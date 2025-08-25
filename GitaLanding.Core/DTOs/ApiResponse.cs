namespace GitaLanding.Core.DTOs;

/// <summary>
/// Базовый класс для API ответов
/// </summary>
/// <typeparam name="T">Тип данных</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Успешность операции
    /// </summary>
    public bool Success { get; set; }
    
    /// <summary>
    /// Сообщение
    /// </summary>
    public string Message { get; set; } = string.Empty;
    
    /// <summary>
    /// Данные
    /// </summary>
    public T? Data { get; set; }
    
    /// <summary>
    /// Ошибки
    /// </summary>
    public List<string> Errors { get; set; } = new();
    
    /// <summary>
    /// Временная метка
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Создать успешный ответ
    /// </summary>
    /// <param name="data">Данные</param>
    /// <param name="message">Сообщение</param>
    /// <returns>Успешный ответ</returns>
    public static ApiResponse<T> SuccessResponse(T data, string message = "Операция выполнена успешно")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }
    
    /// <summary>
    /// Создать ответ с ошибкой
    /// </summary>
    /// <param name="message">Сообщение об ошибке</param>
    /// <param name="errors">Список ошибок</param>
    /// <returns>Ответ с ошибкой</returns>
    public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }
    
    /// <summary>
    /// Создать ответ с ошибкой
    /// </summary>
    /// <param name="message">Сообщение об ошибке</param>
    /// <param name="error">Ошибка</param>
    /// <returns>Ответ с ошибкой</returns>
    public static ApiResponse<T> ErrorResponse(string message, string error)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = new List<string> { error }
        };
    }
}

/// <summary>
/// API ответ без данных
/// </summary>
public class ApiResponse : ApiResponse<object>
{
    /// <summary>
    /// Создать успешный ответ
    /// </summary>
    /// <param name="message">Сообщение</param>
    /// <returns>Успешный ответ</returns>
    public static ApiResponse SuccessResponse(string message = "Операция выполнена успешно")
    {
        return new ApiResponse
        {
            Success = true,
            Message = message
        };
    }
    
    /// <summary>
    /// Создать ответ с ошибкой
    /// </summary>
    /// <param name="message">Сообщение об ошибке</param>
    /// <param name="errors">Список ошибок</param>
    /// <returns>Ответ с ошибкой</returns>
    public static new ApiResponse ErrorResponse(string message, List<string>? errors = null)
    {
        return new ApiResponse
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }
}
