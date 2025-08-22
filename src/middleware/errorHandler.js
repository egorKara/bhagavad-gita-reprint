/**
 * Middleware для централизованной обработки ошибок
 */

/**
 * Обработчик ошибок валидации
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError' || err.message.includes('Ошибка валидации')) {
        return res.status(400).json({
            success: false,
            error: 'Ошибка валидации данных',
            details: err.message,
            timestamp: new Date().toISOString()
        });
    }
    next(err);
};

/**
 * Обработчик ошибок "не найдено"
 */
const notFoundErrorHandler = (err, req, res, next) => {
    if (err.message.includes('не найден') || err.message.includes('not found')) {
        return res.status(404).json({
            success: false,
            error: 'Ресурс не найден',
            details: err.message,
            timestamp: new Date().toISOString()
        });
    }
    next(err);
};

/**
 * Общий обработчик ошибок
 */
const generalErrorHandler = (err, req, res, next) => {
    console.error('Ошибка:', err);
    
    // Определяем статус ошибки
    const statusCode = err.statusCode || 500;
    
    // Формируем ответ
    const errorResponse = {
        success: false,
        error: err.message || 'Внутренняя ошибка сервера',
        timestamp: new Date().toISOString()
    };

    // В режиме разработки добавляем стек ошибки
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * Async wrapper для обработки асинхронных ошибок в маршрутах
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    validationErrorHandler,
    notFoundErrorHandler,
    generalErrorHandler,
    asyncHandler
};