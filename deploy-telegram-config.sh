#!/bin/bash
# Скрипт развертывания обновленной конфигурации Telegram бота
# на продакшн сервере

set -e

# Конфигурация
VM_ID="fhmqd2mct32i12bapfn1"
VM_IP="46.21.247.218"
SERVER_USER="egorkara"
AGENT_PATH="/home/egorkara/server-agent"
CONFIG_FILE="agent-config.json"
BACKUP_SUFFIX=$(date +%Y%m%d_%H%M%S)

echo "🚀 РАЗВЕРТЫВАНИЕ TELEGRAM КОНФИГУРАЦИИ"
echo "======================================"
echo "VM ID: $VM_ID"
echo "VM IP: $VM_IP"
echo "Пользователь: $SERVER_USER"
echo "Путь агента: $AGENT_PATH"
echo ""

# Функция безопасного SSH с таймаутом
safe_ssh() {
    local cmd="$1"
    local timeout="${2:-30}"
    echo "[INFO] 🔄 Выполняю: $cmd"
    echo "[INFO] ⏱️ Таймаут: ${timeout}s"
    
    if timeout "$timeout" yc compute ssh "$VM_ID" --ssh-flag="-o ConnectTimeout=10" --ssh-flag="-o ServerAliveInterval=5" --ssh-flag="-o ServerAliveCountMax=3" <<EOF; then
$cmd
EOF
        return 0
    else
        echo "[ERROR] ❌ SSH команда завершилась с ошибкой или превышен тайм-аут"
        return 1
    fi
}

# Шаг 1: Проверка подключения
echo "📡 ШАГ 1: Проверка подключения к серверу..."
if safe_ssh "echo 'SSH подключение OK'" 15; then
    echo "✅ Подключение успешно"
else
    echo "❌ Не удается подключиться к серверу"
    exit 1
fi

# Шаг 2: Проверка текущего состояния агента
echo ""
echo "🔍 ШАГ 2: Проверка состояния Yandex Server Agent..."
safe_ssh "sudo systemctl status yandex-server-agent --no-pager || echo 'Сервис не найден'" 10

# Шаг 3: Создание резервной копии текущей конфигурации
echo ""
echo "💾 ШАГ 3: Создание резервной копии конфигурации..."
safe_ssh "cd $AGENT_PATH && cp $CONFIG_FILE ${CONFIG_FILE}.backup_${BACKUP_SUFFIX} 2>/dev/null || echo 'Файл конфигурации не найден'" 10

# Шаг 4: Загрузка новой конфигурации с GitHub
echo ""
echo "📥 ШАГ 4: Загрузка обновленной конфигурации..."
safe_ssh "cd $AGENT_PATH && wget -O ${CONFIG_FILE}.new https://raw.githubusercontent.com/egorKara/bhagavad-gita-reprint/main/server-agent/agent-config.json && mv ${CONFIG_FILE}.new $CONFIG_FILE" 20

# Шаг 5: Проверка корректности JSON
echo ""
echo "🔍 ШАГ 5: Проверка корректности JSON конфигурации..."
safe_ssh "cd $AGENT_PATH && python3 -m json.tool $CONFIG_FILE > /dev/null && echo 'JSON корректен'" 10

# Шаг 6: Перезапуск агента
echo ""
echo "🔄 ШАГ 6: Перезапуск Yandex Server Agent..."
safe_ssh "sudo systemctl restart yandex-server-agent" 15

# Шаг 7: Проверка статуса после перезапуска
echo ""
echo "📊 ШАГ 7: Проверка статуса после перезапуска..."
sleep 5  # Даем время на запуск
safe_ssh "sudo systemctl status yandex-server-agent --no-pager" 10

# Шаг 8: Проверка логов агента
echo ""
echo "📝 ШАГ 8: Проверка логов агента..."
safe_ssh "sudo journalctl -u yandex-server-agent --no-pager -n 10" 15

echo ""
echo "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО!"
echo "========================="
echo "✅ Telegram конфигурация обновлена"
echo "✅ Yandex Server Agent перезапущен"
echo "✅ Логи проверены"
echo ""
echo "📱 TELEGRAM БОТ ГОТОВ К ТЕСТИРОВАНИЮ:"
echo "   Отправьте боту команду: /status"
echo "   Или любую другую: /help, /services, /logs"
echo ""
echo "🔗 Бот: @Gita_server_monitor_bot"
echo "💬 Chat ID: 6878699213"
