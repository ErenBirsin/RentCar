using Microsoft.EntityFrameworkCore;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Branches;
using RentCarServer.Domain.Categories;
using RentCarServer.Domain.Customers;
using RentCarServer.Domain.Extras;
using RentCarServer.Domain.ProtectionPackage;
using RentCarServer.Domain.Reservations;
using RentCarServer.Domain.Vehicles;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Reservations;
public sealed record ReservationGetMyDetailQuery(
    Guid Id) : IRequest<Result<ReservationDto>>;
internal sealed class ReservationGetMyDetailQueryHandler(
    IReservationRepository reservationRepository,
    ICustomerRepository customerRepository,
    IBranchRepository brancheRepository,
    IVehicleRepository vehicleRepository,
    ICategoryRepository categoryRepository,
    IProtectionPackageRepository protectionPackageRepository,
    IExtraRepository extraRepository,
    IClaimContext claimContext) : IRequestHandler<ReservationGetMyDetailQuery, Result<ReservationDto>>
{
    public async Task<Result<ReservationDto>> Handle(ReservationGetMyDetailQuery request, CancellationToken cancellationToken)
    {
        var customerId = claimContext.GetUserId();

        var res = await reservationRepository
            .GetAllWithAudit()
            .Where(x => x.Entity.CustomerId == customerId)
            .MapTo(
                customerRepository.GetAll(),
                brancheRepository.GetAll(),
                vehicleRepository.GetAll(),
                categoryRepository.GetAll(),
                protectionPackageRepository.GetAll(),
                extraRepository.GetAll())
            .Where(i => i.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (res is null)
        {
            return Result<ReservationDto>.Failure("Rezervasyon bulunamadı");
        }

        return res;
    }
}