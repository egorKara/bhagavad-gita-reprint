#!/bin/bash

# Экстренное восстановление API сервера Gita 1972
# Диагностика и исправление ошибки 502 Bad Gateway

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

PROJECT_DIR="/var/www/gita-1972-reprint"
LOG_FILE="/var/log/api-emergency-fix.log"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

header() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${WHITE}                  ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ API                   ${BLUE}║${NC}"
    echo -e "${BLUE}║${CYAN}                      Gita 1972 Project                          ${BLUE}║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Диагностика системы
diagnose_system() {
    log "=== НАЧАЛО ДИАГНОСТИКИ ==="
    echo -e "${WHITE}🔍 ДИАГНОСТИКА СИСТЕМЫ${NC}"
    echo -e "${BLUE}═══════════════════════${NC}"
    
    # 1. Проверка доступности сервера
    echo -e "${CYAN}1️⃣ Проверка доступности сервера...${NC}"
    if ping -c 1 gita-1972-reprint.ru &>/dev/null; then
        echo -e "${GREEN}✅ Основной домен доступен${NC}"
    else
        echo -e "${RED}❌ Основной домен недоступен${NC}"
    fi
    
    if ping -c 1 api.gita-1972-reprint.ru &>/dev/null; then
        echo -e "${GREEN}✅ API домен доступен${NC}"
    else
        echo -e "${RED}❌ API домен недоступен${NC}"
    fi
    
    # 2. Статус сервисов
    echo -e "${CYAN}2️⃣ Проверка сервисов...${NC}"
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx: РАБОТАЕТ${NC}"
    else
        echo -e "${RED}❌ Nginx: ОСТАНОВЛЕН${NC}"
    fi
    
    if systemctl is-active --quiet gita-api 2>/dev/null; then
        echo -e "${GREEN}✅ API Service: РАБОТАЕТ${NC}"
    else
        echo -e "${RED}❌ API Service: НЕ НАЙДЕН ИЛИ ОСТАНОВЛЕН${NC}"
    fi
    
    # 3. Проверка портов
    echo -e "${CYAN}3️⃣ Проверка портов...${NC}"
    
    if ss -tulpn | grep -q ":80 "; then
        echo -e "${GREEN}✅ Порт 80: Слушается${NC}"
    else
        echo -e "${RED}❌ Порт 80: Не слушается${NC}"
    fi
    
    if ss -tulpn | grep -q ":443 "; then
        echo -e "${GREEN}✅ Порт 443: Слушается${NC}"
    else
        echo -e "${RED}❌ Порт 443: Не слушается${NC}"
    fi
    
    if ss -tulpn | grep -q ":3000 "; then
        echo -e "${GREEN}✅ Порт 3000: Слушается${NC}"
    else
        echo -e "${RED}❌ Порт 3000: НЕ СЛУШАЕТСЯ (ГЛАВНАЯ ПРОБЛЕМА!)${NC}"
    fi
    
    # 4. Проверка процессов Node.js
    echo -e "${CYAN}4️⃣ Проверка процессов Node.js...${NC}"
    node_processes=$(ps aux | grep -v grep | grep -c "node.*server.js")
    if [ "$node_processes" -gt 0 ]; then
        echo -e "${GREEN}✅ Node.js процессы: $node_processes${NC}"
        ps aux | grep -v grep | grep "node.*server.js"
    else
        echo -e "${RED}❌ Node.js процессы: НЕ НАЙДЕНЫ${NC}"
    fi
    
    # 5. Проверка файлов проекта
    echo -e "${CYAN}5️⃣ Проверка файлов проекта...${NC}"
    
    if [ -d "$PROJECT_DIR" ]; then
        echo -e "${GREEN}✅ Директория проекта: Существует${NC}"
    else
        echo -e "${RED}❌ Директория проекта: НЕ НАЙДЕНА${NC}"
        return 1
    fi
    
    if [ -f "$PROJECT_DIR/src/server.js" ]; then
        echo -e "${GREEN}✅ server.js: Найден${NC}"
    else
        echo -e "${RED}❌ server.js: НЕ НАЙДЕН${NC}"
        return 1
    fi
    
    if [ -f "$PROJECT_DIR/package.json" ]; then
        echo -e "${GREEN}✅ package.json: Найден${NC}"
    else
        echo -e "${RED}❌ package.json: НЕ НАЙДЕН${NC}"
        return 1
    fi
    
    # 6. Проверка логов
    echo -e "${CYAN}6️⃣ Анализ логов...${NC}"
    echo -e "${YELLOW}Последние ошибки Nginx:${NC}"
    if [ -f "/var/log/nginx/error.log" ]; then
        tail -5 /var/log/nginx/error.log | grep -v "^$" || echo "Нет недавних ошибок"
    else
        echo "Лог файл не найден"
    fi
    
    echo -e "${YELLOW}Системные ошибки:${NC}"
    journalctl --since "1 hour ago" --priority=err --no-pager | tail -3 || echo "Нет системных ошибок"
    
    echo ""
}

# Экстренное восстановление
emergency_restore() {
    echo -e "${WHITE}🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ${NC}"
    echo -e "${BLUE}═══════════════════════════${NC}"
    
    log "Начало экстренного восстановления"
    
    # 1. Остановка всех связанных процессов
    echo -e "${CYAN}1️⃣ Очистка процессов...${NC}"
    sudo pkill -f "node.*server.js" 2>/dev/null || true
    sudo systemctl stop gita-api 2>/dev/null || true
    sleep 3
    
    # 2. Проверка Node.js
    echo -e "${CYAN}2️⃣ Проверка Node.js...${NC}"
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js не установлен! Установка...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo -e "${GREEN}✅ Node.js версия: $(node --version)${NC}"
    fi
    
    # 3. Переход в директорию проекта
    echo -e "${CYAN}3️⃣ Переход в директорию проекта...${NC}"
    cd "$PROJECT_DIR" || {
        echo -e "${RED}❌ Не могу перейти в $PROJECT_DIR${NC}"
        return 1
    }
    
    # 4. Установка зависимостей
    echo -e "${CYAN}4️⃣ Установка зависимостей...${NC}"
    if [ -f "package.json" ]; then
        npm install --production
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Зависимости установлены${NC}"
        else
            echo -e "${RED}❌ Ошибка установки зависимостей${NC}"
            return 1
        fi
    fi
    
    # 5. Проверка .env файла
    echo -e "${CYAN}5️⃣ Проверка конфигурации...${NC}"
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️ .env файл не найден. Создание базового...${NC}"
        cat > .env << EOF
NODE_ENV=production
PORT=3000
TRANSLATOR_PROVIDER=mock
ADMIN_TOKEN=admin123
METRICS_TOKEN=metrics123
EOF
        chmod 600 .env
        chown www-data:www-data .env
    fi
    
    # 6. Тест запуска API
    echo -e "${CYAN}6️⃣ Тестовый запуск API...${NC}"
    timeout 10 node src/server.js &
    api_pid=$!
    sleep 5
    
    if curl -s http://localhost:3000/api/status >/dev/null; then
        echo -e "${GREEN}✅ API отвечает в тестовом режиме${NC}"
        kill $api_pid 2>/dev/null || true
    else
        echo -e "${RED}❌ API не отвечает даже в тестовом режиме${NC}"
        kill $api_pid 2>/dev/null || true
        
        # Попытка запуска с отладкой
        echo -e "${YELLOW}🔍 Запуск с отладкой...${NC}"
        timeout 5 node src/server.js &
        debug_pid=$!
        sleep 3
        kill $debug_pid 2>/dev/null || true
    fi
    
    # 7. Настройка systemd сервиса
    echo -e "${CYAN}7️⃣ Настройка systemd сервиса...${NC}"
    
    if [ ! -f "/etc/systemd/system/gita-api.service" ]; then
        echo -e "${YELLOW}⚠️ Создание systemd сервиса...${NC}"
        sudo cp deployment/gita-api.service /etc/systemd/system/
        sudo systemctl daemon-reload
    fi
    
    # 8. Запуск сервиса
    echo -e "${CYAN}8️⃣ Запуск сервиса...${NC}"
    sudo systemctl enable gita-api
    sudo systemctl start gita-api
    sleep 5
    
    # 9. Перезапуск Nginx
    echo -e "${CYAN}9️⃣ Перезапуск Nginx...${NC}"
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo systemctl restart nginx
        echo -e "${GREEN}✅ Nginx перезапущен${NC}"
    else
        echo -e "${RED}❌ Ошибка конфигурации Nginx${NC}"
    fi
    
    log "Экстренное восстановление завершено"
}

# Проверка восстановления
verify_restoration() {
    echo -e "${WHITE}✅ ПРОВЕРКА ВОССТАНОВЛЕНИЯ${NC}"
    echo -e "${BLUE}══════════════════════════${NC}"
    
    # Локальная проверка
    echo -e "${CYAN}🔍 Локальная проверка...${NC}"
    if curl -s http://localhost:3000/api/status >/dev/null; then
        echo -e "${GREEN}✅ Локальный API: Работает${NC}"
    else
        echo -e "${RED}❌ Локальный API: Не работает${NC}"
        return 1
    fi
    
    # Проверка через домен (может занять время из-за DNS)
    echo -e "${CYAN}🌐 Проверка через домен...${NC}"
    if curl -s --max-time 10 https://api.gita-1972-reprint.ru/api/status >/dev/null; then
        echo -e "${GREEN}✅ Внешний API: Работает${NC}"
    else
        echo -e "${YELLOW}⚠️ Внешний API: Не отвечает (возможно, нужно время на DNS)${NC}"
        echo -e "${YELLOW}   Попробуйте через несколько минут${NC}"
    fi
    
    # Итоговый статус
    echo ""
    echo -e "${WHITE}📊 ИТОГОВЫЙ СТАТУС:${NC}"
    systemctl is-active --quiet nginx && echo -e "${GREEN}✅ Nginx: Работает${NC}" || echo -e "${RED}❌ Nginx: Проблема${NC}"
    systemctl is-active --quiet gita-api && echo -e "${GREEN}✅ API Service: Работает${NC}" || echo -e "${RED}❌ API Service: Проблема${NC}"
    ss -tulpn | grep -q ":3000 " && echo -e "${GREEN}✅ Порт 3000: Слушается${NC}" || echo -e "${RED}❌ Порт 3000: Не слушается${NC}"
}

# Создание отчета
create_report() {
    local report_file="/tmp/api-fix-report-$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "ОТЧЕТ О ВОССТАНОВЛЕНИИ API"
        echo "=========================="
        echo "Время: $(date)"
        echo ""
        
        echo "СЕРВИСЫ:"
        systemctl is-active nginx && echo "✅ Nginx: работает" || echo "❌ Nginx: проблема"
        systemctl is-active gita-api && echo "✅ API: работает" || echo "❌ API: проблема"
        echo ""
        
        echo "ПОРТЫ:"
        ss -tulpn | grep ":80 " && echo "✅ Порт 80: слушается" || echo "❌ Порт 80: не слушается"
        ss -tulpn | grep ":443 " && echo "✅ Порт 443: слушается" || echo "❌ Порт 443: не слушается"
        ss -tulpn | grep ":3000 " && echo "✅ Порт 3000: слушается" || echo "❌ Порт 3000: не слушается"
        echo ""
        
        echo "ТЕСТЫ:"
        curl -s http://localhost:3000/api/status >/dev/null && echo "✅ Локальный API: отвечает" || echo "❌ Локальный API: не отвечает"
        curl -s --max-time 10 https://api.gita-1972-reprint.ru/api/status >/dev/null && echo "✅ Внешний API: отвечает" || echo "❌ Внешний API: не отвечает"
        echo ""
        
        echo "ЛОГИ (последние ошибки):"
        journalctl -u gita-api --since "10 minutes ago" --priority=err --no-pager | tail -5
        
    } > "$report_file"
    
    echo "$report_file"
}

# Главная функция
main() {
    header
    
    case "${1:-auto}" in
        "diagnose")
            diagnose_system
            ;;
        "fix")
            emergency_restore
            ;;
        "verify")
            verify_restoration
            ;;
        "report")
            create_report
            ;;
        "auto")
            diagnose_system
            echo ""
            emergency_restore
            echo ""
            verify_restoration
            echo ""
            report_file=$(create_report)
            echo -e "${CYAN}📋 Отчет сохранен: $report_file${NC}"
            ;;
        *)
            echo "Экстренное восстановление API Gita 1972"
            echo "======================================="
            echo ""
            echo "Использование: $0 [команда]"
            echo ""
            echo "Команды:"
            echo "  auto      - Полное восстановление (по умолчанию)"
            echo "  diagnose  - Только диагностика"
            echo "  fix       - Только восстановление"
            echo "  verify    - Только проверка"
            echo "  report    - Создать отчет"
            ;;
    esac
}

# Проверка прав
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️ Запущено от root. Некоторые команды могут работать некорректно.${NC}"
fi

# Запуск
main "$@"
