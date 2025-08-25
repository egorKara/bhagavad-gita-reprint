using GitaLanding.Core.Entities;

namespace GitaLanding.Core.Services;

/// <summary>
/// Интерфейс для сервиса управления авторами
/// </summary>
public interface IAuthorService
{
    /// <summary>
    /// Получить всех авторов
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Список авторов</returns>
    Task<IEnumerable<Author>> GetAuthorsAsync(string language = "ru");
    
    /// <summary>
    /// Получить автора по ID
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>Автор или null</returns>
    Task<Author?> GetAuthorByIdAsync(int id);
    
    /// <summary>
    /// Получить основного автора (Шрила Прабхупада)
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Основной автор или null</returns>
    Task<Author?> GetMainAuthorAsync(string language = "ru");
    
    /// <summary>
    /// Создать нового автора
    /// </summary>
    /// <param name="author">Данные автора</param>
    /// <returns>Созданный автор</returns>
    Task<Author> CreateAuthorAsync(Author author);
    
    /// <summary>
    /// Обновить автора
    /// </summary>
    /// <param name="author">Обновленные данные</param>
    /// <returns>Обновленный автор или null</returns>
    Task<Author?> UpdateAuthorAsync(Author author);
    
    /// <summary>
    /// Удалить автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>True если удалено, false если не найдено</returns>
    Task<bool> DeleteAuthorAsync(int id);
    
    /// <summary>
    /// Поиск авторов по имени
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="language">Язык</param>
    /// <returns>Найденные авторы</returns>
    Task<IEnumerable<Author>> SearchAuthorsAsync(string query, string language = "ru");
    
    /// <summary>
    /// Получить книги автора
    /// </summary>
    /// <param name="authorId">ID автора</param>
    /// <returns>Книги автора или null</returns>
    Task<IEnumerable<Book>?> GetAuthorBooksAsync(int authorId);
    
    /// <summary>
    /// Получить биографию автора
    /// </summary>
    /// <param name="authorId">ID автора</param>
    /// <returns>Биография автора</returns>
    Task<object> GetAuthorBiographyAsync(int authorId);
    
    /// <summary>
    /// Получить общее количество авторов
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Количество авторов</returns>
    Task<int> GetAuthorsCountAsync(string language = "ru");
    
    /// <summary>
    /// Получить активных авторов
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Активные авторы</returns>
    Task<IEnumerable<Author>> GetActiveAuthorsAsync(string language = "ru");
    
    /// <summary>
    /// Проверить существование автора
    /// </summary>
    /// <param name="id">ID автора</param>
    /// <returns>True если существует</returns>
    Task<bool> AuthorExistsAsync(int id);
    
    /// <summary>
    /// Получить авторов по году рождения
    /// </summary>
    /// <param name="year">Год рождения</param>
    /// <returns>Авторы</returns>
    Task<IEnumerable<Author>> GetAuthorsByBirthYearAsync(int year);
}
