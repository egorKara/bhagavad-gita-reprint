#!/bin/bash

# 🤖 УСТАНОВКА YANDEX SERVER AGENT
# Скрипт для развертывания агента на сервере Yandex Cloud
# Версия: 1.0

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Переменные
AGENT_DIR="/home/yc-user/gita-1972/server-agent"
SERVICE_NAME="yandex-server-agent"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
LOG_DIR="/home/yc-user/gita-1972/logs"

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

log_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                   🤖 YANDEX SERVER AGENT                    ║${NC}"
    echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC} Установка и настройка автономного агента сервера         ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC} Дата: $(date '+%d.%m.%Y %H:%M:%S')                              ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

check_requirements() {
    log_info "🔍 Проверка системных требований"
    
    # Проверка ОС
    if [[ ! -f /etc/ubuntu-release ]] && [[ ! -f /etc/lsb-release ]]; then
        log_error "❌ Поддерживается только Ubuntu"
        exit 1
    fi
    
    log_success "✅ ОС совместима"
    
    # Проверка Python 3
    if ! command -v python3 &> /dev/null; then
        log_error "❌ Python 3 не найден"
        exit 1
    fi
    
    local python_version=$(python3 --version | cut -d' ' -f2)
    log_success "✅ Python 3 найден: $python_version"
    
    # Проверка pip
    if ! command -v pip3 &> /dev/null; then
        log_warning "⚠️ pip3 не найден, устанавливаем"
        sudo apt update
        sudo apt install -y python3-pip
    fi
    
    log_success "✅ pip3 доступен"
}

install_dependencies() {
    log_info "📦 Установка зависимостей Python"
    
    # Сначала пробуем установить через apt (более стабильно)
    log_info "Устанавливаем пакеты через apt"
    sudo apt update -qq
    sudo apt install -y python3-requests python3-psutil 2>/dev/null || true
    
    # Затем устанавливаем недостающие через pip
    local pip_packages=(
        "schedule>=1.2.0"
    )
    
    for package in "${pip_packages[@]}"; do
        log_info "Устанавливаем $package через pip"
        python3 -m pip install --break-system-packages "$package" --quiet
    done
    
    # Проверяем что все установлено
    if python3 -c "import requests, schedule, psutil; print('All dependencies OK')" 2>/dev/null; then
        log_success "✅ Зависимости установлены"
    else
        log_error "❌ Проблемы с зависимостями"
        return 1
    fi
}

create_directories() {
    log_info "📁 Создание директорий"
    
    # Создаем директории
    sudo mkdir -p "$AGENT_DIR"
    sudo mkdir -p "$LOG_DIR"
    
    # Устанавливаем правильные права
    sudo chown -R yc-user:yc-user "/home/yc-user/gita-1972/"
    sudo chmod -R 755 "/home/yc-user/gita-1972/"
    
    log_success "✅ Директории созданы"
}

copy_agent_files() {
    log_info "📄 Копирование файлов агента"
    
    # Копируем файлы в целевую директорию
    if [[ -f "yandex-server-agent.py" ]]; then
        sudo cp yandex-server-agent.py "$AGENT_DIR/"
        sudo chmod +x "$AGENT_DIR/yandex-server-agent.py"
        log_success "✅ Скрипт агента скопирован"
    else
        log_error "❌ Файл yandex-server-agent.py не найден"
        exit 1
    fi
    
    if [[ -f "agent-config.json" ]]; then
        sudo cp agent-config.json "$AGENT_DIR/"
        log_success "✅ Конфигурация скопирована"
    else
        log_error "❌ Файл agent-config.json не найден"
        exit 1
    fi
    
    # Устанавливаем права
    sudo chown -R yc-user:yc-user "$AGENT_DIR"
}

create_systemd_service() {
    log_info "⚙️ Создание systemd сервиса"
    
    # Создаем service файл
    sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Yandex Server Agent for Gita 1972 Reprint
After=network.target
Wants=network.target

[Service]
Type=simple
User=yc-user
Group=yc-user
WorkingDirectory=$AGENT_DIR
ExecStart=/usr/bin/python3 $AGENT_DIR/yandex-server-agent.py
Restart=always
RestartSec=10
Environment=PYTHONPATH=$AGENT_DIR
Environment=PATH=/usr/local/bin:/usr/bin:/bin

# Логирование
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yandex-server-agent

# Безопасность
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$LOG_DIR /home/yc-user/gita-1972

[Install]
WantedBy=multi-user.target
EOF

    log_success "✅ Systemd сервис создан"
    
    # Перезагружаем systemd
    sudo systemctl daemon-reload
    log_success "✅ Systemd daemon перезагружен"
}

setup_log_rotation() {
    log_info "🔄 Настройка ротации логов"
    
    # Создаем конфигурацию logrotate
    sudo tee "/etc/logrotate.d/yandex-server-agent" > /dev/null <<EOF
$LOG_DIR/server-agent.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 yc-user yc-user
    postrotate
        systemctl reload yandex-server-agent || true
    endscript
}
EOF

    log_success "✅ Ротация логов настроена"
}

configure_firewall() {
    log_info "🔥 Настройка firewall (если необходимо)"
    
    # Проверяем есть ли ufw
    if command -v ufw &> /dev/null; then
        # Убеждаемся что основные порты открыты
        sudo ufw allow 22/tcp   # SSH
        sudo ufw allow 80/tcp   # HTTP
        sudo ufw allow 443/tcp  # HTTPS
        sudo ufw allow 3000/tcp # API
        
        log_success "✅ Firewall настроен"
    else
        log_info "ℹ️ UFW не установлен, пропускаем"
    fi
}

create_monitoring_script() {
    log_info "📊 Создание скрипта мониторинга агента"
    
    cat > "$AGENT_DIR/monitor-agent.sh" <<'EOF'
#!/bin/bash

# Проверка статуса агента
echo "🤖 YANDEX SERVER AGENT STATUS"
echo "=============================="
echo "Время: $(date)"
echo

# Статус сервиса
echo "📋 Статус сервиса:"
systemctl is-active yandex-server-agent && echo "✅ Активен" || echo "❌ Неактивен"
echo

# Последние логи
echo "📄 Последние 10 строк лога:"
tail -10 /home/yc-user/gita-1972/logs/server-agent.log 2>/dev/null || echo "Лог не найден"
echo

# Статус отчет
echo "📊 Последний статус-отчет:"
if [[ -f "/home/yc-user/gita-1972/logs/agent-status.json" ]]; then
    jq -r '.timestamp' /home/yc-user/gita-1972/logs/agent-status.json 2>/dev/null || echo "Не удалось прочитать"
else
    echo "Отчет не найден"
fi

# Использование ресурсов
echo
echo "💻 Ресурсы системы:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "RAM: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
echo "Диск: $(df -h / | awk 'NR==2{printf "%s", $5}')"
EOF

    chmod +x "$AGENT_DIR/monitor-agent.sh"
    log_success "✅ Скрипт мониторинга создан"
}

start_agent() {
    log_info "🚀 Запуск агента"
    
    # Включаем автозапуск
    sudo systemctl enable "$SERVICE_NAME"
    log_success "✅ Автозапуск включен"
    
    # Запускаем сервис
    sudo systemctl start "$SERVICE_NAME"
    
    # Проверяем статус
    sleep 3
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log_success "✅ Агент успешно запущен"
        
        # Показываем статус
        echo
        log_info "📊 Статус сервиса:"
        systemctl status "$SERVICE_NAME" --no-pager -l
        
    else
        log_error "❌ Ошибка запуска агента"
        echo
        log_info "📄 Последние логи:"
        journalctl -u "$SERVICE_NAME" -n 20 --no-pager
        exit 1
    fi
}

show_usage_info() {
    echo
    log_info "🎯 ИСПОЛЬЗОВАНИЕ АГЕНТА:"
    echo
    echo "📊 Проверка статуса:"
    echo "   systemctl status yandex-server-agent"
    echo
    echo "📄 Просмотр логов:"
    echo "   journalctl -u yandex-server-agent -f"
    echo
    echo "🔧 Перезапуск:"
    echo "   sudo systemctl restart yandex-server-agent"
    echo
    echo "📊 Мониторинг:"
    echo "   $AGENT_DIR/monitor-agent.sh"
    echo
    echo "⚙️ Конфигурация:"
    echo "   nano $AGENT_DIR/agent-config.json"
    echo "   sudo systemctl restart yandex-server-agent  # после изменений"
    echo
}

main() {
    log_header
    
    # Проверяем что запущено от root или с sudo
    if [[ $EUID -ne 0 ]] && [[ -z "${SUDO_USER:-}" ]]; then
        log_error "❌ Скрипт должен быть запущен с sudo"
        exit 1
    fi
    
    log_info "🚀 Начинаем установку Yandex Server Agent"
    echo
    
    check_requirements
    echo
    
    install_dependencies
    echo
    
    create_directories
    echo
    
    copy_agent_files
    echo
    
    create_systemd_service
    echo
    
    setup_log_rotation
    echo
    
    configure_firewall
    echo
    
    create_monitoring_script
    echo
    
    start_agent
    echo
    
    show_usage_info
    
    log_success "🎉 УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!"
    echo
    log_info "🤖 Yandex Server Agent теперь работает автономно"
    log_info "📊 Мониторинг: $AGENT_DIR/monitor-agent.sh"
}

# Запуск только если скрипт выполняется напрямую
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
