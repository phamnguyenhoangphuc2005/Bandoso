using System.Text.Json;
using HungLongMap.Api.Models;

namespace HungLongMap.Api.Services;

/// <summary>
/// Đọc dữ liệu trực tiếp từ file JSON trong thư mục Data/ và wwwroot/map/.
/// Không sử dụng Database theo đúng yêu cầu của dự án.
/// </summary>
public class LocationService : ILocationService
{
    private readonly IWebHostEnvironment _env;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public LocationService(IWebHostEnvironment env)
    {
        _env = env;
    }

    private string DataPath(string fileName) =>
        Path.Combine(_env.ContentRootPath, "Data", fileName);

    private string MapPath(string fileName) =>
        Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "map", fileName);

    public async Task<List<Location>> GetAllLocationsAsync()
    {
        var json = await File.ReadAllTextAsync(DataPath("locations.json"));
        return JsonSerializer.Deserialize<List<Location>>(json, _jsonOptions) ?? new List<Location>();
    }

    public async Task<Location?> GetLocationByIdAsync(string id)
    {
        var locations = await GetAllLocationsAsync();
        return locations.FirstOrDefault(l => l.Id == id);
    }

    public async Task<List<Category>> GetAllCategoriesAsync()
    {
        var json = await File.ReadAllTextAsync(DataPath("categories.json"));
        return JsonSerializer.Deserialize<List<Category>>(json, _jsonOptions) ?? new List<Category>();
    }

    public async Task<object?> GetMapBoundaryAsync()
    {
        var path = MapPath("hung-long.geojson");
        if (!File.Exists(path)) return null;

        var json = await File.ReadAllTextAsync(path);
        return JsonSerializer.Deserialize<object>(json, _jsonOptions);
    }
}
