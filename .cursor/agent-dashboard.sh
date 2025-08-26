#!/bin/bash

# 🎛️ CURSOR AGENT DASHBOARD
# Интерактивная панель управления агентами
# Версия: 1.0

set -euo pipefail

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

show_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                   🤖 CURSOR AGENT DASHBOARD                    ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC} Проект: ${GREEN}Bhagavad Gita 1972 Reprint${NC}                        ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC} Время:  ${YELLOW}$(date '+%d.%m.%Y %H:%M:%S')${NC}                              ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo
}

show_quick_status() {
    echo -e "${BLUE}📊 БЫСТРЫЙ СТАТУС:${NC}"
    
    # API статус
    if curl -s --max-time 3 "https://api.gita-1972-reprint.ru/api/status" > /dev/null; then
        echo -e "   API: ${GREEN}✅ Работает${NC}"
    else
        echo -e "   API: ${RED}❌ Недоступен${NC}"
    fi
    
    # Конфигурации
    local configs=$(ls .cursor/*.json 2>/dev/null | wc -l)
    echo -e "   Конфигурации: ${GREEN}$configs файлов${NC}"
    
    # Последняя синхронизация
    if [[ -f ".cursor/sync-status.log" ]]; then
        local last_sync=$(stat -c %Y .cursor/sync-status.log)
        local current_time=$(date +%s)
        local hours=$(( (current_time - last_sync) / 3600 ))
        
        if [[ $hours -lt 6 ]]; then
            echo -e "   Синхронизация: ${GREEN}$hours ч. назад${NC}"
        else
            echo -e "   Синхронизация: ${YELLOW}$hours ч. назад${NC}"
        fi
    else
        echo -e "   Синхронизация: ${RED}Нет данных${NC}"
    fi
    
    echo
}

show_menu() {
    echo -e "${PURPLE}🎛️ УПРАВЛЕНИЕ:${NC}"
    echo -e "   ${CYAN}1)${NC} 🔍 Полный мониторинг агентов"
    echo -e "   ${CYAN}2)${NC} ⚙️ Показать настройки агентов"
    echo -e "   ${CYAN}3)${NC} 🎯 Показать приоритеты"
    echo -e "   ${CYAN}4)${NC} 🧠 Статус Memory Bank"
    echo -e "   ${CYAN}5)${NC} 🔄 Принудительная синхронизация"
    echo -e "   ${CYAN}6)${NC} 📝 Обновить приоритеты"
    echo -e "   ${CYAN}7)${NC} 🌐 Проверить все сервисы"
    echo -e "   ${CYAN}8)${NC} 📊 Создать отчет"
    echo -e "   ${CYAN}9)${NC} 🧹 Очистить старые логи"
    echo -e "   ${CYAN}0)${NC} ❌ Выход"
    echo
    echo -n "Выберите действие: "
}

run_full_monitoring() {
    echo -e "${BLUE}🔍 Запуск полного мониторинга...${NC}"
    ./scripts/agent-monitor.sh
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

show_agent_settings() {
    echo -e "${BLUE}⚙️ НАСТРОЙКИ АГЕНТОВ:${NC}"
    echo
    if [[ -f ".cursor/settings.json" ]]; then
        echo "📋 Ключевые настройки:"
        grep -A 5 -B 1 "background\|memory" .cursor/settings.json | head -20
    else
        echo -e "${RED}❌ Файл настроек не найден${NC}"
    fi
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

show_priorities() {
    echo -e "${BLUE}🎯 ПРИОРИТЕТЫ АГЕНТОВ:${NC}"
    echo
    if [[ -f ".cursor/rules/agent-priorities.mdc" ]]; then
        echo "📋 Критические приоритеты:"
        grep -A 10 "КРИТИЧЕСКИЙ ПРИОРИТЕТ" .cursor/rules/agent-priorities.mdc
    else
        echo -e "${RED}❌ Файл приоритетов не найден${NC}"
    fi
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

show_memory_bank_status() {
    echo -e "${BLUE}🧠 MEMORY BANK STATUS:${NC}"
    echo
    local memory_files=$(find .cursor/memory-bank/ -name "*.md" 2>/dev/null | wc -l)
    echo "📁 Файлов в Memory Bank: $memory_files"
    echo
    if [[ $memory_files -gt 0 ]]; then
        echo "📋 Содержимое:"
        find .cursor/memory-bank/ -name "*.md" -exec basename {} \; | sort
    fi
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

force_sync() {
    echo -e "${BLUE}🔄 Принудительная синхронизация...${NC}"
    
    # Обновляем лог синхронизации
    echo "Forced sync initiated at $(date)" >> .cursor/sync-status.log
    
    # Проверяем все критические компоненты
    echo "✅ Проверка API..."
    curl -s "https://api.gita-1972-reprint.ru/api/status" > /dev/null && echo "API OK" || echo "API FAILED"
    
    echo "✅ Проверка конфигураций..."
    test -f ".cursor/settings.json" && echo "Settings OK" || echo "Settings MISSING"
    
    echo "✅ Обновление статуса..."
    echo "Forced sync completed at $(date)" >> .cursor/sync-status.log
    
    echo -e "${GREEN}✅ Синхронизация завершена${NC}"
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

update_priorities() {
    echo -e "${BLUE}📝 Обновление приоритетов...${NC}"
    echo
    echo "Текущие критические приоритеты:"
    if [[ -f ".cursor/rules/agent-priorities.mdc" ]]; then
        grep -A 5 "КРИТИЧЕСКИЙ ПРИОРИТЕТ" .cursor/rules/agent-priorities.mdc | head -10
        echo
        echo "Хотите редактировать файл приоритетов? (y/N)"
        read -n 1 answer
        if [[ $answer == "y" || $answer == "Y" ]]; then
            ${EDITOR:-nano} .cursor/rules/agent-priorities.mdc
            echo -e "${GREEN}✅ Приоритеты обновлены${NC}"
        fi
    else
        echo -e "${RED}❌ Файл приоритетов не найден${NC}"
    fi
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

check_all_services() {
    echo -e "${BLUE}🌐 ПРОВЕРКА ВСЕХ СЕРВИСОВ:${NC}"
    echo
    
    local services=(
        "https://api.gita-1972-reprint.ru/api/status|API"
        "https://gita-1972-reprint.ru/|Основной сайт"
        "https://egorKara.github.io/bhagavad-gita-reprint/|GitHub Pages"
    )
    
    for service in "${services[@]}"; do
        IFS='|' read -r url name <<< "$service"
        echo -n "Проверяю $name... "
        if curl -s --max-time 5 "$url" > /dev/null; then
            echo -e "${GREEN}✅ OK${NC}"
        else
            echo -e "${RED}❌ FAILED${NC}"
        fi
    done
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

create_report() {
    echo -e "${BLUE}📊 Создание отчета...${NC}"
    
    local report_file=".cursor/dashboard-report-$(date +%Y%m%d-%H%M%S).log"
    
    {
        echo "=== CURSOR AGENT DASHBOARD REPORT ==="
        echo "Время создания: $(date)"
        echo "Проект: Bhagavad Gita 1972 Reprint"
        echo
        
        echo "КОНФИГУРАЦИИ:"
        ls -la .cursor/*.json 2>/dev/null || echo "Нет JSON конфигураций"
        echo
        
        echo "ПРИОРИТЕТЫ:"
        test -f ".cursor/rules/agent-priorities.mdc" && echo "Файл приоритетов найден" || echo "Файл приоритетов отсутствует"
        echo
        
        echo "СИНХРОНИЗАЦИЯ:"
        tail -3 .cursor/sync-status.log 2>/dev/null || echo "Нет логов синхронизации"
        echo
        
        echo "СЕРВИСЫ:"
        curl -s --max-time 3 "https://api.gita-1972-reprint.ru/api/status" > /dev/null && echo "API: OK" || echo "API: FAILED"
        curl -s --max-time 3 "https://gita-1972-reprint.ru/" > /dev/null && echo "Site: OK" || echo "Site: FAILED"
        
    } > "$report_file"
    
    echo -e "${GREEN}✅ Отчет создан: $report_file${NC}"
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

cleanup_logs() {
    echo -e "${BLUE}🧹 Очистка старых логов...${NC}"
    echo
    
    # Архивируем старые логи (старше 7 дней)
    find .cursor/ -name "*.log" -mtime +7 -exec ls -la {} \;
    
    echo "Найдены старые логи (>7 дней). Удалить их? (y/N)"
    read -n 1 answer
    if [[ $answer == "y" || $answer == "Y" ]]; then
        find .cursor/ -name "*.log" -mtime +7 -delete
        echo -e "${GREEN}✅ Старые логи удалены${NC}"
    else
        echo "Очистка отменена"
    fi
    echo
    echo "Нажмите Enter для продолжения..."
    read
}

main() {
    while true; do
        show_header
        show_quick_status
        show_menu
        
        read choice
        
        case $choice in
            1) run_full_monitoring ;;
            2) show_agent_settings ;;
            3) show_priorities ;;
            4) show_memory_bank_status ;;
            5) force_sync ;;
            6) update_priorities ;;
            7) check_all_services ;;
            8) create_report ;;
            9) cleanup_logs ;;
            0) echo -e "${GREEN}👋 До свидания!${NC}"; exit 0 ;;
            *) echo -e "${RED}❌ Неверный выбор${NC}"; sleep 2 ;;
        esac
    done
}

# Запуск только если скрипт выполняется напрямую
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
