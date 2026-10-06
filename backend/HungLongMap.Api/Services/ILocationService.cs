using HungLongMap.Api.Models;

namespace HungLongMap.Api.Services;

public interface ILocationService
{
    Task<List<Location>> GetAllLocationsAsync();
    Task<Location?> GetLocationByIdAsync(string id);
    Task<List<Category>> GetAllCategoriesAsync();
    Task<object?> GetMapBoundaryAsync();
}
