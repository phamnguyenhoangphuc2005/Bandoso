using HungLongMap.Api.Models;
using HungLongMap.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HungLongMap.Api.Controllers;

[ApiController]
[Route("api/locations")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    // GET /api/locations
    [HttpGet]
    public async Task<ActionResult<List<Location>>> GetAll()
    {
        var locations = await _locationService.GetAllLocationsAsync();
        return Ok(locations);
    }

    // GET /api/locations/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Location>> GetById(string id)
    {
        var location = await _locationService.GetLocationByIdAsync(id);
        if (location is null)
        {
            return NotFound(new { message = $"Không tìm thấy địa điểm có id = {id}" });
        }
        return Ok(location);
    }
}
