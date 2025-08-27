#!/bin/bash
# 🚀 YANDEX INTEGRATIONS SETUP - Настройка интеграций с экосистемой Yandex
# Полная автоматизация развертывания AI-powered управления инфраструктурой

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Конфигурация
YANDEX_INTEGRATIONS_DIR="/home/yc-user/yandex-integrations"
VENV_DIR="/home/yc-user/yandex-venv"
SERVICE_USER="yc-user"
LOG_FILE="/var/log/yandex-integrations-setup.log"

echo -e "${CYAN}🚀 YANDEX ECOSYSTEM INTEGRATION SETUP${NC}"
echo -e "${CYAN}====================================${NC}"
echo ""

# Функция логирования
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Функция проверки успеха
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        log "SUCCESS: $1"
    else
        echo -e "${RED}❌ $1${NC}"
        log "ERROR: $1"
        exit 1
    fi
}

echo -e "${BLUE}📋 Проверка системы...${NC}"

# Проверка прав
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Этот скрипт должен запускаться с правами root${NC}"
   echo "Использование: sudo $0"
   exit 1
fi

# Проверка Ubuntu
if ! lsb_release -d | grep -q "Ubuntu"; then
    echo -e "${RED}❌ Поддерживается только Ubuntu${NC}"
    exit 1
fi

# Установка системных зависимостей
echo -e "${YELLOW}📦 Установка системных пакетов...${NC}"

apt update && apt upgrade -y
check_success "Обновление системы"

# Основные пакеты
apt install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    htop \
    vim \
    nano \
    jq \
    ffmpeg \
    libssl-dev \
    libffi-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    liblzma-dev

check_success "Установка системных пакетов"

# Установка Yandex Cloud CLI если не установлен
if ! command -v yc &> /dev/null; then
    echo -e "${YELLOW}☁️ Установка Yandex Cloud CLI...${NC}"
    curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash
    source ~/.bashrc
    check_success "Установка Yandex Cloud CLI"
else
    echo -e "${GREEN}✅ Yandex Cloud CLI уже установлен${NC}"
fi

# Создание структуры каталогов
echo -e "${YELLOW}📁 Создание структуры каталогов...${NC}"

mkdir -p "$YANDEX_INTEGRATIONS_DIR"/{configs,logs,data,scripts,tests}
mkdir -p /var/log/yandex-integrations
mkdir -p /etc/yandex-integrations

check_success "Создание каталогов"

# Создание Python виртуального окружения
echo -e "${YELLOW}🐍 Создание Python окружения...${NC}"

if [ -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}⚠️ Виртуальное окружение существует, пересоздаем...${NC}"
    rm -rf "$VENV_DIR"
fi

python3.11 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"

# Обновление pip
pip install --upgrade pip setuptools wheel
check_success "Создание виртуального окружения"

# Установка Python зависимостей
echo -e "${YELLOW}📦 Установка Python пакетов...${NC}"

# Базовые зависимости
pip install \
    yandexcloud \
    aiohttp \
    asyncio \
    requests \
    paramiko \
    psutil \
    schedule \
    python-dotenv \
    aiofiles \
    loguru \
    cryptography \
    python-telegram-bot \
    fastapi \
    uvicorn

check_success "Установка базовых Python пакетов"

# Дополнительные AI зависимости
echo -e "${YELLOW}🧠 Установка AI зависимостей...${NC}"

pip install \
    openai \
    transformers \
    torch \
    numpy \
    pandas \
    scikit-learn \
    matplotlib \
    pillow

check_success "Установка AI пакетов"

# Копирование файлов интеграции
echo -e "${YELLOW}📄 Копирование файлов интеграции...${NC}"

# Определяем исходную директорию (откуда запущен скрипт)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Копируем Python модули
cp "$SCRIPT_DIR"/*.py "$YANDEX_INTEGRATIONS_DIR/"
check_success "Копирование Python модулей"

# Создание конфигурационных файлов
echo -e "${YELLOW}⚙️ Создание конфигураций...${NC}"

# Основной конфиг
cat > /etc/yandex-integrations/config.env << 'EOF'
# 🚀 YANDEX INTEGRATIONS CONFIG
# Конфигурация интеграций с экосистемой Yandex

# Yandex Cloud
YANDEX_CLOUD_ID=
YANDEX_FOLDER_ID=
YANDEX_VM_ID=fhmqd2mct32i12bapfn1
YANDEX_SERVICE_ACCOUNT_KEY_PATH=/etc/yandex-integrations/sa-key.json

# Yandex AI API Keys
YANDEX_GPT_API_KEY=
YANDEX_SPEECHKIT_API_KEY=
YANDEX_TRANSLATE_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s
TELEGRAM_CHAT_ID=6878699213

# Server Configuration
PRIMARY_SERVER_IP=46.21.247.218
PRIMARY_SERVER_ID=fhmqd2mct32i12bapfn1

# Monitoring
MONITORING_INTERVAL=300
LOG_LEVEL=INFO
ENABLE_AI_ANALYSIS=true

# Security
ENABLE_ENCRYPTION=true
BACKUP_ENCRYPTION_KEY=
AUDIT_LOG_RETENTION_DAYS=90

# Performance
MAX_CONCURRENT_OPERATIONS=10
API_TIMEOUT_SECONDS=30
RECOVERY_TIMEOUT_SECONDS=600
EOF

check_success "Создание основного конфига"

# Конфигурация systemd сервисов
echo -e "${YELLOW}⚙️ Создание systemd сервисов...${NC}"

# Yandex Cloud Manager Service
cat > /etc/systemd/system/yandex-cloud-manager.service << EOF
[Unit]
Description=Yandex Cloud Manager - Infrastructure Management
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$YANDEX_INTEGRATIONS_DIR
Environment=PATH=$VENV_DIR/bin
EnvironmentFile=/etc/yandex-integrations/config.env
ExecStart=$VENV_DIR/bin/python yandex-cloud-manager.py
Restart=always
RestartSec=10
KillMode=mixed
TimeoutStopSec=30

# Security
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$YANDEX_INTEGRATIONS_DIR /var/log/yandex-integrations

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yandex-cloud-manager

[Install]
WantedBy=multi-user.target
EOF

# Yandex AI Assistant Service
cat > /etc/systemd/system/yandex-ai-assistant.service << EOF
[Unit]
Description=Yandex AI Assistant - Intelligent Infrastructure Management
After=network.target yandex-cloud-manager.service
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$YANDEX_INTEGRATIONS_DIR
Environment=PATH=$VENV_DIR/bin
EnvironmentFile=/etc/yandex-integrations/config.env
ExecStart=$VENV_DIR/bin/python yandex-ai-assistant.py
Restart=always
RestartSec=15
KillMode=mixed
TimeoutStopSec=30

# Security
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$YANDEX_INTEGRATIONS_DIR /var/log/yandex-integrations

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yandex-ai-assistant

[Install]
WantedBy=multi-user.target
EOF

# Recovery System Service
cat > /etc/systemd/system/yandex-recovery-system.service << EOF
[Unit]
Description=Yandex Recovery System - Emergency Server Recovery
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$YANDEX_INTEGRATIONS_DIR
Environment=PATH=$VENV_DIR/bin
EnvironmentFile=/etc/yandex-integrations/config.env
ExecStart=$VENV_DIR/bin/python recovery-system.py
Restart=always
RestartSec=30
KillMode=mixed
TimeoutStopSec=60

# Security
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$YANDEX_INTEGRATIONS_DIR /var/log/yandex-integrations

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=yandex-recovery-system

[Install]
WantedBy=multi-user.target
EOF

check_success "Создание systemd сервисов"

# Настройка прав доступа
echo -e "${YELLOW}🔐 Настройка прав доступа...${NC}"

chown -R $SERVICE_USER:$SERVICE_USER "$YANDEX_INTEGRATIONS_DIR"
chown -R $SERVICE_USER:$SERVICE_USER "$VENV_DIR"
chown -R $SERVICE_USER:$SERVICE_USER /var/log/yandex-integrations
chmod -R 755 "$YANDEX_INTEGRATIONS_DIR"
chmod -R 644 /etc/yandex-integrations/config.env
chmod 755 "$YANDEX_INTEGRATIONS_DIR"/*.py

check_success "Настройка прав доступа"

# Создание скриптов управления
echo -e "${YELLOW}🔧 Создание скриптов управления...${NC}"

# Скрипт управления сервисами
cat > "$YANDEX_INTEGRATIONS_DIR/scripts/manage-services.sh" << 'EOF'
#!/bin/bash
# 🎛️ Управление Yandex интеграциями

SERVICES=("yandex-cloud-manager" "yandex-ai-assistant" "yandex-recovery-system")

case "$1" in
    start)
        echo "🚀 Запуск всех Yandex сервисов..."
        for service in "${SERVICES[@]}"; do
            sudo systemctl start "$service"
            echo "✅ $service запущен"
        done
        ;;
    stop)
        echo "⏹️ Остановка всех Yandex сервисов..."
        for service in "${SERVICES[@]}"; do
            sudo systemctl stop "$service"
            echo "⏹️ $service остановлен"
        done
        ;;
    restart)
        echo "🔄 Перезапуск всех Yandex сервисов..."
        for service in "${SERVICES[@]}"; do
            sudo systemctl restart "$service"
            echo "🔄 $service перезапущен"
        done
        ;;
    status)
        echo "📊 Статус всех Yandex сервисов:"
        for service in "${SERVICES[@]}"; do
            status=$(systemctl is-active "$service")
            if [ "$status" = "active" ]; then
                echo "✅ $service: $status"
            else
                echo "❌ $service: $status"
            fi
        done
        ;;
    logs)
        echo "📝 Логи всех Yandex сервисов:"
        for service in "${SERVICES[@]}"; do
            echo "--- $service ---"
            sudo journalctl -u "$service" -n 5 --no-pager
            echo ""
        done
        ;;
    *)
        echo "Использование: $0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
EOF

chmod +x "$YANDEX_INTEGRATIONS_DIR/scripts/manage-services.sh"

# Скрипт тестирования
cat > "$YANDEX_INTEGRATIONS_DIR/scripts/test-integrations.sh" << 'EOF'
#!/bin/bash
# 🧪 Тестирование Yandex интеграций

echo "🧪 Тестирование Yandex интеграций"
echo "================================"

# Активация виртуального окружения
source /home/yc-user/yandex-venv/bin/activate

cd /home/yc-user/yandex-integrations

echo "1. 🧠 Тестирование AI Assistant..."
python3 -c "
import asyncio
from yandex-ai-assistant import YandexAIAssistant
async def test():
    assistant = YandexAIAssistant()
    result = await assistant.analyze_logs_with_ai('Test log entry', 'Test context')
    print('✅ AI Assistant:', result.get('success', False))
asyncio.run(test())
"

echo "2. ☁️ Тестирование Cloud Manager..."
python3 -c "
import asyncio
from yandex-cloud-manager import YandexCloudManager
async def test():
    manager = YandexCloudManager()
    result = await manager.get_vm_status()
    print('✅ Cloud Manager:', 'success' if 'id' in result else 'error')
asyncio.run(test())
"

echo "3. 🛡️ Тестирование Recovery System..."
python3 -c "
import asyncio
from recovery-system import ServerRecoverySystem
async def test():
    recovery = ServerRecoverySystem()
    result = await recovery.health_check_all_channels()
    print('✅ Recovery System:', result.get('recovery_readiness', False))
asyncio.run(test())
"

echo ""
echo "✅ Тестирование завершено!"
EOF

chmod +x "$YANDEX_INTEGRATIONS_DIR/scripts/test-integrations.sh"

check_success "Создание скриптов управления"

# Настройка логротации
echo -e "${YELLOW}📝 Настройка логротации...${NC}"

cat > /etc/logrotate.d/yandex-integrations << 'EOF'
/var/log/yandex-integrations/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        systemctl reload yandex-cloud-manager yandex-ai-assistant yandex-recovery-system > /dev/null 2>&1 || true
    endscript
}
EOF

check_success "Настройка логротации"

# Перезагрузка systemd и включение сервисов
echo -e "${YELLOW}🔄 Настройка автозапуска сервисов...${NC}"

systemctl daemon-reload
check_success "Перезагрузка systemd daemon"

# Включение сервисов
for service in yandex-cloud-manager yandex-ai-assistant yandex-recovery-system; do
    systemctl enable "$service"
    echo -e "${GREEN}✅ $service включен в автозапуск${NC}"
done

# Создание алиасов для удобства
echo -e "${YELLOW}🔗 Создание алиасов...${NC}"

cat >> /home/$SERVICE_USER/.bashrc << 'EOF'

# 🚀 Yandex Integrations Aliases
alias yandex-start='sudo /home/yc-user/yandex-integrations/scripts/manage-services.sh start'
alias yandex-stop='sudo /home/yc-user/yandex-integrations/scripts/manage-services.sh stop'
alias yandex-restart='sudo /home/yc-user/yandex-integrations/scripts/manage-services.sh restart'
alias yandex-status='sudo /home/yc-user/yandex-integrations/scripts/manage-services.sh status'
alias yandex-logs='sudo /home/yc-user/yandex-integrations/scripts/manage-services.sh logs'
alias yandex-test='/home/yc-user/yandex-integrations/scripts/test-integrations.sh'
alias yandex-config='sudo nano /etc/yandex-integrations/config.env'
EOF

check_success "Создание алиасов"

# Финальная проверка
echo -e "${YELLOW}🔍 Финальная проверка установки...${NC}"

# Проверка Python модулей
source "$VENV_DIR/bin/activate"
python3 -c "
import yandexcloud, aiohttp, asyncio, requests, paramiko
print('✅ Все критичные модули импортированы успешно')
" 2>/dev/null

check_success "Проверка Python модулей"

# Проверка структуры каталогов
if [ -d "$YANDEX_INTEGRATIONS_DIR" ] && [ -d "$VENV_DIR" ] && [ -f "/etc/yandex-integrations/config.env" ]; then
    echo -e "${GREEN}✅ Структура каталогов корректна${NC}"
else
    echo -e "${RED}❌ Проблемы со структурой каталогов${NC}"
    exit 1
fi

# Информация о завершении
echo ""
echo -e "${CYAN}🎉 УСТАНОВКА YANDEX INTEGRATIONS ЗАВЕРШЕНА!${NC}"
echo -e "${CYAN}===========================================${NC}"
echo ""
echo -e "${GREEN}✅ Установленные компоненты:${NC}"
echo -e "   🧠 Yandex AI Assistant"
echo -e "   ☁️ Yandex Cloud Manager"
echo -e "   🛡️ Recovery System"
echo -e "   📱 Telegram интеграция"
echo ""
echo -e "${YELLOW}📋 Следующие шаги:${NC}"
echo -e "   1. 🔑 Настройте API ключи в: ${BLUE}/etc/yandex-integrations/config.env${NC}"
echo -e "   2. 🧪 Запустите тесты: ${BLUE}yandex-test${NC}"
echo -e "   3. 🚀 Запустите сервисы: ${BLUE}yandex-start${NC}"
echo -e "   4. 📊 Проверьте статус: ${BLUE}yandex-status${NC}"
echo ""
echo -e "${PURPLE}🎯 Полезные команды:${NC}"
echo -e "   ${BLUE}yandex-start${NC}   - Запуск всех сервисов"
echo -e "   ${BLUE}yandex-stop${NC}    - Остановка всех сервисов"
echo -e "   ${BLUE}yandex-restart${NC} - Перезапуск всех сервисов"
echo -e "   ${BLUE}yandex-status${NC}  - Статус всех сервисов"
echo -e "   ${BLUE}yandex-logs${NC}    - Просмотр логов"
echo -e "   ${BLUE}yandex-test${NC}    - Тестирование интеграций"
echo -e "   ${BLUE}yandex-config${NC}  - Редактирование конфигурации"
echo ""
echo -e "${GREEN}🚀 Система готова к использованию!${NC}"
echo ""

log "INSTALLATION COMPLETED SUCCESSFULLY"
