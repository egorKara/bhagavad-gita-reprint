/**
 * Тесты для OrderService
 */

const orderService = require('../src/services/orderService');

// Мокаем fs для тестов
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn(),
        access: jest.fn()
    }
}));

jest.mock('uuid', () => ({
    v4: () => 'test-uuid-123'
}));

// Импортируем мокированные модули
const fs = require('fs').promises;

describe('OrderService', () => {
    let mockOrders;
    let mockStats;

    beforeEach(() => {
        // Сбрасываем моки
        jest.clearAllMocks();
        
        // Подготавливаем тестовые данные
        mockOrders = [
            {
                id: 'test-uuid-123',
                firstName: 'Иван',
                lastName: 'Иванов',
                email: 'ivan@test.com',
                phone: '+79001234567',
                address: 'Москва, ул. Тестовая, 1',
                quantity: 2,
                status: 'new',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                totalAmount: 3300
            }
        ];

        mockStats = {
            totalOrders: 1,
            totalRevenue: 3300,
            averageOrderValue: 3300,
            ordersByMonth: {},
            topProducts: {},
            lastUpdated: '2024-01-01T00:00:00.000Z'
        };

        // Мокаем fs.readFile
        fs.readFile.mockImplementation((filePath) => {
            if (filePath.includes('orders.json')) {
                return Promise.resolve(JSON.stringify(mockOrders));
            }
            if (filePath.includes('order-stats.json')) {
                return Promise.resolve(JSON.stringify(mockStats));
            }
            return Promise.reject(new Error('File not found'));
        });

        // Мокаем fs.writeFile
        fs.writeFile.mockResolvedValue();
        
        // Мокаем fs.mkdir
        fs.mkdir.mockResolvedValue();
        
        // Мокаем fs.access
        fs.access.mockResolvedValue();
    });

    describe('createOrder', () => {
        it('должен создавать новый заказ с валидными данными', async () => {
            const orderData = {
                firstName: 'Петр',
                lastName: 'Петров',
                email: 'petr@test.com',
                phone: '+79001234568',
                address: 'СПб, ул. Петрова, 2',
                quantity: 1
            };

            const result = await orderService.createOrder(orderData);

            expect(result.success).toBe(true);
            expect(result.orderId).toBe('test-uuid-123');
            expect(result.message).toBe('Заказ успешно создан');
        });

        it('должен выбрасывать ошибку при невалидных данных', async () => {
            const invalidOrderData = {
                firstName: '',
                lastName: 'Петров',
                email: 'invalid-email',
                phone: '123',
                address: 'СПб, ул. Петрова, 2',
                quantity: 0
            };

            await expect(orderService.createOrder(invalidOrderData))
                .rejects
                .toThrow('Ошибка валидации');
        });
    });

    describe('validateOrderData', () => {
        it('должен валидировать корректные данные', () => {
            const validData = {
                firstName: 'Иван',
                lastName: 'Иванов',
                email: 'ivan@test.com',
                phone: '+79001234567',
                address: 'Москва, ул. Тестовая, 1',
                quantity: 1
            };

            const result = orderService.validateOrderData(validData);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('должен находить ошибки в невалидных данных', () => {
            const invalidData = {
                firstName: '',
                lastName: '',
                email: 'invalid-email',
                phone: '123',
                address: '',
                quantity: 0
            };

            const result = orderService.validateOrderData(invalidData);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('calculateTotal', () => {
        it('должен правильно рассчитывать стоимость', () => {
            const quantity = 3;
            const expectedTotal = 3 * 1500 + 300; // 4800

            const result = orderService.calculateTotal(quantity);
            expect(result).toBe(expectedTotal);
        });
    });

    describe('getOrderById', () => {
        it('должен находить заказ по ID', async () => {
            const order = await orderService.getOrderById('test-uuid-123');
            
            expect(order).toBeDefined();
            expect(order.id).toBe('test-uuid-123');
            expect(order.firstName).toBe('Иван');
        });

        it('должен возвращать null для несуществующего ID', async () => {
            const order = await orderService.getOrderById('non-existent-id');
            expect(order).toBeNull();
        });
    });

    describe('searchOrders', () => {
        it('должен находить заказы по поисковому запросу', async () => {
            const results = await orderService.searchOrders('Иван');
            
            expect(results).toHaveLength(1);
            expect(results[0].firstName).toBe('Иван');
        });

        it('должен возвращать пустой массив для несуществующего запроса', async () => {
            const results = await orderService.searchOrders('несуществующий');
            expect(results).toHaveLength(0);
        });
    });

    describe('getOrdersWithPagination', () => {
        it('должен возвращать заказы с пагинацией', async () => {
            const result = await orderService.getOrdersWithPagination(1, 10);
            
            expect(result.orders).toBeDefined();
            expect(result.pagination).toBeDefined();
            expect(result.pagination.currentPage).toBe(1);
            expect(result.pagination.totalOrders).toBe(1);
        });
    });
});