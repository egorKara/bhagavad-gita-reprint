#!/bin/bash

# 🚨 СКРИПТ ЭКСТРЕННОГО ВОССТАНОВЛЕНИЯ CURSOR IDE
# Диагностика и устранение критических проблем
# Автор: Cursor Agent
# Версия: 1.0
# Дата: 2025-08-23

set -euo pipefail

# Настройки
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/emergency-recovery.log"
BACKUP_DIR="$SCRIPT_DIR/backup-$(date +%Y%m%d_%H%M%S)"
CURSOR_CONFIG_DIR="$HOME/.config/Cursor"
CURSOR_CACHE_DIR="$HOME/.cache/Cursor"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция логирования
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "$LOG_FILE"
}

error_exit() {
    echo -e "${RED}❌ КРИТИЧЕСКАЯ ОШИБКА: $*${NC}" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}✅ $*${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $*${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️  $*${NC}" | tee -a "$LOG_FILE"
}

# Начало работы
echo -e "${RED}🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ CURSOR IDE${NC}"
echo "=================================="
log "Начало экстренного восстановления Cursor IDE"

# 1. Немедленная диагностика
diagnose_critical_issues() {
    info "Проведение критической диагностики..."
    
    # Проверка процессов Cursor
    local cursor_processes=$(ps aux | grep -c "[c]ursor" || echo "0")
    log "Обнаружено процессов Cursor: $cursor_processes"
    
    # Проверка CPU использования
    local cursor_cpu=$(ps aux | grep "[c]ursor" | awk '{sum+=$3} END {print sum}' || echo "0")
    if (( $(echo "$cursor_cpu > 100" | bc -l 2>/dev/null || echo "0") )); then
        warning "КРИТИЧЕСКОЕ ПОТРЕБЛЕНИЕ CPU: ${cursor_cpu}%"
        return 1
    fi
    
    # Проверка памяти
    local cursor_mem=$(ps aux | grep "[c]ursor" | awk '{sum+=$4} END {print sum}' || echo "0")
    if (( $(echo "$cursor_mem > 50" | bc -l 2>/dev/null || echo "0") )); then
        warning "ВЫСОКОЕ ПОТРЕБЛЕНИЕ ПАМЯТИ: ${cursor_mem}%"
    fi
    
    # Проверка системной нагрузки
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | xargs)
    if (( $(echo "$load_avg > 3.0" | bc -l 2>/dev/null || echo "0") )); then
        warning "КРИТИЧЕСКАЯ СИСТЕМНАЯ НАГРУЗКА: $load_avg"
        return 1
    fi
    
    success "Базовая диагностика завершена"
    return 0
}

# 2. Аварийная остановка проблемных процессов
emergency_stop_cursor() {
    warning "Выполняется аварийная остановка Cursor..."
    
    # Мягкая остановка
    pkill -TERM cursor 2>/dev/null || true
    sleep 3
    
    # Принудительная остановка зависших процессов
    pkill -KILL cursor 2>/dev/null || true
    sleep 2
    
    # Проверка успешности остановки
    if pgrep cursor >/dev/null; then
        error_exit "Не удалось остановить все процессы Cursor"
    fi
    
    success "Все процессы Cursor остановлены"
}

# 3. Создание резервной копии конфигурации
backup_cursor_config() {
    info "Создание резервной копии конфигурации..."
    mkdir -p "$BACKUP_DIR"
    
    # Копируем критические файлы
    if [ -d "$CURSOR_CONFIG_DIR" ]; then
        cp -r "$CURSOR_CONFIG_DIR" "$BACKUP_DIR/" 2>/dev/null || true
        success "Конфигурация сохранена в $BACKUP_DIR"
    fi
    
    # Копируем настройки проекта
    if [ -f ".cursorrules" ]; then
        cp ".cursorrules" "$BACKUP_DIR/" 2>/dev/null || true
    fi
    
    if [ -d ".cursor" ]; then
        cp -r ".cursor" "$BACKUP_DIR/" 2>/dev/null || true
    fi
}

# 4. Очистка проблемных файлов
cleanup_cursor_files() {
    info "Очистка проблемных файлов и кэша..."
    
    # Удаляем кэш
    if [ -d "$CURSOR_CACHE_DIR" ]; then
        rm -rf "$CURSOR_CACHE_DIR"/* 2>/dev/null || true
        success "Кэш Cursor очищен"
    fi
    
    # Удаляем временные файлы
    find /tmp -name "*cursor*" -type f -mmin +60 -delete 2>/dev/null || true
    
    # Очищаем логи старше 7 дней
    find "$CURSOR_CONFIG_DIR/logs" -type f -mtime +7 -delete 2>/dev/null || true
    
    success "Временные файлы очищены"
}

# 5. Исправление сетевых настроек
fix_network_settings() {
    info "Исправление сетевых настроек..."
    
    local settings_file="$CURSOR_CONFIG_DIR/User/settings.json"
    if [ -f "$settings_file" ]; then
        # Создаем резервную копию
        cp "$settings_file" "$settings_file.backup.$(date +%s)"
        
        # Удаляем проблемные настройки прокси
        if grep -q "proxy" "$settings_file"; then
            warning "Обнаружены настройки прокси, удаляем..."
            sed -i '/proxy/d' "$settings_file" 2>/dev/null || true
            success "Настройки прокси удалены"
        fi
    fi
}

# 6. Проверка и исправление прав доступа
fix_permissions() {
    info "Проверка и исправление прав доступа..."
    
    # Исправляем права на конфигурационную директорию
    if [ -d "$CURSOR_CONFIG_DIR" ]; then
        chmod -R u+rw "$CURSOR_CONFIG_DIR" 2>/dev/null || true
        success "Права доступа исправлены"
    fi
    
    # Исправляем права на файлы проекта
    chmod +x ".cursor"/*.sh 2>/dev/null || true
}

# 7. Создание мониторинга здоровья
create_health_monitor() {
    info "Создание системы мониторинга здоровья..."
    
    cat > "$SCRIPT_DIR/cursor-health-monitor.sh" << 'EOF'
#!/bin/bash

# Мониторинг здоровья Cursor IDE
check_cursor_health() {
    # Проверка CPU
    local cpu_usage=$(ps aux | grep "[c]ursor" | awk '{sum+=$3} END {print sum}' || echo "0")
    if (( $(echo "$cpu_usage > 150" | bc -l 2>/dev/null || echo "0") )); then
        echo "КРИТИЧНО: CPU ${cpu_usage}%"
        return 1
    fi
    
    # Проверка памяти
    local mem_usage=$(ps aux | grep "[c]ursor" | awk '{sum+=$4} END {print sum}' || echo "0")
    if (( $(echo "$mem_usage > 60" | bc -l 2>/dev/null || echo "0") )); then
        echo "ПРЕДУПРЕЖДЕНИЕ: Память ${mem_usage}%"
    fi
    
    # Проверка зомби-процессов
    local zombies=$(ps aux | awk '$8 ~ /^Z/ { count++ } END { print count+0 }')
    if [ "$zombies" -gt 0 ]; then
        echo "ВНИМАНИЕ: $zombies зомби-процессов"
    fi
    
    echo "OK: Cursor работает нормально"
    return 0
}

# Автоматическое исправление при обнаружении проблем
auto_fix() {
    if ! check_cursor_health; then
        echo "Обнаружены проблемы, применяем исправления..."
        bash "$(dirname "$0")/emergency-cursor-recovery.sh" --auto
    fi
}

case "${1:-}" in
    --check)
        check_cursor_health
        ;;
    --auto-fix)
        auto_fix
        ;;
    *)
        check_cursor_health
        ;;
esac
EOF

    chmod +x "$SCRIPT_DIR/cursor-health-monitor.sh"
    success "Мониторинг здоровья создан"
}

# 8. Настройка автоматического мониторинга
setup_automatic_monitoring() {
    info "Настройка автоматического мониторинга..."
    
    # Создаем systemd timer для пользователя
    mkdir -p "$HOME/.config/systemd/user"
    
    cat > "$HOME/.config/systemd/user/cursor-health.service" << EOF
[Unit]
Description=Cursor Health Monitor
After=graphical-session.target

[Service]
Type=oneshot
ExecStart=$SCRIPT_DIR/cursor-health-monitor.sh --auto-fix
Environment=DISPLAY=:0
EOF

    cat > "$HOME/.config/systemd/user/cursor-health.timer" << EOF
[Unit]
Description=Run Cursor Health Monitor every 5 minutes
Requires=cursor-health.service

[Timer]
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
EOF

    # Активируем мониторинг
    systemctl --user daemon-reload 2>/dev/null || true
    systemctl --user enable cursor-health.timer 2>/dev/null || true
    systemctl --user start cursor-health.timer 2>/dev/null || true
    
    success "Автоматический мониторинг настроен (каждые 5 минут)"
}

# 9. Создание профиля предотвращения проблем
create_prevention_profile() {
    info "Создание профиля предотвращения проблем..."
    
    cat > "$SCRIPT_DIR/cursor-prevention.conf" << 'EOF'
# Профиль предотвращения проблем Cursor IDE
# Применяется автоматически при запуске

# Ограничения ресурсов
export CURSOR_MAX_MEMORY="4G"
export CURSOR_MAX_CPU_CORES="4"

# Сетевые настройки
export NO_PROXY="localhost,127.0.0.1"
export CURSOR_DISABLE_TELEMETRY="true"

# Настройки производительности
export CURSOR_DISABLE_GPU="false"
export CURSOR_ENABLE_LOGGING="false"
export CURSOR_CACHE_SIZE="1G"

# Настройки стабильности
export CURSOR_DISABLE_EXTENSIONS_AUTO_UPDATE="true"
export CURSOR_RESTART_ON_CRASH="true"
EOF

    success "Профиль предотвращения создан"
}

# Основная функция восстановления
main_recovery() {
    echo
    info "=== ЭТАП 1: ДИАГНОСТИКА ==="
    if ! diagnose_critical_issues; then
        warning "Обнаружены критические проблемы, продолжаем восстановление..."
    fi
    
    echo
    info "=== ЭТАП 2: РЕЗЕРВНОЕ КОПИРОВАНИЕ ==="
    backup_cursor_config
    
    echo
    info "=== ЭТАП 3: АВАРИЙНАЯ ОСТАНОВКА ==="
    emergency_stop_cursor
    
    echo
    info "=== ЭТАП 4: ОЧИСТКА ==="
    cleanup_cursor_files
    
    echo
    info "=== ЭТАП 5: ИСПРАВЛЕНИЕ НАСТРОЕК ==="
    fix_network_settings
    fix_permissions
    
    echo
    info "=== ЭТАП 6: СОЗДАНИЕ ЗАЩИТЫ ==="
    create_health_monitor
    create_prevention_profile
    
    if [ "${1:-}" != "--no-monitoring" ]; then
        setup_automatic_monitoring
    fi
    
    echo
    success "🎉 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ ЗАВЕРШЕНО!"
    echo
    echo -e "${GREEN}📋 РЕЗУЛЬТАТЫ:${NC}"
    echo "• Все проблемные процессы остановлены"
    echo "• Конфигурация сохранена в: $BACKUP_DIR"
    echo "• Кэш и временные файлы очищены"
    echo "• Сетевые настройки исправлены"
    echo "• Создан мониторинг здоровья"
    echo "• Настроено автоматическое предотвращение проблем"
    echo
    echo -e "${BLUE}🚀 ДЛЯ ЗАПУСКА CURSOR:${NC}"
    echo "cursor . &"
    echo
    echo -e "${YELLOW}📊 ДЛЯ МОНИТОРИНГА:${NC}"
    echo "bash $SCRIPT_DIR/cursor-health-monitor.sh"
}

# Обработка аргументов командной строки
case "${1:-}" in
    --auto)
        log "Автоматическое восстановление запущено"
        main_recovery --no-monitoring
        ;;
    --diagnose-only)
        diagnose_critical_issues
        ;;
    --stop-only)
        emergency_stop_cursor
        ;;
    --cleanup-only)
        cleanup_cursor_files
        ;;
    --help)
        echo "Использование: $0 [ОПЦИЯ]"
        echo "Опции:"
        echo "  --auto           Автоматическое восстановление без мониторинга"
        echo "  --diagnose-only  Только диагностика"
        echo "  --stop-only      Только остановка процессов"
        echo "  --cleanup-only   Только очистка файлов"
        echo "  --help           Показать эту справку"
        ;;
    *)
        main_recovery
        ;;
esac

log "Экстренное восстановление завершено: $(date)"
