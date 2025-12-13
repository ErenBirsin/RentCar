using RentCarServer.Domain.LoginTokens;
using System.Security.Claims;

namespace RentCarServer.WepAPI.Middlewares;

public sealed class CheckTokenMiddleware
    (ILoginTokenRepository loginTokenRepository) : IMiddleware
{
    public async Task InvokeAsync(HttpContext httpContext, RequestDelegate next)
    {
        // Auth endpoint'lerini bypass et (login, forgot-password vb.)
        var path = httpContext.Request.Path.Value?.ToLower() ?? "";
        if (path.Contains("/auth/"))
        {
            await next(httpContext);
            return;
        }

        var token = httpContext.Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        if (string.IsNullOrWhiteSpace(token))
        {
            await next(httpContext);
            return;
        }

        var userId = httpContext.User.Claims
            .FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?
            .Value;
        if (userId is null)
        {
            throw new TokenException();
        }

        var isTokenAvailable = await loginTokenRepository.AnyAsync(p =>
            p.UserId == userId
            && p.Token.Value == token
            && p.IsActive.Value == true);
        if (!isTokenAvailable)
        {
            throw new TokenException();

        }

        await next(httpContext);
    }
}

public sealed class TokenException : Exception;