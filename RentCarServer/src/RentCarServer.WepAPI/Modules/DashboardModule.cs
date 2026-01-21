using RentCarServer.Application.Dashboards;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.WepAPI.Modules;
public static class DashboardModule
{
    public static void MapDashboard(this IEndpointRouteBuilder builder)
    {
        var app = builder
            .MapGroup("/dashboard")
            .RequireRateLimiting("fixed")
            .RequireAuthorization()
            .WithTags("Dashboard");

        app.MapGet("active-reservation-count",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var res = await sender.Send(new DashboardActiveReservationCountQuery(), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<int>>();

        app.MapGet("total-vehicle-count",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var res = await sender.Send(new DashboardTotalVehicleCountQuery(), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<int>>();

        app.MapGet("total-customer-count",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var res = await sender.Send(new DashboardTotalCustomerCountQuery(), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<int>>();

        app.MapGet("monthly-revenue",
            async (int year, int month, ISender sender, CancellationToken cancellationToken) =>
            {
                if (month is < 1 or > 12)
                {
                    return Results.BadRequest(Result<decimal>.Failure("Ay bilgisi 1-12 arasında olmalıdır"));
                }

                var res = await sender.Send(new DashboardMonthlyRevenueQuery(year, month), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<decimal>>();

        app.MapGet("monthly-revenue-series",
            async (int months, ISender sender, CancellationToken cancellationToken) =>
            {
                if (months is < 1 or > 36)
                {
                    return Results.BadRequest(Result<List<DashboardMonthlyRevenueSeriesDto>>.Failure("Ay bilgisi 1-36 arasında olmalıdır"));
                }

                var res = await sender.Send(new DashboardMonthlyRevenueSeriesQuery(months), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<List<DashboardMonthlyRevenueSeriesDto>>>();

        app.MapGet("daily-revenue",
            async (int days, ISender sender, CancellationToken cancellationToken) =>
            {
                if (days is < 1 or > 365)
                {
                    return Results.BadRequest(Result<List<DashboardDailyRevenueDto>>.Failure("Gün bilgisi 1-365 arasında olmalıdır"));
                }

                var res = await sender.Send(new DashboardDailyRevenueQuery(days), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<List<DashboardDailyRevenueDto>>>();

        app.MapGet("reservation-status-summary",
            async (ISender sender, CancellationToken cancellationToken) =>
            {
                var res = await sender.Send(new DashboardReservationStatusSummaryQuery(), cancellationToken);
                return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
            })
            .Produces<Result<List<DashboardReservationStatusSummaryDto>>>();
    }
}