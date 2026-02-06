using RentCarServer.Domain.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerCheckForgotPasswordCodeCommand(Guid ForgotPasswordCode) : IRequest<Result<bool>>;

internal sealed class CustomerCheckForgotPasswordCodeCommandHandler(
    ICustomerRepository customerRepository) : IRequestHandler<CustomerCheckForgotPasswordCodeCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(CustomerCheckForgotPasswordCodeCommand request, CancellationToken cancellationToken)
    {
        var customer = await customerRepository.FirstOrDefaultAsync(p =>
        p.ForgotPasswordCode != null
        && p.ForgotPasswordCode.Value == request.ForgotPasswordCode
        , cancellationToken);

        if (customer is null)
        {
            return Result<bool>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        if (customer.IsForgotPasswordCompleted is null || customer.IsForgotPasswordCompleted.Value)
        {
            return Result<bool>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        if (customer.ForgotPasswordDate is null)
        {
            return Result<bool>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        var fpDate = customer.ForgotPasswordDate!.Value.AddDays(1);
        var now = DateTimeOffset.Now;
        if (fpDate < now)
        {
            return Result<bool>.Failure("Şifre sıfırlama değeriniz geçersiz");
        }

        return true;
    }
}