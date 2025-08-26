# 📚 API Справочник - Бхагавад-Гита 1972

## 📋 Содержание

- [🚀 Обзор API](#-обзор-api)
- [🔐 Аутентификация](#-аутентификация)
- [📊 Express.js API](#-expressjs-api)
- [⚡ .NET Core API](#-net-core-api)
- [📝 Примеры использования](#-примеры-использования)
- [🔍 Коды ошибок](#-коды-ошибок)
- [📈 Rate Limiting](#-rate-limiting)

---

## 🚀 Обзор API

Проект предоставляет **два API интерфейса** для максимальной гибкости:

| API | Технология | Статус | Основное назначение |
|-----|------------|---------|---------------------|
| **Express.js API** | Node.js + Express | ✅ Готов | Основной API + статика |
| **.NET Core API** | ASP.NET Core 8 | 🔄 Базовая версия | Альтернативный API |

### Базовые URL

```bash
# Express.js API
http://localhost:3000/api

# .NET Core API  
http://localhost:5246/api

# Swagger документация (.NET)
http://localhost:5246/swagger
```

---

## 🔐 Аутентификация

### API Keys (для метрик)

```bash
# Заголовок для доступа к метрикам
Authorization: Bearer your-metrics-token

# Пример запроса
curl -H "Authorization: Bearer your-token" \
     http://localhost:3000/metrics
```

### JWT Tokens (планируется)

```bash
# Заголовок для защищенных endpoints
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Получение токена
POST /api/auth/login
{
  "username": "admin",
  "password": "secure_password"
}
```

---

## 📊 Express.js API

### 1. **Status Endpoints**

#### `GET /api/status`
Получение статуса сервера

```bash
curl http://localhost:3000/api/status
```

**Ответ:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-25T02:20:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": "45.2 MB",
    "total": "512 MB"
  }
}
```

#### `GET /healthz`
Health check для Kubernetes/Docker

```bash
curl http://localhost:3000/healthz
```

**Ответ:** `ok`

#### `GET /livez`
Liveness probe

```bash
curl http://localhost:3000/livez
```

**Ответ:** `ok`

#### `GET /readyz`
Readiness probe

```bash
curl http://localhost:3000/readyz
```

**Ответ:** `ok`

### 2. **Orders API**

#### `POST /api/orders`
Создание нового заказа

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7-999-123-45-67",
    "bookTitle": "Бхагавад-Гита как она есть",
    "quantity": 1,
    "address": "г. Москва, ул. Примерная, д. 1"
  }'
```

**Ответ:**
```json
{
  "success": true,
  "orderId": "ord_123456789",
  "message": "Заказ успешно создан",
  "estimatedDelivery": "2025-09-01"
}
```

#### `GET /api/orders/:orderId`
Получение информации о заказе

```bash
curl http://localhost:3000/api/orders/ord_123456789
```

**Ответ:**
```json
{
  "orderId": "ord_123456789",
  "status": "processing",
  "customerName": "Иван Иванов",
  "email": "ivan@example.com",
  "bookTitle": "Бхагавад-Гита как она есть",
  "quantity": 1,
  "createdAt": "2025-08-25T02:20:00.000Z",
  "estimatedDelivery": "2025-09-01"
}
```

### 3. **Translation API**

#### `POST /api/translate/batch`
Пакетный перевод текстов

```bash
curl -X POST http://localhost:3000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLang": "ru",
    "targetLang": "en",
    "items": [
      {
        "text": "Бхагавад-Гита как она есть",
        "url": "/book-description"
      },
      {
        "text": "Священный текст ведической литературы",
        "url": "/about"
      }
    ]
  }'
```

**Ответ:**
```json
{
  "success": true,
  "jobId": "job_987654321",
  "queuedCount": 2,
  "message": "Перевод поставлен в очередь"
}
```

#### `GET /api/translate/status/:jobId`
Статус задания перевода

```bash
curl http://localhost:3000/api/translate/status/job_987654321
```

**Ответ:**
```json
{
  "jobId": "job_987654321",
  "status": "completed",
  "progress": 100,
  "totalItems": 2,
  "completedItems": 2,
  "results": [
    {
      "original": "Бхагавад-Гита как она есть",
      "translated": "Bhagavad-gita As It Is",
      "url": "/book-description"
    },
    {
      "original": "Священный текст ведической литературы",
      "translated": "Sacred text of Vedic literature",
      "url": "/about"
    }
  ]
}
```

#### `POST /api/translate/feedback`
Отправка обратной связи по переводу

```bash
curl -X POST http://localhost:3000/api/translate/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "sourceLang": "ru",
    "targetLang": "en",
    "text": "Бхагавад-Гита как она есть",
    "corrected": "Bhagavad-gita As It Is",
    "url": "/book-description",
    "reason": "improvement"
  }'
```

**Ответ:**
```json
{
  "success": true,
  "feedbackId": "fb_456789123",
  "message": "Обратная связь принята"
}
```

### 4. **Metrics API**

#### `GET /metrics`
Prometheus метрики (требует аутентификации)

```bash
curl -H "Authorization: Bearer your-metrics-token" \
     http://localhost:3000/metrics
```

**Ответ:**
```prometheus
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 150
http_requests_total{method="POST",status="201"} 25
http_requests_total{method="GET",status="404"} 3

# HELP http_request_duration_seconds Duration of HTTP requests
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 120
http_request_duration_seconds_bucket{le="0.5"} 145
http_request_duration_seconds_bucket{le="1.0"} 150
```

---

## ⚡ .NET Core API

### 1. **Health Endpoints**

#### `GET /health`
Health check

```bash
curl http://localhost:5246/health
```

**Ответ:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-25T02:20:00.000Z"
}
```

### 2. **Books API**

#### `GET /api/books`
Список всех книг

```bash
curl http://localhost:5246/api/books
```

**Ответ:**
```json
{
  "message": "Books endpoint working",
  "timestamp": "2025-08-25T02:20:00.000Z"
}
```

#### `GET /api/books/main`
Основная книга

```bash
curl http://localhost:5246/api/books/main
```

**Ответ:**
```json
{
  "message": "Main book endpoint working",
  "timestamp": "2025-08-25T02:20:00.000Z"
}
```

### 3. **Authors API**

#### `GET /api/authors`
Список авторов

```bash
curl http://localhost:5246/api/authors
```

**Ответ:**
```json
{
  "message": "Authors endpoint working",
  "timestamp": "2025-08-25T02:20:00.000Z"
}
```

---

## 📝 Примеры использования

### JavaScript/TypeScript

```typescript
// Создание заказа
async function createOrder(orderData: OrderData): Promise<OrderResponse> {
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Получение статуса заказа
async function getOrderStatus(orderId: string): Promise<Order> {
  const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Пакетный перевод
async function batchTranslate(texts: string[], from: string, to: string): Promise<TranslationJob> {
  const response = await fetch('http://localhost:3000/api/translate/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourceLang: from,
      targetLang: to,
      items: texts.map(text => ({ text, url: '/' }))
    })
  });
  
  return await response.json();
}
```

### Python

```python
import requests
import json

# Создание заказа
def create_order(order_data):
    response = requests.post(
        'http://localhost:3000/api/orders',
        json=order_data,
        headers={'Content-Type': 'application/json'}
    )
    response.raise_for_status()
    return response.json()

# Получение статуса заказа
def get_order_status(order_id):
    response = requests.get(f'http://localhost:3000/api/orders/{order_id}')
    response.raise_for_status()
    return response.json()

# Пакетный перевод
def batch_translate(texts, source_lang, target_lang):
    data = {
        'sourceLang': source_lang,
        'targetLang': target_lang,
        'items': [{'text': text, 'url': '/'} for text in texts]
    }
    
    response = requests.post(
        'http://localhost:3000/api/translate/batch',
        json=data,
        headers={'Content-Type': 'application/json'}
    )
    response.raise_for_status()
    return response.json()

# Пример использования
if __name__ == '__main__':
    # Создание заказа
    order = create_order({
        'customerName': 'Иван Иванов',
        'email': 'ivan@example.com',
        'bookTitle': 'Бхагавад-Гита как она есть',
        'quantity': 1
    })
    print(f"Заказ создан: {order['orderId']}")
    
    # Перевод текста
    translation = batch_translate(
        ['Бхагавад-Гита как она есть'],
        'ru', 'en'
    )
    print(f"Перевод поставлен в очередь: {translation['jobId']}")
```

### cURL

```bash
#!/bin/bash

# Создание заказа
ORDER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Иван Иванов",
    "email": "ivan@example.com",
    "bookTitle": "Бхагавад-Гита как она есть",
    "quantity": 1
  }')

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.orderId')
echo "Заказ создан: $ORDER_ID"

# Получение статуса заказа
ORDER_STATUS=$(curl -s "http://localhost:3000/api/orders/$ORDER_ID")
echo "Статус заказа: $(echo $ORDER_STATUS | jq -r '.status')"

# Проверка здоровья сервера
HEALTH=$(curl -s http://localhost:3000/healthz)
echo "Сервер здоров: $HEALTH"
```

---

## 🔍 Коды ошибок

### HTTP Status Codes

| Код | Название | Описание |
|-----|----------|----------|
| `200` | OK | Успешный запрос |
| `201` | Created | Ресурс создан |
| `400` | Bad Request | Неверный запрос |
| `401` | Unauthorized | Требуется аутентификация |
| `403` | Forbidden | Доступ запрещен |
| `404` | Not Found | Ресурс не найден |
| `429` | Too Many Requests | Превышен лимит запросов |
| `500` | Internal Server Error | Внутренняя ошибка сервера |

### Error Response Format

```json
{
  "error": "Описание ошибки",
  "code": "ERROR_CODE",
  "requestId": "req_123456789",
  "timestamp": "2025-08-25T02:20:00.000Z",
  "details": {
    "field": "Дополнительная информация"
  }
}
```

### Примеры ошибок

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Неверный формат email",
    "phone": "Телефон обязателен"
  }
}
```

#### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "code": "INTERNAL_ERROR",
  "requestId": "req_123456789"
}
```

---

## 📈 Rate Limiting

### Лимиты по умолчанию

| Endpoint | Лимит | Окно времени |
|----------|-------|--------------|
| **Общий API** | 1000 запросов | 15 минут |
| **Создание заказов** | 20 запросов | 15 минут |
| **Переводы** | 100 запросов | 15 минут |
| **Метрики** | 50 запросов | 15 минут |

### Headers для Rate Limiting

```bash
# Оставшиеся запросы
X-RateLimit-Remaining: 999

# Лимит запросов
X-RateLimit-Limit: 1000

# Время сброса лимита
X-RateLimit-Reset: 1732540800

# Время до следующего запроса (при превышении)
Retry-After: 60
```

### Пример превышения лимита

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName": "Test"}'
```

**Ответ (429):**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60,
  "message": "Попробуйте снова через 60 секунд"
}
```

---

## 🔧 Конфигурация

### Переменные окружения

```bash
# Основные настройки
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# API настройки
API_VERSION=v1
API_PREFIX=/api
CORS_ORIGINS=https://gita-1972-reprint.ru

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
ORDER_RATE_LIMIT_MAX=20

# Мониторинг
METRICS_TOKEN=your-secure-token
LOG_LEVEL=info
```

### CORS настройки

```javascript
// Разрешенные домены
const corsOrigins = [
  'https://gita-1972-reprint.ru',
  'https://www.gita-1972-reprint.ru',
  'http://localhost:3000',
  'http://localhost:8000'
];

// CORS конфигурация
app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: false,
  maxAge: 86400 // 24 часа
}));
```

---

## 📚 Заключение

API предоставляет полный набор функций для:
- **Управления заказами** - создание, отслеживание, статусы
- **Перевода контента** - пакетные переводы, обратная связь
- **Мониторинга** - метрики, health checks
- **Масштабирования** - rate limiting, кеширование

**Дата создания:** 25 августа 2025, 05:25  
**Версия API:** 1.0.0  
**Статус:** Актуально ✅
