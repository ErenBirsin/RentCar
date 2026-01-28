using RentCarServer.Application.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.WepAPI.Modules;
public static class CustomerAuthModule
{
    public static void MapCustomerAuth(this IEndpointRouteBuilder builder)
    {
        var app = builder.MapGroup("/customer-auth").WithTags("CustomerAuth");

        app.MapPost("/register", async (CustomerRegisterCommand request, ISender sender, CancellationToken cancellationToken) =>
        {
            var res = await sender.Send(request, cancellationToken);
            return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
        })
        .Produces<Result<string>>()
        .RequireRateLimiting("fixed");

        app.MapPost("/login", async (CustomerLoginCommand request, ISender sender, CancellationToken cancellationToken) =>
        {
            var res = await sender.Send(request, cancellationToken);
            return res.IsSuccessful ? Results.Ok(res) : Results.InternalServerError(res);
        })
        .Produces<Result<CustomerLoginCommandResponse>>()
        .RequireRateLimiting("login-fixed");
    }
}