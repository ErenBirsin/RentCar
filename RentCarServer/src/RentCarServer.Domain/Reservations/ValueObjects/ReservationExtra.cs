namespace RentCarServer.Domain.Reservations.ValueObjects;

public sealed record ReservationExtra(
    Guid ExtraId,
    decimal Price);