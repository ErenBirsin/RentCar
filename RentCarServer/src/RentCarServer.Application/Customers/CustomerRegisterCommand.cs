using FluentValidation;
using GenericRepository;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.Shared;
using RentCarServer.Domain.Users.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerRegisterCommand(
    string FirstName,
    string LastName,
    string IdentityNumber,
    DateOnly DateOfBirth,
    string PhoneNumber,
    string Email,
    DateOnly DrivingLicenseIssuanceDate,
    string FullAddress,
    string Password
) : IRequest<Result<string>>;

public sealed class CustomerRegisterCommandValidator : AbstractValidator<CustomerRegisterCommand>
{
    public CustomerRegisterCommandValidator()
    {
        RuleFor(p => p.FirstName).NotEmpty().WithMessage("Ad alanı boş olamaz.");
        RuleFor(p => p.LastName).NotEmpty().WithMessage("Soyad alanı boş olamaz.");
        RuleFor(p => p.IdentityNumber).NotEmpty().WithMessage("TC kimlik numarası boş olamaz.");
        RuleFor(p => p.DateOfBirth).NotEmpty().WithMessage("Doğum tarihi boş olamaz.");
        RuleFor(p => p.PhoneNumber).NotEmpty().WithMessage("Telefon numarası boş olamaz.");
        RuleFor(p => p.Email).NotEmpty().WithMessage("E-posta adresi boş olamaz.")
                             .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        RuleFor(p => p.DrivingLicenseIssuanceDate).NotEmpty().WithMessage("Ehliyet alış tarihi boş olamaz.");
        RuleFor(p => p.FullAddress).NotEmpty().WithMessage("Adres alanı boş olamaz.");
        RuleFor(p => p.Password).NotEmpty().WithMessage("Şifre alanı boş olamaz.");
    }
}

internal sealed class CustomerRegisterCommandHandler(
    ICustomerRepository repository,
    IUnitOfWork unitOfWork) : IRequestHandler<CustomerRegisterCommand, Result<string>>
{
    public async Task<Result<string>> Handle(CustomerRegisterCommand request, CancellationToken cancellationToken)
    {
        bool identityExists = await repository.AnyAsync(
            x => x.IdentityNumber.Value == request.IdentityNumber,
            cancellationToken);
        if (identityExists)
            return Result<string>.Failure("Bu TC kimlik numarası ile kayıtlı müşteri var.");

        bool emailExists = await repository.AnyAsync(
            x => x.Email.Value == request.Email,
            cancellationToken);
        if (emailExists)
            return Result<string>.Failure("Bu e-posta adresi ile kayıtlı müşteri var.");

        Customer customer = new(
            new FirstName(request.FirstName),
            new LastName(request.LastName),
            new IdentityNumber(request.IdentityNumber),
            new DateOfBirth(request.DateOfBirth),
            new PhoneNumber(request.PhoneNumber),
            new Email(request.Email),
            new DrivingLicenseIssuanceDate(request.DrivingLicenseIssuanceDate),
            new FullAddress(request.FullAddress),
            new Password(request.Password),
            isActive: true
        );

        repository.Add(customer);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Müşteri başarıyla kaydedildi";
    }
}