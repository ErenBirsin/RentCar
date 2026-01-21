using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Reservations.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;
public sealed record DashboardMonthlyRevenueQuery(int Year, int Month) : IRequest<Result<decimal>>;

internal sealed class DashboardMonthlyRevenueQueryHandler(
    IReservationRepository reservationRepository
    ) : IRequestHandler<DashboardMonthlyRevenueQuery, Result<decimal>>
{
    public async Task<Result<decimal>> Handle(DashboardMonthlyRevenueQuery request, CancellationToken cancellationToken)
    {
        var revenue = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Completed.Value)
            .Where(r => r.DeliveryDateTime.Value.Year == request.Year && r.DeliveryDateTime.Value.Month == request.Month)
            .Select(r => (decimal?)r.Total.Value)
            .SumAsync(cancellationToken) ?? 0m;

        return revenue;
    }
}

