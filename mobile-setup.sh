#!/bin/bash

# =============================================
# 📱 СКРИПТ ДЛЯ СМАРТФОНА (выполнять на телефоне)
# Автоматическая настройка Cursor for Web
# =============================================

echo "📱 НАСТРОЙКА CURSOR FOR WEB НА СМАРТФОНЕ"
echo "=========================================="
echo ""

# Проверяем что это Linux/Android
if [[ "$OSTYPE" == "linux-android"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "✅ Операционная система: $OSTYPE"
else
    echo "⚠️  Операционная система: $OSTYPE"
    echo "   Скрипт может работать некорректно"
fi

echo ""
echo "🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА:"
echo ""

# 1. Открываем браузер
echo "1️⃣ Открываю браузер..."
if command -v google-chrome &> /dev/null; then
    google-chrome "https://cursor.sh" &
    echo "✅ Chrome запущен"
elif command -v firefox &> /dev/null; then
    firefox "https://cursor.sh" &
    echo "✅ Firefox запущен"
else
    echo "⚠️  Браузер не найден"
    echo "   Откройте https://cursor.sh вручную"
fi

echo ""
echo "2️⃣ Войдите в Microsoft аккаунт"
echo "3️⃣ Нажмите 'Open Folder'"
echo "4️⃣ Выберите 'GitHub'"
echo "5️⃣ Найдите репозиторий 'bhagavad-gita-reprint'"
echo "6️⃣ Нажмите 'Clone'"
echo ""

echo "✅ Настройка завершена!"
echo "🌐 Теперь работайте с кодом через браузер"
