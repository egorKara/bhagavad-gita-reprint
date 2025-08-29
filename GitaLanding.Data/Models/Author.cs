using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Data.Models
{
    /// <summary>
    /// Модель автора - Шрила Прабхупада
    /// </summary>
    public class Author
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = "A.C. Bhaktivedanta Swami Prabhupada";

        [StringLength(100)]
        public string Title { get; set; } = "Srila Prabhupada";

        [StringLength(100)]
        public string BirthName { get; set; } = "Abhay Charan De";

        [StringLength(20)]
        public string BirthDate { get; set; } = "1896-09-01";

        [StringLength(20)]
        public string PassingDate { get; set; } = "1977-11-14";

        [StringLength(100)]
        public string BirthPlace { get; set; } = "Calcutta, India";

        [StringLength(100)]
        public string Nationality { get; set; } = "Indian";

        [StringLength(500)]
        public string Biography { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Mission { get; set; } = string.Empty;

        [StringLength(100)]
        public string Organization { get; set; } = "ISKCON";

        [StringLength(100)]
        public string Photo { get; set; } = string.Empty;

        [StringLength(500)]
        public string Achievements { get; set; } = string.Empty;

        [StringLength(500)]
        public string Legacy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }
}