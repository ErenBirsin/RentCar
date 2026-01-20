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
    }
}