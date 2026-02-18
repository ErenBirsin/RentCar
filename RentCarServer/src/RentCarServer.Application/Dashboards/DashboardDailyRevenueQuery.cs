using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Reservations.ValueObjects;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;
public sealed record DashboardDailyRevenueDto(string Date, decimal Total);
public sealed record DashboardDailyRevenueQuery(int Days) : IRequest<Result<List<DashboardDailyRevenueDto>>>;
internal sealed class DashboardDailyRevenueQueryHandler(
    IReservationRepository reservationRepository
    ) : IRequestHandler<DashboardDailyRevenueQuery, Result<List<DashboardDailyRevenueDto>>>
{
    public async Task<Result<List<DashboardDailyRevenueDto>>> Handle(DashboardDailyRevenueQuery request, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.Now.Date);
        var start = today.AddDays(-(request.Days - 1));

        var raw = await reservationRepository
            .GetAll()
            .Where(r => r.IsActive == true)
            .Where(r => r.Status.Value == Status.Completed.Value)
            .Where(r =>
                r.DeliveryDate.Value >= start &&
                r.DeliveryDate.Value <= today)
            .Select(r => new
            {
                Date = r.DeliveryDate.Value,
                Total = (decimal)r.Total.Value
            })
            .GroupBy(x => x.Date)
            .Select(g => new
            {
                Date = g.Key,
                Total = g.Sum(x => x.Total)
            })
            .ToListAsync(cancellationToken);

        var dict = raw.ToDictionary(x => x.Date, x => x.Total);
        var list = new List<DashboardDailyRevenueDto>(request.Days);
        for (var d = start; d <= today; d = d.AddDays(1))
        {
            dict.TryGetValue(d, out var total);
            list.Add(new DashboardDailyRevenueDto(d.ToString("yyyy-MM-dd"), total));
        }

        return list;
    }
}