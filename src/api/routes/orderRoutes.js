/**
 * Маршруты для API заказов
 * Включает все операции с заказами
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Создание нового заказа
router.post('/create', async (req, res) => {
    try {
        const result = await orderController.createOrder(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Получение всех заказов (с пагинацией)
router.get('/list', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const orders = await orderController.readOrders();
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedOrders = orders.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            data: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(orders.length / limit),
                totalOrders: orders.length,
                hasNextPage: endIndex < orders.length,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение заказа по ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await orderController.getOrderById(req.params.orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Заказ не найден'
            });
        }
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Обновление статуса заказа
router.patch('/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                error: 'Статус не указан'
            });
        }
        
        const result = await orderController.updateOrderStatus(req.params.orderId, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Поиск заказов
router.get('/search/:query', async (req, res) => {
    try {
        const orders = await orderController.searchOrders(req.params.query);
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение статистики заказов
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await orderController.getOrderStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Экспорт заказов в CSV
router.get('/export/csv', async (req, res) => {
    try {
        const csvData = await orderController.exportOrdersToCSV();
        
        if (!csvData) {
            return res.status(404).json({
                success: false,
                error: 'Нет данных для экспорта'
            });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`);
        res.send(csvData);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Удаление заказа
router.delete('/:orderId', async (req, res) => {
    try {
        const result = await orderController.deleteOrder(req.params.orderId);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
