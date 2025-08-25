using Microsoft.AspNetCore.Mvc;
using GitaLanding.Core.Entities;
using GitaLanding.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace GitaLanding.API.Controllers;

/// <summary>
/// API контроллер для управления авторами
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthorsController : ControllerBase
{
    private readonly IAuthorService _authorService;
    private readonly ILogger<AuthorsController> _logger;

    public AuthorsController(IAuthorService authorService, ILogger<AuthorsController> logger)
    {
        _authorService = authorService;
        _logger = logger;
    }

    /// <summary>
    /// Получить всех авторов
    /// </summary>
    /// <param name="language">Язык (ru/en)</param>
    /// <returns>Список авторов</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Author>>> GetAuthors([FromQuery] string language = "ru")
    {
        try
        {
            _logger.LogInformation("Получение списка авторов. Язык: {Language}", language);
            
            var authors = await _authorService.GetAuthorsAsync(language);
            return Ok(authors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка авторов");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить автора по ID
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>Автор</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> GetAuthor(int id)
    {
        try
        {
            _logger.LogInformation("Получение автора с ID: {Id}", id);
            
            var author = await _authorService.GetAuthorByIdAsync(id);
            if (author == null)
            {
                return NotFound($"Автор с ID {id} не найден");
            }
            
            return Ok(author);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении автора с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить основного автора (Шрила Прабхупада)
    /// </summary>
    /// <param name="language">Язык (ru/en)</param>
    /// <returns>Основной автор</returns>
    [HttpGet("main")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> GetMainAuthor([FromQuery] string language = "ru")
    {
        try
        {
            _logger.LogInformation("Получение основного автора. Язык: {Language}", language);
            
            var author = await _authorService.GetMainAuthorAsync(language);
            if (author == null)
            {
                return NotFound("Основной автор не найден");
            }
            
            return Ok(author);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении основного автора");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Создать нового автора
    /// </summary>
    /// <param name="author">Данные автора</param>
    /// <returns>Созданный автор</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Author>> CreateAuthor([FromBody] Author author)
    {
        try
        {
            _logger.LogInformation("Создание нового автора: {FullName}", author.FullName);
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var createdAuthor = await _authorService.CreateAuthorAsync(author);
            return CreatedAtAction(nameof(GetAuthor), new { id = createdAuthor.Id }, createdAuthor);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при создании автора");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании автора");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Обновить автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <param name="author">Обновленные данные</param>
    /// <returns>Обновленный автор</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Author>> UpdateAuthor(int id, [FromBody] Author author)
    {
        try
        {
            _logger.LogInformation("Обновление автора с ID: {Id}", id);
            
            if (id != author.Id)
            {
                return BadRequest("ID в URL не совпадает с ID в теле запроса");
            }
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            var updatedAuthor = await _authorService.UpdateAuthorAsync(author);
            if (updatedAuthor == null)
            {
                return NotFound($"Автор с ID {id} не найден");
            }
            
            return Ok(updatedAuthor);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Ошибка валидации при обновлении автора");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении автора с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Удалить автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>Результат операции</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteAuthor(int id)
    {
        try
        {
            _logger.LogInformation("Удаление автора с ID: {Id}", id);
            
            var result = await _authorService.DeleteAuthorAsync(id);
            if (!result)
            {
                return NotFound($"Автор с ID {id} не найден");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении автора с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Поиск авторов по имени
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="language">Язык (ru/en)</param>
    /// <returns>Найденные авторы</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<Author>>> SearchAuthors(
        [FromQuery] [Required] string query,
        [FromQuery] string language = "ru")
    {
        try
        {
            _logger.LogInformation("Поиск авторов. Запрос: {Query}, Язык: {Language}", query, language);
            
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Поисковый запрос не может быть пустым");
            }
            
            var authors = await _authorService.SearchAuthorsAsync(query, language);
            return Ok(authors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при поиске авторов");
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить книги автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>Книги автора</returns>
    [HttpGet("{id}/books")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Book>>> GetAuthorBooks(int id)
    {
        try
        {
            _logger.LogInformation("Получение книг автора с ID: {Id}", id);
            
            var books = await _authorService.GetAuthorBooksAsync(id);
            if (books == null)
            {
                return NotFound($"Автор с ID {id} не найден");
            }
            
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении книг автора с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }

    /// <summary>
    /// Получить биографию автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>Биография автора</returns>
    [HttpGet("{id}/biography")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<object>> GetAuthorBiography(int id)
    {
        try
        {
            _logger.LogInformation("Получение биографии автора с ID: {Id}", id);
            
            var author = await _authorService.GetAuthorByIdAsync(id);
            if (author == null)
            {
                return NotFound($"Автор с ID {id} не найден");
            }
            
            var biography = new
            {
                author.FullName,
                author.Biography,
                author.Mission,
                author.Achievements,
                Age = author.GetAge(),
                IsAlive = author.IsAlive(),
                author.PhotoPath
            };
            
            return Ok(biography);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении биографии автора с ID: {Id}", id);
            return StatusCode(500, "Внутренняя ошибка сервера");
        }
    }
}
