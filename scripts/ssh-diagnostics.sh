#!/bin/bash
# 🔍 SSH Diagnostics - полная диагностика проблем подключения к Yandex серверу

set -e

SERVER_IP="46.21.247.218"
SSH_KEY="$HOME/.ssh/ssh-key-1753182147967"
SSH_USER="yc-user"

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🔍 SSH DIAGNOSTICS - Диагностика проблем подключения"
echo "=================================================="

# 1. Проверка сетевой доступности
echo ""
log_info "1. 🌐 Проверка сетевой доступности..."
if ping -c 2 -W 3 "$SERVER_IP" >/dev/null 2>&1; then
    log_success "✅ Сервер доступен по сети"
else
    log_error "❌ Сервер недоступен по сети"
    exit 1
fi

# 2. Проверка SSH порта
echo ""
log_info "2. 🚪 Проверка SSH порта 22..."
if timeout 5 bash -c "</dev/tcp/$SERVER_IP/22" 2>/dev/null; then
    log_success "✅ Порт 22 открыт"
else
    log_error "❌ Порт 22 недоступен или заблокирован"
fi

# 3. Проверка SSH ключа
echo ""
log_info "3. 🔑 Проверка SSH ключа..."
if [ -f "$SSH_KEY" ]; then
    log_success "✅ SSH ключ найден: $SSH_KEY"
    chmod 600 "$SSH_KEY" 2>/dev/null || true
else
    log_error "❌ SSH ключ не найден: $SSH_KEY"
    exit 1
fi

# 4. Тест базового SSH с детальным выводом
echo ""
log_info "4. 🔗 Тест SSH подключения..."
log_info "Команда: ssh -v -i '$SSH_KEY' -o ConnectTimeout=10 $SSH_USER@$SERVER_IP 'echo \"SSH OK\"'"

# Создаем временный файл для вывода
temp_file="/tmp/ssh_test_$$"

timeout 15 ssh -v \
    -i "$SSH_KEY" \
    -o StrictHostKeyChecking=no \
    -o ConnectTimeout=10 \
    -o ServerAliveInterval=5 \
    -o ServerAliveCountMax=2 \
    "$SSH_USER@$SERVER_IP" \
    'echo "SSH_CONNECTION_OK"' > "$temp_file" 2>&1 &

ssh_pid=$!

# Ждем завершения с индикатором прогресса
elapsed=0
max_wait=15

while [ $elapsed -lt $max_wait ]; do
    if ! kill -0 $ssh_pid 2>/dev/null; then
        # Процесс завершился
        wait $ssh_pid
        exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            log_success "✅ SSH подключение работает"
            if grep -q "SSH_CONNECTION_OK" "$temp_file" 2>/dev/null; then
                log_success "✅ Команды выполняются корректно"
            fi
        else
            log_error "❌ SSH подключение failed (код: $exit_code)"
            echo "Детали ошибки:"
            cat "$temp_file" 2>/dev/null | tail -10
        fi
        
        rm -f "$temp_file"
        break
    fi
    
    printf "\r[INFO] ⏳ SSH тест... %d/%ds" $elapsed $max_wait
    sleep 1
    ((elapsed++))
done

if kill -0 $ssh_pid 2>/dev/null; then
    printf "\n"
    log_warning "⚠️ SSH тест превысил тайм-аут ($max_wait секунд)"
    kill -TERM $ssh_pid 2>/dev/null || true
    sleep 2
    kill -KILL $ssh_pid 2>/dev/null || true
    
    echo "Вывод SSH (до тайм-аута):"
    if [ -f "$temp_file" ]; then
        cat "$temp_file" | tail -15
    fi
    rm -f "$temp_file"
fi

# 5. Альтернативные способы подключения
echo ""
echo ""
log_info "5. 🔄 Альтернативные способы подключения:"

echo ""
log_info "5.1. Через Yandex Cloud CLI:"
echo "yc compute ssh --id fhmmuttj78nf215noffh --identity-file ~/.ssh/ssh-key-1753182147967 --login yc-user"

echo ""
log_info "5.2. Прямой SSH с дополнительными опциями:"
echo "ssh -i ~/.ssh/ssh-key-1753182147967 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o ServerAliveInterval=60 yc-user@46.21.247.218"

echo ""
log_info "5.3. SSH с принудительным IPv4:"
echo "ssh -4 -i ~/.ssh/ssh-key-1753182147967 -o ConnectTimeout=30 yc-user@46.21.247.218"

# 6. Рекомендации по решению проблемы
echo ""
echo ""
log_warning "🛠️ РЕКОМЕНДАЦИИ ПО РЕШЕНИЮ ПРОБЛЕМЫ ЗАВИСАНИЙ:"
echo ""
echo "1. 🚫 НЕ использовать SSH команды напрямую в Cursor IDE"
echo "2. ✅ Использовать подготовленные скрипты с тайм-аутами"
echo "3. ⏱️ Всегда устанавливать жесткие лимиты времени"
echo "4. 🔄 Разбивать сложные операции на простые шаги"
echo "5. 📱 Использовать локальные скрипты для удаленного управления"

echo ""
log_info "📋 ГОТОВЫЕ РЕШЕНИЯ:"
echo "  ./scripts/ssh-ultra-safe.sh check    - Быстрая проверка"
echo "  ./scripts/ssh-ultra-safe.sh status   - Статус агента"
echo "  ./scripts/ssh-ultra-safe.sh logs     - Логи без зависаний"

echo ""
log_success "🎯 Диагностика завершена!"
