using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Reservations.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;

public sealed record DashboardMonthlyRevenueSeriesDto(string Month, decimal Total); // Month: yyyy-MM

public sealed record DashboardMonthlyRevenueSeriesQuery(int Months) : IRequest<Result<List<DashboardMonthlyRevenueSeriesDto>>>;

internal sealed class DashboardMonthlyRevenueSeriesQueryHandler(
    IReservationRepository reservationRepository
    ) : IRequestHandler<DashboardMonthlyRevenueSeriesQuery, Result<List<DashboardMonthlyRevenueSeriesDto>>>
{
    public async Task<Result<List<DashboardMonthlyRevenueSeriesDto>>> Handle(DashboardMonthlyRevenueSeriesQuery request, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var thisMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startMonth = thisMonth.AddMonths(-(request.Months - 1));
        var endExclusive = thisMonth.AddMonths(1);

        var raw = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Completed.Value)
            .Where(r => r.DeliveryDateTime.Value >= startMonth && r.DeliveryDateTime.Value < endExclusive)
            .Select(r => new
            {
                Year = r.DeliveryDateTime.Value.Year,
                Month = r.DeliveryDateTime.Value.Month,
                Total = (decimal)r.Total.Value
            })
            .GroupBy(x => new { x.Year, x.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Total = g.Sum(x => x.Total)
            })
            .ToListAsync(cancellationToken);

        var dict = raw.ToDictionary(x => $"{x.Year:D4}-{x.Month:D2}", x => x.Total);
        var list = new List<DashboardMonthlyRevenueSeriesDto>(request.Months);

        for (var d = startMonth; d < endExclusive; d = d.AddMonths(1))
        {
            var key = $"{d.Year:D4}-{d.Month:D2}";
            dict.TryGetValue(key, out var total);
            list.Add(new DashboardMonthlyRevenueSeriesDto(key, total));
        }

        return list;
    }
}

