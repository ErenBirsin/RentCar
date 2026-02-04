using FluentValidation;
using GenericRepository;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.Shared;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerUpdateMeCommand(
    string PhoneNumber,
    string Email,
    string FullAddress) : IRequest<Result<string>>;

public sealed class CustomerUpdateMeCommandValidator : AbstractValidator<CustomerUpdateMeCommand>
{
    public CustomerUpdateMeCommandValidator()
    {
        RuleFor(p => p.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz.")
                             .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        RuleFor(p => p.PhoneNumber).NotEmpty().WithMessage("Telefon numarası boş olamaz.");
        RuleFor(p => p.FullAddress).NotEmpty().WithMessage("Adres alanı boş olamaz.");
    }
}

internal sealed class CustomerUpdateMeCommandHandler(
    ICustomerRepository repository,
    IClaimContext claimContext,
    IUnitOfWork unitOfWork) : IRequestHandler<CustomerUpdateMeCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerUpdateMeCommand request, CancellationToken cancellationToken)
    {
        var customerId = claimContext.GetUserId();

        Customer? customer = await repository.FirstOrDefaultAsync(x => x.Id == customerId, cancellationToken);
        if (customer is null)
            return Result<string>.Failure("Müşteri bulunamadı");

        if (!string.Equals(customer.Email.Value, request.Email, StringComparison.OrdinalIgnoreCase))
        {
            bool emailExists = await repository.AnyAsync(
                x => x.Email.Value == request.Email && x.Id != customerId,
                cancellationToken);
            if (emailExists)
                return Result<string>.Failure("Bu e-posta adresi ile kayıtlı müşteri var.");
        }

        PhoneNumber phoneNumber = new(request.PhoneNumber);
        Email email = new(request.Email);
        FullAddress fullAddress = new(request.FullAddress);

        customer.SetPhoneNumber(phoneNumber);
        customer.SetEmail(email);
        customer.SetFullAddress(fullAddress);

        repository.Update(customer);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Profil bilgileri güncellendi";
    }
}