# ⚙️ Конфигурация проекта Бхагавад-Гита 1972

## 📋 Содержание

- [🔧 Основные настройки](#-основные-настройки)
- [🌍 Переменные окружения](#-переменные-окружения)
- [🐳 Docker конфигурация](#-docker-конфигурация)
- [🚀 CI/CD настройки](#-cicd-настройки)
- [📊 Мониторинг](#-мониторинг)
- [🔐 Безопасность](#-безопасность)
- [📱 Frontend настройки](#-frontend-настройки)

---

## 🔧 Основные настройки

### Версии технологий

| Компонент | Версия | Статус | Примечания |
|-----------|--------|---------|------------|
| **Node.js** | 18.19.1 | ✅ Текущая | LTS версия |
| **.NET** | 8.0 | ✅ Текущая | LTS версия |
| **TypeScript** | 5.0+ | ✅ Текущая | Строгая типизация |
| **Vite** | 5.0+ | ✅ Текущая | Современный сборщик |
| **PostgreSQL** | 15+ | 📋 Планируется | Основная БД |
| **Redis** | 7+ | 📋 Планируется | Кеширование |

### Порты по умолчанию

| Сервис | Порт | Описание | Конфигурируемость |
|--------|------|----------|-------------------|
| **Express.js** | 3000 | Основной API | ✅ |
| **.NET Core** | 5246 | Альтернативный API | ✅ |
| **Vite Dev** | 8000 | Frontend разработка | ✅ |
| **PostgreSQL** | 5432 | База данных | ✅ |
| **Redis** | 6379 | Кеш | ✅ |
| **Prometheus** | 9090 | Метрики | ✅ |
| **Grafana** | 3001 | Дашборды | ✅ |

---

## 🌍 Переменные окружения

### Основные настройки

```bash
# .env файл
# ========================================
# ОСНОВНЫЕ НАСТРОЙКИ
# ========================================
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
API_VERSION=v1
API_PREFIX=/api

# ========================================
# БАЗА ДАННЫХ
# ========================================
DATABASE_URL=postgresql://user:pass@localhost:5432/gita
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000
DATABASE_SSL=false

# ========================================
# КЕШИРОВАНИЕ
# ========================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# ========================================
# БЕЗОПАСНОСТЬ
# ========================================
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
ORDER_RATE_LIMIT_MAX=20
TRANSLATION_RATE_LIMIT_MAX=100

# ========================================
# МОНИТОРИНГ
# ========================================
PROMETHEUS_PORT=9090
METRICS_TOKEN=your-metrics-token
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=

# ========================================
# ВНЕШНИЕ СЕРВИСЫ
# ========================================
TRANSLATION_API_KEY=your-translation-key
EMAIL_SERVICE_URL=smtp://smtp.gmail.com:587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PAYMENT_GATEWAY_KEY=your-payment-key

# ========================================
# ФАЙЛОВОЕ ХРАНИЛИЩЕ
# ========================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx
```

### Конфигурация для разных окружений

#### Development (.env.development)

```bash
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/gita_dev
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,http://localhost:3001
```

#### Staging (.env.staging)

```bash
NODE_ENV=staging
PORT=3000
LOG_LEVEL=info
DATABASE_URL=postgresql://staging_user:staging_pass@staging-db:5432/gita_staging
CORS_ORIGINS=https://staging.gita-1972-reprint.ru
```

#### Production (.env.production)

```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db:5432/gita_production
CORS_ORIGINS=https://gita-1972-reprint.ru,https://www.gita-1972-reprint.ru
```

---

## 🐳 Docker конфигурация

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Основное приложение
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/gita
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - gita-network

  # База данных
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=gita
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./deployment/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - gita-network

  # Кеш
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - gita-network

  # Веб-сервер
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./deployment/nginx/sites-enabled:/etc/nginx/sites-enabled
      - ./deployment/ssl:/etc/nginx/ssl
      - ./landing-gita-1972-reprint/frontend/dist:/var/www/html
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - gita-network

  # Мониторинг
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./deployment/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    networks:
      - gita-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./deployment/grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus
    restart: unless-stopped
    networks:
      - gita-network

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  gita-network:
    driver: bridge
```

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Установка зависимостей
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Создание рабочей директории
WORKDIR /app

# Копирование package файлов
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY . .

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Создание необходимых директорий
RUN mkdir -p uploads logs
RUN chown -R nodejs:nodejs /app

# Переключение на непривилегированного пользователя
USER nodejs

# Открытие порта
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

# Запуск приложения
CMD ["npm", "start"]
```

---

## 🚀 CI/CD настройки

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  DOTNET_VERSION: '8.0.x'

jobs:
  # Тестирование
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: ${{ env.DOTNET_VERSION }}
        
    - name: Install dependencies
      run: |
        npm ci
        cd landing-gita-1972-reprint/frontend && npm ci
        cd ../..
        
    - name: Run tests
      run: |
        npm test
        cd landing-gita-1972-reprint && dotnet test
        
    - name: Build frontend
      run: |
        cd landing-gita-1972-reprint/frontend
        npm run build
        
    - name: Build .NET API
      run: |
        cd landing-gita-1972-reprint/GitaLanding.API
        dotnet build --configuration Release

  # Сборка Docker образа
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
      
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
        
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          your-username/gita-api:latest
          your-username/gita-api:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # Развертывание
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Здесь команды развертывания
```

---

## 📊 Мониторинг

### Prometheus конфигурация

```yaml
# deployment/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'gita-api'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s
    scrape_timeout: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['db:5432']
    scrape_interval: 30s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
    scrape_interval: 30s
```

### Grafana дашборды

```json
// deployment/grafana/dashboards/api-dashboard.json
{
  "dashboard": {
    "title": "Gita API Dashboard",
    "panels": [
      {
        "title": "HTTP Requests",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

---

## 🔐 Безопасность

### SSL/TLS конфигурация

```nginx
# deployment/nginx/sites-enabled/gita-ssl.conf
server {
    listen 443 ssl http2;
    server_name gita-1972-reprint.ru www.gita-1972-reprint.ru;
    
    ssl_certificate /etc/nginx/ssl/gita.crt;
    ssl_certificate_key /etc/nginx/ssl/gita.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name gita-1972-reprint.ru www.gita-1972-reprint.ru;
    return 301 https://$server_name$request_uri;
}
```

### Security Headers

```javascript
// src/middleware/security.js
const helmet = require('helmet');

const securityConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
};

module.exports = helmet(securityConfig);
```

---

## 📱 Frontend настройки

### Vite конфигурация

```typescript
// landing-gita-1972-reprint/frontend/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['typescript']
        }
      }
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
    open: true
  },
  preview: {
    port: 8000,
    host: '0.0.0.0'
  },
  css: {
    devSourcemap: true
  }
});
```

### TypeScript конфигурация

```json
// landing-gita-1972-reprint/frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📚 Заключение

Конфигурация проекта обеспечивает:
- **Гибкость** - настройка под разные окружения
- **Безопасность** - SSL/TLS, security headers, rate limiting
- **Масштабируемость** - Docker, мониторинг, CI/CD
- **Надежность** - health checks, логирование, алерты

**Дата создания:** 25 августа 2025, 05:30  
**Версия:** 1.0.0  
**Статус:** Актуально ✅
