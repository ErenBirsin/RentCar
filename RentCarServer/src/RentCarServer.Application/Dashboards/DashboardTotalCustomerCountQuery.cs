using Microsoft.EntityFrameworkCore;
using RentCarServer.Domain.Customers;
using TS.MediatR;
using TS.Result;

namespace RentCarServer.Application.Dashboards;

public sealed record DashboardTotalCustomerCountQuery : IRequest<Result<int>>;

internal sealed class DashboardTotalCustomerCountQueryHandler(
    ICustomerRepository customerRepository
    ) : IRequestHandler<DashboardTotalCustomerCountQuery, Result<int>>
{
    public async Task<Result<int>> Handle(DashboardTotalCustomerCountQuery request, CancellationToken cancellationToken)
    {
        var res = await customerRepository
            .GetAll()
            .Where(c => c.IsActive == true)
            .CountAsync(cancellationToken);

        return res;
    }
}

