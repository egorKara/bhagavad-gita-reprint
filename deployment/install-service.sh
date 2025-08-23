#!/bin/bash

# Скрипт установки systemd сервиса для Gita 1972 API
# Выполнять с правами sudo на production сервере

set -e

echo "🚀 Установка Gita 1972 API Service"
echo "=================================="

# Проверка что скрипт запущен с sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ошибка: Скрипт должен быть запущен с sudo"
    echo "   Использование: sudo bash deployment/install-service.sh"
    exit 1
fi

# Определение путей
PROJECT_DIR="/var/www/gita-1972-reprint"
SERVICE_FILE="/etc/systemd/system/gita-api.service"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📁 Пути:"
echo "   Проект: $PROJECT_DIR"
echo "   Сервис: $SERVICE_FILE"
echo ""

# Проверка существования проекта
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Ошибка: Директория проекта не найдена: $PROJECT_DIR"
    echo "   Убедитесь что проект развернут в правильной директории"
    exit 1
fi

# Проверка package.json
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "❌ Ошибка: package.json не найден в $PROJECT_DIR"
    exit 1
fi

# Проверка server.js
if [ ! -f "$PROJECT_DIR/src/server.js" ]; then
    echo "❌ Ошибка: src/server.js не найден в $PROJECT_DIR"
    exit 1
fi

echo "✅ Проект найден и корректен"

# Установка зависимостей если нужно
echo ""
echo "📦 Проверка зависимостей..."
cd "$PROJECT_DIR"

if [ ! -d "node_modules" ]; then
    echo "📥 Установка npm зависимостей..."
    npm ci --production
else
    echo "✅ node_modules уже существует"
fi

# Создание пользователя www-data если не существует
if ! id "www-data" &>/dev/null; then
    echo "👤 Создание пользователя www-data..."
    useradd --system --no-create-home --shell /bin/false www-data
else
    echo "✅ Пользователь www-data существует"
fi

# Установка прав доступа
echo ""
echo "🔒 Установка прав доступа..."
chown -R www-data:www-data "$PROJECT_DIR"
chmod -R 755 "$PROJECT_DIR"
chmod 644 "$PROJECT_DIR"/package.json

# Копирование файла сервиса
echo ""
echo "📋 Установка systemd сервиса..."
cp "$SCRIPT_DIR/gita-api.service" "$SERVICE_FILE"
chmod 644 "$SERVICE_FILE"

# Копирование примера .env файла
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "📄 Создание .env файла из примера..."
    cp "$SCRIPT_DIR/env.production.example" "$PROJECT_DIR/.env"
    chown www-data:www-data "$PROJECT_DIR/.env"
    chmod 600 "$PROJECT_DIR/.env"
    echo "⚠️  ВАЖНО: Отредактируйте $PROJECT_DIR/.env с реальными значениями!"
else
    echo "✅ .env файл уже существует"
fi

# Перезагрузка systemd
echo ""
echo "🔄 Перезагрузка systemd..."
systemctl daemon-reload

# Включение автозапуска
echo "🎯 Включение автозапуска..."
systemctl enable gita-api

# Запуск сервиса
echo "▶️  Запуск сервиса..."
systemctl start gita-api

# Проверка статуса
echo ""
echo "📊 Проверка статуса..."
sleep 2

if systemctl is-active --quiet gita-api; then
    echo "✅ Сервис успешно запущен!"
    echo ""
    systemctl status gita-api --no-pager -l
    echo ""
    echo "🔗 Проверка API:"
    echo "   Локально: curl http://localhost:3000/api/status"
    echo "   Внешний:  curl https://api.gita-1972-reprint.ru/api/status"
    echo ""
    echo "📝 Управление сервисом:"
    echo "   sudo systemctl start gita-api     - запуск"
    echo "   sudo systemctl stop gita-api      - остановка"
    echo "   sudo systemctl restart gita-api   - перезапуск"
    echo "   sudo systemctl status gita-api    - статус"
    echo "   sudo journalctl -u gita-api -f    - логи в реальном времени"
else
    echo "❌ Ошибка запуска сервиса!"
    echo ""
    echo "📝 Логи ошибки:"
    journalctl -u gita-api --no-pager -l
    echo ""
    echo "🔧 Проверьте:"
    echo "   1. Корректность .env файла"
    echo "   2. Установлены ли npm зависимости"
    echo "   3. Доступен ли порт 3000"
    exit 1
fi

echo ""
echo "🎉 Установка завершена успешно!"
echo "🚀 API сервер настроен и запущен!"
