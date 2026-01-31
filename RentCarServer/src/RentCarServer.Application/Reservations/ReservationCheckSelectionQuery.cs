using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Vehicles;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Reservations;

public sealed record ReservationCheckSelectionDto(Guid? VehicleId, bool HasSelectedVehicle, string Message);

public sealed record ReservationCheckSelectionQuery(
    Guid? VehicleId,
    Guid? PickUpLocationId,
    DateOnly? PickUpDate,
    TimeOnly? PickUpTime,
    DateOnly? DeliveryDate,
    TimeOnly? DeliveryTime
    ) : IRequest<Result<ReservationCheckSelectionDto>>;

internal sealed class ReservationCheckSelectionQueryHandler(
    IReservationRepository reservationRepository,
    IVehicleRepository vehicleRepository
    ) : IRequestHandler<ReservationCheckSelectionQuery, Result<ReservationCheckSelectionDto>>
{
    public async Task<Result<ReservationCheckSelectionDto>> Handle(ReservationCheckSelectionQuery request, CancellationToken cancellationToken)
    {
        if (request.VehicleId is null || request.VehicleId == Guid.Empty)
        {
            return Result<ReservationCheckSelectionDto>.Failure("Araç seçilmedi");
        }

        var vehicle = await vehicleRepository.FirstOrDefaultAsync(i => i.Id == request.VehicleId, cancellationToken);
        if (vehicle is null)
        {
            return Result<ReservationCheckSelectionDto>.Failure("Seçilen araç bulunamadı");
        }

        var dto = new ReservationCheckSelectionDto(request.VehicleId, true, string.Empty);
        return Result<ReservationCheckSelectionDto>.Succeed(dto);
    }
}