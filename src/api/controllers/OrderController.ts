/**
 * Контроллер для обработки заказов
 * Современная архитектура с TypeScript
 */

import { Request, Response } from 'express';
import { OrderService } from '../../services/OrderService.js';
import { CreateOrderRequest, CreateOrderOptions, OrderStatus } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import config from '../../config/index.js';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService(config.dataDir);
    }

    /**
     * Создание нового заказа
     */
    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderData: CreateOrderRequest = req.body;
            const options: CreateOrderOptions = {
                idempotencyKey: req.headers['x-idempotency-key'] as string,
                captchaToken: req.headers['x-captcha-token'] as string || req.body.captchaToken,
                captchaProvider: req.headers['x-captcha-provider'] as 'recaptcha' | 'turnstile' || req.body.captchaProvider
            };

            // Валидация CAPTCHA если требуется
            if (config.recaptchaSecret || config.turnstileSecret) {
                const captchaResult = await this.verifyCaptcha(options.captchaToken, options.captchaProvider);
                if (!captchaResult.ok) {
                    res.status(400).json({
                        success: false,
                        error: captchaResult.error
                    });
                    return;
                }
            }

            const order = await this.orderService.createOrder(orderData, options);
            
            res.status(201).json({
                success: true,
                data: order,
                message: 'Заказ успешно создан'
            });

            logger.info('Order created via API', { 
                orderId: order.id, 
                requestId: req.id 
            });

        } catch (error) {
            logger.error('Failed to create order', { 
                error: String(error), 
                requestId: req.id 
            });

            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Получение всех заказов с пагинацией
     */
    async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.getAllOrders();
            
            res.json({
                success: true,
                data: orders,
                count: orders.length
            });

        } catch (error) {
            logger.error('Failed to get orders', { 
                error: String(error), 
                requestId: req.id 
            });

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve orders'
            });
        }
    }

    /**
     * Получение заказа по ID
     */
    async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;
            const order = await this.orderService.getOrderById(orderId);

            if (!order) {
                res.status(404).json({
                    success: false,
                    error: 'Заказ не найден'
                });
                return;
            }

            res.json({
                success: true,
                data: order
            });

        } catch (error) {
            logger.error('Failed to get order by ID', { 
                error: String(error), 
                requestId: req.id,
                orderId: req.params.orderId 
            });

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve order'
            });
        }
    }

    /**
     * Обновление статуса заказа
     */
    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            if (!status || !this.isValidStatus(status)) {
                res.status(400).json({
                    success: false,
                    error: 'Неверный статус заказа'
                });
                return;
            }

            const order = await this.orderService.updateOrderStatus(orderId, status);
            
            res.json({
                success: true,
                data: order,
                message: 'Статус заказа обновлен'
            });

            logger.info('Order status updated', { 
                orderId, 
                status, 
                requestId: req.id 
            });

        } catch (error) {
            logger.error('Failed to update order status', { 
                error: String(error), 
                requestId: req.id,
                orderId: req.params.orderId 
            });

            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Поиск заказов
     */
    async searchOrders(req: Request, res: Response): Promise<void> {
        try {
            const { query } = req.params;
            const orders = await this.orderService.searchOrders(query);
            
            res.json({
                success: true,
                data: orders,
                count: orders.length,
                query
            });

        } catch (error) {
            logger.error('Failed to search orders', { 
                error: String(error), 
                requestId: req.id,
                query: req.params.query 
            });

            res.status(500).json({
                success: false,
                error: 'Failed to search orders'
            });
        }
    }

    /**
     * Получение статистики заказов
     */
    async getOrderStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.orderService.getOrderStats();
            
            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            logger.error('Failed to get order stats', { 
                error: String(error), 
                requestId: req.id 
            });

            res.status(500).json({
                success: false,
                error: 'Failed to retrieve statistics'
            });
        }
    }

    /**
     * Экспорт заказов в CSV
     */
    async exportOrdersToCSV(req: Request, res: Response): Promise<void> {
        try {
            const csvData = await this.orderService.exportOrdersToCSV();

            if (!csvData) {
                res.status(404).json({
                    success: false,
                    error: 'Нет данных для экспорта'
                });
                return;
            }

            const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(csvData);

            logger.info('Orders exported to CSV', { 
                requestId: req.id,
                filename 
            });

        } catch (error) {
            logger.error('Failed to export orders to CSV', { 
                error: String(error), 
                requestId: req.id 
            });

            res.status(500).json({
                success: false,
                error: 'Failed to export orders'
            });
        }
    }

    /**
     * Удаление заказа
     */
    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const { orderId } = req.params;
            await this.orderService.deleteOrder(orderId);
            
            res.json({
                success: true,
                message: 'Заказ успешно удален'
            });

            logger.info('Order deleted', { 
                orderId, 
                requestId: req.id 
            });

        } catch (error) {
            logger.error('Failed to delete order', { 
                error: String(error), 
                requestId: req.id,
                orderId: req.params.orderId 
            });

            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Проверка CAPTCHA
     */
    private async verifyCaptcha(token: string, provider: string): Promise<{ ok: boolean; error?: string }> {
        if (!config.recaptchaSecret && !config.turnstileSecret) {
            return { ok: true };
        }

        if (!token || !provider) {
            return { ok: false, error: 'captcha_required' };
        }

        const isRecaptcha = provider === 'recaptcha' && !!config.recaptchaSecret;
        const isTurnstile = provider === 'turnstile' && !!config.turnstileSecret;

        if (!isRecaptcha && !isTurnstile) {
            return { ok: false, error: 'captcha_provider_unsupported' };
        }

        try {
            if (isRecaptcha) {
                return await this.verifyRecaptcha(token);
            } else if (isTurnstile) {
                return await this.verifyTurnstile(token);
            }
        } catch (error) {
            logger.error('CAPTCHA verification failed', { error: String(error), provider });
            return { ok: false, error: 'captcha_verification_failed' };
        }

        return { ok: false, error: 'captcha_verification_failed' };
    }

    /**
     * Проверка reCAPTCHA
     */
    private async verifyRecaptcha(token: string): Promise<{ ok: boolean; error?: string }> {
        // Реализация проверки reCAPTCHA
        // Здесь должен быть HTTP запрос к Google API
        return { ok: true };
    }

    /**
     * Проверка Turnstile
     */
    private async verifyTurnstile(token: string): Promise<{ ok: boolean; error?: string }> {
        // Реализация проверки Turnstile
        // Здесь должен быть HTTP запрос к Cloudflare API
        return { ok: true };
    }

    /**
     * Проверка валидности статуса
     */
    private isValidStatus(status: string): status is OrderStatus {
        const validStatuses: OrderStatus[] = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
        return validStatuses.includes(status as OrderStatus);
    }
}

// Экспорт экземпляра контроллера
export default new OrderController();