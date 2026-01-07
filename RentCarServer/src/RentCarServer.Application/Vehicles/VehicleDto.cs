using RentCarServer.Domain.Abstractions;
using RentCarServer.Domain.Branches;
using RentCarServer.Domain.Categories;
using RentCarServer.Domain.Vehicles;

namespace RentCarServer.Application.Vehicles;

public sealed class VehicleDto : EntityDto
{
    public string Brand { get; set; } = default!;
    public string Model { get; set; } = default!;
    public int ModelYear { get; set; }
    public string Color { get; set; } = default!;
    public string Plate { get; set; } = default!;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = default!;
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = default!;
    public string VinNumber { get; set; } = default!;
    public string EngineNumber { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string ImageUrl { get; set; } = default!;
    public string FuelType { get; set; } = default!;
    public string Transmission { get; set; } = default!;
    public decimal EngineVolume { get; set; }
    public int EnginePower { get; set; }
    public string TractionType { get; set; } = default!;
    public decimal FuelConsumption { get; set; }
    public int SeatCount { get; set; }
    public int Kilometer { get; set; }
    public decimal DailyPrice { get; set; }
    public decimal WeeklyDiscountRate { get; set; }
    public decimal MonthlyDiscountRate { get; set; }
    public string InsuranceType { get; set; } = default!;
    public DateOnly LastMaintenanceDate { get; set; }
    public int LastMaintenanceKm { get; set; }
    public int NextMaintenanceKm { get; set; }
    public DateOnly InspectionDate { get; set; }
    public DateOnly InsuranceEndDate { get; set; }
    public DateOnly? CascoEndDate { get; set; }
    public string TireStatus { get; set; } = default!;
    public string GeneralStatus { get; set; } = default!;
    public List<string> Features { get; set; } = new();
}

public static class VehicleExtensions
{
    public static IQueryable<VehicleDto> MapTo(
        this IQueryable<EntityWithAuditDto<Vehicle>> entities,
        IQueryable<Branch> branches,
        IQueryable<Category> categories
        )
    {
        return from e in entities
               join b in branches on e.Entity.BranchId.value equals b.Id into branchGroup
               from branch in branchGroup.DefaultIfEmpty()
               join c in categories on e.Entity.CategoryId.value equals c.Id into categoryGroup
               from category in categoryGroup.DefaultIfEmpty()
               select new VehicleDto
               {
                   Id = e.Entity.Id,
                   Brand = e.Entity.Brand.Value,
                   Model = e.Entity.Model.Value,
                   ModelYear = e.Entity.ModelYear.Value,
                   Color = e.Entity.Color.Value,
                   Plate = e.Entity.Plate.Value,
                   CategoryId = e.Entity.CategoryId,
                   CategoryName = category != null ? category.Name.Value : "Kategori Yok",
                   BranchId = e.Entity.BranchId,
                   BranchName = branch != null ? branch.Name.Value : "Şube Yok",
                   VinNumber = e.Entity.VinNumber.Value,
                   EngineNumber = e.Entity.EngineNumber.Value,
                   Description = e.Entity.Description.Value,
                   ImageUrl = e.Entity.ImageUrl.Value,
                   FuelType = e.Entity.FuelType.Value,
                   Transmission = e.Entity.Transmission.Value,
                   EngineVolume = e.Entity.EngineVolume.Value,
                   EnginePower = (int)e.Entity.EnginePower.Value,
                   TractionType = e.Entity.TractionType.Value,
                   FuelConsumption = e.Entity.FuelConsumption.Value,
                   SeatCount = e.Entity.SeatCount.Value,
                   Kilometer = e.Entity.Kilometer.Value,
                   DailyPrice = e.Entity.DailyPrice.Value,
                   WeeklyDiscountRate = e.Entity.WeeklyDiscountRate.Value,
                   MonthlyDiscountRate = e.Entity.MonthlyDiscountRate.Value,
                   InsuranceType = e.Entity.InsuranceType.Value,
                   LastMaintenanceDate = e.Entity.LastMaintenanceDate.Value,
                   LastMaintenanceKm = e.Entity.LastMaintenanceKm.Value,
                   NextMaintenanceKm = e.Entity.NextMaintenanceKm.Value,
                   InspectionDate = e.Entity.InspectionDate.Value,
                   InsuranceEndDate = e.Entity.InsuranceEndDate.Value,
                   CascoEndDate = e.Entity.CascoEndDate != null ? e.Entity.CascoEndDate.Value : null,
                   TireStatus = e.Entity.TireStatus.Value,
                   GeneralStatus = e.Entity.GeneralStatus.Value,
                   Features = e.Entity.Features.Select(f => f.Value).ToList(),
                   IsActive = e.Entity.IsActive,
                   CreatedAt = e.Entity.CreatedAt,
                   CreatedBy = e.Entity.CreatedBy,
                   CreatedFullName = e.CreatedUser != null ? e.CreatedUser.FullName.Value : "Bilinmiyor",
                   UpdatedAt = e.Entity.UpdatedAt,
                   UpdatedBy = e.Entity.UpdatedBy != null ? e.Entity.UpdatedBy.value : null,
                   UpdatedFullName = e.UpdatedUser != null ? e.UpdatedUser.FullName.Value : null,
               };
    }
}
