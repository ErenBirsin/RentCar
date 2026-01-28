using GenericRepository;
using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Abstractions;
using RentCarServer.Domain.Users;

namespace RentCarServer.Infrastructure.Abstractions;
internal class AuditableRepository<TEntity, TContext> : Repository<TEntity, TContext>, IAuditableRepository<TEntity>
    where TEntity : Entity
    where TContext : DbContext
{
    private readonly TContext _context;
    public AuditableRepository(TContext context) : base(context)
    {
        _context = context;
    }

    public IQueryable<EntityWithAuditDto<TEntity>> GetAllWithAudit()
    {
        var entities = _context.Set<TEntity>().AsNoTracking().AsQueryable();
        var users = _context.Set<User>().AsNoTracking().AsQueryable();

        var res = entities
            .AsNoTracking()
            .GroupJoin(users, e => e.CreatedBy, u => u.Id, (entity, createdUsers) =>
                new { entity, createdUsers })
            .SelectMany(x => x.createdUsers.DefaultIfEmpty(),
                (x, createdUser) => new { x.entity, createdUser })
            .GroupJoin(users, x => x.entity.UpdatedBy, u => u.Id, (x, updatedUsers) =>
                new { x.entity, x.createdUser, updatedUsers })
            .SelectMany(x => x.updatedUsers.DefaultIfEmpty(),
                (x, updatedUser) => new EntityWithAuditDto<TEntity>
                {
                    Entity = x.entity,
                    CreatedUser = x.createdUser,
                    UpdatedUser = updatedUser
                });

        return res;
    }
}