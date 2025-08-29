namespace GitaLanding.Data.Models
{
    /// <summary>
    /// Статус заказа
    /// </summary>
    public enum OrderStatus
    {
        Pending = 0,        // Ожидает обработки
        Confirmed = 1,      // Подтвержден
        Processing = 2,     // Обрабатывается
        Shipped = 3,        // Отправлен
        Delivered = 4,      // Доставлен
        Cancelled = 5,      // Отменен
        Refunded = 6        // Возвращен
    }

    /// <summary>
    /// Статус платежа
    /// </summary>
    public enum PaymentStatus
    {
        Pending = 0,        // Ожидает оплаты
        Paid = 1,           // Оплачен
        Failed = 2,         // Ошибка оплаты
        Refunded = 3,       // Возвращен
        PartiallyRefunded = 4 // Частично возвращен
    }

    /// <summary>
    /// Способ оплаты
    /// </summary>
    public enum PaymentMethod
    {
        CreditCard = 0,     // Кредитная карта
        DebitCard = 1,      // Дебетовая карта
        BankTransfer = 2,   // Банковский перевод
        Cash = 3,           // Наличные
        DigitalWallet = 4,  // Цифровой кошелек
        Cryptocurrency = 5  // Криптовалюта
    }

    /// <summary>
    /// Способ доставки
    /// </summary>
    public enum ShippingMethod
    {
        Standard = 0,       // Стандартная доставка
        Express = 1,        // Экспресс доставка
        Overnight = 2,      // Доставка за ночь
        Pickup = 3,         // Самовывоз
        International = 4   // Международная доставка
    }

    /// <summary>
    /// Язык книги
    /// </summary>
    public enum BookLanguage
    {
        English = 0,        // Английский
        Russian = 1,        // Русский
        Hindi = 2,          // Хинди
        Sanskrit = 3,       // Санскрит
        Spanish = 4,        // Испанский
        French = 5,         // Французский
        German = 6,         // Немецкий
        Chinese = 7,        // Китайский
        Japanese = 8,       // Японский
        Other = 9           // Другой
    }
}