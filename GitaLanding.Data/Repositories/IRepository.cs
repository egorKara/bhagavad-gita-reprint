namespace GitaLanding.Data.Repositories;

/// <summary>
/// Базовый интерфейс репозитория для работы с сущностями
/// </summary>
/// <typeparam name="T">Тип сущности</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Получить все сущности
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Получить сущность по ID
    /// </summary>
    Task<T?> GetByIdAsync(int id);

    /// <summary>
    /// Добавить новую сущность
    /// </summary>
    Task<T> AddAsync(T entity);

    /// <summary>
    /// Обновить существующую сущность
    /// </summary>
    Task<T> UpdateAsync(T entity);

    /// <summary>
    /// Удалить сущность
    /// </summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Проверить существование сущности
    /// </summary>
    Task<bool> ExistsAsync(int id);

    /// <summary>
    /// Получить количество сущностей
    /// </summary>
    Task<int> CountAsync();
}
