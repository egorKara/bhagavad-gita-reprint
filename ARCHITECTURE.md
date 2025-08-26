# 🏗️ Архитектура проекта Бхагавад-Гита 1972

## 📋 Содержание

- [🎯 Обзор архитектуры](#-обзор-архитектуры)
- [🏛️ Слои системы](#️-слои-системы)
- [🔄 Потоки данных](#-потоки-данных)
- [🔐 Безопасность](#-безопасность)
- [📊 Мониторинг](#-мониторинг)
- [🚀 Развертывание](#-развертывание)
- [🔧 Конфигурация](#-конфигурация)

---

## 🎯 Обзор архитектуры

Проект построен по принципу **микросервисной архитектуры** с возможностью выбора между Express.js и .NET API.

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[Mobile App]
        A --> C[Admin Panel]
    end
    
    subgraph "Load Balancer"
        D[Nginx] --> E[Express.js Server]
        D --> F[.NET Core API]
    end
    
    subgraph "Application Layer"
        E --> G[Express.js App]
        F --> H[ASP.NET Core App]
    end
    
    subgraph "Data Layer"
        G --> I[PostgreSQL]
        H --> I
        G --> J[File Storage]
        H --> J
    end
    
    subgraph "Monitoring"
        K[Prometheus] --> L[Grafana]
        M[Health Checks] --> K
    end
    
    A --> D
    B --> D
    C --> D
```

---

## 🏛️ Слои системы

### 1. **Frontend Layer** (TypeScript + Vite)

```mermaid
graph LR
    subgraph "Frontend Architecture"
        A[TypeScript Source] --> B[Vite Build]
        B --> C[Dist Folder]
        C --> D[Express.js Static]
        C --> E[CDN/Static Hosting]
    end
    
    subgraph "Components"
        F[LanguageManager] --> G[ImageSlider]
        H[UI Components] --> I[Responsive Design]
    end
    
    A --> F
    A --> G
    A --> H
```

**Особенности:**
- **TypeScript 5.0** - строгая типизация
- **Vite 5.0** - быстрая сборка
- **CSS Grid & Flexbox** - современная верстка
- **Responsive Design** - mobile-first подход

### 2. **API Layer** (Express.js + .NET)

```mermaid
graph TB
    subgraph "Express.js API"
        A[Express Server] --> B[REST Endpoints]
        B --> C[Middleware Stack]
        C --> D[Controllers]
        D --> E[Services]
    end
    
    subgraph ".NET Core API"
        F[ASP.NET Core] --> G[Controllers]
        G --> H[Services]
        H --> I[Repositories]
    end
    
    subgraph "Shared Features"
        J[Authentication] --> K[Rate Limiting]
        L[Logging] --> M[Metrics]
    end
    
    A --> J
    F --> J
    C --> L
    G --> L
```

**Express.js особенности:**
- **Middleware архитектура** - гибкая настройка
- **Prometheus метрики** - мониторинг производительности
- **Rate limiting** - защита от DDoS
- **CORS** - кросс-доменные запросы

**.NET Core особенности:**
- **Dependency Injection** - управление зависимостями
- **Entity Framework** - ORM для работы с БД
- **Swagger** - автоматическая документация API
- **Serilog** - структурированное логирование

### 3. **Data Layer**

```mermaid
graph TB
    subgraph "Database"
        A[PostgreSQL] --> B[Entity Framework]
        C[Redis Cache] --> D[Session Storage]
    end
    
    subgraph "File Storage"
        E[Static Assets] --> F[Image Storage]
        G[Document Storage] --> H[Backup Files]
    end
    
    subgraph "External Services"
        I[Translation API] --> J[Email Service]
        K[Payment Gateway] --> L[Analytics]
    end
    
    B --> A
    D --> C
    F --> E
    H --> G
```

---

## 🔄 Потоки данных

### Основной поток запроса

```mermaid
sequenceDiagram
    participant Client
    participant Nginx
    participant Express
    participant Database
    participant Cache
    
    Client->>Nginx: HTTP Request
    Nginx->>Express: Route to Express.js
    Express->>Cache: Check Cache
    alt Cache Hit
        Cache-->>Express: Return Cached Data
    else Cache Miss
        Express->>Database: Query Database
        Database-->>Express: Return Data
        Express->>Cache: Store in Cache
    end
    Express-->>Nginx: HTTP Response
    Nginx-->>Client: Return Response
```

### Поток заказа

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    participant Email
    
    User->>Frontend: Fill Order Form
    Frontend->>API: POST /api/orders
    API->>Database: Validate & Store
    Database-->>API: Order Created
    API->>Email: Send Confirmation
    Email-->>User: Order Confirmation
    API-->>Frontend: Success Response
    Frontend-->>User: Order Confirmed
```

---

## 🔐 Безопасность

### Архитектура безопасности

```mermaid
graph TB
    subgraph "Security Layers"
        A[HTTPS/TLS] --> B[Rate Limiting]
        B --> C[Input Validation]
        C --> D[SQL Injection Protection]
        D --> E[XSS Protection]
        E --> F[CSRF Protection]
    end
    
    subgraph "Authentication"
        G[JWT Tokens] --> H[Session Management]
        I[OAuth 2.0] --> J[API Keys]
    end
    
    subgraph "Monitoring"
        K[Security Logs] --> L[Intrusion Detection]
        M[Audit Trail] --> N[Alerting]
    end
    
    A --> G
    F --> K
    J --> M
```

**Меры безопасности:**
- **HTTPS/TLS** - шифрование трафика
- **Helmet.js** - security headers
- **Rate Limiting** - защита от брутфорса
- **Input Validation** - валидация входных данных
- **SQL Injection Protection** - параметризованные запросы
- **XSS Protection** - защита от XSS атак

---

## 📊 Мониторинг

### Система мониторинга

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Express.js Metrics] --> B[Prometheus]
        C[.NET Metrics] --> B
        D[Custom Metrics] --> B
    end
    
    subgraph "Infrastructure"
        E[System Metrics] --> F[Node Exporter]
        G[Database Metrics] --> H[Postgres Exporter]
        I[Web Server] --> J[Nginx Exporter]
    end
    
    subgraph "Visualization"
        B --> K[Grafana Dashboards]
        F --> K
        H --> K
        J --> K
    end
    
    subgraph "Alerting"
        K --> L[Alert Manager]
        L --> M[Email/Slack]
        L --> N[PagerDuty]
    end
```

**Метрики:**
- **Application:** HTTP requests, response times, error rates
- **Infrastructure:** CPU, memory, disk, network
- **Business:** orders, users, conversions
- **Custom:** translation jobs, API usage

---

## 🚀 Развертывание

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        A[Code Changes] --> B[Local Testing]
        B --> C[Git Push]
    end
    
    subgraph "CI/CD"
        C --> D[GitHub Actions]
        D --> E[Run Tests]
        E --> F[Build Artifacts]
        F --> G[Security Scan]
    end
    
    subgraph "Deployment"
        G --> H[Staging Environment]
        H --> I[Integration Tests]
        I --> J[Production Deployment]
        J --> K[Health Checks]
    end
    
    subgraph "Monitoring"
        K --> L[Performance Monitoring]
        L --> M[Error Tracking]
        M --> N[User Analytics]
    end
```

**Этапы развертывания:**
1. **Development** - локальная разработка
2. **Testing** - автоматические тесты
3. **Staging** - тестовое окружение
4. **Production** - продакшн развертывание
5. **Monitoring** - мониторинг и алерты

---

## 🔧 Конфигурация

### Переменные окружения

```bash
# Основные настройки
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# База данных
DATABASE_URL=postgresql://user:pass@localhost:5432/gita
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Безопасность
JWT_SECRET=your-super-secret-key
CORS_ORIGINS=https://gita-1972-reprint.ru,https://www.gita-1972-reprint.ru
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000

# Мониторинг
PROMETHEUS_PORT=9090
METRICS_TOKEN=your-metrics-token
LOG_LEVEL=info

# Внешние сервисы
TRANSLATION_API_KEY=your-translation-key
EMAIL_SERVICE_URL=smtp://smtp.gmail.com:587
PAYMENT_GATEWAY_KEY=your-payment-key
```

### Docker конфигурация

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/gita
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=gita
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl

volumes:
  postgres_data:
  redis_data:
```

---

## 📈 Масштабирование

### Горизонтальное масштабирование

```mermaid
graph TB
    subgraph "Load Balancer"
        A[Nginx] --> B[Express.js Instance 1]
        A --> C[Express.js Instance 2]
        A --> D[Express.js Instance N]
    end
    
    subgraph "Database Cluster"
        E[PostgreSQL Primary] --> F[PostgreSQL Replica 1]
        E --> G[PostgreSQL Replica 2]
    end
    
    subgraph "Cache Cluster"
        H[Redis Master] --> I[Redis Slave 1]
        H --> J[Redis Slave 2]
    end
    
    B --> E
    C --> F
    D --> G
    B --> H
    C --> I
    D --> J
```

**Стратегии масштабирования:**
- **Load Balancing** - распределение нагрузки
- **Database Sharding** - горизонтальное разделение БД
- **Caching** - Redis кластер для кеширования
- **CDN** - раздача статического контента
- **Microservices** - разделение на микросервисы

---

## 🔍 Отладка и логирование

### Система логирования

```mermaid
graph TB
    subgraph "Application Logs"
        A[Express.js Logs] --> B[Structured Logging]
        C[.NET Logs] --> B
        D[Error Logs] --> E[Error Tracking]
    end
    
    subgraph "Infrastructure Logs"
        F[System Logs] --> G[Container Logs]
        H[Database Logs] --> I[Performance Logs]
    end
    
    subgraph "Centralized Logging"
        B --> J[ELK Stack]
        E --> J
        G --> J
        I --> J
    end
    
    subgraph "Analysis"
        J --> K[Log Analysis]
        K --> L[Alerting]
        L --> M[Incident Response]
    end
```

**Уровни логирования:**
- **DEBUG** - детальная отладочная информация
- **INFO** - общая информация о работе
- **WARN** - предупреждения
- **ERROR** - ошибки приложения
- **FATAL** - критические ошибки

---

## 📚 Заключение

Архитектура проекта обеспечивает:
- **Масштабируемость** - горизонтальное и вертикальное масштабирование
- **Надежность** - отказоустойчивость и резервирование
- **Безопасность** - многоуровневая защита
- **Мониторинг** - полная видимость системы
- **Гибкость** - возможность выбора технологий

**Дата создания:** 25 августа 2025, 05:20  
**Версия:** 1.0.0  
**Статус:** Актуально ✅
