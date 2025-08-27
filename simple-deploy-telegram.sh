#!/bin/bash
# Упрощенный скрипт развертывания Telegram конфигурации

set -e

VM_ID="fhmqd2mct32i12bapfn1"
CONFIG_URL="https://raw.githubusercontent.com/egorKara/bhagavad-gita-reprint/main/server-agent/agent-config.json"

echo "🚀 УПРОЩЕННОЕ РАЗВЕРТЫВАНИЕ TELEGRAM КОНФИГУРАЦИИ"
echo "================================================"
echo "VM ID: $VM_ID"
echo ""

# Функция для безопасного SSH
run_ssh_command() {
    local cmd="$1"
    echo "[INFO] 🔄 Выполняю: $cmd"
    
    # Используем простое yc compute ssh подключение с тайм-аутом через timeout
    timeout 30s yc compute ssh "$VM_ID" <<EOF
$cmd
exit
EOF
}

echo "📡 ШАГ 1: Проверка подключения..."
if run_ssh_command "echo 'SSH OK'"; then
    echo "✅ Подключение успешно"
else
    echo "❌ Проблема с SSH подключением"
    echo ""
    echo "🔧 АЛЬТЕРНАТИВНЫЙ СПОСОБ:"
    echo "Выполните команды вручную на сервере:"
    echo ""
    echo "1. Подключение:"
    echo "   yc compute ssh $VM_ID"
    echo ""
    echo "2. Обновление конфигурации:"
    echo "   cd /home/egorkara/server-agent/"
    echo "   cp agent-config.json agent-config.json.backup"
    echo "   wget -O agent-config.json $CONFIG_URL"
    echo ""
    echo "3. Перезапуск агента:"
    echo "   sudo systemctl restart yandex-server-agent"
    echo "   sudo systemctl status yandex-server-agent"
    echo ""
    echo "4. Проверка логов:"
    echo "   sudo journalctl -u yandex-server-agent -n 10"
    echo ""
    exit 1
fi

echo ""
echo "💾 ШАГ 2: Создание резервной копии..."
run_ssh_command "cd /home/egorkara/server-agent && cp agent-config.json agent-config.json.backup_$(date +%Y%m%d_%H%M%S) 2>/dev/null || echo 'Файл не найден, создаем новый'"

echo ""
echo "📥 ШАГ 3: Загрузка новой конфигурации..."
run_ssh_command "cd /home/egorkara/server-agent && wget -O agent-config.json.new '$CONFIG_URL' && mv agent-config.json.new agent-config.json"

echo ""
echo "🔍 ШАГ 4: Проверка JSON..."
run_ssh_command "cd /home/egorkara/server-agent && python3 -m json.tool agent-config.json > /dev/null && echo 'JSON корректен'"

echo ""
echo "🔄 ШАГ 5: Перезапуск агента..."
run_ssh_command "sudo systemctl restart yandex-server-agent"

echo ""
echo "📊 ШАГ 6: Проверка статуса..."
sleep 3
run_ssh_command "sudo systemctl status yandex-server-agent --no-pager"

echo ""
echo "📝 ШАГ 7: Проверка логов..."
run_ssh_command "sudo journalctl -u yandex-server-agent --no-pager -n 5"

echo ""
echo "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО УСПЕШНО!"
echo "=================================="
echo "✅ Telegram конфигурация обновлена"
echo "✅ Yandex Server Agent перезапущен"
echo ""
echo "📱 ТЕСТИРУЙТЕ TELEGRAM БОТА:"
echo "   Отправьте: /status"
echo "🔗 Бот: @Gita_server_monitor_bot"
