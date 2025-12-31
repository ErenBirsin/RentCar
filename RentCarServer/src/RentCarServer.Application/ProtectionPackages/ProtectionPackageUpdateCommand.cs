using FluentValidation;
using GenericRepository;
using RentCarServer.Domain.ProtectionPackage;
using RentCarServer.Domain.ProtectionPackage.ValueObjects;
using RentCarServer.Domain.Shared;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.ProtectionPackages;

public sealed record ProtectionPackageUpdateCommand(
    Guid Id,
    string Name,
    decimal Price,
    bool IsRecommended,
    List<string> Coverages) : IRequest<Result<string>>;

public sealed class ProtectionPackageUpdateCommandValidator : AbstractValidator<ProtectionPackageUpdateCommand>
{
    public ProtectionPackageUpdateCommandValidator()
    {
        RuleFor(p => p.Name).NotEmpty().WithMessage("Geçerli bir paket adı girin");
        RuleFor(p => p.Price).GreaterThan(0).WithMessage("Fiyat pozitif olmalı");
    }
}

internal sealed class ProtectionPackageUpdateCommandHandler(
    IProtectionPackageRepository repository,
    IUnitOfWork unitOfWork) : IRequestHandler<ProtectionPackageUpdateCommand, Result<string>>
{
    public async Task<Result<string>> Handle(ProtectionPackageUpdateCommand request, CancellationToken cancellationToken)
    {
        var package = await repository.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (package is null)
            return Result<string>.Failure("Güvence paketi bulunamadı");

        if (!string.Equals(package.Name.Value, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await repository.AnyAsync(
                p => p.Name.Value == request.Name && p.Id != request.Id,
                cancellationToken);

            if (nameExists)
                return Result<string>.Failure("Paket adı daha önce tanımlanmış");
        }

        Name name = new(request.Name);
        Price price = new(request.Price);
        IsRecommended isRecommended = new(request.IsRecommended);
        List<ProtectionCoverage> coverages = request.Coverages.Select(c => new ProtectionCoverage(c)).ToList();

        package.SetName(name);
        package.SetPrice(price);
        package.SetIsRecommended(isRecommended);
        package.SetCoverages(coverages);

        repository.Update(package);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return "Güvence paketi başarıyla güncellendi";
    }
}