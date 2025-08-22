/**
 * Контроллер для обработки заказов
 * Теперь использует сервисный слой для бизнес-логики
 */

const orderService = require('../../services/orderService');
const { asyncHandler } = require('../../middleware/errorHandler');

class OrderController {
    /**
     * Создание нового заказа
     */
    createOrder = asyncHandler(async (req, res) => {
        const result = await orderService.createOrder(req.body);
        res.status(201).json(result);
    });

    /**
     * Получение всех заказов (с пагинацией)
     */
    getOrders = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await orderService.getOrdersWithPagination(page, limit);
        
        res.json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    });

    /**
     * Получение заказа по ID
     */
    getOrderById = asyncHandler(async (req, res) => {
        const order = await orderService.getOrderById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Заказ не найден',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            data: order
        });
    });

    /**
     * Обновление статуса заказа
     */
    updateOrderStatus = asyncHandler(async (req, res) => {
        const result = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
        res.json(result);
    });

    /**
     * Поиск заказов
     */
    searchOrders = asyncHandler(async (req, res) => {
        const orders = await orderService.searchOrders(req.params.query);
        
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    });

    /**
     * Получение статистики заказов
     */
    getOrderStats = asyncHandler(async (req, res) => {
        const stats = await orderService.getOrderStats();
        
        res.json({
            success: true,
            data: stats
        });
    });

    /**
     * Экспорт заказов в CSV
     */
    exportOrdersToCSV = asyncHandler(async (req, res) => {
        const csvData = await orderService.exportOrdersToCSV();
        
        if (!csvData) {
            return res.status(404).json({
                success: false,
                error: 'Нет данных для экспорта',
                timestamp: new Date().toISOString()
            });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`);
        res.send(csvData);
    });

    /**
     * Удаление заказа
     */
    deleteOrder = asyncHandler(async (req, res) => {
        const result = await orderService.deleteOrder(req.params.orderId);
        res.json(result);
    });
}

module.exports = new OrderController();
