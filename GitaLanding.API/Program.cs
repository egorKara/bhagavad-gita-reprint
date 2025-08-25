using GitaLanding.Core.Services;
using GitaLanding.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// Настройка Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/gita-landing-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Добавляем сервисы
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Настройка Entity Framework Core с PostgreSQL
builder.Services.AddDbContext<GitaLanding.Data.GitaLandingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавляем репозитории
builder.Services.AddScoped<GitaLanding.Data.Repositories.IBookRepository, GitaLanding.Data.Repositories.BookRepository>();

// Добавляем сервисы
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Настройка middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Добавляем метрики Prometheus
app.UseMetricServer();
app.UseHttpMetrics();

app.UseAuthorization();
app.MapControllers();

// Endpoint для метрик
app.MapMetrics();

// Endpoint для проверки здоровья
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }));

try
{
    Log.Information("Запуск GitaLanding API...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Ошибка запуска приложения");
}
finally
{
    Log.CloseAndFlush();
}
