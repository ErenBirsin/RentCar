using GenericRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Abstractions;
using RentCarServer.Domain.Branches;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.LoginTokens;
using RentCarServer.Domain.LoginTokens.ValueObjects;
using RentCarServer.Domain.Roles;
using RentCarServer.Domain.Users;
using RentCarServer.Infrastructure.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace RentCarServer.Infrastructure.Services;
internal sealed class JwtProvider(
    ILoginTokenRepository loginTokenRepository,
    IRoleRepository roleRepository,
    IBranchRepository branchRepository,
    IUnitOfWork unitOfWork,
    IOptions<JwtOptions> options) : IJwtProvider
{
    public async Task<string> CreateTokenAsync(User user, CancellationToken cancellationToken = default)
    {
        var role = await roleRepository.FirstOrDefaultAsync(i => i.Id == user.RoleId, cancellationToken);
        var branch = await branchRepository.FirstOrDefaultAsync(i => i.Id == user.BranchId, cancellationToken);

        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("fullName", user.FirstName.Value + " " + user.LastName.Value),
            new Claim("fullNameWithEmail", user.FullName.Value),
            new Claim("email",user.Email.Value),
            new Claim("role", role?.Name.Value ?? string.Empty),
            new Claim("permissions",role is null? "" : JsonSerializer.Serialize(role.Permissions.Select(s => s.Value).ToArray())),
            new Claim("branch",branch?.Name.Value ?? string.Empty),
            new Claim("branchId",branch?.Id ?? string.Empty)
        };

        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(options.Value.SecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha512);

        var expires = DateTime.Now.AddDays(1);
        JwtSecurityToken securityToken = new(
            issuer: options.Value.Issuer,
            audience: options.Value.Audience,
            claims: claims,
            notBefore: DateTime.Now,
            expires: expires,
            signingCredentials: signingCredentials);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.WriteToken(securityToken);

        await SetLoginTokenAsync(user.Id, token, expires, cancellationToken);

        return token;
    }
    public async Task<string> CreateTokenAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.NameIdentifier, customer.Id),
            new Claim("fullName", customer.FullName.Value),
            new Claim("email", customer.Email.Value),
            new Claim("role", "Customer"),
            new Claim("userType", "Customer")
        };

        SymmetricSecurityKey securityKey = new(Encoding.UTF8.GetBytes(options.Value.SecretKey));
        SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha512);

        var expires = DateTime.Now.AddDays(1);
        JwtSecurityToken securityToken = new(
            issuer: options.Value.Issuer,
            audience: options.Value.Audience,
            claims: claims,
            notBefore: DateTime.Now,
            expires: expires,
            signingCredentials: signingCredentials);

        var handler = new JwtSecurityTokenHandler();
        var token = handler.WriteToken(securityToken);

        await SetLoginTokenAsync(customer.Id, token, expires, cancellationToken);
        return token;
    }

    private async Task SetLoginTokenAsync(IdentityId userId, string token, DateTime expires, CancellationToken cancellationToken)
    {
        Token newToken = new(token);
        ExpiresDate expiresDate = new(expires);
        LoginToken loginToken = new(newToken, userId, expiresDate);
        loginTokenRepository.Add(loginToken);

        var loginTokens = await loginTokenRepository
            .Where(p => p.UserId == userId && p.IsActive.Value == true)
            .ToListAsync(cancellationToken);

        foreach (var item in loginTokens)
        {
            item.SetIsActive(new(false));
        }
        loginTokenRepository.UpdateRange(loginTokens);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}