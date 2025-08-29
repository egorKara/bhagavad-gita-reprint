#!/bin/bash

# Cursor Security Agent - Автозапуск
# Этот скрипт запускает агент безопасности в фоновом режиме

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ОШИБКА]${NC} $1"
}

success() {
    echo -e "${GREEN}[УСПЕХ]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[ПРЕДУПРЕЖДЕНИЕ]${NC} $1"
}

# Проверка наличия Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        error "Node.js не установлен. Установите Node.js для работы агента."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    log "Node.js версия: $NODE_VERSION"
}

# Проверка рабочей директории
check_workspace() {
    if [ ! -f "src/services/security-agent.js" ]; then
        error "Файл security-agent.js не найден. Запустите скрипт из корневой директории проекта."
        exit 1
    fi
    
    log "Рабочая директория: $(pwd)"
}

# Создание PID файла
create_pid_file() {
    PID_FILE="/tmp/cursor-security-agent.pid"
    
    if [ -f "$PID_FILE" ]; then
        OLD_PID=$(cat "$PID_FILE")
        if ps -p "$OLD_PID" > /dev/null 2>&1; then
            warning "Агент уже запущен с PID $OLD_PID"
            read -p "Остановить существующий процесс? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                kill "$OLD_PID" 2>/dev/null || true
                rm -f "$PID_FILE"
                success "Существующий процесс остановлен"
            else
                log "Выход без изменений"
                exit 0
            fi
        else
            log "Удаляю устаревший PID файл"
            rm -f "$PID_FILE"
        fi
    fi
}

# Запуск агента в фоновом режиме
start_agent() {
    log "Запускаю Cursor Security Agent в фоновом режиме..."
    
    # Создаем лог файл
    LOG_FILE="security-agent.log"
    
    # Запускаем агент в фоне
    nohup node src/cli/security-cli.js monitor > "$LOG_FILE" 2>&1 &
    
    # Сохраняем PID
    AGENT_PID=$!
    echo "$AGENT_PID" > "$PID_FILE"
    
    # Проверяем что процесс запустился
    sleep 2
    if ps -p "$AGENT_PID" > /dev/null 2>&1; then
        success "Агент запущен с PID $AGENT_PID"
        log "Лог файл: $LOG_FILE"
        log "PID файл: $PID_FILE"
        log "Для остановки: ./stop-security-agent.sh"
        log "Для просмотра статуса: ./security-status.sh"
    else
        error "Не удалось запустить агент"
        exit 1
    fi
}

# Создание дополнительных скриптов
create_utility_scripts() {
    # Скрипт остановки
    cat > stop-security-agent.sh << 'EOF'
#!/bin/bash
PID_FILE="/tmp/cursor-security-agent.pid"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "Останавливаю агент с PID $PID..."
        kill "$PID"
        rm -f "$PID_FILE"
        echo "Агент остановлен"
    else
        echo "Процесс не найден, удаляю PID файл"
        rm -f "$PID_FILE"
    fi
else
    echo "PID файл не найден"
fi
EOF

    # Скрипт статуса
    cat > security-status.sh << 'EOF'
#!/bin/bash
PID_FILE="/tmp/cursor-security-agent.pid"
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "✅ Агент безопасности активен (PID: $PID)"
        echo "📊 Последние логи:"
        tail -n 20 security-agent.log 2>/dev/null || echo "Лог файл не найден"
    else
        echo "❌ Агент не активен"
        rm -f "$PID_FILE"
    fi
else
    echo "❌ PID файл не найден"
fi
EOF

    # Скрипт быстрого сканирования
    cat > quick-scan.sh << 'EOF'
#!/bin/bash
echo "🔍 Выполняю быстрое сканирование..."
node src/cli/security-cli.js scan
echo "📊 Для просмотра отчета: node src/cli/security-cli.js report"
EOF

    # Делаем скрипты исполняемыми
    chmod +x stop-security-agent.sh security-status.sh quick-scan.sh
    
    success "Созданы вспомогательные скрипты:"
    log "  - stop-security-agent.sh - остановка агента"
    log "  - security-status.sh - проверка статуса"
    log "  - quick-scan.sh - быстрое сканирование"
}

# Создание systemd сервиса (опционально)
create_systemd_service() {
    if command -v systemctl &> /dev/null; then
        read -p "Создать systemd сервис для автозапуска? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            SERVICE_FILE="/etc/systemd/system/cursor-security-agent.service"
            
            if [ ! -w "/etc/systemd/system" ]; then
                warning "Требуются права администратора для создания systemd сервиса"
                log "Запустите скрипт с sudo для создания сервиса"
                return
            fi
            
            cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Cursor Security Agent
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node src/cli/security-cli.js monitor
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

            systemctl daemon-reload
            systemctl enable cursor-security-agent.service
            
            success "Systemd сервис создан и включен"
            log "Для управления: sudo systemctl start/stop/status cursor-security-agent"
        fi
    fi
}

# Основная функция
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                CURSOR SECURITY AGENT                        ║"
    echo "║                    Автозапуск v1.0                          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_node
    check_workspace
    create_pid_file
    start_agent
    create_utility_scripts
    
    echo
    echo -e "${GREEN}🎉 Агент безопасности успешно запущен!${NC}"
    echo
    echo "📋 Доступные команды:"
    echo "  ./stop-security-agent.sh    - Остановить агент"
    echo "  ./security-status.sh        - Проверить статус"
    echo "  ./quick-scan.sh             - Быстрое сканирование"
    echo "  tail -f security-agent.log  - Просмотр логов в реальном времени"
    echo
    echo "🔒 Агент будет автоматически сканировать проект каждые 5 минут"
    echo "📊 Отчеты сохраняются в security-scan-report.json"
    echo "🔐 Инструкции по GitHub Secrets в github-secrets-to-create.md"
    
    create_systemd_service
}

# Запуск основной функции
main "$@"