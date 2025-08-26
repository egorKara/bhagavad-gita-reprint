/**
 * TypeScript типы для проекта Bhagavad-Gita 1972
 */

// ===== ОСНОВНЫЕ ТИПЫ =====

export interface Order {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    quantity: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByMonth: Record<string, number>;
    topProducts: Record<string, number>;
    lastUpdated: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// ===== API ТИПЫ =====

export interface CreateOrderRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    quantity: number;
    notes?: string;
}

export interface CreateOrderOptions {
    idempotencyKey?: string;
    captchaToken?: string;
    captchaProvider?: 'recaptcha' | 'turnstile';
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface SearchOrdersRequest {
    query: string;
    page?: number;
    limit?: number;
}

// ===== КОНФИГУРАЦИЯ =====

export interface AppConfig {
    env: string;
    port: number;
    corsOrigins: string[];
    adminToken: string | null;
    metricsToken: string | null;
    recaptchaSecret: string | null;
    turnstileSecret: string | null;
    dataDir: string;
    translator: TranslatorConfig;
    logLevel: string;
}

export interface TranslatorConfig {
    provider: string;
    apiKey: string | null;
    endpoint: string | null;
}

// ===== ЛОГИРОВАНИЕ =====

export interface LogEntry {
    level: 'error' | 'warn' | 'info' | 'debug';
    message: string;
    timestamp: string;
    requestId?: string;
    [key: string]: any;
}

// ===== МЕТРИКИ =====

export interface MetricsData {
    requests: {
        total: number;
        byMethod: Record<string, number>;
        byStatus: Record<string, number>;
        byEndpoint: Record<string, number>;
    };
    performance: {
        averageResponseTime: number;
        p95ResponseTime: number;
        p99ResponseTime: number;
    };
    errors: {
        total: number;
        byType: Record<string, number>;
    };
}

// ===== ВАЛИДАЦИЯ =====

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// ===== УТИЛИТЫ =====

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;