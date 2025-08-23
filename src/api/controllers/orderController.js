/**
 * Контроллер для обработки заказов
 * Включает сохранение, анализ и управление заказами
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const { recaptchaSecret, turnstileSecret } = require('../../config');
const logger = require('../../utils/logger');

class OrderController {
    constructor() {
        const { dataDir } = require('../../config');
        this.ordersFile = path.join(dataDir, 'orders.json');
        this.statsFile = path.join(dataDir, 'order-stats.json');
        this.idempotencyFile = path.join(dataDir, 'idempotency.json');
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
                await fs.writeFile(
                    this.statsFile,
                    JSON.stringify(
                        {
                            totalOrders: 0,
                            totalRevenue: 0,
                            averageOrderValue: 0,
                            ordersByMonth: {},
                            topProducts: {},
                            lastUpdated: new Date().toISOString(),
                        },
                        null,
                        2
                    )
                );
            }

            // Создание файла идемпотентности если не существует
            try {
                await fs.access(this.idempotencyFile);
            } catch {
                await fs.writeFile(this.idempotencyFile, JSON.stringify({}, null, 2));
            }
        } catch (error) {
            logger.error('Ошибка инициализации OrderController', { error: String(error) });
        }
    }

    async readJson(filePath, fallback) {
        try {
            const raw = await fs.readFile(filePath, 'utf8');
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    async getIdempotencyMapping() {
        return this.readJson(this.idempotencyFile, {});
    }

    async setIdempotencyRecord(key, orderId) {
        const map = await this.getIdempotencyMapping();
        map[key] = { orderId, createdAt: new Date().toISOString() };
        await fs.writeFile(this.idempotencyFile, JSON.stringify(map, null, 2));
    }

    async verifyCaptchaIfRequired(token, provider) {
        if (!recaptchaSecret && !turnstileSecret) {
            return { ok: true };
        }
        if (!token || !provider) {
            return { ok: false, error: 'captcha_required' };
        }
        const isRecaptcha = provider === 'recaptcha' && !!recaptchaSecret;
        const isTurnstile = provider === 'turnstile' && !!turnstileSecret;
        if (!isRecaptcha && !isTurnstile) {
            return { ok: false, error: 'captcha_provider_unsupported' };
        }

        const url = isRecaptcha
            ? 'https://www.google.com/recaptcha/api/siteverify'
            : 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const secret = isRecaptcha ? recaptchaSecret : turnstileSecret;
        const body = new URLSearchParams({ secret, response: token }).toString();

        const { ok, score } = await new Promise((resolve) => {
            const req = https.request(
                url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(body),
                    },
                },
                (res) => {
                    let data = '';
                    res.on('data', (chunk) => (data += chunk));
                    res.on('end', () => {
                        try {
                            const parsed = JSON.parse(data);
                            if (isRecaptcha) {
                                resolve({ ok: !!parsed.success, score: parsed.score });
                            } else {
                                resolve({ ok: !!parsed.success, score: undefined });
                            }
                        } catch {
                            resolve({ ok: false });
                        }
                    });
                }
            );
            req.on('error', () => resolve({ ok: false }));
            req.write(body);
            req.end();
        });

        if (!ok) {
            return { ok: false, error: 'captcha_verification_failed' };
        }
        return { ok: true, score };
    }

    /**
     * Создание нового заказа
     */
    async createOrder(orderData, options = {}) {
        const { idempotencyKey, captchaToken, captchaProvider } = options;
        try {
            // Идемпотентность: если ключ уже использован, возвращаем прежний результат
            if (idempotencyKey) {
                const map = await this.getIdempotencyMapping();
                const existing = map[idempotencyKey];
                if (existing && existing.orderId) {
                    return {
                        success: true,
                        orderId: existing.orderId,
                        message: 'Идемпотентная повторная отправка',
                    };
                }
            }

            // CAPTCHA (опционально через переменные окружения)
            const captchaResult = await this.verifyCaptchaIfRequired(captchaToken, captchaProvider);
            if (!captchaResult.ok) {
                throw new Error(captchaResult.error || 'captcha_failed');
            }

            // Валидация данных
            const validationResult = this.validateOrderData(orderData);
            if (!validationResult.isValid) {
                throw new Error(`Ошибка валидации: ${validationResult.errors.join(', ')}`);
            }

            // Канонический адрес
            const canonicalAddress =
                orderData.address && orderData.address.trim()
                    ? orderData.address.trim()
                    : [
                          orderData.postalCode,
                          orderData.city,
                          orderData.street,
                          orderData.house,
                          orderData.apartment,
                      ]
                          .filter(Boolean)
                          .join(', ');

            // Количество (число)
            const quantityNum = Number.parseInt(orderData.quantity, 10);

            // Создание объекта заказа
            const order = {
                id: uuidv4(),
                ...orderData,
                address: canonicalAddress,
                status: 'new',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                totalAmount: this.calculateTotal(quantityNum),
            };

            // Чтение существующих заказов
            const orders = await this.readOrders();
            orders.push(order);

            // Сохранение заказов
            await fs.writeFile(this.ordersFile, JSON.stringify(orders, null, 2));

            // Обновление статистики
            await this.updateStats(order);

            // Логирование
            logger.info('Новый заказ создан', {
                orderId: order.id,
                customer: `${order.firstName} ${order.lastName}`,
            });

            // Сохраняем идемпотентную запись
            if (idempotencyKey) {
                await this.setIdempotencyRecord(idempotencyKey, order.id);
            }

            return {
                success: true,
                orderId: order.id,
                message: 'Заказ успешно создан',
            };
        } catch (error) {
            logger.error('Ошибка создания заказа', { error: String(error) });
            throw error;
        }
    }

    /**
     * Валидация данных заказа
     */
    validateOrderData(data) {
        const errors = [];
        const requiredBasic = ['firstName', 'lastName', 'email', 'phone', 'quantity'];
        for (const field of requiredBasic) {
            if (!data[field] || String(data[field]).trim() === '') {
                errors.push(`Поле ${field} обязательно для заполнения`);
            }
        }

        // Адрес: либо цельное поле address, либо составные
        const hasAddress = data.address && String(data.address).trim() !== '';
        const requiredAddressParts = ['postalCode', 'city', 'street', 'house'];
        const hasAddressParts = requiredAddressParts.every(
            (k) => data[k] && String(data[k]).trim() !== ''
        );
        if (!hasAddress && !hasAddressParts) {
            errors.push('Адрес обязателен: используйте address или postalCode/city/street/house');
        }

        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push('Некорректный email адрес');
        }

        // Проверка телефона
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        if (data.phone && !phoneRegex.test(data.phone)) {
            errors.push('Некорректный номер телефона');
        }

        // Проверка количества
        const quantityNum = Number.parseInt(data.quantity, 10);
        if (!Number.isFinite(quantityNum)) {
            errors.push('Количество должно быть числом');
        } else if (quantityNum < 1 || quantityNum > 100) {
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
            errors,
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
            logger.error('Ошибка чтения заказов', { error: String(error) });
            return [];
        }
    }

    /**
     * Получение заказа по ID
     */
    async getOrderById(orderId) {
        try {
            const orders = await this.readOrders();
            return orders.find((order) => order.id === orderId);
        } catch (error) {
            logger.error('Ошибка получения заказа', { error: String(error) });
            return null;
        }
    }

    /**
     * Обновление статуса заказа
     */
    async updateOrderStatus(orderId, newStatus) {
        try {
            const orders = await this.readOrders();
            const orderIndex = orders.findIndex((order) => order.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Заказ не найден');
            }

            orders[orderIndex].status = newStatus;
            orders[orderIndex].updatedAt = new Date().toISOString();

            await fs.writeFile(this.ordersFile, JSON.stringify(orders, null, 2));

            return {
                success: true,
                message: `Статус заказа ${orderId} обновлен на ${newStatus}`,
            };
        } catch (error) {
            logger.error('Ошибка обновления статуса заказа', { error: String(error) });
            throw error;
        }
    }

    /**
     * Получение статистики заказов
     */
    async getOrderStats() {
        try {
            const data = await fs.readFile(this.statsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            logger.error('Ошибка чтения статистики', { error: String(error) });
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
                    revenue: 0,
                };
            }
            stats.ordersByMonth[month].count += 1;
            stats.ordersByMonth[month].revenue += newOrder.totalAmount;

            // Топ продуктов
            if (!stats.topProducts['bhagavad-gita-1972']) {
                stats.topProducts['bhagavad-gita-1972'] = {
                    name: 'Бхагавад-Гита как она есть (1972)',
                    quantity: 0,
                    revenue: 0,
                };
            }
            stats.topProducts['bhagavad-gita-1972'].quantity += Number.parseInt(
                newOrder.quantity,
                10
            );
            stats.topProducts['bhagavad-gita-1972'].revenue += newOrder.totalAmount;

            stats.lastUpdated = new Date().toISOString();

            await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
        } catch (error) {
            logger.error('Ошибка обновления статистики', { error: String(error) });
        }
    }

    /**
     * Поиск заказов
     */
    async searchOrders(query) {
        try {
            const orders = await this.readOrders();
            const searchTerm = query.toLowerCase();

            return orders.filter(
                (order) =>
                    order.firstName.toLowerCase().includes(searchTerm) ||
                    order.lastName.toLowerCase().includes(searchTerm) ||
                    order.email.toLowerCase().includes(searchTerm) ||
                    order.phone.includes(query) ||
                    order.id.includes(query)
            );
        } catch (error) {
            logger.error('Ошибка поиска заказов', { error: String(error) });
            return [];
        }
    }

    /**
     * Экспорт заказов в CSV
     */
    async exportOrdersToCSV() {
        try {
            const orders = await this.readOrders();

            if (orders.length === 0) {
                return '';
            }

            const headers = [
                'ID',
                'Дата',
                'Имя',
                'Фамилия',
                'Email',
                'Телефон',
                'Адрес',
                'Количество',
                'Сумма',
                'Статус',
            ];
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
                    order.status,
                ];
                csvRows.push(row.join(','));
            }

            return csvRows.join('\n');
        } catch (error) {
            logger.error('Ошибка экспорта в CSV', { error: String(error) });
            return '';
        }
    }

    /**
     * Удаление заказа
     */
    async deleteOrder(orderId) {
        try {
            const orders = await this.readOrders();
            const filteredOrders = orders.filter((order) => order.id !== orderId);

            if (filteredOrders.length === orders.length) {
                throw new Error('Заказ не найден');
            }

            await fs.writeFile(this.ordersFile, JSON.stringify(filteredOrders, null, 2));

            return {
                success: true,
                message: `Заказ ${orderId} удален`,
            };
        } catch (error) {
            logger.error('Ошибка удаления заказа', { error: String(error) });
            throw error;
        }
    }
}

module.exports = new OrderController();
