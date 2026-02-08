using FluentValidation;
using GenericRepository;
using Microsoft.EntityFrameworkCore;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.LoginTokens;
using RentCarServer.Domain.Users.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerChangePasswordCommand(
    string CurrentPassword,
    string NewPassword,
    bool LogoutAllDevices) : IRequest<Result<string>>;
public sealed class CustomerChangePasswordCommandValidator : AbstractValidator<CustomerChangePasswordCommand>
{
    public CustomerChangePasswordCommandValidator()
    {
        RuleFor(p => p.CurrentPassword)
            .NotEmpty().WithMessage("Mevcut şifre boş olamaz");

        RuleFor(p => p.NewPassword)
            .NotEmpty().WithMessage("Geçerli bir yeni şifre giriniz");
    }
}

internal sealed class CustomerChangePasswordCommandHandler(
    ICustomerRepository customerRepository,
    ILoginTokenRepository loginTokenRepository,
    IClaimContext claimContext,
    IUnitOfWork unitOfWork) : IRequestHandler<CustomerChangePasswordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var customerId = claimContext.GetUserId();

        Customer? customer = await customerRepository.FirstOrDefaultAsync(x => x.Id == customerId, cancellationToken);
        if (customer is null)
            return Result<string>.Failure("Müşteri bulunamadı");

        if (!customer.VerifyPasswordHash(request.CurrentPassword))
            return Result<string>.Failure("Mevcut şifreniz hatalı");

        Password password = new(request.NewPassword);
        customer.SetPassword(password);
        customerRepository.Update(customer);

        if (request.LogoutAllDevices)
        {
            var loginTokens = await loginTokenRepository
                .Where(p => p.UserId == customer.Id && p.IsActive.Value == true)
                .ToListAsync(cancellationToken);

            foreach (var item in loginTokens)
            {
                item.SetIsActive(new(false));
            }

            loginTokenRepository.UpdateRange(loginTokens);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Şifreniz başarıyla güncellendi";
    }
}