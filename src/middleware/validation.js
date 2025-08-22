/**
 * Middleware для валидации входящих данных
 */

/**
 * Валидация данных заказа
 */
const validateOrderData = (req, res, next) => {
    const { firstName, lastName, email, phone, address, quantity } = req.body;
    const errors = [];

    // Проверка обязательных полей
    if (!firstName || firstName.trim() === '') {
        errors.push('Имя обязательно для заполнения');
    }
    if (!lastName || lastName.trim() === '') {
        errors.push('Фамилия обязательна для заполнения');
    }
    if (!email || email.trim() === '') {
        errors.push('Email обязателен для заполнения');
    }
    if (!phone || phone.trim() === '') {
        errors.push('Телефон обязателен для заполнения');
    }
    if (!address || address.trim() === '') {
        errors.push('Адрес обязателен для заполнения');
    }
    if (!quantity) {
        errors.push('Количество обязательно для заполнения');
    }

    // Проверка форматов
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Некорректный email адрес');
    }

    if (phone && !/^(\+7|8)[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/.test(phone)) {
        errors.push('Некорректный номер телефона');
    }

    if (quantity && (quantity < 1 || quantity > 100)) {
        errors.push('Количество должно быть от 1 до 100');
    }

    if (firstName && firstName.length > 50) {
        errors.push('Имя слишком длинное (максимум 50 символов)');
    }

    if (address && address.length > 200) {
        errors.push('Адрес слишком длинный (максимум 200 символов)');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Ошибка валидации данных',
            details: errors,
            timestamp: new Date().toISOString()
        });
    }

    next();
};

/**
 * Валидация ID заказа
 */
const validateOrderId = (req, res, next) => {
    const { orderId } = req.params;
    
    if (!orderId || orderId.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'ID заказа обязателен',
            timestamp: new Date().toISOString()
        });
    }

    // Проверка формата UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
        return res.status(400).json({
            success: false,
            error: 'Некорректный формат ID заказа',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

/**
 * Валидация статуса заказа
 */
const validateOrderStatus = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || status.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Статус заказа обязателен',
            timestamp: new Date().toISOString()
        });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Некорректный статус заказа',
            validStatuses,
            timestamp: new Date().toISOString()
        });
    }

    next();
};

/**
 * Валидация параметров пагинации
 */
const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (page < 1) {
        return res.status(400).json({
            success: false,
            error: 'Номер страницы должен быть больше 0',
            timestamp: new Date().toISOString()
        });
    }

    if (limit < 1 || limit > 100) {
        return res.status(400).json({
            success: false,
            error: 'Лимит должен быть от 1 до 100',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

/**
 * Валидация поискового запроса
 */
const validateSearchQuery = (req, res, next) => {
    const { query } = req.params;
    
    if (!query || query.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Поисковый запрос обязателен',
            timestamp: new Date().toISOString()
        });
    }

    if (query.length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Поисковый запрос должен содержать минимум 2 символа',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

module.exports = {
    validateOrderData,
    validateOrderId,
    validateOrderStatus,
    validatePagination,
    validateSearchQuery
};