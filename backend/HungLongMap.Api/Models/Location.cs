using System.Text.Json.Serialization;

namespace HungLongMap.Api.Models;

public class Location
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("categoryId")]
    public string CategoryId { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("history")]
    public string History { get; set; } = string.Empty;

    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    [JsonPropertyName("videos")]
    public List<string> Videos { get; set; } = new();
}
