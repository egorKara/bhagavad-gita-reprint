#!/bin/bash
# 🚀 SSH Ultra Safe - экстремально безопасный скрипт для Cursor IDE
# Решает проблему зависаний через фоновые процессы и принудительные тайм-ауты

set -e

# Конфигурация
SERVER_IP="46.21.247.218"
SSH_KEY="$HOME/.ssh/ssh-key-1753182147967"
SSH_USER="yc-user"
DEFAULT_TIMEOUT=10

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

# Функция ультра-безопасного SSH с принудительным завершением
ultra_safe_ssh() {
    local command="$1"
    local timeout_duration="${2:-$DEFAULT_TIMEOUT}"
    local temp_file="/tmp/ssh_output_$$"
    local pid_file="/tmp/ssh_pid_$$"
    
    log_info "🔄 Команда: $command"
    log_info "⏱️ Таймаут: ${timeout_duration}s"
    
    # Запускаем SSH в фоне с записью PID
    (
        ssh -i "$SSH_KEY" \
            -o StrictHostKeyChecking=no \
            -o ConnectTimeout=5 \
            -o ServerAliveInterval=2 \
            -o ServerAliveCountMax=2 \
            -o BatchMode=yes \
            -o LogLevel=ERROR \
            "$SSH_USER@$SERVER_IP" \
            "$command" > "$temp_file" 2>&1
        echo $? > "${temp_file}.exit_code"
    ) &
    
    local ssh_pid=$!
    echo $ssh_pid > "$pid_file"
    
    # Ждем завершения или тайм-аута
    local elapsed=0
    while [ $elapsed -lt $timeout_duration ]; do
        if ! kill -0 $ssh_pid 2>/dev/null; then
            # Процесс завершился
            wait $ssh_pid 2>/dev/null || true
            local exit_code=0
            if [ -f "${temp_file}.exit_code" ]; then
                exit_code=$(cat "${temp_file}.exit_code")
            fi
            
            if [ $exit_code -eq 0 ] && [ -f "$temp_file" ]; then
                log_success "✅ Команда выполнена успешно"
                cat "$temp_file"
            else
                log_error "❌ Команда завершилась с ошибкой (код: $exit_code)"
                if [ -f "$temp_file" ]; then
                    cat "$temp_file"
                fi
            fi
            
            # Очистка
            rm -f "$temp_file" "${temp_file}.exit_code" "$pid_file"
            return $exit_code
        fi
        
        sleep 1
        ((elapsed++))
        
        # Показываем прогресс каждые 3 секунды
        if [ $((elapsed % 3)) -eq 0 ]; then
            log_info "⏳ Выполняется... ${elapsed}/${timeout_duration}s"
        fi
    done
    
    # Тайм-аут - принудительно завершаем
    log_warning "⚠️ Достигнут тайм-аут, завершаем процесс..."
    
    # Пытаемся мягко завершить
    kill -TERM $ssh_pid 2>/dev/null || true
    sleep 2
    
    # Если не помогло - убиваем жестко
    if kill -0 $ssh_pid 2>/dev/null; then
        log_warning "🔨 Принудительное завершение..."
        kill -KILL $ssh_pid 2>/dev/null || true
    fi
    
    log_error "❌ Команда превысила тайм-аут (${timeout_duration}s)"
    
    # Очистка
    rm -f "$temp_file" "${temp_file}.exit_code" "$pid_file"
    return 124
}

# Быстрая проверка подключения
quick_check() {
    log_info "🔍 Быстрая проверка подключения..."
    
    if ultra_safe_ssh "echo 'OK'" 8; then
        log_success "✅ Сервер доступен"
        return 0
    else
        log_error "❌ Сервер недоступен или превышен тайм-аут"
        return 1
    fi
}

# Статус агента (минимальная команда)
quick_status() {
    log_info "📊 Быстрый статус агента..."
    ultra_safe_ssh "systemctl is-active yandex-server-agent 2>/dev/null || echo 'UNKNOWN'" 8
}

# Последние 5 строк логов
quick_logs() {
    log_info "📋 Последние логи агента..."
    ultra_safe_ssh "journalctl -u yandex-server-agent -n 5 --no-pager --output=short-iso 2>/dev/null | tail -5 || echo 'Логи недоступны'" 12
}

# Быстрые метрики
quick_metrics() {
    log_info "📈 Быстрые метрики системы..."
    ultra_safe_ssh "echo 'CPU:' && top -bn1 | grep 'Cpu(s)' | head -1 2>/dev/null || echo 'N/A'; echo 'RAM:' && free | grep Mem | awk '{printf \"%.1f%%\n\", \$3/\$2 * 100.0}' 2>/dev/null || echo 'N/A'" 10
}

# Тест AI модулей (быстрый)
quick_ai_test() {
    log_info "🤖 Быстрый тест AI модулей..."
    ultra_safe_ssh "cd /home/yc-user/gita-1972/server-agent 2>/dev/null && ls *.py | grep -E '(ai_|telegram|monitoring)' | wc -l || echo '0'" 8
}

# Перезапуск агента (безопасный)
safe_restart() {
    log_info "🔄 Безопасный перезапуск агента..."
    
    log_info "1. Остановка..."
    if ultra_safe_ssh "sudo systemctl stop yandex-server-agent" 10; then
        log_success "Остановлен"
    else
        log_warning "Ошибка остановки"
    fi
    
    sleep 2
    
    log_info "2. Запуск..."
    if ultra_safe_ssh "sudo systemctl start yandex-server-agent" 10; then
        log_success "Запущен"
    else
        log_error "Ошибка запуска"
        return 1
    fi
    
    sleep 2
    
    log_info "3. Проверка..."
    quick_status
}

# Произвольная команда
execute_command() {
    local cmd="$1"
    local timeout="${2:-15}"
    
    if [ -z "$cmd" ]; then
        log_error "Команда не указана"
        return 1
    fi
    
    log_info "🔧 Выполнение произвольной команды..."
    ultra_safe_ssh "$cmd" "$timeout"
}

# Главное меню
main() {
    echo "🛡️ SSH ULTRA SAFE - Решение проблемы зависаний Cursor IDE"
    echo "========================================================="
    
    if [ $# -eq 0 ]; then
        echo "Использование: $0 [команда]"
        echo ""
        echo "⚡ БЫСТРЫЕ КОМАНДЫ (защита от зависаний):"
        echo "  check       - Проверка подключения (8s)"
        echo "  status      - Статус агента (8s)"  
        echo "  logs        - Последние 5 логов (12s)"
        echo "  metrics     - CPU/RAM (10s)"
        echo "  ai-test     - Тест AI модулей (8s)"
        echo "  restart     - Перезапуск агента (30s)"
        echo "  cmd 'COMMAND' [timeout] - Произвольная команда"
        echo ""
        echo "Примеры:"
        echo "  $0 check"
        echo "  $0 cmd 'ls -la /home/yc-user/gita-1972/server-agent/' 10"
        echo ""
        echo "🔧 Решает проблему зависаний через:"
        echo "  - Принудительные тайм-ауты"
        echo "  - Фоновые процессы"
        echo "  - Автоматическое завершение"
        exit 1
    fi
    
    local command="$1"
    shift
    
    case "$command" in
        "check") quick_check ;;
        "status") quick_status ;;
        "logs") quick_logs ;;
        "metrics") quick_metrics ;;
        "ai-test") quick_ai_test ;;
        "restart") safe_restart ;;
        "cmd") 
            if [ $# -eq 0 ]; then
                log_error "Необходимо указать команду"
                exit 1
            fi
            execute_command "$1" "$2"
            ;;
        *)
            log_error "Неизвестная команда: $command"
            echo "Используйте '$0' для списка команд"
            exit 1
            ;;
    esac
}

# Запуск
main "$@"
