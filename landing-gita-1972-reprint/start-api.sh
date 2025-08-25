#!/bin/bash

echo "🚀 Запуск GitaLanding API..."
echo "📍 Директория: $(pwd)"
echo "🌐 URL: http://localhost:5246"

# Останавливаем предыдущие процессы
pkill -f "dotnet run" 2>/dev/null
sleep 2

# Запускаем API
cd GitaLanding.API
dotnet run --urls "http://localhost:5246" &

# Ждем запуска
sleep 15

# Проверяем работу
echo "✅ Проверка API..."
if curl -s http://localhost:5246/health > /dev/null; then
    echo "🎉 API успешно запущен!"
    echo "🔗 Health: http://localhost:5246/health"
    echo "🔗 Swagger: http://localhost:5246/swagger"
    echo "🔗 Books: http://localhost:5246/api/books"
    echo "🔗 Authors: http://localhost:5246/api/authors"
    echo "🔗 Main Book: http://localhost:5246/api/books/main"
    echo ""
    echo "💡 Для остановки: pkill -f 'dotnet run'"
else
    echo "❌ API не отвечает"
    exit 1
fi
