using HungLongMap.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------- Services ----------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ILocationService, LocationService>();

const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        // Vite dev server mặc định chạy ở cổng 5173.
        // Thêm domain khi deploy thật vào đây.
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:4173",   // vite preview
                "https://phamnguyenhoangphuc2005.github.io"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ---------- Middleware pipeline ----------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(FrontendCorsPolicy);

// Cho phép truy cập tĩnh vào wwwroot/images, wwwroot/videos, wwwroot/map
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
