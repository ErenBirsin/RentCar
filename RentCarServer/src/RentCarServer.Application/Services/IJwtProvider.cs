using RentCarServer.Domain.Customers;
using RentCarServer.Domain.Users;

namespace RentCarServer.Application.Services;
public interface IJwtProvider
{
    Task<string> CreateTokenAsync(User user, CancellationToken cancellationToken = default);
    Task<string> CreateTokenAsync(Customer customer, CancellationToken cancellationToken = default);
}