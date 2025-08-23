#!/bin/bash

# Cursor Connection Monitor v1.0
# Система мониторинга соединения Cursor IDE с интернетом
# Автор: Cursor Background Agent
# Дата: 2025-08-23

set -euo pipefail

# Конфигурация
SCRIPT_NAME="cursor-connection-monitor"
LOG_FILE="$HOME/.cursor/connection-monitor.log"
CONFIG_FILE="$HOME/.cursor/connection-monitor.conf"
BACKUP_DIR="$HOME/.cursor/backups"
PID_FILE="/tmp/cursor-connection-monitor.pid"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Создание необходимых директорий
mkdir -p "$(dirname "$LOG_FILE")" "$BACKUP_DIR"

# Функция логирования
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Функция для цветного вывода
print_colored() {
    local color="$1"
    shift
    echo -e "${color}$*${NC}"
}

# Проверка, запущен ли уже монитор
check_if_running() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            print_colored "$RED" "❌ Монитор уже запущен (PID: $pid)"
            exit 1
        else
            rm -f "$PID_FILE"
        fi
    fi
}

# Создание PID файла
create_pid_file() {
    echo $$ > "$PID_FILE"
    trap 'rm -f "$PID_FILE"; exit' INT TERM EXIT
}

# Загрузка конфигурации
load_config() {
    # Значения по умолчанию
    CHECK_INTERVAL=300  # 5 минут
    API_TIMEOUT=10
    MAX_RETRIES=3
    
    # Серверы для проверки
    declare -A SERVERS=(
        ["github"]="https://api.github.com"
        ["openai"]="https://api.openai.com"
        ["cursor"]="https://api.cursor.sh"
        ["google"]="https://www.google.com"
    )
    
    # Загрузка пользовательской конфигурации
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
    fi
}

# Сохранение конфигурации по умолчанию
save_default_config() {
    cat > "$CONFIG_FILE" << 'EOF'
# Cursor Connection Monitor Configuration

# Интервал проверки в секундах (по умолчанию 300 = 5 минут)
CHECK_INTERVAL=300

# Таймаут для API запросов в секундах
API_TIMEOUT=10

# Максимальное количество повторных попыток
MAX_RETRIES=3

# Уровень логирования (DEBUG, INFO, WARN, ERROR)
LOG_LEVEL=INFO

# Автоматическое исправление проблем (true/false)
AUTO_FIX=true

# Уведомления (true/false)
NOTIFICATIONS=true
EOF
    print_colored "$GREEN" "✅ Создан файл конфигурации: $CONFIG_FILE"
}

# Проверка соединения с сервером
check_server() {
    local name="$1"
    local url="$2"
    local timeout="${3:-$API_TIMEOUT}"
    
    local start_time=$(date +%s.%N)
    local response=$(curl -s -I --max-time "$timeout" "$url" 2>/dev/null | head -1)
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | bc -l 2>/dev/null || echo "N/A")
    
    if [[ -n "$response" && "$response" =~ HTTP.*[23][0-9][0-9] ]]; then
        print_colored "$GREEN" "✅ $name: OK (${duration}s)"
        log "INFO" "$name server accessible in ${duration}s"
        return 0
    else
        print_colored "$RED" "❌ $name: FAIL"
        log "ERROR" "$name server not accessible"
        return 1
    fi
}

# Проверка DNS
check_dns() {
    local domain="$1"
    local result=$(dig +short "$domain" 2>/dev/null)
    
    if [[ -n "$result" ]]; then
        print_colored "$GREEN" "✅ DNS для $domain: OK"
        log "INFO" "DNS resolution for $domain successful: $result"
        return 0
    else
        print_colored "$RED" "❌ DNS для $domain: FAIL"
        log "ERROR" "DNS resolution for $domain failed"
        return 1
    fi
}

# Проверка процессов Tor
check_tor_processes() {
    local tor_processes=$(pgrep -f tor | wc -l)
    local tor_browser_processes=$(pgrep -f tor-browser | wc -l)
    
    if [[ "$tor_processes" -gt 0 || "$tor_browser_processes" -gt 0 ]]; then
        print_colored "$YELLOW" "⚠️  Обнаружены Tor процессы:"
        print_colored "$YELLOW" "   • Tor: $tor_processes процессов"
        print_colored "$YELLOW" "   • Tor Browser: $tor_browser_processes процессов"
        log "WARN" "Tor processes detected: tor=$tor_processes, tor-browser=$tor_browser_processes"
        return 1
    else
        print_colored "$GREEN" "✅ Tor процессы не найдены"
        log "INFO" "No Tor processes detected"
        return 0
    fi
}

# Проверка прокси настроек
check_proxy_settings() {
    local proxy_vars=("HTTP_PROXY" "HTTPS_PROXY" "http_proxy" "https_proxy")
    local found_proxy=false
    
    for var in "${proxy_vars[@]}"; do
        if [[ -n "${!var:-}" ]]; then
            print_colored "$YELLOW" "⚠️  Обнаружена прокси переменная $var: ${!var}"
            log "WARN" "Proxy variable detected: $var=${!var}"
            found_proxy=true
        fi
    done
    
    if [[ "$found_proxy" == false ]]; then
        print_colored "$GREEN" "✅ Системные прокси не настроены"
        log "INFO" "No system proxy variables detected"
        return 0
    else
        return 1
    fi
}

# Основная функция диагностики
run_diagnostics() {
    print_colored "$BLUE" "🔍 ДИАГНОСТИКА СОЕДИНЕНИЯ CURSOR IDE"
    print_colored "$BLUE" "==================================="
    echo ""
    
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    log "INFO" "Starting connection diagnostics at $timestamp"
    
    # 1. Проверка основного интернет-соединения
    print_colored "$CYAN" "🌐 Проверка основного интернет-соединения:"
    if ping -c 3 8.8.8.8 >/dev/null 2>&1; then
        print_colored "$GREEN" "✅ Основное соединение: OK"
        log "INFO" "Basic internet connection working"
    else
        print_colored "$RED" "❌ Основное соединение: FAIL"
        log "ERROR" "Basic internet connection failed"
        return 1
    fi
    echo ""
    
    # 2. Проверка DNS
    print_colored "$CYAN" "🔍 Проверка DNS:"
    check_dns "api.cursor.sh"
    check_dns "api.github.com"
    echo ""
    
    # 3. Проверка серверов
    print_colored "$CYAN" "🎯 Проверка ключевых серверов:"
    local server_failures=0
    
    check_server "GitHub API" "https://api.github.com" || ((server_failures++))
    check_server "OpenAI API" "https://api.openai.com" || ((server_failures++))
    check_server "Cursor API" "https://api.cursor.sh" || ((server_failures++))
    check_server "Google" "https://www.google.com" || ((server_failures++))
    echo ""
    
    # 4. Проверка Tor
    print_colored "$CYAN" "🕵️  Проверка Tor процессов:"
    check_tor_processes
    echo ""
    
    # 5. Проверка прокси
    print_colored "$CYAN" "🌐 Проверка прокси настроек:"
    check_proxy_settings
    echo ""
    
    # Итоговый статус
    if [[ "$server_failures" -eq 0 ]]; then
        print_colored "$GREEN" "🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ УСПЕШНО!"
        log "INFO" "All diagnostics passed successfully"
        return 0
    else
        print_colored "$RED" "⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ: $server_failures серверов недоступны"
        log "ERROR" "Diagnostics failed: $server_failures servers unreachable"
        return 1
    fi
}

# Автоматическое исправление проблем
auto_fix_issues() {
    print_colored "$YELLOW" "🔧 АВТОМАТИЧЕСКОЕ ИСПРАВЛЕНИЕ ПРОБЛЕМ"
    print_colored "$YELLOW" "===================================="
    echo ""
    
    log "INFO" "Starting automatic issue fixing"
    
    # Проверка и исправление Tor проблем
    if pgrep -f tor >/dev/null; then
        print_colored "$YELLOW" "🚨 Обнаружены Tor процессы - попытка исправления..."
        
        # Создание backup настроек Cursor
        local backup_file="$BACKUP_DIR/settings_before_auto_fix_$(date +%Y%m%d_%H%M%S).json"
        if [[ -f "$HOME/.cursor/User/settings.json" ]]; then
            cp "$HOME/.cursor/User/settings.json" "$backup_file"
            print_colored "$GREEN" "✅ Backup создан: $backup_file"
            log "INFO" "Backup created: $backup_file"
        fi
        
        # Очистка прокси настроек в Cursor
        if [[ -f "$HOME/.cursor/User/settings.json" ]]; then
            python3 -c "
import json
import sys

try:
    with open('$HOME/.cursor/User/settings.json', 'r') as f:
        settings = json.load(f)
    
    proxy_keys = ['http.proxy', 'http.proxySupport', 'http.proxyAuthorization']
    removed = []
    
    for key in proxy_keys:
        if key in settings:
            del settings[key]
            removed.append(key)
    
    if removed:
        with open('$HOME/.cursor/User/settings.json', 'w') as f:
            json.dump(settings, f, indent=4)
        print('Removed proxy settings:', ', '.join(removed))
    else:
        print('No proxy settings found to remove')
        
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
" && print_colored "$GREEN" "✅ Прокси настройки очищены из Cursor"
        fi
        
        log "INFO" "Proxy settings cleared from Cursor configuration"
    fi
    
    print_colored "$GREEN" "✅ Автоматическое исправление завершено"
    log "INFO" "Automatic fixing completed"
}

# Режим непрерывного мониторинга
monitor_mode() {
    print_colored "$PURPLE" "🔄 ЗАПУСК НЕПРЕРЫВНОГО МОНИТОРИНГА"
    print_colored "$PURPLE" "=================================="
    echo ""
    
    check_if_running
    create_pid_file
    
    load_config
    
    print_colored "$BLUE" "📊 Конфигурация мониторинга:"
    print_colored "$BLUE" "• Интервал проверки: ${CHECK_INTERVAL}s"
    print_colored "$BLUE" "• Таймаут API: ${API_TIMEOUT}s"
    print_colored "$BLUE" "• Максимум попыток: ${MAX_RETRIES}"
    print_colored "$BLUE" "• Лог файл: $LOG_FILE"
    print_colored "$BLUE" "• PID файл: $PID_FILE"
    echo ""
    
    log "INFO" "Starting continuous monitoring (PID: $$)"
    
    local failure_count=0
    
    while true; do
        if run_diagnostics >/dev/null 2>&1; then
            failure_count=0
            print_colored "$GREEN" "$(date '+%H:%M:%S') ✅ Все системы работают нормально"
        else
            ((failure_count++))
            print_colored "$RED" "$(date '+%H:%M:%S') ❌ Обнаружены проблемы (попытка $failure_count/$MAX_RETRIES)"
            
            if [[ "$failure_count" -ge "$MAX_RETRIES" ]]; then
                print_colored "$YELLOW" "🔧 Запуск автоматического исправления..."
                auto_fix_issues
                failure_count=0
            fi
        fi
        
        sleep "$CHECK_INTERVAL"
    done
}

# Создание отчёта
generate_report() {
    local report_file="cursor-connection-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# Отчёт о соединении Cursor IDE

**Дата:** $(date '+%Y-%m-%d %H:%M:%S')  
**Система:** $(uname -a)  
**Пользователь:** $(whoami)  

## Результаты диагностики

$(run_diagnostics 2>&1)

## Системная информация

### Сетевые интерфейсы
\`\`\`
$(ip addr show | grep -E "(inet |inet6 )")
\`\`\`

### Активные соединения
\`\`\`
$(ss -tlnp | head -20)
\`\`\`

### DNS настройки
\`\`\`
$(cat /etc/resolv.conf)
\`\`\`

### Tor процессы
\`\`\`
$(ps aux | grep -E "\\btor\\b" | grep -v grep || echo "Не найдены")
\`\`\`

## Логи (последние 50 строк)
\`\`\`
$(tail -50 "$LOG_FILE" 2>/dev/null || echo "Лог файл не найден")
\`\`\`

---
*Отчёт создан автоматически скриптом $SCRIPT_NAME*
EOF

    print_colored "$GREEN" "✅ Отчёт создан: $report_file"
    log "INFO" "Report generated: $report_file"
}

# Очистка логов
clean_logs() {
    if [[ -f "$LOG_FILE" ]]; then
        # Сохраняем последние 1000 строк
        tail -1000 "$LOG_FILE" > "${LOG_FILE}.tmp"
        mv "${LOG_FILE}.tmp" "$LOG_FILE"
        print_colored "$GREEN" "✅ Логи очищены (сохранены последние 1000 строк)"
        log "INFO" "Logs cleaned, kept last 1000 lines"
    else
        print_colored "$YELLOW" "⚠️  Лог файл не найден"
    fi
}

# Остановка мониторинга
stop_monitor() {
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            rm -f "$PID_FILE"
            print_colored "$GREEN" "✅ Монитор остановлен (PID: $pid)"
            log "INFO" "Monitor stopped (PID: $pid)"
        else
            rm -f "$PID_FILE"
            print_colored "$YELLOW" "⚠️  Монитор не был запущен"
        fi
    else
        print_colored "$YELLOW" "⚠️  PID файл не найден"
    fi
}

# Показ статуса
show_status() {
    print_colored "$BLUE" "📊 СТАТУС CURSOR CONNECTION MONITOR"
    print_colored "$BLUE" "==================================="
    echo ""
    
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            print_colored "$GREEN" "✅ Монитор запущен (PID: $pid)"
            print_colored "$BLUE" "• Время запуска: $(ps -o lstart= -p "$pid")"
            print_colored "$BLUE" "• Использование CPU: $(ps -o %cpu= -p "$pid")%"
            print_colored "$BLUE" "• Использование памяти: $(ps -o %mem= -p "$pid")%"
        else
            print_colored "$RED" "❌ Монитор не отвечает (stale PID: $pid)"
            rm -f "$PID_FILE"
        fi
    else
        print_colored "$YELLOW" "⚠️  Монитор не запущен"
    fi
    
    echo ""
    
    if [[ -f "$LOG_FILE" ]]; then
        print_colored "$BLUE" "📄 Лог файл: $LOG_FILE"
        print_colored "$BLUE" "• Размер: $(du -h "$LOG_FILE" | cut -f1)"
        print_colored "$BLUE" "• Последние записи:"
        tail -5 "$LOG_FILE" | while read line; do
            print_colored "$BLUE" "  $line"
        done
    else
        print_colored "$YELLOW" "⚠️  Лог файл не найден"
    fi
}

# Справка
show_help() {
    cat << EOF
🔍 Cursor Connection Monitor v1.0

ИСПОЛЬЗОВАНИЕ:
    $0 [команда]

КОМАНДЫ:
    check        Выполнить разовую диагностику соединения
    monitor      Запустить непрерывный мониторинг (daemon)
    stop         Остановить мониторинг
    status       Показать статус мониторинга
    fix          Автоматическое исправление проблем
    report       Создать подробный отчёт
    config       Создать файл конфигурации по умолчанию
    clean        Очистить логи
    help         Показать эту справку

ФАЙЛЫ:
    $LOG_FILE
    $CONFIG_FILE
    $BACKUP_DIR/

ПРИМЕРЫ:
    $0 check                 # Разовая проверка
    $0 monitor              # Запуск в фоне
    $0 status               # Проверка статуса
    $0 stop                 # Остановка мониторинга
    $0 fix                  # Исправление проблем
    $0 report               # Создание отчёта

Для автоматического запуска добавьте в crontab:
    @reboot $PWD/$0 monitor

EOF
}

# Основная логика
main() {
    local command="${1:-help}"
    
    case "$command" in
        "check"|"c")
            run_diagnostics
            ;;
        "monitor"|"m")
            monitor_mode
            ;;
        "stop"|"s")
            stop_monitor
            ;;
        "status"|"st")
            show_status
            ;;
        "fix"|"f")
            auto_fix_issues
            ;;
        "report"|"r")
            generate_report
            ;;
        "config"|"conf")
            save_default_config
            ;;
        "clean"|"cl")
            clean_logs
            ;;
        "help"|"h"|"--help")
            show_help
            ;;
        *)
            print_colored "$RED" "❌ Неизвестная команда: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Проверка зависимостей
check_dependencies() {
    local deps=("curl" "dig" "ping" "ss" "python3")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing+=("$dep")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        print_colored "$RED" "❌ Отсутствуют зависимости: ${missing[*]}"
        print_colored "$YELLOW" "Установите их командой: sudo apt install ${missing[*]}"
        exit 1
    fi
}

# Инициализация
check_dependencies
load_config

# Запуск основной функции
main "$@"
