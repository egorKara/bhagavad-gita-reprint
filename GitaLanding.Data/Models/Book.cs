using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Data.Models
{
    /// <summary>
    /// Модель книги "Бхагавад-Гита как она есть"
    /// </summary>
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;

        [StringLength(50)]
        public string Edition { get; set; } = "1972 Original";

        [StringLength(100)]
        public string Publisher { get; set; } = "Macmillan";

        [StringLength(20)]
        public string ISBN { get; set; } = string.Empty;

        [StringLength(20)]
        public string Language { get; set; } = "English";

        [Range(1, 1000)]
        public int Pages { get; set; } = 800;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Range(0, 10000)]
        public decimal Price { get; set; } = 0;

        [StringLength(20)]
        public string Currency { get; set; } = "USD";

        [StringLength(100)]
        public string CoverImage { get; set; } = string.Empty;

        [StringLength(100)]
        public string BackCoverImage { get; set; } = string.Empty;

        [StringLength(100)]
        public string SpineImage { get; set; } = string.Empty;

        public bool IsAvailable { get; set; } = true;

        public int StockQuantity { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual ICollection<BookOrder> Orders { get; set; } = new List<BookOrder>();
    }
}