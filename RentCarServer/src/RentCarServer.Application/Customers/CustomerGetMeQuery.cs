using Microsoft.EntityFrameworkCore;
using RentCarServer.Application.Services;
using RentCarServer.Domain.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Customers;
public sealed record CustomerGetMeQuery() : IRequest<Result<CustomerDto>>;

internal sealed class CustomerGetMeQueryHandler(
    ICustomerRepository repository,
    IClaimContext claimContext) : IRequestHandler<CustomerGetMeQuery, Result<CustomerDto>>
{
    public async Task<Result<CustomerDto>> Handle(CustomerGetMeQuery request, CancellationToken cancellationToken)
    {
        var customerId = claimContext.GetUserId();

        var res = await repository
            .GetAllWithAudit()
            .MapTo()
            .Where(p => p.Id == customerId)
            .FirstOrDefaultAsync(cancellationToken);

        if (res is null)
            return Result<CustomerDto>.Failure("Müşteri bulunamadı");

        return res;
    }
}