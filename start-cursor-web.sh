#!/bin/bash

# =============================================
# 🚀 СКРИПТ ЗАПУСКА CURSOR FOR WEB
# Запуск Cursor IDE в веб-режиме для удалённого доступа
# =============================================

echo "🌐 Запускаю Cursor for Web..."
echo "📱 Теперь можно подключиться с телефона через браузер"
echo "🔗 Откройте: https://cursor.sh на вашем смартфоне"
echo ""

# Переходим в директорию проекта
cd /home/oem/github/bhagavad-gita-reprint

# Проверяем что Cursor установлен
if ! command -v cursor &> /dev/null; then
    echo "❌ Cursor не найден. Устанавливаю..."
    
    # Попытка установки через snap
    if command -v snap &> /dev/null; then
        sudo snap install cursor --classic
    else
        echo "❌ Snap не доступен. Установите Cursor вручную:"
        echo "   https://cursor.sh/docs/getting-started"
        exit 1
    fi
fi

# Запускаем Cursor в веб-режиме
echo "🚀 Запускаю Cursor IDE..."
echo "📁 Рабочая директория: $(pwd)"
echo "🌐 Веб-интерфейс будет доступен через Cursor"
echo ""

# Запускаем Cursor с текущим проектом
cursor . --web-server

echo ""
echo "✅ Cursor for Web запущен!"
echo "📱 Подключитесь с телефона через https://cursor.sh"
echo "🔑 Войдите в аккаунт Microsoft"
echo "📁 Откройте проект: bhagavad-gita-reprint"
