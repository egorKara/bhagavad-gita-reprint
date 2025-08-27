#!/bin/bash

# 🚀 РАЗВЁРТЫВАНИЕ TELEGRAM MASTER BOT НА СЕРВЕРЕ
# Автоматическое развертывание на Yandex Cloud VM

echo "🚀 РАЗВЁРТЫВАНИЕ TELEGRAM MASTER BOT"
echo "==================================="
echo ""

# 🎯 Параметры сервера
SERVER_IP="46.21.247.218"
SERVER_USER="yc-user"
SSH_KEY="~/.ssh/ssh-key-1753182147967"
BOT_DIR="/home/yc-user/telegram-master-bot"

echo "📡 Сервер: $SERVER_USER@$SERVER_IP"
echo "📁 Директория: $BOT_DIR"
echo ""

# 🔄 Функция безопасного SSH
safe_ssh() {
    timeout 15 ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "$1"
}

# 📦 Подготовка файлов для отправки
echo "📦 Подготовка файлов..."
cd "$(dirname "$0")"

# 🚀 Создание директории на сервере
echo "📁 Создание директории на сервере..."
safe_ssh "mkdir -p $BOT_DIR"

# 📤 Копирование файлов на сервер
echo "📤 Копирование файлов на сервер..."
timeout 30 scp -i $SSH_KEY -o StrictHostKeyChecking=no \
    telegram-master-bot.js \
    package.json \
    README.md \
    config.example.env \
    $SERVER_USER@$SERVER_IP:$BOT_DIR/

# 📦 Установка зависимостей на сервере
echo "📦 Установка зависимостей на сервере..."
safe_ssh "cd $BOT_DIR && npm install --production"

# 🔐 Настройка переменных окружения
echo "🔐 Настройка конфигурации..."
safe_ssh "cd $BOT_DIR && cp config.example.env .env"

# 📝 Создание systemd сервиса
echo "📝 Создание systemd сервиса..."
safe_ssh "sudo tee /etc/systemd/system/telegram-master-bot.service > /dev/null << 'EOF'
[Unit]
Description=Telegram Master Bot - Mobile Control Center
After=network.target

[Service]
Type=simple
User=yc-user
WorkingDirectory=$BOT_DIR
ExecStart=/usr/bin/node telegram-master-bot.js
Restart=always
RestartSec=3
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF"

# 🔄 Включение и запуск сервиса
echo "🔄 Включение и запуск сервиса..."
safe_ssh "sudo systemctl daemon-reload"
safe_ssh "sudo systemctl enable telegram-master-bot"
safe_ssh "sudo systemctl start telegram-master-bot"

# ✅ Проверка статуса
echo ""
echo "✅ Проверка статуса развёртывания..."
safe_ssh "sudo systemctl status telegram-master-bot --no-pager -l"

echo ""
echo "🎉 РАЗВЁРТЫВАНИЕ ЗАВЕРШЕНО!"
echo "=========================="
echo ""
echo "📱 Telegram бот готов к использованию:"
echo "   • Найдите @Gita_server_monitor_bot в Telegram"
echo "   • Отправьте /start для начала работы"
echo "   • Используйте /help для списка команд"
echo ""
echo "🔧 Управление сервисом на сервере:"
echo "   sudo systemctl status telegram-master-bot"
echo "   sudo systemctl restart telegram-master-bot"
echo "   sudo systemctl logs telegram-master-bot"
echo ""
echo "🚀 Мобильный центр управления активирован!"
