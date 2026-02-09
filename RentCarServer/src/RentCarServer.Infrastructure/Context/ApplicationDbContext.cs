using GenericRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RentCarServer.Domain.Abstractions;
using System.Security.Claims;

namespace RentCarServer.Infrastructure.Context;
internal sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ApplicationDbContext(DbContextOptions options, IHttpContextAccessor httpContextAccessor) : base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        modelBuilder.ApplyGlobalFilters();
        base.OnModelCreating(modelBuilder);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<IdentityId>().HaveConversion<IdentityIdValueConverter>();
        configurationBuilder.Properties<decimal>().HaveColumnType("money");
        configurationBuilder.Properties<string>().HaveColumnType("nvarchar(MAX)");
        configurationBuilder.Properties<TimeOnly>().HaveColumnType("time(7)");
        base.ConfigureConventions(configurationBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<Entity>();

        string? userIdString =
        _httpContextAccessor
        .HttpContext?
        .User
        .Claims
        .FirstOrDefault(p => p.Type == ClaimTypes.NameIdentifier)?
        .Value;

        IdentityId identityId = userIdString is not null
            ? new(Guid.Parse(userIdString))
            : new(Guid.Empty);

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Property(p => p.CreatedAt)
                    .CurrentValue = DateTimeOffset.Now;
                entry.Property(p => p.CreatedBy)
                    .CurrentValue = identityId;
            }

            if (entry.State == EntityState.Modified)
            {
                if (entry.Property(p => p.IsDeleted).CurrentValue == true)
                {
                    entry.Property(p => p.DeletedAt)
                    .CurrentValue = DateTimeOffset.Now;
                    entry.Property(p => p.DeletedBy)
                    .CurrentValue = identityId;
                }
                else
                {
                    entry.Property(p => p.UpdatedAt)
                        .CurrentValue = DateTimeOffset.Now;
                    entry.Property(p => p.UpdatedBy)
                    .CurrentValue = identityId;
                }
            }

            if (entry.State == EntityState.Deleted)
            {
                throw new ArgumentException("Db'den direkt silme işlemi yapamazsınız");
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

}

internal sealed class IdentityIdValueConverter : ValueConverter<IdentityId, Guid>
{
    public IdentityIdValueConverter() : base(m => m.value, m => new IdentityId(m)) { }
}