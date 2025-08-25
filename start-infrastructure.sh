#!/bin/bash

echo "🚀 Запуск инфраструктуры Gita Landing..."

# Проверяем Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    exit 1
fi

# Проверяем Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Запускаем инфраструктуру
echo "📦 Запуск контейнеров..."
docker-compose up -d

# Ждем запуска
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверяем статус
echo "🔍 Проверка статуса сервисов..."
docker-compose ps

echo ""
echo "✅ Инфраструктура запущена!"
echo ""
echo "📊 Доступные сервисы:"
echo "   • PostgreSQL: localhost:5432"
echo "   • Prometheus: http://localhost:9090"
echo "   • API (после запуска): http://localhost:5000"
echo ""
echo "🔧 Управление:"
echo "   • Остановить: docker-compose down"
echo "   • Логи: docker-compose logs -f"
echo "   • Перезапустить: docker-compose restart"
