using GenericRepository;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Users;
using RentCarServer.Domain.Users.ValueObjects;

namespace RentCarServer.WepAPI;

public static class ExtensionMethods
{
    public static async Task CreateUserFirstUser(this WebApplication app)
    {
        using var scoped = app.Services.CreateScope();
        var userRepository = scoped.ServiceProvider.GetRequiredService<IUserRepository>();
        var unitOfWork = scoped.ServiceProvider.GetRequiredService<IUnitOfWork>();

        if (!(await userRepository.AnyAsync(p => p.UserName.Value == "admin")))
        {
            FirstName firstName = new("Eren");
            LastName lastName = new("Birsin");
            Email email = new("erenbirsin7@gmail.com");
            UserName userName = new("admin");
            Password password = new("1");

            var user = new User(
                firstName,
                lastName,
                email,
                userName,
                password
                );

            userRepository.Add(user);
            await unitOfWork.SaveChangesAsync();

        }

    }

    public static async Task CleanRemovedPermissionsFromRoleAsync(this WebApplication app)
    {
        using var scoped = app.Services.CreateScope();
        var srv = scoped.ServiceProvider;
        var service = srv.GetRequiredService<PermissionCleanerService>();
        await service.CleanRemovedPermissionsFromRolesAsync();
    }
}
