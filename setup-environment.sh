#!/bin/bash

echo "🛠️ НАСТРОЙКА ОКРУЖЕНИЯ НА НОВОЙ VM"
echo "=================================="
echo ""

if [ $# -ne 1 ]; then
    echo "Использование: $0 <NEW_VM_ID>"
    exit 1
fi

NEW_VM_ID="$1"

echo "🆔 Настраиваю VM: $NEW_VM_ID"
echo ""

echo "📦 1. Установка базового ПО..."
yc compute ssh "$NEW_VM_ID" --command "
sudo apt-get update
sudo apt-get install -y curl wget git htop nginx certbot python3-certbot-nginx
echo 'Базовое ПО установлено'
"

echo "🟢 2. Установка Node.js 20..."
yc compute ssh "$NEW_VM_ID" --command "
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
echo 'Node.js установлен'
"

echo "🔧 3. Установка зависимостей проекта..."
yc compute ssh "$NEW_VM_ID" --command "
cd ~/gita-1972 && npm install
echo 'Зависимости установлены'
"

echo "🔥 4. Настройка Nginx..."
yc compute ssh "$NEW_VM_ID" --command "
sudo systemctl enable nginx
sudo systemctl start nginx
sudo nginx -t
echo 'Nginx настроен'
"

echo "🔐 5. Восстановление SSL сертификатов..."
yc compute ssh "$NEW_VM_ID" --command "
sudo systemctl reload nginx
echo 'SSL восстановлен'
"

echo "⚡ 6. Создание systemd сервиса для API..."
yc compute ssh "$NEW_VM_ID" --command "
sudo tee /etc/systemd/system/gita-api.service > /dev/null << UNIT
[Unit]
Description=Gita 1972 API Server
After=network.target

[Service]
Type=simple
User=\$(whoami)
WorkingDirectory=/home/\$(whoami)/gita-1972
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable gita-api
echo 'Systemd сервис создан'
"

echo "🤖 7. Восстановление Yandex Server Agent..."
yc compute ssh "$NEW_VM_ID" --command "
cd ~/gita-1972/server-agent
sudo python3 -m pip install --break-system-packages requests schedule psutil
python3 yandex-server-agent.py --test
echo 'Yandex Server Agent готов'
"

echo ""
echo "✅ ОКРУЖЕНИЕ ПОЛНОСТЬЮ НАСТРОЕНО!"
echo "🚀 Готово к запуску всех сервисов!"
