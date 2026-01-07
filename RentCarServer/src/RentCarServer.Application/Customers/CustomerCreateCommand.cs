using FluentValidation;
using GenericRepository;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.Shared;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerCreateCommand(
    string FirstName,
    string LastName,
    string IdentityNumber,
    DateOnly DateOfBirth,
    string PhoneNumber,
    string Email,
    DateOnly DrivingLicenseIssuanceDate,
    string FullAddress,
    bool IsActive
) : IRequest<Result<string>>;
public sealed class CustomerCreateCommandValidator : AbstractValidator<CustomerCreateCommand>
{
    public CustomerCreateCommandValidator()
    {
        RuleFor(p => p.FirstName).NotEmpty().WithMessage("Ad alanı boş olamaz.");
        RuleFor(p => p.LastName).NotEmpty().WithMessage("Soyad alanı boş olamaz.");
        RuleFor(p => p.IdentityNumber).NotEmpty().WithMessage("TC kimlik numarası boş olamaz.");
        RuleFor(p => p.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz.")
                             .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        RuleFor(p => p.PhoneNumber).NotEmpty().WithMessage("Telefon numarası boş olamaz.");
        RuleFor(p => p.FullAddress).NotEmpty().WithMessage("Adres alanı boş olamaz.");
    }
}
internal sealed class CustomerCreateCommandHandler(
    ICustomerRepository repository,
    IUnitOfWork unitOfWork) : IRequestHandler<CustomerCreateCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerCreateCommand request, CancellationToken cancellationToken)
    {
        bool exists = await repository.AnyAsync(x => x.IdentityNumber.Value == request.IdentityNumber, cancellationToken);
        if (exists)
            return Result<string>.Failure("Bu TC kimlik numarası ile kayıtlı müşteri var.");

        FirstName firstName = new(request.FirstName);
        LastName lastName = new(request.LastName);
        IdentityNumber identityNumber = new(request.IdentityNumber);
        DateOfBirth dateOfBirth = new(request.DateOfBirth);
        PhoneNumber phoneNumber = new(request.PhoneNumber);
        Email email = new(request.Email);
        DrivingLicenseIssuanceDate drivingLicenseIssuanceDate = new(request.DrivingLicenseIssuanceDate);
        FullAddress fullAddress = new(request.FullAddress);

        Customer customer = new(
            firstName,
            lastName,
            identityNumber,
            dateOfBirth,
            phoneNumber,
            email,
            drivingLicenseIssuanceDate,
            fullAddress,
            request.IsActive
        );

        repository.Add(customer);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Müşteri başarıyla kaydedildi";
    }
}