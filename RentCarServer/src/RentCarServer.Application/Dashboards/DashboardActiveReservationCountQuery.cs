using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Reservations.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;

public sealed record DashboardActiveReservationCountQuery : IRequest<Result<int>>;

internal sealed class DashboardActiveReservationCountQueryHandler(
    IReservationRepository reservationRepository
    ) : IRequestHandler<DashboardActiveReservationCountQuery, Result<int>>
{
    public async Task<Result<int>> Handle(DashboardActiveReservationCountQuery request, CancellationToken cancellationToken)
    {
        // "Aktif" = tamamlanmamış ve iptal edilmemiş rezervasyonlar
        var res = await reservationRepository
            .GetAll()
            .Where(p => p.IsActive == true)
            .Where(p => p.Status.Value != Status.Completed.Value && p.Status.Value != Status.Canceled.Value)
            .CountAsync(cancellationToken);

        return res;
    }
}