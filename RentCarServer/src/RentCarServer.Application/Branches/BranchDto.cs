using RentCarServer.Domain.Abstractions;
using RentCarServer.Domain.Branches;
using RentCarServer.Domain.Shared;

namespace RentCarServer.Application.Branches;
public sealed class BranchDto : EntityDto
{
    public string Name { get; set; } = default!;
    public string City { get; set; } = default!;
    public string District { get; set; } = default!;
    public string FullAddress { get; set; } = default!;
    public string PhoneNumber1 { get; set; } = default!;
    public string? PhoneNumber2 { get; set; }
    public string Email { get; set; } = default!;
    public Address Address { get; set; } = default!;
    public Contact Contact { get; set; } = default!;
}

public static class BranchExtensions
{
    public static IQueryable<BranchDto> MapTo(this IQueryable<EntityWithAuditDto<Branch>> entity)
    {
        var res = entity
            .Select(s => new BranchDto
            {
                Id = s.Entity.Id,
                Name = s.Entity.Name.Value,
                City = s.Entity.Address.City,
                District = s.Entity.Address.District,
                FullAddress = s.Entity.Address.FullAddress,
                PhoneNumber1 = s.Entity.Contact.PhoneNumber1,
                PhoneNumber2 = s.Entity.Contact.PhoneNumber2,
                Email = s.Entity.Contact.Email,
                Address = s.Entity.Address,
                Contact = s.Entity.Contact,
                CreatedAt = s.Entity.CreatedAt,
                CreatedBy = s.Entity.CreatedBy,
                IsActive = s.Entity.IsActive,
                UpdatedAt = s.Entity.UpdatedAt,
                UpdatedBy = s.Entity.UpdatedBy == null ? null : s.Entity.UpdatedBy.value,
                CreatedFullName = s.CreatedUser != null ? s.CreatedUser.FullName.Value : "Admin",
                UpdatedFullName = s.UpdatedUser == null ? null : s.UpdatedUser.FullName.Value
            })
            .AsQueryable();

        return res;
    }
}