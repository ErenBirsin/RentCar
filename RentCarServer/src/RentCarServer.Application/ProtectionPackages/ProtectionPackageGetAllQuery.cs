using RentCarServer.Domain.ProtectionPackage;
using TS.MediatR;

namespace RentCarServer.Application.ProtectionPackages;
[Permission("protection_package:view")]

public sealed record ProtectionPackageGetAllQuery : IRequest<IQueryable<ProtectionPackageDto>>;

internal sealed class ProtectionPackageGetAllQueryHandler(
    IProtectionPackageRepository repository) : IRequestHandler<ProtectionPackageGetAllQuery, IQueryable<ProtectionPackageDto>>
{
    public Task<IQueryable<ProtectionPackageDto>> Handle(ProtectionPackageGetAllQuery request, CancellationToken cancellationToken) =>
        Task.FromResult(repository.GetAllWithAudit().MapTo().AsQueryable());
}