using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Core.Entities;

/// <summary>
/// Книга "Бхагавад-Гита как она есть"
/// </summary>
public class Book
{
    /// <summary>
    /// Уникальный идентификатор книги
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Название книги
    /// </summary>
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// Подзаголовок
    /// </summary>
    [StringLength(300)]
    public string? Subtitle { get; set; }
    
    /// <summary>
    /// Автор
    /// </summary>
    [Required]
    [StringLength(100)]
    public string Author { get; set; } = string.Empty;
    
    /// <summary>
    /// ISBN
    /// </summary>
    [StringLength(20)]
    public string? Isbn { get; set; }
    
    /// <summary>
    /// Год издания
    /// </summary>
    public int PublicationYear { get; set; }
    
    /// <summary>
    /// Количество страниц
    /// </summary>
    public int Pages { get; set; }
    
    /// <summary>
    /// Количество иллюстраций
    /// </summary>
    public int Illustrations { get; set; }
    
    /// <summary>
    /// Цена в рублях
    /// </summary>
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    /// <summary>
    /// Описание книги
    /// </summary>
    [StringLength(2000)]
    public string? Description { get; set; }
    
    /// <summary>
    /// Язык книги
    /// </summary>
    [Required]
    [StringLength(10)]
    public string Language { get; set; } = "ru";
    
    /// <summary>
    /// Доступность для заказа
    /// </summary>
    public bool IsAvailable { get; set; } = true;
    
    /// <summary>
    /// Количество доступных экземпляров
    /// </summary>
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
    
    /// <summary>
    /// Дата создания записи
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Дата последнего обновления
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Связанные заказы
    /// </summary>
    public virtual ICollection<BookOrder> Orders { get; set; } = new List<BookOrder>();
    
    /// <summary>
    /// Обновление времени последнего изменения
    /// </summary>
    public void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}
