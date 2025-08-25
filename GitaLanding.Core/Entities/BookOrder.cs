using System.ComponentModel.DataAnnotations;

namespace GitaLanding.Core.Entities;

/// <summary>
/// Заказ книги
/// </summary>
public class BookOrder
{
    /// <summary>
    /// Уникальный идентификатор заказа
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Номер заказа (для клиента)
    /// </summary>
    [Required]
    [StringLength(20)]
    public string OrderNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Связанная книга
    /// </summary>
    public int BookId { get; set; }
    public virtual Book Book { get; set; } = null!;
    
    /// <summary>
    /// Количество экземпляров
    /// </summary>
    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
    
    /// <summary>
    /// Цена за единицу на момент заказа
    /// </summary>
    [Range(0, double.MaxValue)]
    public decimal UnitPrice { get; set; }
    
    /// <summary>
    /// Общая стоимость заказа
    /// </summary>
    [Range(0, double.MaxValue)]
    public decimal TotalPrice { get; set; }
    
    /// <summary>
    /// Имя заказчика
    /// </summary>
    [Required]
    [StringLength(100)]
    public string CustomerName { get; set; } = string.Empty;
    
    /// <summary>
    /// Email заказчика
    /// </summary>
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string CustomerEmail { get; set; } = string.Empty;
    
    /// <summary>
    /// Телефон заказчика
    /// </summary>
    [Phone]
    [StringLength(20)]
    public string? CustomerPhone { get; set; }
    
    /// <summary>
    /// Адрес доставки
    /// </summary>
    [StringLength(500)]
    public string? DeliveryAddress { get; set; }
    
    /// <summary>
    /// Комментарий к заказу
    /// </summary>
    [StringLength(1000)]
    public string? Comment { get; set; }
    
    /// <summary>
    /// Статус заказа
    /// </summary>
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    /// <summary>
    /// Способ доставки
    /// </summary>
    public DeliveryMethod DeliveryMethod { get; set; } = DeliveryMethod.Post;
    
    /// <summary>
    /// Способ оплаты
    /// </summary>
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    
    /// <summary>
    /// Дата создания заказа
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Дата последнего обновления
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Дата выполнения заказа
    /// </summary>
    public DateTime? CompletedAt { get; set; }
    
    /// <summary>
    /// Расчет общей стоимости
    /// </summary>
    public void CalculateTotalPrice()
    {
        TotalPrice = UnitPrice * Quantity;
    }
    
    /// <summary>
    /// Обновление времени последнего изменения
    /// </summary>
    public void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Отметка заказа как выполненного
    /// </summary>
    public void MarkAsCompleted()
    {
        Status = OrderStatus.Completed;
        CompletedAt = DateTime.UtcNow;
        UpdateTimestamp();
    }
}

/// <summary>
/// Статус заказа
/// </summary>
public enum OrderStatus
{
    /// <summary>
    /// Ожидает обработки
    /// </summary>
    Pending = 0,
    
    /// <summary>
    /// Подтвержден
    /// </summary>
    Confirmed = 1,
    
    /// <summary>
    /// В обработке
    /// </summary>
    Processing = 2,
    
    /// <summary>
    /// Отправлен
    /// </summary>
    Shipped = 3,
    
    /// <summary>
    /// Доставлен
    /// </summary>
    Delivered = 4,
    
    /// <summary>
    /// Выполнен
    /// </summary>
    Completed = 5,
    
    /// <summary>
    /// Отменен
    /// </summary>
    Cancelled = 6
}

/// <summary>
/// Способ доставки
/// </summary>
public enum DeliveryMethod
{
    /// <summary>
    /// Почта России
    /// </summary>
    Post = 0,
    
    /// <summary>
    /// Курьерская доставка
    /// </summary>
    Courier = 1,
    
    /// <summary>
    /// Самовывоз
    /// </summary>
    Pickup = 2
}

/// <summary>
/// Способ оплаты
/// </summary>
public enum PaymentMethod
{
    /// <summary>
    /// Наложенный платеж
    /// </summary>
    CashOnDelivery = 0,
    
    /// <summary>
    /// Банковская карта
    /// </summary>
    Card = 1,
    
    /// <summary>
    /// Электронный кошелек
    /// </summary>
    EWallet = 2
}
