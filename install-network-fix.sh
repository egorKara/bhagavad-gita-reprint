#!/bin/bash

echo "🚀 Установка системы исправления сетевых проблем..."

# Делаем скрипты исполняемыми
chmod +x fix-network.sh
chmod +x network-monitor.sh

# Копируем systemd сервис
sudo cp network-monitor.service /etc/systemd/system/

# Перезагружаем systemd
sudo systemctl daemon-reload

# Включаем и запускаем сервис
sudo systemctl enable network-monitor.service
sudo systemctl start network-monitor.service

# Проверяем статус
echo "🔍 Проверка статуса сервиса..."
sudo systemctl status network-monitor.service --no-pager -l

echo ""
echo "✅ Система исправления сетевых проблем установлена!"
echo ""
echo "📋 Доступные команды:"
echo "   • Автоматическое исправление: ./fix-network.sh"
echo "   • Проверка статуса: sudo systemctl status network-monitor.service"
echo "   • Просмотр логов: sudo journalctl -u network-monitor.service -f"
echo "   • Остановка: sudo systemctl stop network-monitor.service"
echo "   • Запуск: sudo systemctl start network-monitor.service"
echo ""
echo "🌐 Сервис будет автоматически:"
echo "   • Мониторить соединение каждые 60 секунд"
echo "   • Выполнять быстрое исправление при первой проблеме"
echo "   • Выполнять полное исправление после 3 неудач"
echo "   • Логировать все действия в /var/log/network-monitor.log"
