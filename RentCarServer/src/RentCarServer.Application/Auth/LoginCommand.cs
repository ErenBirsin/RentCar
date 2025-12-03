using FluentValidation;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Users;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Auth;
public sealed record LoginCommand(string EmailOrUserName, string Password) : IRequest<Result<string>>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.EmailOrUserName)
            .NotEmpty().WithMessage("Geçerli bir mail ya da kullanıcı adı girin");
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Geçerli bir şifre girin");
    }
}
public sealed class LoginCommandHandler(IUserRepository userRepository, IJwtProvider jwtProvider) : IRequestHandler<LoginCommand, Result<string>>
{
    public async Task<Result<string>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FirstOrDefaultAsync(p => p.Email.Value == request.EmailOrUserName || p.UserName.Value == request.EmailOrUserName);

        if (user is null)
        {
            return Result<string>.Failure("Kullanıcı adı veya şifre hatalı.");
        }

        var checkedPassword = user.VerifyPasswordHash(request.Password);

        if (!checkedPassword)
        {
            return Result<string>.Failure("Kullanıcı adı veya şifre hatalı.");
        }

        var token = await jwtProvider.CreateTokenAsync(user, cancellationToken);

        return token;
    }
}
