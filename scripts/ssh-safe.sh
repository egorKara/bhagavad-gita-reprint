#!/bin/bash
# 🚀 SSH Safe - безопасный скрипт для работы с Yandex сервером
# Решает проблему зависаний в Cursor IDE

set -e

# Конфигурация
SERVER_IP="46.21.247.218"
SSH_KEY="~/.ssh/ssh-key-1753182147967"
SSH_USER="yc-user"
TIMEOUT=30

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Функция безопасного SSH
safe_ssh() {
    local command="$1"
    local timeout_duration="${2:-$TIMEOUT}"
    
    log_info "Выполнение команды на сервере (таймаут: ${timeout_duration}s)"
    log_info "Команда: $command"
    
    # Выполняем с тайм-аутом и неинтерактивными флагами
    timeout "$timeout_duration" ssh \
        -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        -o ServerAliveInterval=5 \
        -o ServerAliveCountMax=3 \
        -o BatchMode=yes \
        "$SSH_USER@$SERVER_IP" \
        "$command" 2>/dev/null || {
        
        local exit_code=$?
        if [ $exit_code -eq 124 ]; then
            log_error "Команда превысила таймаут ($timeout_duration секунд)"
            return 124
        elif [ $exit_code -eq 255 ]; then
            log_error "Ошибка SSH соединения"
            return 255
        else
            log_error "Команда завершилась с ошибкой (код: $exit_code)"
            return $exit_code
        fi
    }
}

# Функция проверки соединения
check_connection() {
    log_info "🔗 Проверка подключения к серверу..."
    
    if safe_ssh "echo 'Connection test'" 5; then
        log_success "✅ Подключение работает"
        return 0
    else
        log_error "❌ Подключение недоступно"
        return 1
    fi
}

# Функция получения статуса агента
get_agent_status() {
    log_info "📊 Получение статуса Yandex Server Agent..."
    
    safe_ssh "sudo systemctl is-active yandex-server-agent --quiet && echo 'ACTIVE' || echo 'INACTIVE'" 10
}

# Функция получения последних логов
get_recent_logs() {
    local lines="${1:-10}"
    log_info "📋 Получение последних $lines строк логов..."
    
    safe_ssh "sudo journalctl -u yandex-server-agent -n $lines --no-pager --output=short" 15
}

# Функция перезапуска агента
restart_agent() {
    log_info "🔄 Перезапуск Yandex Server Agent..."
    
    # Остановка
    log_info "Остановка агента..."
    safe_ssh "sudo systemctl stop yandex-server-agent" 10
    
    sleep 2
    
    # Запуск
    log_info "Запуск агента..."
    safe_ssh "sudo systemctl start yandex-server-agent" 10
    
    sleep 3
    
    # Проверка статуса
    log_info "Проверка статуса..."
    if safe_ssh "sudo systemctl is-active yandex-server-agent --quiet" 5; then
        log_success "✅ Агент успешно перезапущен"
    else
        log_error "❌ Ошибка при перезапуске агента"
        return 1
    fi
}

# Функция получения системных метрик
get_system_metrics() {
    log_info "📈 Получение системных метрик..."
    
    safe_ssh "echo '=== CPU ===' && top -bn1 | grep 'Cpu(s)' | head -1 && echo '=== MEMORY ===' && free -h | grep -E 'Mem:|Swap:' && echo '=== DISK ===' && df -h / | tail -1" 15
}

# Функция тестирования AI модулей
test_ai_modules() {
    log_info "🤖 Тестирование AI модулей..."
    
    safe_ssh "cd /home/yc-user/gita-1972/server-agent && python3 -c 'import ai_log_analyzer, telegram_notifier, yandex_monitoring_integration; print(\"✅ Все AI модули доступны\")'" 20
}

# Главная функция с меню
main() {
    echo "🤖 SSH SAFE - Безопасная работа с Yandex Server Agent"
    echo "=================================================="
    
    if [ $# -eq 0 ]; then
        echo "Использование: $0 [команда]"
        echo ""
        echo "Доступные команды:"
        echo "  check       - Проверка подключения"
        echo "  status      - Статус агента"
        echo "  logs [N]    - Последние N строк логов (по умолчанию 10)"
        echo "  restart     - Перезапуск агента"
        echo "  metrics     - Системные метрики"
        echo "  test-ai     - Тест AI модулей"
        echo "  cmd 'COMMAND' - Выполнить произвольную команду"
        echo ""
        echo "Примеры:"
        echo "  $0 check"
        echo "  $0 logs 20"
        echo "  $0 cmd 'ls -la /home/yc-user/gita-1972/server-agent/'"
        exit 1
    fi
    
    local command="$1"
    shift
    
    case "$command" in
        "check")
            check_connection
            ;;
        "status")
            get_agent_status
            ;;
        "logs")
            local lines="${1:-10}"
            get_recent_logs "$lines"
            ;;
        "restart")
            restart_agent
            ;;
        "metrics")
            get_system_metrics
            ;;
        "test-ai")
            test_ai_modules
            ;;
        "cmd")
            if [ $# -eq 0 ]; then
                log_error "Необходимо указать команду для выполнения"
                exit 1
            fi
            safe_ssh "$1" 30
            ;;
        *)
            log_error "Неизвестная команда: $command"
            exit 1
            ;;
    esac
}

# Запуск основной функции
main "$@"
