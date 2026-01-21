using Microsoft.EntityFrameworkCore;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Vehicles;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;
public sealed record DashboardTotalVehicleCountQuery : IRequest<Result<int>>;

internal sealed class DashboardTotalVehicleCountQueryHandler(
    IVehicleRepository vehicleRepository,
    IClaimContext claimContext
    ) : IRequestHandler<DashboardTotalVehicleCountQuery, Result<int>>
{
    public async Task<Result<int>> Handle(DashboardTotalVehicleCountQuery request, CancellationToken cancellationToken)
    {
        var query = vehicleRepository.GetAll();

        // sys_admin ise tüm şubelerdeki araçlar, değilse sadece kendi şubesi
        if (claimContext.GetRoleName() != "sys_admin")
        {
            var branchId = claimContext.GetBranchId();
            query = query.Where(v => v.BranchId.value == branchId);
        }

        var res = await query.CountAsync(cancellationToken);
        return res;
    }
}

