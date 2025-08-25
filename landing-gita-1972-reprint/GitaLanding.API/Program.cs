using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Настройка pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Простые тестовые endpoints
app.MapGet("/", () => "GitaLanding API работает!");
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));
app.MapGet("/api/books", () => Results.Ok(new { message = "Books endpoint working", timestamp = DateTime.UtcNow }));
app.MapGet("/api/authors", () => Results.Ok(new { message = "Authors endpoint working", timestamp = DateTime.UtcNow }));
app.MapGet("/api/books/main", () => Results.Ok(new { message = "Main book endpoint working", timestamp = DateTime.UtcNow }));

app.Run();
