using Microsoft.EntityFrameworkCore;
using GitaLanding.Core.Entities;

namespace GitaLanding.Data;

/// <summary>
/// Основной контекст базы данных для приложения GitaLanding
/// </summary>
public class GitaLandingDbContext : DbContext
{
    public GitaLandingDbContext(DbContextOptions<GitaLandingDbContext> options) : base(options)
    {
    }

    /// <summary>
    /// Книги
    /// </summary>
    public DbSet<Book> Books { get; set; }

    /// <summary>
    /// Заказы
    /// </summary>
    public DbSet<BookOrder> BookOrders { get; set; }

    /// <summary>
    /// Авторы
    /// </summary>
    public DbSet<Author> Authors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Конфигурация сущности Book
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.AuthorName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ISBN).HasMaxLength(20);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.CoverImageUrl).HasMaxLength(500);
            entity.Property(e => e.PublicationYear);
            entity.Property(e => e.StockQuantity);
            entity.Property(e => e.IsAvailable);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);

            // Индексы для оптимизации поиска
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.AuthorName);
            entity.HasIndex(e => e.ISBN);
            entity.HasIndex(e => e.IsAvailable);
        });

        // Конфигурация сущности BookOrder
        modelBuilder.Entity<BookOrder>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomerEmail).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomerPhone).HasMaxLength(20);
            entity.Property(e => e.DeliveryAddress).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.DeliveryMethod).IsRequired();
            entity.Property(e => e.PaymentMethod).IsRequired();
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);

            // Связь с книгой
            entity.HasOne<Book>()
                  .WithMany()
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Индексы для оптимизации
            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasIndex(e => e.CustomerEmail);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Конфигурация сущности Author
        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Biography).HasMaxLength(5000);
            entity.Property(e => e.BirthDate);
            entity.Property(e => e.DeathDate);
            entity.Property(e => e.Nationality).HasMaxLength(50);
            entity.Property(e => e.PhotoUrl).HasMaxLength(500);
            entity.Property(e => e.Website).HasMaxLength(200);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);

            // Индексы для оптимизации
            entity.HasIndex(e => e.Name);
            entity.HasIndex(e => e.BirthDate);
        });

        // Начальные данные для основной книги
        modelBuilder.Entity<Book>().HasData(new Book
        {
            Id = 1,
            Title = "Bhagavad-gita As It Is",
            AuthorName = "A.C. Bhaktivedanta Swami Prabhupada",
            ISBN = "978-0-89213-268-3",
            Price = 1500.00m,
            Description = "Классический перевод и комментарии к Бхагавад-гите от Шрилы Прабхупады",
            PublicationYear = 1972,
            StockQuantity = 100,
            IsAvailable = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        // Начальные данные для основного автора
        modelBuilder.Entity<Author>().HasData(new Author
        {
            Id = 1,
            Name = "A.C. Bhaktivedanta Swami Prabhupada",
            Biography = "Основатель Международного общества сознания Кришны (ISKCON), выдающийся философ и духовный учитель",
            BirthDate = new DateTime(1896, 9, 1),
            DeathDate = new DateTime(1977, 11, 14),
            Nationality = "Индийская",
            PhotoUrl = "/assets/images/prabhupada.jpg",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
    }
}
