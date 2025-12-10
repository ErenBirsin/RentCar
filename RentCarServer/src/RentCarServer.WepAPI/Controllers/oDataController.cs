using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using RentCarServer.Application.Branches;
using TS.MediatR;

namespace RentCarServer.WepAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
[EnableQuery]
public class oDataController : ControllerBase
{
    public static IEdmModel GetEdmModel()
    {
        ODataConventionModelBuilder builder = new();
        builder.EnableLowerCamelCase();
        builder.EntitySet<BranchDto>("branches");
        return builder.GetEdmModel();
    }

    [HttpGet("branches")]
    public IQueryable<BranchDto> Branches(ISender sender, CancellationToken cancellationToken = default)
        => sender.Send(new BranchGetAllQuery(), cancellationToken).Result;
}
