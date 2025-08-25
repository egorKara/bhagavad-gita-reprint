using GitaLanding.Core.Entities;

namespace GitaLanding.Core.Services;

/// <summary>
/// Интерфейс для сервиса управления книгами
/// </summary>
public interface IBookService
{
    /// <summary>
    /// Получить все книги с пагинацией
    /// </summary>
    /// <param name="language">Язык</param>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns>Список книг</returns>
    Task<IEnumerable<Book>> GetBooksAsync(string language = "ru", int page = 1, int pageSize = 10);
    
    /// <summary>
    /// Получить книгу по ID
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <returns>Книга или null</returns>
    Task<Book?> GetBookByIdAsync(int id);
    
    /// <summary>
    /// Получить основную книгу (Бхагавад-Гита)
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Основная книга или null</returns>
    Task<Book?> GetMainBookAsync(string language = "ru");
    
    /// <summary>
    /// Создать новую книгу
    /// </summary>
    /// <param name="book">Данные книги</param>
    /// <returns>Созданная книга</returns>
    Task<Book> CreateBookAsync(Book book);
    
    /// <summary>
    /// Обновить книгу
    /// </summary>
    /// <param name="book">Обновленные данные</param>
    /// <returns>Обновленная книга или null</returns>
    Task<Book?> UpdateBookAsync(Book book);
    
    /// <summary>
    /// Удалить книгу
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <returns>True если удалено, false если не найдено</returns>
    Task<bool> DeleteBookAsync(int id);
    
    /// <summary>
    /// Поиск книг по названию
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="language">Язык</param>
    /// <returns>Найденные книги</returns>
    Task<IEnumerable<Book>> SearchBooksAsync(string query, string language = "ru");
    
    /// <summary>
    /// Получить общее количество книг
    /// </summary>
    /// <param name="language">Язык</param>
    /// <returns>Количество книг</returns>
    Task<int> GetBooksCountAsync(string language = "ru");
    
    /// <summary>
    /// Проверить доступность книги
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <returns>True если доступна</returns>
    Task<bool> IsBookAvailableAsync(int id);
    
    /// <summary>
    /// Обновить количество экземпляров
    /// </summary>
    /// <param name="id">ID книги</param>
    /// <param name="quantity">Новое количество</param>
    /// <returns>True если обновлено</returns>
    Task<bool> UpdateStockQuantityAsync(int id, int quantity);
}
