using HungLongMap.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HungLongMap.Api.Controllers;

[ApiController]
[Route("api/map")]
public class MapController : ControllerBase
{
    private readonly ILocationService _locationService;

    public MapController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    // GET /api/map/boundary
    // Trả về ranh giới hành chính xã Hưng Long (GeoJSON), đọc từ
    // wwwroot/map/hung-long.geojson.
    [HttpGet("boundary")]
    public async Task<ActionResult<object>> GetBoundary()
    {
        var boundary = await _locationService.GetMapBoundaryAsync();
        if (boundary is null)
        {
            return NotFound(new { message = "Chưa có file ranh giới wwwroot/map/hung-long.geojson" });
        }
        return Ok(boundary);
    }
}
