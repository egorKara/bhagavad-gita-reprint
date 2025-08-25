using Microsoft.AspNetCore.Mvc;
using GitaLanding.Core.Entities;
using GitaLanding.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace GitaLanding.API.Controllers;

/// <summary>
/// API контроллер для управления заказами
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    /// <summary>
    /// Получить все заказы (с пагинацией)
    /// </summary>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <param name="status">Фильтр по статусу</param>
    /// <returns>Список заказов</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<BookOrder>>> GetOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] OrderStatus? status = null)
    {
        try
        {
            _logger.LogInformation("Получение списка заказов. Страница: {Page}, Статус: {Status}", page, status);
            
            var orders = await _orderService.GetOrdersAsync(page, pageSize, status);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка заказов");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить заказ по ID
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <returns>Заказ</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookOrder>> GetOrder(int id)
    {
        try
        {
            _logger.LogInformation("Получение заказа с ID: {Id}", id);
            
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound($"Заказ с ID {id} не найден");
            }
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении заказа с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить заказ по номеру
    /// </summary>
    /// <param name="orderNumber">Номер заказа</param>
    /// <returns>Заказ</returns>
    [HttpGet("number/{orderNumber}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookOrder>> GetOrderByNumber(string orderNumber)
    {
        try
        {
            _logger.LogInformation("Получение заказа по номеру: {OrderNumber}", orderNumber);
            
            var order = await _orderService.GetOrderByNumberAsync(orderNumber);
            if (order == null)
            {
                return NotFound($"Заказ с номером {orderNumber} не найден");
            }
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении заказа по номеру: {OrderNumber}", orderNumber);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Создать новый заказ
    /// </summary>
    /// <param name="order">Данные заказа</param>
    /// <returns>Созданный заказ</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BookOrder>> CreateOrder([FromBody] BookOrder order)
    {
        try
        {
            _logger.LogInformation("Создание нового заказа для клиента: {CustomerName}", order.CustomerName);
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Генерируем номер заказа
            order.OrderNumber = await _orderService.GenerateOrderNumberAsync();
            
            // Рассчитываем общую стоимость
            order.CalculateTotalPrice();
            
            var createdOrder = await _orderService.CreateOrderAsync(order);
            return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при создании заказа");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании заказа");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Обновить заказ
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <param name="order">Обновленные данные</param>
    /// <returns>Обновленный заказ</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookOrder>> UpdateOrder(int id, [FromBody] BookOrder order)
    {
        try
        {
            _logger.LogInformation("Обновление заказа с ID: {Id}", id);
            
            if (id != order.Id)
            {
                return BadRequest("ID в URL не совпадает с ID в теле запроса");
            }
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Пересчитываем стоимость при изменении количества
            order.CalculateTotalPrice();
            
            var updatedOrder = await _orderService.UpdateOrderAsync(order);
            if (updatedOrder == null)
            {
                return NotFound($"Заказ с ID {id} не найден");
            }
            
            return Ok(updatedOrder);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при обновлении заказа");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении заказа с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Обновить статус заказа
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <param name="status">Новый статус</param>
    /// <returns>Обновленный заказ</returns>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BookOrder>> UpdateOrderStatus(int id, [FromBody] OrderStatus status)
    {
        try
        {
            _logger.LogInformation("Обновление статуса заказа с ID: {Id} на {Status}", id, status);
            
            var order = await _orderService.UpdateOrderStatusAsync(id, status);
            if (order == null)
            {
                return NotFound($"Заказ с ID {id} не найден");
            }
            
            // Если статус "Выполнен", отмечаем время завершения
            if (status == OrderStatus.Completed)
            {
                order.MarkAsCompleted();
            }
            
            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении статуса заказа с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Удалить заказ
    /// </summary>
    /// <param name="id">ID заказа</param>
    /// <returns>Результат операции</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteOrder(int id)
    {
        try
        {
            _logger.LogInformation("Удаление заказа с ID: {Id}", id);
            
            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
            {
                return NotFound($"Заказ с ID {id} не найден");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении заказа с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить статистику заказов
    /// </summary>
    /// <returns>Статистика</returns>
    [HttpGet("stats")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> GetOrderStats()
    {
        try
        {
            _logger.LogInformation("Получение статистики заказов");
            
            var stats = await _orderService.GetOrderStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении статистики заказов");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Поиск заказов по клиенту
    /// </summary>
    /// <param name="customerEmail">Email клиента</param>
    /// <returns>Заказы клиента</returns>
    [HttpGet("customer/{customerEmail}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<BookOrder>>> GetOrdersByCustomer(string customerEmail)
    {
        try
        {
            _logger.LogInformation("Поиск заказов клиента: {CustomerEmail}", customerEmail);
            
            if (string.IsNullOrWhiteSpace(customerEmail))
            {
                return BadRequest("Email клиента не может быть пустым");
            }
            
            var orders = await _orderService.GetOrdersByCustomerAsync(customerEmail);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при поиске заказов клиента");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }
}
