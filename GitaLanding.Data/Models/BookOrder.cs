using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Data.Models
{
    /// <summary>
    /// Модель заказа книги
    /// </summary>
    public class BookOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string CustomerEmail { get; set; } = string.Empty;

        [StringLength(20)]
        public string CustomerPhone { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string ShippingAddress { get; set; } = string.Empty;

        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [StringLength(20)]
        public string PostalCode { get; set; } = string.Empty;

        [StringLength(100)]
        public string Country { get; set; } = "Russia";

        [Range(1, 10)]
        public int Quantity { get; set; } = 1;

        [Range(0, 10000)]
        public decimal TotalPrice { get; set; } = 0;

        [StringLength(20)]
        public string Currency { get; set; } = "RUB";

        [StringLength(50)]
        public string OrderStatus { get; set; } = "Pending";

        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(50)]
        public string ShippingMethod { get; set; } = string.Empty;

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public DateTime? ShippedDate { get; set; }

        public DateTime? DeliveredDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Навигационные свойства
        public virtual Book Book { get; set; } = null!;
    }
}