using Microsoft.EntityFrameworkCore;
using GitaLanding.Data.Models;

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
            entity.Property(e => e.Author).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ISBN).HasMaxLength(20);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.CoverImage).HasMaxLength(100);
            entity.Property(e => e.StockQuantity);
            entity.Property(e => e.IsAvailable);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);

            // Индексы для оптимизации поиска
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.Author);
            entity.HasIndex(e => e.ISBN);
            entity.HasIndex(e => e.IsAvailable);
        });

        // Конфигурация сущности BookOrder
        modelBuilder.Entity<BookOrder>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomerEmail).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomerPhone).HasMaxLength(20);
            entity.Property(e => e.ShippingAddress).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OrderStatus).IsRequired();
            entity.Property(e => e.PaymentStatus).IsRequired();
            entity.Property(e => e.PaymentMethod).IsRequired();
            entity.Property(e => e.ShippingMethod).IsRequired();
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);

            // Связь с книгой
            entity.HasOne(e => e.Book)
                  .WithMany(b => b.Orders)
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Restrict);

            // Индексы для оптимизации
            entity.HasIndex(e => e.CustomerEmail);
            entity.HasIndex(e => e.OrderStatus);
            entity.HasIndex(e => e.CreatedAt);
        });

        // Конфигурация сущности Author
        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Biography).HasMaxLength(500);
            entity.Property(e => e.BirthDate).HasMaxLength(20);
            entity.Property(e => e.PassingDate).HasMaxLength(20);
            entity.Property(e => e.Nationality).HasMaxLength(100);
            entity.Property(e => e.Photo).HasMaxLength(100);
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
            Author = "A.C. Bhaktivedanta Swami Prabhupada",
            Edition = "1972 Original",
            Publisher = "Macmillan",
            ISBN = "978-0-89213-268-3",
            Language = "English",
            Pages = 800,
            Description = "Классический перевод и комментарии к Бхагавад-гите от Шрилы Прабхупады",
            Price = 1500.00m,
            Currency = "RUB",
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
            Title = "Srila Prabhupada",
            BirthName = "Abhay Charan De",
            BirthDate = "1896-09-01",
            PassingDate = "1977-11-14",
            BirthPlace = "Calcutta, India",
            Nationality = "Indian",
            Biography = "Основатель Международного общества сознания Кришны (ISKCON), выдающийся философ и духовный учитель",
            Mission = "Распространение сознания Кришны по всему миру через перевод и комментарии к ведическим текстам",
            Organization = "ISKCON",
            Photo = "/assets/images/prabhupada.jpg",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
    }
}
