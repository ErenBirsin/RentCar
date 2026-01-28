using FluentValidation;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;

public sealed record CustomerLoginCommand(
    string Email,
    string Password) : IRequest<Result<CustomerLoginCommandResponse>>;

public sealed record CustomerLoginCommandResponse
{
    public string? Token { get; set; }
}

public sealed class CustomerLoginCommandValidator : AbstractValidator<CustomerLoginCommand>
{
    public CustomerLoginCommandValidator()
    {
        RuleFor(p => p.Email).NotEmpty().WithMessage("Geçerli bir mail girin")
                             .EmailAddress().WithMessage("Geçerli bir mail girin");
        RuleFor(p => p.Password).NotEmpty().WithMessage("Geçerli bir şifre girin");
    }
}
internal sealed class CustomerLoginCommandHandler(
    ICustomerRepository customerRepository,
    IJwtProvider jwtProvider) : IRequestHandler<CustomerLoginCommand, Result<CustomerLoginCommandResponse>>
{
    public async Task<Result<CustomerLoginCommandResponse>> Handle(CustomerLoginCommand request, CancellationToken cancellationToken)
    {
        var customer = await customerRepository.FirstOrDefaultAsync(
            p => p.Email.Value == request.Email,
            cancellationToken);

        if (customer is null)
            return Result<CustomerLoginCommandResponse>.Failure("E-posta ya da şifre yanlış");

        var checkPassword = customer.VerifyPasswordHash(request.Password);
        if (!checkPassword)
            return Result<CustomerLoginCommandResponse>.Failure("E-posta ya da şifre yanlış");

        var token = await jwtProvider.CreateTokenAsync(customer, cancellationToken);
        return new CustomerLoginCommandResponse { Token = token };
    }
}