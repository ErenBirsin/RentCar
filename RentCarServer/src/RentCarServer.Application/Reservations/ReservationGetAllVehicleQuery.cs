using Microsoft.EntityFrameworkCore;
using RentCarServer.Application.Vehicles;
using RentCarServer.Domain.Branches;
using RentCarServer.Domain.Categories;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Vehicles;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Reservations;

public sealed record ReservationGetAllVehicleQuery(
    Guid BranchId,
    DateOnly PickUpDate,
    TimeOnly PickUpTime,
    DateOnly DeliveryDate,
    TimeOnly DeliverTime
    ) : IRequest<Result<List<ReservationVehicleDto>>>;

internal sealed class ReservationGetAllVehicleQueryHandler(
    IReservationRepository reservationRepository,
    IVehicleRepository vehicleRepository,
    IBranchRepository branchRepository,
    ICategoryRepository categoryRepository
    ) : IRequestHandler<ReservationGetAllVehicleQuery, Result<List<ReservationVehicleDto>>>
{
    public async Task<Result<List<ReservationVehicleDto>>> Handle(ReservationGetAllVehicleQuery request, CancellationToken cancellationToken)
    {
        var pickupDatetime = new DateTime(request.PickUpDate, request.PickUpTime);
        var deliveryDatetime = new DateTime(request.DeliveryDate, request.DeliverTime);

        var unavailabeVehicleIdsQueryable = reservationRepository
            .Where(p =>
                p.PickUpLocationId == request.BranchId
                && p.PickUpDateTime.Value >= pickupDatetime
                && p.DeliveryDateTime.Value.AddHours(1) <= deliveryDatetime)
            .AsQueryable();

        var unavailabeVehicleIds = await unavailabeVehicleIdsQueryable
            .Select(s => s.VehicleId.value)
            .ToListAsync(cancellationToken);

        var vehicles = await vehicleRepository
            .GetAllWithAudit()
            .Where(p =>
            !unavailabeVehicleIds.Contains(p.Entity.Id)
            && p.Entity.BranchId.value == request.BranchId)
            .MapTo(
            branchRepository.GetAll(),
            categoryRepository.GetAll())
            .ToListAsync(cancellationToken);

        // Burada değişişklik yaptım.
        var reservationVehicles = vehicles.Select(v => new ReservationVehicleDto
        {
            Id = v.Id,
            Brand = v.Brand,
            Model = v.Model,
            ModelYear = v.ModelYear,
            Color = v.Color,
            Plate = v.Plate,
            CategoryName = v.CategoryName,
            FuelType = v.FuelType,
            Transmission = v.Transmission,
            FuelConsumption = v.FuelConsumption,
            SeatCount = v.SeatCount,
            TractionType = v.TractionType,
            Kilometer = v.Kilometer,
            ImageUrl = v.ImageUrl,
            DailyPrice = v.DailyPrice
        }).ToList();

        return Result<List<ReservationVehicleDto>>.Succeed(reservationVehicles);
    }
}