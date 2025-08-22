/**
 * Маршруты для API заказов
 * Теперь использует middleware для валидации и обработки ошибок
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { 
    validateOrderData, 
    validateOrderId, 
    validateOrderStatus, 
    validatePagination, 
    validateSearchQuery 
} = require('../../middleware/validation');

// Создание нового заказа
router.post('/create', validateOrderData, orderController.createOrder);

// Получение всех заказов (с пагинацией)
router.get('/list', validatePagination, orderController.getOrders);

// Получение заказа по ID
router.get('/:orderId', validateOrderId, orderController.getOrderById);

// Обновление статуса заказа
router.patch('/:orderId/status', validateOrderId, validateOrderStatus, orderController.updateOrderStatus);

// Поиск заказов
router.get('/search/:query', validateSearchQuery, orderController.searchOrders);

// Получение статистики заказов
router.get('/stats/overview', orderController.getOrderStats);

// Экспорт заказов в CSV
router.get('/export/csv', orderController.exportOrdersToCSV);

// Удаление заказа
router.delete('/:orderId', validateOrderId, orderController.deleteOrder);

module.exports = router;
