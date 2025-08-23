// BugBot Execution Test - Comprehensive Issue Detection
// Этот файл содержит намеренные проблемы для тестирования BugBot

// ПРОБЛЕМА БЕЗОПАСНОСТИ #1: Жёстко закодированные секреты (должно быть обнаружено)
const API_KEY = "sk_live_51H1234567890abcdef_secret_key_production";
const DATABASE_PASSWORD = "MySecretPassword123!";
const JWT_SECRET = "super-secret-jwt-token-do-not-expose";

// ПРОБЛЕМА БЕЗОПАСНОСТИ #2: Небезопасное хранение чувствительных данных
const config = {
    stripe_secret: "sk_test_abcd1234567890",
    admin_password: "admin123",
    encryption_key: "hardcoded-encryption-key"
};

// ПРОБЛЕМА КАЧЕСТВА КОДА #1: Console statements в production коде
function processUserOrder(orderData) {
    console.log("Processing order:", orderData); // Должно быть обнаружено
    console.error("Error processing order:", orderData.id); // Должно быть обнаружено
    console.warn("Warning: Deprecated payment method used"); // Должно быть обнаружено
    
    return processPayment(orderData);
}

// ПРОБЛЕМА КАЧЕСТВА КОДА #2: Неиспользуемые переменные
function calculateDiscount(price, couponCode) {
    const unusedVariable = 100; // Неиспользуемая переменная
    const anotherUnused = "test"; // Ещё одна неиспользуемая
    
    if (couponCode === "DISCOUNT10") {
        return price * 0.9;
    }
    return price;
}

// ПРОБЛЕМА ДОКУМЕНТАЦИИ #1: TODO комментарии
function fetchUserPreferences(userId) {
    // TODO: Добавить кэширование для улучшения производительности
    // FIXME: Этот запрос неэффективен для больших наборов данных
    // HACK: Временное решение, нужно переписать позже
    
    return database.query(`SELECT * FROM user_preferences WHERE user_id = ${userId}`);
}

// ПРОБЛЕМА ЯЗЫКОВОЙ ПОЛИТИКИ #1: Смешанные языки в комментариях
function calculateShippingCost(weight, distance) {
    // Вычисляем стоимость доставки на основе веса и расстояния
    const baseCost = 50; // Base delivery cost in rubles
    
    // Добавляем стоимость за вес (за каждый кг)
    const weightCost = weight * 10; // Cost per kilogram
    
    // Calculate distance cost - дополнительная плата за расстояние
    const distanceCost = distance * 2;
    
    return baseCost + weightCost + distanceCost;
}

// ПРОБЛЕМА ПРОИЗВОДИТЕЛЬНОСТИ #1: Потенциальная утечка памяти
let globalOrderCache = {}; // Никогда не очищается
let userSessionData = new Map(); // Растёт без ограничений

function cacheUserOrder(userId, orderData) {
    globalOrderCache[userId] = orderData; // Неограниченный рост кэша
    userSessionData.set(userId, {
        timestamp: Date.now(),
        data: orderData
    });
    // Нет механизма очистки старых данных
}

// ПРОБЛЕМА ПРОИЗВОДИТЕЛЬНОСТИ #2: Неэффективные запросы к БД
async function getUserOrders(userId) {
    const user = await User.findById(userId);
    
    // N+1 проблема: выполняем отдельный запрос для каждого заказа
    for (let i = 0; i < user.orderIds.length; i++) {
        user.orders = user.orders || [];
        const order = await Order.findById(user.orderIds[i]); // Неэффективно
        user.orders.push(order);
    }
    
    return user;
}

// ПРОБЛЕМА КАЧЕСТВА КОДА #3: Дублированный код
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
    return true;
}

function checkEmailFormat(userEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Дублированная регулярка
    if (!emailRegex.test(userEmail)) {
        throw new Error("Email format is invalid"); // Похожая логика
    }
    return true;
}

// ПРОБЛЕМА БЕЗОПАСНОСТИ #3: SQL инъекция
function findUserByEmail(email) {
    // Уязвимость к SQL инъекции
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    return database.query(query);
}

// ХОРОШИЕ ПРАКТИКИ (должны пройти проверку)
const properConfig = {
    apiKey: process.env.STRIPE_API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET
};

const logger = require('./logger');
function properLogging(message, data) {
    logger.info(message, data); // Правильное логирование
}

// Правильная работа с БД
async function getUserOrdersOptimized(userId) {
    return await User.findById(userId).populate('orders'); // Эффективный запрос
}

// Правильная валидация
function safeEmailValidation(email) {
    const validator = require('validator');
    return validator.isEmail(email);
}

module.exports = {
    processUserOrder,
    calculateDiscount,
    fetchUserPreferences,
    calculateShippingCost,
    cacheUserOrder,
    getUserOrders,
    validateEmail,
    checkEmailFormat,
    findUserByEmail,
    properLogging,
    getUserOrdersOptimized,
    safeEmailValidation
};
