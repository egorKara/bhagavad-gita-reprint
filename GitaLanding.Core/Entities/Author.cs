using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Core.Entities;

/// <summary>
/// Автор книги - Шрила Прабхупада
/// </summary>
public class Author
{
    /// <summary>
    /// Уникальный идентификатор автора
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Полное имя автора
    /// </summary>
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    /// <summary>
    /// Инициалы
    /// </summary>
    [StringLength(20)]
    public string? Initials { get; set; }
    
    /// <summary>
    /// Год рождения
    /// </summary>
    public int? BirthYear { get; set; }
    
    /// <summary>
    /// Год смерти
    /// </summary>
    public int? DeathYear { get; set; }
    
    /// <summary>
    /// Краткая биография
    /// </summary>
    [StringLength(2000)]
    public string? Biography { get; set; }
    
    /// <summary>
    /// Миссия и философия
    /// </summary>
    [StringLength(3000)]
    public string? Mission { get; set; }
    
    /// <summary>
    /// Достижения и награды
    /// </summary>
    [StringLength(1000)]
    public string? Achievements { get; set; }
    
    /// <summary>
    /// Фотография автора (путь к файлу)
    /// </summary>
    [StringLength(500)]
    public string? PhotoPath { get; set; }
    
    /// <summary>
    /// Веб-сайт
    /// </summary>
    [Url]
    [StringLength(200)]
    public string? Website { get; set; }
    
    /// <summary>
    /// Email для связи
    /// </summary>
    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }
    
    /// <summary>
    /// Язык контента
    /// </summary>
    [Required]
    [StringLength(10)]
    public string Language { get; set; } = "ru";
    
    /// <summary>
    /// Активность автора
    /// </summary>
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Дата создания записи
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Дата последнего обновления
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Связанные книги
    /// </summary>
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    
    /// <summary>
    /// Обновление времени последнего изменения
    /// </summary>
    public void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Получение возраста автора
    /// </summary>
    public int? GetAge()
    {
        if (BirthYear.HasValue)
        {
            var endYear = DeathYear ?? DateTime.Now.Year;
            return endYear - BirthYear.Value;
        }
        return null;
    }
    
    /// <summary>
    /// Проверка, жив ли автор
    /// </summary>
    public bool IsAlive()
    {
        return !DeathYear.HasValue;
    }
}
