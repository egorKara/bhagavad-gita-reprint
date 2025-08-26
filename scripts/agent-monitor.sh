#!/bin/bash

# 🤖 AGENT MONITORING SCRIPT
# Проверка состояния и активности Cursor агентов
# Версия: 1.0
# Дата: 26 августа 2025

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Логирование
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

# Проверка наличия Cursor конфигураций
check_cursor_configs() {
    log_info "🔍 Проверка конфигураций Cursor..."
    
    local configs=(
        ".cursor/settings.json"
        ".cursor/environment.json"
        ".cursor/rules/agent-priorities.mdc"
        ".cursor/sync-status.log"
    )
    
    for config in "${configs[@]}"; do
        if [[ -f "$config" ]]; then
            log_success "✅ $config найден"
        else
            log_warning "⚠️ $config отсутствует"
        fi
    done
}

# Проверка статуса агентов
check_agent_status() {
    log_info "🤖 Проверка статуса агентов..."
    
    if [[ -f ".cursor/sync-status.log" ]]; then
        echo "📋 Последняя синхронизация:"
        tail -5 .cursor/sync-status.log
        echo
        
        # Проверка давности последней синхронизации
        local last_sync=$(stat -c %Y .cursor/sync-status.log 2>/dev/null || echo 0)
        local current_time=$(date +%s)
        local diff=$((current_time - last_sync))
        local hours=$((diff / 3600))
        
        if [[ $hours -lt 24 ]]; then
            log_success "✅ Синхронизация актуальна ($hours часов назад)"
        else
            log_warning "⚠️ Синхронизация устарела ($hours часов назад)"
        fi
    else
        log_error "❌ Лог синхронизации не найден"
    fi
}

# Проверка приоритетов агентов
check_agent_priorities() {
    log_info "🎯 Проверка приоритетов агентов..."
    
    if [[ -f ".cursor/rules/agent-priorities.mdc" ]]; then
        echo "📋 Активные приоритеты:"
        grep -A 10 "КРИТИЧЕСКИЙ ПРИОРИТЕТ" .cursor/rules/agent-priorities.mdc | head -15
        echo
        log_success "✅ Приоритеты загружены"
    else
        log_error "❌ Файл приоритетов не найден"
    fi
}

# Проверка Memory Bank
check_memory_bank() {
    log_info "🧠 Проверка Memory Bank..."
    
    local memory_files=$(find .cursor/memory-bank/ -name "*.md" 2>/dev/null | wc -l)
    
    if [[ $memory_files -gt 0 ]]; then
        log_success "✅ Memory Bank: $memory_files файлов"
        
        # Показать последние обновления
        echo "📋 Последние обновления Memory Bank:"
        find .cursor/memory-bank/ -name "*.md" -exec ls -la {} \; | head -5
        echo
    else
        log_warning "⚠️ Memory Bank пуст или не найден"
    fi
}

# Проверка API и сервисов (как делают агенты)
check_services() {
    log_info "🌐 Проверка сервисов (как агенты)..."
    
    # API проверка
    if curl -s --max-time 5 "https://api.gita-1972-reprint.ru/api/status" > /dev/null; then
        log_success "✅ API доступен"
    else
        log_error "❌ API недоступен"
    fi
    
    # Основной сайт
    if curl -s --max-time 5 "https://gita-1972-reprint.ru/" > /dev/null; then
        log_success "✅ Основной сайт доступен"
    else
        log_error "❌ Основной сайт недоступен"
    fi
}

# Проверка автоматизации GitHub
check_github_automation() {
    log_info "🔄 Проверка GitHub автоматизации..."
    
    if [[ -f ".github/workflows/sync-project-todo.yml" ]]; then
        log_success "✅ Workflow синхронизации TODO найден"
        
        # Проверка последних запусков (если есть git log)
        if git log --oneline -n 5 --grep="sync" &>/dev/null; then
            echo "📋 Последние sync коммиты:"
            git log --oneline -n 3 --grep="sync" || echo "Нет sync коммитов"
        fi
    else
        log_warning "⚠️ GitHub workflow не найден"
    fi
}

# Генерация отчета
generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local report_file=".cursor/agent-monitor-report.log"
    
    {
        echo "=== AGENT MONITOR REPORT ==="
        echo "Время: $timestamp"
        echo "Хост: $(hostname)"
        echo "Директория: $(pwd)"
        echo
        echo "СТАТУС КОМПОНЕНТОВ:"
        echo "- Конфигурации: $(ls .cursor/*.json 2>/dev/null | wc -l) файлов"
        echo "- Memory Bank: $(find .cursor/memory-bank/ -name "*.md" 2>/dev/null | wc -l) файлов"
        echo "- Приоритеты: $(test -f .cursor/rules/agent-priorities.mdc && echo "OK" || echo "MISSING")"
        echo "- Последняя синхронизация: $(test -f .cursor/sync-status.log && stat -c %y .cursor/sync-status.log || echo "НЕТ ДАННЫХ")"
        echo
    } > "$report_file"
    
    log_success "📊 Отчет сохранен: $report_file"
}

# Основная функция
main() {
    echo "🤖 CURSOR AGENT MONITOR"
    echo "======================="
    echo "Дата: $(date)"
    echo "Проект: Bhagavad Gita 1972 Reprint"
    echo
    
    check_cursor_configs
    echo
    
    check_agent_status
    echo
    
    check_agent_priorities
    echo
    
    check_memory_bank
    echo
    
    check_services
    echo
    
    check_github_automation
    echo
    
    generate_report
    
    echo
    log_info "🎯 Мониторинг завершен"
    echo "💡 Для детального анализа смотрите: .cursor/agent-monitor-report.log"
}

# Запуск
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
