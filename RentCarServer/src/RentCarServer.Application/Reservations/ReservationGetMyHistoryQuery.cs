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
public sealed record ReservationGetMyHistoryQuery : IRequest<Result<List<ReservationDto>>>;
internal sealed class ReservationGetMyHistoryQueryHandler(
    IReservationRepository reservationRepository,
    ICustomerRepository customerRepository,
    IBranchRepository brancheRepository,
    IVehicleRepository vehicleRepository,
    ICategoryRepository categoryRepository,
    IProtectionPackageRepository protectionPackageRepository,
    IExtraRepository extraRepository,
    IClaimContext claimContext) : IRequestHandler<ReservationGetMyHistoryQuery, Result<List<ReservationDto>>>
{
    public async Task<Result<List<ReservationDto>>> Handle(ReservationGetMyHistoryQuery request, CancellationToken cancellationToken)
    {
        var customerId = claimContext.GetUserId();

        var query = reservationRepository
            .GetAllWithAudit()
            .Where(x => x.Entity.CustomerId == customerId)
            .MapTo(
                customerRepository.GetAll(),
                brancheRepository.GetAll(),
                vehicleRepository.GetAll(),
                categoryRepository.GetAll(),
                protectionPackageRepository.GetAll(),
                extraRepository.GetAll())
            .OrderByDescending(x => x.CreatedAt);

        var list = await query.ToListAsync(cancellationToken);
        return list;
    }
}