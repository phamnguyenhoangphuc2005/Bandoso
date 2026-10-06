using HungLongMap.Api.Models;
using HungLongMap.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HungLongMap.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ILocationService _locationService;

    public CategoriesController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    // GET /api/categories
    [HttpGet]
    public async Task<ActionResult<List<Category>>> GetAll()
    {
        var categories = await _locationService.GetAllCategoriesAsync();
        return Ok(categories);
    }
}
