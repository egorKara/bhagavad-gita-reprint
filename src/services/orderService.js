/**
 * Сервис для работы с заказами
 * Содержит всю бизнес-логику, связанную с заказами
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class OrderService {
    constructor() {
        this.ordersFile = path.join(__dirname, '../../data/orders.json');
        this.statsFile = path.join(__dirname, '../../data/order-stats.json');
        this.init();
    }

    /**
     * Инициализация - создание папок и файлов
     */
    async init() {
        try {
            const dataDir = path.dirname(this.ordersFile);
            await fs.mkdir(dataDir, { recursive: true });
            
            // Создание файла заказов если не существует
            try {
                await fs.access(this.ordersFile);
            } catch {
                await fs.writeFile(this.ordersFile, JSON.stringify([], null, 2));
            }

            // Создание файла статистики если не существует
            try {
                await fs.access(this.statsFile);
            } catch {
                await fs.writeFile(this.statsFile, JSON.stringify({
                    totalOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0,
                    ordersByMonth: {},
                    topProducts: {},
                    lastUpdated: new Date().toISOString()
                }, null, 2));
            }
        } catch (error) {
            console.error('Ошибка инициализации OrderService:', error);
            throw error;
        }
    }

    /**
     * Создание нового заказа
     */
    async createOrder(orderData) {
        // Валидация данных
        const validationResult = this.validateOrderData(orderData);
        if (!validationResult.isValid) {
            throw new Error(`Ошибка валидации: ${validationResult.errors.join(', ')}`);
        }

        // Создание объекта заказа
        const order = {
            id: uuidv4(),
            ...orderData,
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            totalAmount: this.calculateTotal(orderData.quantity)
        };

        // Чтение существующих заказов
        const orders = await this.readOrders();
        orders.push(order);

        // Сохранение заказов
        await fs.writeFile(this.ordersFile, JSON.stringify(orders, null, 2));

        // Обновление статистики
        await this.updateStats(order);

        // Логирование
        console.log(`Новый заказ создан: ${order.id} от ${order.firstName} ${order.lastName}`);

        return {
            success: true,
            orderId: order.id,
            message: 'Заказ успешно создан'
        };
    }

    /**
     * Валидация данных заказа
     */
    validateOrderData(data) {
        const errors = [];
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'quantity'];

        // Проверка обязательных полей
        for (const field of required) {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors.push(`Поле ${field} обязательно для заполнения`);
            }
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push('Некорректный email адрес');
        }

        // Проверка телефона
        const phoneRegex = /^(\+7|8)[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/;
        if (data.phone && !phoneRegex.test(data.phone)) {
            errors.push('Некорректный номер телефона');
        }

        // Проверка количества
        if (data.quantity && (data.quantity < 1 || data.quantity > 100)) {
            errors.push('Количество должно быть от 1 до 100');
        }

        // Проверка длины полей
        if (data.firstName && data.firstName.length > 50) {
            errors.push('Имя слишком длинное (максимум 50 символов)');
        }

        if (data.address && data.address.length > 200) {
            errors.push('Адрес слишком длинный (максимум 200 символов)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Расчет общей стоимости
     */
    calculateTotal(quantity) {
        const bookPrice = 1500;
        const deliveryPrice = 300;
        return quantity * bookPrice + deliveryPrice;
    }

    /**
     * Чтение всех заказов
     */
    async readOrders() {
        try {
            const data = await fs.readFile(this.ordersFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Ошибка чтения заказов:', error);
            return [];
        }
    }

    /**
     * Получение заказа по ID
     */
    async getOrderById(orderId) {
        const orders = await this.readOrders();
        const order = orders.find(order => order.id === orderId);
        return order || null;
    }

    /**
     * Обновление статуса заказа
     */
    async updateOrderStatus(orderId, newStatus) {
        const orders = await this.readOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            throw new Error('Заказ не найден');
        }

        orders[orderIndex].status = newStatus;
        orders[orderIndex].updatedAt = new Date().toISOString();

        await fs.writeFile(this.ordersFile, JSON.stringify(orders, null, 2));
        
        return {
            success: true,
            message: `Статус заказа ${orderId} обновлен на ${newStatus}`
        };
    }

    /**
     * Получение статистики заказов
     */
    async getOrderStats() {
        try {
            const data = await fs.readFile(this.statsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Ошибка чтения статистики:', error);
            return null;
        }
    }

    /**
     * Обновление статистики
     */
    async updateStats(newOrder) {
        try {
            const stats = await this.getOrderStats();
            
            // Обновление базовых показателей
            stats.totalOrders += 1;
            stats.totalRevenue += newOrder.totalAmount;
            stats.averageOrderValue = stats.totalRevenue / stats.totalOrders;

            // Статистика по месяцам
            const month = new Date(newOrder.createdAt).toISOString().slice(0, 7);
            if (!stats.ordersByMonth[month]) {
                stats.ordersByMonth[month] = {
                    count: 0,
                    revenue: 0
                };
            }
            stats.ordersByMonth[month].count += 1;
            stats.ordersByMonth[month].revenue += newOrder.totalAmount;

            // Топ продуктов
            if (!stats.topProducts['bhagavad-gita-1972']) {
                stats.topProducts['bhagavad-gita-1972'] = {
                    name: 'Бхагавад-Гита как она есть (1972)',
                    quantity: 0,
                    revenue: 0
                };
            }
            stats.topProducts['bhagavad-gita-1972'].quantity += parseInt(newOrder.quantity);
            stats.topProducts['bhagavad-gita-1972'].revenue += newOrder.totalAmount;

            stats.lastUpdated = new Date().toISOString();

            await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));

        } catch (error) {
            console.error('Ошибка обновления статистики:', error);
        }
    }

    /**
     * Поиск заказов
     */
    async searchOrders(query) {
        const orders = await this.readOrders();
        const searchTerm = query.toLowerCase();

        return orders.filter(order => 
            order.firstName.toLowerCase().includes(searchTerm) ||
            order.lastName.toLowerCase().includes(searchTerm) ||
            order.email.toLowerCase().includes(searchTerm) ||
            order.phone.includes(query) ||
            order.id.includes(query)
        );
    }

    /**
     * Экспорт заказов в CSV
     */
    async exportOrdersToCSV() {
        const orders = await this.readOrders();
        
        if (orders.length === 0) {
            return '';
        }

        const headers = ['ID', 'Дата', 'Имя', 'Фамилия', 'Email', 'Телефон', 'Адрес', 'Количество', 'Сумма', 'Статус'];
        const csvRows = [headers.join(',')];

        for (const order of orders) {
            const row = [
                order.id,
                order.createdAt,
                `"${order.firstName}"`,
                `"${order.lastName}"`,
                order.email,
                order.phone,
                `"${order.address}"`,
                order.quantity,
                order.totalAmount,
                order.status
            ];
            csvRows.push(row.join(','));
        }

        return csvRows.join('\n');
    }

    /**
     * Удаление заказа
     */
    async deleteOrder(orderId) {
        const orders = await this.readOrders();
        const filteredOrders = orders.filter(order => order.id !== orderId);
        
        if (filteredOrders.length === orders.length) {
            throw new Error('Заказ не найден');
        }

        await fs.writeFile(this.ordersFile, JSON.stringify(filteredOrders, null, 2));
        
        return {
            success: true,
            message: `Заказ ${orderId} удален`
        };
    }

    /**
     * Получение заказов с пагинацией
     */
    async getOrdersWithPagination(page = 1, limit = 20) {
        const orders = await this.readOrders();
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedOrders = orders.slice(startIndex, endIndex);
        
        return {
            orders: paginatedOrders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(orders.length / limit),
                totalOrders: orders.length,
                hasNextPage: endIndex < orders.length,
                hasPrevPage: page > 1
            }
        };
    }
}

module.exports = new OrderService();