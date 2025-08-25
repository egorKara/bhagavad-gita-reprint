using GitaLanding.Core.Entities;

namespace GitaLanding.Core.Services;

/// <summary>
/// Интерфейс для сервиса управления заказами
/// </summary>
public interface IOrderService
{
    /// <summary>
    /// Получить все заказы с пагинацией
    /// </summary>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <param name="status">Фильтр по статусу</param>
    /// <returns>Список заказов</returns>
    Task<IEnumerable<BookOrder>> GetOrdersAsync(int page = 1, int pageSize = 20, OrderStatus? status = null);
    
    /// <summary>
    /// Получить заказ по ID
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <returns>Заказ или null</returns>
    Task<BookOrder?> GetOrderByIdAsync(int id);
    
    /// <summary>
    /// Получить заказ по номеру
    /// </summary>
    /// <param name="orderNumber">Номер заказа</param>
    /// <returns>Заказ или null</returns>
    Task<BookOrder?> GetOrderByNumberAsync(string orderNumber);
    
    /// <summary>
    /// Создать новый заказ
    /// </summary>
    /// <param name="order">Данные заказа</param>
    /// <returns>Созданный заказ</returns>
    Task<BookOrder> CreateOrderAsync(BookOrder order);
    
    /// <summary>
    /// Обновить заказ
    /// </summary>
    /// <param name="order">Обновленные данные</param>
    /// <returns>Обновленный заказ или null</returns>
    Task<BookOrder?> UpdateOrderAsync(BookOrder order);
    
    /// <summary>
    /// Обновить статус заказа
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <param name="status">Новый статус</param>
    /// <returns>Обновленный заказ или null</returns>
    Task<BookOrder?> UpdateOrderStatusAsync(int id, OrderStatus status);
    
    /// <summary>
    /// Удалить заказ
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <returns>True если удалено, false если не найдено</returns>
    Task<bool> DeleteOrderAsync(int id);
    
    /// <summary>
    /// Получить статистику заказов
    /// </summary>
    /// <returns>Статистика</returns>
    Task<object> GetOrderStatsAsync();
    
    /// <summary>
    /// Получить заказы клиента
    /// </summary>
    /// <param name="customerEmail">Email клиента</param>
    /// <returns>Заказы клиента</returns>
    Task<IEnumerable<BookOrder>> GetOrdersByCustomerAsync(string customerEmail);
    
    /// <summary>
    /// Сгенерировать уникальный номер заказа
    /// </summary>
    /// <returns>Номер заказа</returns>
    Task<string> GenerateOrderNumberAsync();
    
    /// <summary>
    /// Получить общее количество заказов
    /// </summary>
    /// <param name="status">Фильтр по статусу</param>
    /// <returns>Количество заказов</returns>
    Task<int> GetOrdersCountAsync(OrderStatus? status = null);
    
    /// <summary>
    /// Получить заказы за период
    /// </summary>
    /// <param name="startDate">Начальная дата</param>
    /// <param name="endDate">Конечная дата</param>
    /// <returns>Заказы за период</returns>
    Task<IEnumerable<BookOrder>> GetOrdersByDateRangeAsync(DateTime startDate, DateTime endDate);
    
    /// <summary>
    /// Проверить возможность создания заказа
    /// </summary>
    /// <param name="bookId">ID книги</param>
    /// <param name="quantity">Количество</param>
    /// <returns>True если возможно</returns>
    Task<bool> CanCreateOrderAsync(int bookId, int quantity);
}
