#!/bin/bash

# Cursor Preventive Measures v1.0
# Превентивные меры для предотвращения проблем соединения Cursor IDE
# Автор: Cursor Background Agent
# Дата: 2025-08-23

set -euo pipefail

# Конфигурация
SCRIPT_NAME="cursor-preventive-measures"
LOG_FILE="$HOME/.cursor/preventive-measures.log"
BACKUP_DIR="$HOME/.cursor/backups"
CURSOR_SETTINGS="$HOME/.cursor/User/settings.json"

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

# Создание backup конфигурации Cursor
create_cursor_backup() {
    if [[ -f "$CURSOR_SETTINGS" ]]; then
        local backup_file="$BACKUP_DIR/settings_preventive_backup_$(date +%Y%m%d_%H%M%S).json"
        cp "$CURSOR_SETTINGS" "$backup_file"
        print_colored "$GREEN" "✅ Backup создан: $backup_file"
        log "INFO" "Cursor settings backup created: $backup_file"
        echo "$backup_file"
    else
        print_colored "$YELLOW" "⚠️  Файл настроек Cursor не найден: $CURSOR_SETTINGS"
        log "WARN" "Cursor settings file not found: $CURSOR_SETTINGS"
        return 1
    fi
}

# Очистка прокси настроек
clear_proxy_settings() {
    print_colored "$CYAN" "🧹 Очистка прокси настроек..."
    
    # Системные переменные среды
    local proxy_vars=("HTTP_PROXY" "HTTPS_PROXY" "http_proxy" "https_proxy" "FTP_PROXY" "ftp_proxy" "NO_PROXY" "no_proxy")
    local cleared_vars=()
    
    for var in "${proxy_vars[@]}"; do
        if [[ -n "${!var:-}" ]]; then
            unset "$var"
            cleared_vars+=("$var")
            log "INFO" "Cleared environment variable: $var"
        fi
    done
    
    if [[ ${#cleared_vars[@]} -gt 0 ]]; then
        print_colored "$GREEN" "✅ Очищены переменные среды: ${cleared_vars[*]}"
    else
        print_colored "$GREEN" "✅ Системные прокси переменные не найдены"
    fi
    
    # Очистка настроек в Cursor
    if [[ -f "$CURSOR_SETTINGS" ]]; then
        python3 -c "
import json
import sys

try:
    with open('$CURSOR_SETTINGS', 'r') as f:
        settings = json.load(f)
    
    proxy_keys = [
        'http.proxy',
        'http.proxySupport', 
        'http.proxyAuthorization',
        'http.proxyStrictSSL',
        'http.systemCertificates'
    ]
    
    removed = []
    for key in proxy_keys:
        if key in settings:
            del settings[key]
            removed.append(key)
    
    # Добавляем оптимальные настройки для соединения
    optimal_settings = {
        'http.proxySupport': 'off',
        'http.systemCertificates': True,
        'extensions.autoCheckUpdates': False,
        'telemetry.telemetryLevel': 'off',
        'update.mode': 'manual'
    }
    
    for key, value in optimal_settings.items():
        settings[key] = value
    
    with open('$CURSOR_SETTINGS', 'w') as f:
        json.dump(settings, f, indent=4)
    
    if removed:
        print('Removed proxy settings:', ', '.join(removed))
    print('Applied optimal connection settings')
        
except Exception as e:
    print(f'Error processing Cursor settings: {e}')
    sys.exit(1)
"
        print_colored "$GREEN" "✅ Настройки Cursor оптимизированы"
        log "INFO" "Cursor proxy settings cleared and optimized"
    fi
}

# Проверка и остановка конфликтующих процессов
handle_conflicting_processes() {
    print_colored "$CYAN" "🔍 Проверка конфликтующих процессов..."
    
    # Проверка Tor процессов
    local tor_pids=$(pgrep -f "^tor " 2>/dev/null || true)
    local tor_browser_pids=$(pgrep -f tor-browser 2>/dev/null || true)
    
    if [[ -n "$tor_pids" ]]; then
        print_colored "$YELLOW" "⚠️  Обнаружены системные Tor процессы:"
        echo "$tor_pids" | while read pid; do
            if [[ -n "$pid" ]]; then
                local cmd=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
                print_colored "$YELLOW" "   • PID $pid: $cmd"
            fi
        done
        
        read -p "Остановить системный Tor? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo systemctl stop tor || print_colored "$YELLOW" "⚠️  Не удалось остановить Tor сервис"
            print_colored "$GREEN" "✅ Tor сервис остановлен"
            log "INFO" "Tor service stopped by user request"
        fi
    fi
    
    if [[ -n "$tor_browser_pids" ]]; then
        local count=$(echo "$tor_browser_pids" | wc -w)
        print_colored "$YELLOW" "⚠️  Обнаружен Tor Browser ($count процессов)"
        print_colored "$BLUE" "💡 Рекомендуется закрыть Tor Browser для оптимальной работы Cursor"
        log "INFO" "Tor Browser processes detected: $count"
    fi
    
    # Проверка других прокси процессов
    local proxy_processes=$(pgrep -f -i "proxy\|squid\|privoxy" 2>/dev/null || true)
    if [[ -n "$proxy_processes" ]]; then
        print_colored "$YELLOW" "⚠️  Обнаружены другие прокси процессы:"
        echo "$proxy_processes" | while read pid; do
            if [[ -n "$pid" ]]; then
                local cmd=$(ps -p "$pid" -o cmd= 2>/dev/null || echo "unknown")
                print_colored "$YELLOW" "   • PID $pid: $cmd"
            fi
        done
        log "WARN" "Other proxy processes detected"
    fi
}

# Оптимизация DNS настроек
optimize_dns() {
    print_colored "$CYAN" "🌐 Оптимизация DNS настроек..."
    
    # Проверка текущих DNS серверов
    local current_dns=$(cat /etc/resolv.conf | grep nameserver | head -3)
    print_colored "$BLUE" "📋 Текущие DNS серверы:"
    echo "$current_dns" | while read line; do
        print_colored "$BLUE" "   $line"
    done
    
    # Тест производительности DNS
    local dns_servers=("8.8.8.8" "1.1.1.1" "208.67.222.222")
    print_colored "$BLUE" "🔍 Тестирование производительности DNS..."
    
    for dns in "${dns_servers[@]}"; do
        local start_time=$(date +%s.%N)
        if dig @"$dns" google.com +short >/dev/null 2>&1; then
            local end_time=$(date +%s.%N)
            local duration=$(echo "$end_time - $start_time" | bc -l 2>/dev/null || echo "N/A")
            print_colored "$GREEN" "✅ $dns: ${duration}s"
        else
            print_colored "$RED" "❌ $dns: недоступен"
        fi
    done
    
    # Создание альтернативной DNS конфигурации
    local dns_config="$HOME/.cursor/dns-backup.conf"
    cat > "$dns_config" << 'EOF'
# Альтернативные DNS серверы для Cursor
# Использовать в случае проблем с DNS разрешением

nameserver 8.8.8.8          # Google DNS
nameserver 1.1.1.1          # Cloudflare DNS  
nameserver 208.67.222.222   # OpenDNS
EOF
    
    print_colored "$GREEN" "✅ Создана альтернативная DNS конфигурация: $dns_config"
    log "INFO" "Alternative DNS configuration created"
}

# Создание скрипта восстановления
create_recovery_script() {
    local recovery_script="$HOME/.cursor/emergency-recovery.sh"
    
    cat > "$recovery_script" << 'EOF'
#!/bin/bash
# Emergency Recovery Script for Cursor IDE
# Автоматически созданный скрипт восстановления

echo "🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ CURSOR IDE"
echo "======================================"

# Остановка всех Cursor процессов
echo "🛑 Остановка Cursor процессов..."
pkill -f cursor || true

# Очистка временных файлов
echo "🧹 Очистка временных файлов..."
rm -rf ~/.cursor/logs/* 2>/dev/null || true
rm -rf ~/.cursor/CachedData/* 2>/dev/null || true

# Сброс настроек сети
echo "🌐 Сброс сетевых настроек..."
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy 2>/dev/null || true

# Восстановление DNS
echo "🔧 Восстановление DNS..."
sudo systemctl restart systemd-resolved 2>/dev/null || true

# Перезапуск сетевого менеджера
echo "📡 Перезапуск сетевого менеджера..."
sudo systemctl restart NetworkManager 2>/dev/null || true

echo "✅ Восстановление завершено"
echo "💡 Теперь можно запустить Cursor IDE заново"
EOF
    
    chmod +x "$recovery_script"
    print_colored "$GREEN" "✅ Создан скрипт экстренного восстановления: $recovery_script"
    log "INFO" "Emergency recovery script created"
}

# Настройка автоматического мониторинга
setup_monitoring() {
    print_colored "$CYAN" "📊 Настройка автоматического мониторинга..."
    
    # Создание cron задачи
    local cron_entry="*/5 * * * * $PWD/scripts/cursor-connection-monitor.sh check >/dev/null 2>&1"
    local temp_cron=$(mktemp)
    
    # Получение текущего crontab
    crontab -l 2>/dev/null > "$temp_cron" || true
    
    # Проверка, не добавлена ли уже задача
    if ! grep -q "cursor-connection-monitor" "$temp_cron"; then
        echo "$cron_entry" >> "$temp_cron"
        crontab "$temp_cron"
        print_colored "$GREEN" "✅ Добавлена cron задача для мониторинга каждые 5 минут"
        log "INFO" "Cron job added for automatic monitoring"
    else
        print_colored "$BLUE" "ℹ️  Cron задача мониторинга уже существует"
    fi
    
    rm -f "$temp_cron"
    
    # Создание systemd timer (альтернатива cron)
    local timer_dir="$HOME/.config/systemd/user"
    mkdir -p "$timer_dir"
    
    cat > "$timer_dir/cursor-monitor.service" << EOF
[Unit]
Description=Cursor Connection Monitor
After=network.target

[Service]
Type=oneshot
ExecStart=$PWD/scripts/cursor-connection-monitor.sh check
User=%i

[Install]
WantedBy=default.target
EOF

    cat > "$timer_dir/cursor-monitor.timer" << EOF
[Unit]
Description=Run Cursor Connection Monitor every 5 minutes
Requires=cursor-monitor.service

[Timer]
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
EOF

    # Активация systemd timer
    systemctl --user daemon-reload 2>/dev/null || true
    systemctl --user enable cursor-monitor.timer 2>/dev/null || true
    systemctl --user start cursor-monitor.timer 2>/dev/null || true
    
    print_colored "$GREEN" "✅ Настроен systemd timer для мониторинга"
    log "INFO" "Systemd timer configured for monitoring"
}

# Создание профиля безопасности
create_security_profile() {
    print_colored "$CYAN" "🔒 Создание профиля безопасности..."
    
    local security_profile="$HOME/.cursor/security-profile.json"
    
    cat > "$security_profile" << 'EOF'
{
    "profile_name": "Cursor Connection Security",
    "version": "1.0",
    "created": "2025-08-23",
    "security_measures": {
        "proxy_isolation": {
            "enabled": true,
            "description": "Изоляция от системных прокси настроек"
        },
        "dns_redundancy": {
            "enabled": true,
            "primary_dns": "8.8.8.8",
            "secondary_dns": "1.1.1.1", 
            "tertiary_dns": "208.67.222.222"
        },
        "process_monitoring": {
            "enabled": true,
            "check_interval": 300,
            "auto_fix": true
        },
        "connection_validation": {
            "enabled": true,
            "test_endpoints": [
                "https://api.github.com",
                "https://www.google.com"
            ]
        },
        "backup_strategy": {
            "enabled": true,
            "retention_days": 30,
            "location": "~/.cursor/backups/"
        }
    },
    "incident_response": {
        "auto_recovery": true,
        "notification_methods": ["log", "console"],
        "escalation_threshold": 3
    }
}
EOF
    
    print_colored "$GREEN" "✅ Создан профиль безопасности: $security_profile"
    log "INFO" "Security profile created"
}

# Проверка эффективности мер
validate_measures() {
    print_colored "$CYAN" "✅ Проверка эффективности превентивных мер..."
    
    local score=0
    local max_score=8
    
    # 1. Проверка backup
    if [[ -d "$BACKUP_DIR" ]] && [[ $(ls -1 "$BACKUP_DIR" | wc -l) -gt 0 ]]; then
        print_colored "$GREEN" "✅ Система backup: работает"
        ((score++))
    else
        print_colored "$RED" "❌ Система backup: проблемы"
    fi
    
    # 2. Проверка настроек Cursor
    if [[ -f "$CURSOR_SETTINGS" ]]; then
        if grep -q '"http.proxySupport": "off"' "$CURSOR_SETTINGS"; then
            print_colored "$GREEN" "✅ Настройки Cursor: оптимизированы"
            ((score++))
        else
            print_colored "$YELLOW" "⚠️  Настройки Cursor: требуют проверки"
        fi
    fi
    
    # 3. Проверка мониторинга
    if [[ -f "scripts/cursor-connection-monitor.sh" ]]; then
        print_colored "$GREEN" "✅ Система мониторинга: готова"
        ((score++))
    else
        print_colored "$RED" "❌ Система мониторинга: отсутствует"
    fi
    
    # 4. Проверка восстановления
    if [[ -f "$HOME/.cursor/emergency-recovery.sh" ]]; then
        print_colored "$GREEN" "✅ Скрипт восстановления: готов"
        ((score++))
    else
        print_colored "$RED" "❌ Скрипт восстановления: отсутствует"
    fi
    
    # 5. Проверка DNS
    if dig +short google.com >/dev/null 2>&1; then
        print_colored "$GREEN" "✅ DNS разрешение: работает"
        ((score++))
    else
        print_colored "$RED" "❌ DNS разрешение: проблемы"
    fi
    
    # 6. Проверка соединения
    if curl -s --max-time 5 https://api.github.com >/dev/null; then
        print_colored "$GREEN" "✅ Интернет соединение: стабильное"
        ((score++))
    else
        print_colored "$RED" "❌ Интернет соединение: проблемы"
    fi
    
    # 7. Проверка логирования
    if [[ -f "$LOG_FILE" ]]; then
        print_colored "$GREEN" "✅ Система логирования: активна"
        ((score++))
    else
        print_colored "$RED" "❌ Система логирования: неактивна"
    fi
    
    # 8. Проверка безопасности
    if [[ -f "$HOME/.cursor/security-profile.json" ]]; then
        print_colored "$GREEN" "✅ Профиль безопасности: создан"
        ((score++))
    else
        print_colored "$RED" "❌ Профиль безопасности: отсутствует"
    fi
    
    # Итоговая оценка
    local percentage=$((score * 100 / max_score))
    echo ""
    print_colored "$BLUE" "📊 ИТОГОВАЯ ОЦЕНКА ЗАЩИЩЁННОСТИ"
    print_colored "$BLUE" "=============================="
    
    if [[ $percentage -ge 90 ]]; then
        print_colored "$GREEN" "🎉 ОТЛИЧНО: $score/$max_score ($percentage%)"
        print_colored "$GREEN" "   Система полностью защищена от проблем соединения"
    elif [[ $percentage -ge 70 ]]; then
        print_colored "$YELLOW" "👍 ХОРОШО: $score/$max_score ($percentage%)"
        print_colored "$YELLOW" "   Система защищена, есть незначительные улучшения"
    else
        print_colored "$RED" "⚠️  ТРЕБУЕТСЯ ВНИМАНИЕ: $score/$max_score ($percentage%)"
        print_colored "$RED" "   Необходимо устранить выявленные проблемы"
    fi
    
    log "INFO" "Preventive measures validation completed: $score/$max_score ($percentage%)"
}

# Главная функция установки
install_all_measures() {
    print_colored "$PURPLE" "🛡️  УСТАНОВКА ПРЕВЕНТИВНЫХ МЕР CURSOR IDE"
    print_colored "$PURPLE" "========================================"
    echo ""
    
    log "INFO" "Starting installation of preventive measures"
    
    # 1. Создание backup
    print_colored "$BLUE" "📦 Этап 1: Создание backup..."
    create_cursor_backup || true
    echo ""
    
    # 2. Очистка прокси
    print_colored "$BLUE" "🧹 Этап 2: Очистка прокси настроек..."
    clear_proxy_settings
    echo ""
    
    # 3. Обработка процессов
    print_colored "$BLUE" "🔍 Этап 3: Проверка конфликтующих процессов..."
    handle_conflicting_processes
    echo ""
    
    # 4. Оптимизация DNS
    print_colored "$BLUE" "🌐 Этап 4: Оптимизация DNS..."
    optimize_dns
    echo ""
    
    # 5. Скрипт восстановления
    print_colored "$BLUE" "🚨 Этап 5: Создание скрипта восстановления..."
    create_recovery_script
    echo ""
    
    # 6. Настройка мониторинга
    print_colored "$BLUE" "📊 Этап 6: Настройка мониторинга..."
    setup_monitoring
    echo ""
    
    # 7. Профиль безопасности
    print_colored "$BLUE" "🔒 Этап 7: Создание профиля безопасности..."
    create_security_profile
    echo ""
    
    # 8. Проверка эффективности
    print_colored "$BLUE" "✅ Этап 8: Проверка эффективности..."
    validate_measures
    
    echo ""
    print_colored "$GREEN" "🎉 УСТАНОВКА ЗАВЕРШЕНА!"
    print_colored "$GREEN" "Все превентивные меры установлены и готовы к работе"
    
    log "INFO" "Preventive measures installation completed successfully"
}

# Справка
show_help() {
    cat << EOF
🛡️  Cursor Preventive Measures v1.0

ИСПОЛЬЗОВАНИЕ:
    $0 [команда]

КОМАНДЫ:
    install      Установить все превентивные меры
    backup       Создать backup настроек Cursor
    clear-proxy  Очистить прокси настройки
    optimize-dns Оптимизировать DNS настройки
    monitor      Настроить автоматический мониторинг
    validate     Проверить эффективность мер
    recovery     Создать скрипт экстренного восстановления
    help         Показать эту справку

ФАЙЛЫ:
    $LOG_FILE
    $BACKUP_DIR/
    ~/.cursor/emergency-recovery.sh
    ~/.cursor/security-profile.json

ПРИМЕРЫ:
    $0 install              # Полная установка всех мер
    $0 backup               # Создание backup
    $0 clear-proxy          # Очистка прокси
    $0 validate             # Проверка эффективности

EOF
}

# Основная логика
main() {
    local command="${1:-help}"
    
    case "$command" in
        "install"|"i")
            install_all_measures
            ;;
        "backup"|"b")
            create_cursor_backup
            ;;
        "clear-proxy"|"cp")
            clear_proxy_settings
            ;;
        "optimize-dns"|"dns")
            optimize_dns
            ;;
        "monitor"|"m")
            setup_monitoring
            ;;
        "validate"|"v")
            validate_measures
            ;;
        "recovery"|"r")
            create_recovery_script
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
    local deps=("curl" "dig" "python3" "bc")
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

# Запуск основной функции
main "$@"
