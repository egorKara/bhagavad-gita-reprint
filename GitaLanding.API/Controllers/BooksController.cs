using Microsoft.AspNetCore.Mvc;
using GitaLanding.Core.Entities;
using GitaLanding.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace GitaLanding.API.Controllers;

/// <summary>
/// API контроллер для управления книгами
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly ILogger<BooksController> _logger;

    public BooksController(IBookService bookService, ILogger<BooksController> logger)
    {
        _bookService = bookService;
        _logger = logger;
    }

    /// <summary>
    /// Получить все книги
    /// </summary>
    /// <param name="language">Язык (ru/en)</param>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns>Список книг</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
        [FromQuery] string language = "ru",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            _logger.LogInformation("Получение списка книг. Язык: {Language}, Страница: {Page}", language, page);
            
            var books = await _bookService.GetBooksAsync(language, page, pageSize);
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка книг");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить книгу по ID
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <returns>Книга</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        try
        {
            _logger.LogInformation("Получение книги с ID: {Id}", id);
            
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
            {
                return NotFound($"Книга с ID {id} не найдена");
            }
            
            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении книги с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить основную книгу (Бхагавад-Гита)
    /// </summary>
    /// <param name="language">Язык (ru/en)</param>
    /// <returns>Основная книга</returns>
    [HttpGet("main")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> GetMainBook([FromQuery] string language = "ru")
    {
        try
        {
            _logger.LogInformation("Получение основной книги. Язык: {Language}", language);
            
            var book = await _bookService.GetMainBookAsync(language);
            if (book == null)
            {
                return NotFound("Основная книга не найдена");
            }
            
            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении основной книги");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Создать новую книгу
    /// </summary>
    /// <param name="book">Данные книги</param>
    /// <returns>Созданная книга</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Book>> CreateBook([FromBody] Book book)
    {
        try
        {
            _logger.LogInformation("Создание новой книги: {Title}", book.Title);
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var createdBook = await _bookService.CreateBookAsync(book);
            return CreatedAtAction(nameof(GetBook), new { id = createdBook.Id }, createdBook);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при создании книги");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании книги");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Обновить книгу
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <param name="book">Обновленные данные</param>
    /// <returns>Обновленная книга</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Book>> UpdateBook(int id, [FromBody] Book book)
    {
        try
        {
            _logger.LogInformation("Обновление книги с ID: {Id}", id);
            
            if (id != book.Id)
            {
                return BadRequest("ID в URL не совпадает с ID в теле запроса");
            }
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var updatedBook = await _bookService.UpdateBookAsync(book);
            if (updatedBook == null)
            {
                return NotFound($"Книга с ID {id} не найдена");
            }
            
            return Ok(updatedBook);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при обновлении книги");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении книги с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Удалить книгу
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <returns>Результат операции</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteBook(int id)
    {
        try
        {
            _logger.LogInformation("Удаление книги с ID: {Id}", id);
            
            var result = await _bookService.DeleteBookAsync(id);
            if (!result)
            {
                return NotFound($"Книга с ID {id} не найдена");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении книги с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Поиск книг по названию
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="language">Язык (ru/en)</param>
    /// <returns>Найденные книги</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<Book>>> SearchBooks(
        [FromQuery] [Required] string query,
        [FromQuery] string language = "ru")
    {
        try
        {
            _logger.LogInformation("Поиск книг. Запрос: {Query}, Язык: {Language}", query, language);
            
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Поисковый запрос не может быть пустым");
            }
            
            var books = await _bookService.SearchBooksAsync(query, language);
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при поиске книг");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }
}
