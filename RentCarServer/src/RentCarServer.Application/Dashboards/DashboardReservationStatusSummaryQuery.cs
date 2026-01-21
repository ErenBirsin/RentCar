using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Reservations.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;

public sealed record DashboardReservationStatusSummaryDto(string Status, int Count);

public sealed record DashboardReservationStatusSummaryQuery : IRequest<Result<List<DashboardReservationStatusSummaryDto>>>;

internal sealed class DashboardReservationStatusSummaryQueryHandler(
    IReservationRepository reservationRepository
    ) : IRequestHandler<DashboardReservationStatusSummaryQuery, Result<List<DashboardReservationStatusSummaryDto>>>
{
    public async Task<Result<List<DashboardReservationStatusSummaryDto>>> Handle(DashboardReservationStatusSummaryQuery request, CancellationToken cancellationToken)
    {
        // Aktif rezervasyonları 3 başlıkta özetliyoruz: Bekliyor, Teslim Edildi, Tamamlandı, İptal
        var pendingCount = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Pending.Value)
            .CountAsync(cancellationToken);

        var deliveredCount = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Delivered.Value)
            .CountAsync(cancellationToken);

        var completedCount = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Completed.Value)
            .CountAsync(cancellationToken);

        var canceledCount = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Canceled.Value)
            .CountAsync(cancellationToken);

        var list = new List<DashboardReservationStatusSummaryDto>
        {
            new(Status.Pending.Value, pendingCount),
            new(Status.Delivered.Value, deliveredCount),
            new(Status.Completed.Value, completedCount),
            new(Status.Canceled.Value, canceledCount),
        };

        return list;
    }
}

