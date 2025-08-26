#!/bin/bash

# =============================================
# 🔧 АДАПТИРОВАННЫЙ SSL СКРИПТ
# ssl_fix_script.sh
# Решение SSL проблемы для api.gita-1972-reprint.ru
# =============================================

DOMAIN="api.gita-1972-reprint.ru"
WWW_DIR="/var/www/html"
APP_DIR="/var/www/gita-1972-reprint"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
LOG_FILE="/var/log/ssl_fix_script.log"
DATE=$(date +"%Y-%m-%d %T")

# Очистка старого лога
> "$LOG_FILE"

# Автоматический вывод лога при завершении
trap 'echo "📄 Полный лог выполнения:"; cat "$LOG_FILE"; echo "✅ Скрипт завершён. Смотрите лог выше."' EXIT

# Логирование с временной меткой
log() {
    echo "[$(date +"%Y-%m-%d %T")] $1" | tee -a "$LOG_FILE"
}

error() {
    log "❌ ОШИБКА: $1"
    exit 1
}

success() {
    log "✅ $1"
}

# =============================================
# 1. ПРОВЕРКА DNS
# =============================================
log "🌐 Проверяю DNS-запись домена $DOMAIN"
IP=$(dig +short "$DOMAIN" | tail -n1)
LOCAL_IP=$(hostname -I | awk '{print $1}')

if [ -z "$IP" ]; then
    error "Домен $DOMAIN не резолвится. Проверьте DNS-настройки."
fi

if [ "$IP" != "$LOCAL_IP" ]; then
    log "⚠️  DNS указывает на $IP, а сервер имеет IP $LOCAL_IP"
    log "⚠️  Это может быть причиной SSL проблем"
fi
success "DNS корректен: $DOMAIN → $IP"

# =============================================
# 2. ПРОВЕРКА ПРОЕКТА
# =============================================
log "🔍 Проверяю структуру проекта..."
if [ ! -f "$APP_DIR/package.json" ]; then
    error "Не найден package.json в $APP_DIR"
fi

if [ ! -f "$APP_DIR/src/server.js" ]; then
    error "Не найден src/server.js в $APP_DIR"
fi

success "Проект найден: $APP_DIR"

# =============================================
# 3. ОЧИСТКА NGINX ОТ РЕДИРЕКТОВ
# =============================================
log "🧹 Очищаю конфигурацию Nginx от редиректов"
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/"$DOMAIN"

# Удаляем редиректы из nginx.conf
sudo sed -i '/return 301 https/d' /etc/nginx/nginx.conf 2>/dev/null || true
sudo sed -i '/rewrite ^ https/d' /etc/nginx/nginx.conf 2>/dev/null || true
sudo sed -i '/if ($scheme = http)/,+2d' /etc/nginx/nginx.conf 2>/dev/null || true

# Создаём чистый конфиг для ACME challenge
NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
cat << 'EOF_NGINX' | sudo tee "$NGINX_CONFIG" > /dev/null
server {
    listen 80;
    server_name DOMAIN;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/html;
        default_type text/plain;
    }

    location / {
        return 404;
    }
}
EOF_NGINX

sudo sed -i "s/DOMAIN/$DOMAIN/g" "$NGINX_CONFIG"
sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/

# Проверка синтаксиса
if ! sudo nginx -t >> "$LOG_FILE" 2>&1; then
    error "Ошибка синтаксиса Nginx"
fi

sudo systemctl reload nginx
success "Nginx настроен для HTTP-проверки"

# =============================================
# 4. СОЗДАНИЕ ДИРЕКТОРИИ ДЛЯ ACME
# =============================================
sudo mkdir -p "$WWW_DIR/.well-known/acme-challenge"
echo "test" | sudo tee "$WWW_DIR/.well-known/acme-challenge/test" > /dev/null
sudo chown -R www-data:www-data "$WWW_DIR"
sudo chmod -R 755 "$WWW_DIR"

# Проверка доступа
if ! curl -f -s "http://localhost/.well-known/acme-challenge/test" | grep -q "test"; then
    error "Тестовый файл недоступен. Проверьте права и фаервол."
fi
success "Тестовый файл доступен через HTTP"

# =============================================
# 5. ПОЛУЧЕНИЕ SSL-СЕРТИФИКАТА
# =============================================
log "🔐 Получаю SSL-сертификат Let's Encrypt..."
sudo certbot certonly --webroot -w "$WWW_DIR" -d "$DOMAIN" --non-interactive --agree-tos --email admin@gita-1972-reprint.ru --keep-until-expiring >> "$LOG_FILE" 2>&1

if [ ! -d "$CERT_DIR" ]; then
    error "Сертификат не получен. Проверьте логи Certbot."
fi
success "SSL-сертификат получен и сохранён в $CERT_DIR"

# =============================================
# 6. ФИНАЛЬНЫЙ КОНФИГ NGINX (HTTPS)
# =============================================
log "🔧 Настраиваю финальный HTTPS конфиг Nginx"
cat << 'EOF_HTTPS' | sudo tee "$NGINX_CONFIG" > /dev/null
server {
    listen 80;
    server_name DOMAIN;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name DOMAIN;

    ssl_certificate /etc/letsencrypt/live/DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN/privkey.pem;

    # SSL настройки безопасности
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 5m;

    # Безопасность
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # CORS заголовки для API
    add_header Access-Control-Allow-Origin "https://gita-1972-reprint.ru" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    location / {
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://gita-1972-reprint.ru";
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Max-Age 86400;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }

        # Проксирование на Node.js приложение
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Логирование
    access_log /var/log/nginx/api.gita-access.log;
    error_log /var/log/nginx/api.gita-error.log;

    # Ограничение размера загружаемых файлов
    client_max_body_size 10M;
}
EOF_HTTPS

sudo sed -i "s/DOMAIN/$DOMAIN/g" "$NGINX_CONFIG"

if ! sudo nginx -t >> "$LOG_FILE" 2>&1; then
    error "Ошибка в финальном конфиге Nginx"
fi

sudo systemctl reload nginx
success "Nginx перезагружен с HTTPS-конфигом"

# =============================================
# 7. САМОПРОВЕРКА СИСТЕМЫ
# =============================================
log "🔍 Провожу финальную самопроверку..."

# Проверка: доступен ли HTTPS?
if ! curl -k -s "https://$DOMAIN" | grep -q "<"; then
    error "HTTPS не работает или возвращает пустой ответ"
fi

# Проверка: работает ли API?
if ! curl -s "http://localhost:3000/api/status" | grep -q "OK"; then
    log "⚠️  API не отвечает. Проверьте статус сервиса"
fi

# Проверка: сертификат активен?
if ! sudo certbot certificates | grep -q "$DOMAIN"; then
    error "SSL сертификат не найден"
fi

success "SSL сертификат активен"

# =============================================
# 🎉 ФИНАЛ
# =============================================
success "✅ Домен $DOMAIN УСПЕШНО НАСТРОЕН!"
success "🌐 Доступен по: https://$DOMAIN"
success "📄 Логи: $LOG_FILE"
success "🛡️  Сертификат: $CERT_DIR"
success "🚀 Nginx работает с HTTPS"

exit 0
