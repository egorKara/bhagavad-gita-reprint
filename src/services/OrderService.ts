/**
 * Сервис для работы с заказами
 * Современная архитектура с TypeScript
 */

import { Order, OrderStatus, CreateOrderRequest, CreateOrderOptions, OrderStats } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class OrderService {
    private ordersFile: string;
    private statsFile: string;
    private idempotencyFile: string;
    private ready: Promise<void>;

    constructor(dataDir: string) {
        this.ordersFile = path.join(dataDir, 'orders.json');
        this.statsFile = path.join(dataDir, 'order-stats.json');
        this.idempotencyFile = path.join(dataDir, 'idempotency.json');
        this.ready = this.init();
    }

    /**
     * Инициализация сервиса
     */
    private async init(): Promise<void> {
        try {
            const dataDir = path.dirname(this.ordersFile);
            await fs.mkdir(dataDir, { recursive: true });

            // Создание файлов если не существуют
            await this.ensureFile(this.ordersFile, []);
            await this.ensureFile(this.statsFile, this.getDefaultStats());
            await this.ensureFile(this.idempotencyFile, {});

            logger.info('OrderService initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize OrderService', { error: String(error) });
            throw error;
        }
    }

    /**
     * Создание файла с данными по умолчанию
     */
    private async ensureFile(filePath: string, defaultData: any): Promise<void> {
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    /**
     * Получение статистики по умолчанию
     */
    private getDefaultStats(): OrderStats {
        return {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            ordersByMonth: {},
            topProducts: {},
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Чтение JSON файла
     */
    private async readJson<T>(filePath: string, fallback: T): Promise<T> {
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            return JSON.parse(raw);
        } catch (err) {
            logger.warn(`Failed to read file: ${filePath}`, { error: String(err) });
            return fallback;
        }
    }

    /**
     * Запись JSON файла
     */
    private async writeJson<T>(filePath: string, data: T): Promise<void> {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            logger.error(`Failed to write file: ${filePath}`, { error: String(err) });
            throw new Error(`Failed to save data: ${err}`);
        }
    }

    /**
     * Создание нового заказа
     */
    async createOrder(orderData: CreateOrderRequest, options: CreateOrderOptions = {}): Promise<Order> {
        await this.ready;

        // Проверка идемпотентности
        if (options.idempotencyKey) {
            const existingOrder = await this.checkIdempotency(options.idempotencyKey);
            if (existingOrder) {
                logger.info('Duplicate order request detected', { idempotencyKey: options.idempotencyKey });
                return existingOrder;
            }
        }

        // Валидация данных
        this.validateOrderData(orderData);

        // Создание заказа
        const order: Order = {
            id: uuidv4(),
            ...orderData,
            totalAmount: orderData.quantity * 1500, // Базовая цена
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Сохранение заказа
        const orders = await this.readJson<Order[]>(this.ordersFile, []);
        orders.push(order);
        await this.writeJson(this.ordersFile, orders);

        // Сохранение идемпотентности
        if (options.idempotencyKey) {
            await this.setIdempotencyRecord(options.idempotencyKey, order.id);
        }

        // Обновление статистики
        await this.updateStats();

        logger.info('Order created successfully', { orderId: order.id });
        return order;
    }

    /**
     * Получение всех заказов
     */
    async getAllOrders(): Promise<Order[]> {
        await this.ready;
        return this.readJson<Order[]>(this.ordersFile, []);
    }

    /**
     * Получение заказа по ID
     */
    async getOrderById(orderId: string): Promise<Order | null> {
        await this.ready;
        const orders = await this.getAllOrders();
        return orders.find(order => order.id === orderId) || null;
    }

    /**
     * Обновление статуса заказа
     */
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        await this.ready;
        const orders = await this.getAllOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();

        await this.writeJson(this.ordersFile, orders);
        await this.updateStats();

        logger.info('Order status updated', { orderId, status });
        return orders[orderIndex];
    }

    /**
     * Поиск заказов
     */
    async searchOrders(query: string): Promise<Order[]> {
        await this.ready;
        const orders = await this.getAllOrders();
        const searchTerm = query.toLowerCase();

        return orders.filter(order => 
            order.firstName.toLowerCase().includes(searchTerm) ||
            order.lastName.toLowerCase().includes(searchTerm) ||
            order.email.toLowerCase().includes(searchTerm) ||
            order.phone.includes(query)
        );
    }

    /**
     * Получение статистики заказов
     */
    async getOrderStats(): Promise<OrderStats> {
        await this.ready;
        return this.readJson<OrderStats>(this.statsFile, this.getDefaultStats());
    }

    /**
     * Экспорт заказов в CSV
     */
    async exportOrdersToCSV(): Promise<string> {
        await this.ready;
        const orders = await this.getAllOrders();

        if (orders.length === 0) {
            return '';
        }

        const headers = ['ID', 'Дата', 'Имя', 'Фамилия', 'Email', 'Телефон', 'Количество', 'Сумма', 'Статус'];
        const csvRows = [headers.join(',')];

        for (const order of orders) {
            const row = [
                order.id,
                order.createdAt,
                order.firstName,
                order.lastName,
                order.email,
                order.phone,
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
    async deleteOrder(orderId: string): Promise<boolean> {
        await this.ready;
        const orders = await this.getAllOrders();
        const filteredOrders = orders.filter(order => order.id !== orderId);

        if (filteredOrders.length === orders.length) {
            throw new Error('Order not found');
        }

        await this.writeJson(this.ordersFile, filteredOrders);
        await this.updateStats();

        logger.info('Order deleted', { orderId });
        return true;
    }

    /**
     * Проверка идемпотентности
     */
    private async checkIdempotency(key: string): Promise<Order | null> {
        const idempotencyMap = await this.readJson<Record<string, { orderId: string }>>(this.idempotencyFile, {});
        const record = idempotencyMap[key];
        
        if (record) {
            return this.getOrderById(record.orderId);
        }
        
        return null;
    }

    /**
     * Установка записи идемпотентности
     */
    private async setIdempotencyRecord(key: string, orderId: string): Promise<void> {
        const idempotencyMap = await this.readJson<Record<string, { orderId: string; createdAt: string }>>(this.idempotencyFile, {});
        idempotencyMap[key] = { orderId, createdAt: new Date().toISOString() };
        await this.writeJson(this.idempotencyFile, idempotencyMap);
    }

    /**
     * Валидация данных заказа
     */
    private validateOrderData(data: CreateOrderRequest): void {
        if (!data.firstName?.trim()) {
            throw new Error('First name is required');
        }
        if (!data.lastName?.trim()) {
            throw new Error('Last name is required');
        }
        if (!data.email?.trim() || !this.isValidEmail(data.email)) {
            throw new Error('Valid email is required');
        }
        if (!data.phone?.trim()) {
            throw new Error('Phone is required');
        }
        if (!data.quantity || data.quantity < 1) {
            throw new Error('Valid quantity is required');
        }
    }

    /**
     * Проверка валидности email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Обновление статистики
     */
    private async updateStats(): Promise<void> {
        const orders = await this.getAllOrders();
        const stats: OrderStats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
            ordersByMonth: {},
            topProducts: {},
            lastUpdated: new Date().toISOString()
        };

        // Группировка по месяцам
        for (const order of orders) {
            const month = order.createdAt.slice(0, 7); // YYYY-MM
            stats.ordersByMonth[month] = (stats.ordersByMonth[month] || 0) + 1;
        }

        await this.writeJson(this.statsFile, stats);
    }
}