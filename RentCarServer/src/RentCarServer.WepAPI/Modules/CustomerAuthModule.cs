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

        app.MapPost("/forgot-password/{email}", async (string email, ISender sender, CancellationToken cancellationToken) =>
        {
            var res = await sender.Send(new CustomerForgotPasswordCommand(email), cancellationToken);
            return res.IsSuccessful ? Results.Ok(res) : Results.BadRequest(res);
        })
       .Produces<Result<string>>()
       .RequireRateLimiting("forgot-pasword-fixed");

        app.MapGet("/check-forgot-password-code/{forgotPasswordCode}", async (Guid forgotPasswordCode, ISender sender, CancellationToken cancellationToken) =>
        {
            var res = await sender.Send(new CustomerCheckForgotPasswordCodeCommand(forgotPasswordCode), cancellationToken);
            return res.IsSuccessful ? Results.Ok(res) : Results.BadRequest(res);
        })
       .Produces<Result<bool>>()
       .RequireRateLimiting("check-forgot-password-code-fixed");

        app.MapPost("/reset-password", async (CustomerResetPasswordCommand request, ISender sender, CancellationToken cancellationToken) =>
        {
            var res = await sender.Send(request, cancellationToken);
            return res.IsSuccessful ? Results.Ok(res) : Results.BadRequest(res);
        })
       .Produces<Result<string>>()
       .RequireRateLimiting("reset-pasword-fixed");
    }
}