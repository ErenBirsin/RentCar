using FluentValidation;
using GenericRepository;
using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.LoginTokens;
using RentCarServer.Domain.Users.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerResetPasswordCommand(
    Guid ForgotPasswordCode,
    string NewPassword,
    bool LogoutAllDevices) : IRequest<Result<string>>;

public sealed class CustomerResetPasswordCommandValidator : AbstractValidator<CustomerResetPasswordCommand>
{
    public CustomerResetPasswordCommandValidator()
    {
        RuleFor(p => p.NewPassword)
            .NotEmpty().WithMessage("Geçerli bir yeni şifre giriniz");
    }
}

internal sealed class CustomerResetPasswordCommandHandler(
    ICustomerRepository customerRepository,
    ILoginTokenRepository loginTokenRepository,
    IUnitOfWork unitOfWork) : IRequestHandler<CustomerResetPasswordCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var customer = await customerRepository.FirstOrDefaultAsync(p =>
        p.ForgotPasswordCode != null
        && p.ForgotPasswordCode.Value == request.ForgotPasswordCode
        , cancellationToken);

        if (customer is null)
        {
            return Result<string>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        if (customer.IsForgotPasswordCompleted is null || customer.IsForgotPasswordCompleted.Value)
        {
            return Result<string>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        if (customer.ForgotPasswordDate is null)
        {
            return Result<string>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        var fpDate = customer.ForgotPasswordDate!.Value.AddDays(1);
        var now = DateTimeOffset.Now;
        if (fpDate < now)
        {
            return Result<string>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        Password password = new(request.NewPassword);
        customer.SetPassword(password);
        customer.SetIsForgotPasswordCompleted(new(true));
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

        return "Şifre başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.";
    }
}