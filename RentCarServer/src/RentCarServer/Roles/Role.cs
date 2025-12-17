using RentCarServer.Domain.Abstractions;
using RentCarServer.Domain.Shared;

namespace RentCarServer.Domain.Roles;
public sealed class Role : Entity
{
    private Role() { }
    public Role(Name name, bool isActive)
    {
        SetName(name);
        SetStatus(isActive);
    }
    public Name Name { get; private set; } = default!;

    #region Behaviors
    public void SetName(Name name)
    {
        Name = name;
    }
    #endregion
}
