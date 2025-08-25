using GitaLanding.Core.Entities;

namespace GitaLanding.Data.Repositories;

/// <summary>
/// Интерфейс репозитория для работы с книгами
/// </summary>
public interface IBookRepository : IRepository<Book>
{
    /// <summary>
    /// Получить книги по автору
    /// </summary>
    Task<IEnumerable<Book>> GetByAuthorAsync(string authorName);

    /// <summary>
    /// Поиск книг по названию
    /// </summary>
    Task<IEnumerable<Book>> SearchByTitleAsync(string searchTerm);

    /// <summary>
    /// Получить доступные книги
    /// </summary>
    Task<IEnumerable<Book>> GetAvailableBooksAsync();

    /// <summary>
    /// Получить книги по году публикации
    /// </summary>
    Task<IEnumerable<Book>> GetByPublicationYearAsync(int year);

    /// <summary>
    /// Получить основную книгу (Bhagavad-gita As It Is)
    /// </summary>
    Task<Book?> GetMainBookAsync();

    /// <summary>
    /// Обновить количество на складе
    /// </summary>
    Task<bool> UpdateStockQuantityAsync(int bookId, int quantity);
}
