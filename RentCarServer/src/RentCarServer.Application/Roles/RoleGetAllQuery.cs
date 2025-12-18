using RentCarServer.Domain.Roles;
using TS.MediatR;

namespace RentCarServer.Application.Roles;
[Permission("role:view")]
public sealed record RoleGetAllQuery : IRequest<IQueryable<RoleDto>>;

internal sealed class RoleGetAllQueryHandler(
    IRoleRepository roleRepository) : IRequestHandler<RoleGetAllQuery, IQueryable<RoleDto>>
{
    public Task<IQueryable<RoleDto>> Handle(RoleGetAllQuery request, CancellationToken cancellationToken)
    {
        var res = roleRepository.GetAllWithAudit().MapTo().AsQueryable();

        return Task.FromResult(res);
    }
}
