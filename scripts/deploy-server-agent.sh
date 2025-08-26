#!/bin/bash

# 🚀 БЫСТРОЕ РАЗВЕРТЫВАНИЕ YANDEX SERVER AGENT
# Скрипт для развертывания агента на сервере с локальной машины
# Версия: 1.0

set -euo pipefail

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Переменные сервера
SERVER_IP="46.21.247.218"
SERVER_USER="yc-user"
SSH_KEY="~/.ssh/ssh-key-1753182147967"
SERVER_ID="fhmmuttj78nf215noffh"
PROJECT_PATH="/home/yc-user/gita-1972"

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

show_header() {
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║              🚀 DEPLOY YANDEX SERVER AGENT                  ║${NC}"
    echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC} Автоматическое развертывание агента на сервере            ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC} Сервер: ${GREEN}$SERVER_IP${NC}                                    ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC} Время:  ${YELLOW}$(date '+%d.%m.%Y %H:%M:%S')${NC}                              ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

check_local_files() {
    log_info "🔍 Проверка локальных файлов агента"
    
    local required_files=(
        "server-agent/yandex-server-agent.py"
        "server-agent/agent-config.json"
        "server-agent/sync-with-cursor.py"
        "server-agent/install-agent.sh"
        "server-agent/DEPLOYMENT_INSTRUCTIONS.md"
    )
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            log_success "✅ $file найден"
        else
            log_error "❌ $file отсутствует"
            return 1
        fi
    done
    
    return 0
}

check_server_connection() {
    log_info "🔗 Проверка подключения к серверу"
    
    # Проверяем YC CLI
    if ! command -v yc &> /dev/null; then
        log_error "❌ Yandex Cloud CLI не найден"
        log_info "💡 Установите YC CLI: curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash"
        return 1
    fi
    
    # Проверяем SSH ключ
    if [[ ! -f "${SSH_KEY/#\~/$HOME}" ]]; then
        log_error "❌ SSH ключ не найден: $SSH_KEY"
        return 1
    fi
    
    # Тестируем подключение через простой SSH
    if timeout 10 ssh -i "${SSH_KEY/#\~/$HOME}" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "echo 'Connection test'" &>/dev/null; then
        log_success "✅ Подключение к серверу работает"
        return 0
    else
        log_error "❌ Не удается подключиться к серверу"
        log_info "💡 Попробуйте: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
        return 1
    fi
}

upload_files() {
    log_info "📤 Загрузка файлов на сервер"
    
    # Создаем директорию на сервере
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "mkdir -p $PROJECT_PATH/server-agent"
    
    # Загружаем файлы через SCP
    local files=(
        "server-agent/yandex-server-agent.py"
        "server-agent/agent-config.json"
        "server-agent/sync-with-cursor.py"
        "server-agent/install-agent.sh"
        "server-agent/DEPLOYMENT_INSTRUCTIONS.md"
    )
    
    for file in "${files[@]}"; do
        log_info "Загружаем $(basename "$file")"
        
        # Используем SCP для загрузки
        if scp -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$file" "$SERVER_USER@$SERVER_IP:$PROJECT_PATH/$file"; then
            log_success "✅ $(basename "$file") загружен"
        else
            log_error "❌ Ошибка загрузки $(basename "$file")"
            return 1
        fi
    done
    
    log_success "✅ Все файлы загружены"
}

install_agent_on_server() {
    log_info "🔧 Установка агента на сервере"
    
    # Делаем установочный скрипт исполняемым и запускаем
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "cd $PROJECT_PATH/server-agent && chmod +x install-agent.sh && sudo ./install-agent.sh"
    
    if [[ $? -eq 0 ]]; then
        log_success "✅ Агент установлен успешно"
        return 0
    else
        log_error "❌ Ошибка установки агента"
        return 1
    fi
}

verify_installation() {
    log_info "✅ Проверка установки"
    
    echo
    log_info "📊 Статус сервиса:"
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "systemctl status yandex-server-agent --no-pager" || true
    
    echo
    log_info "📋 Последние логи:"
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "journalctl -u yandex-server-agent -n 10 --no-pager" || true
    
    echo
    log_info "🔍 Проверка файлов:"
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "ls -la $PROJECT_PATH/server-agent/ && ls -la $PROJECT_PATH/logs/"
}

test_agent_functionality() {
    log_info "🧪 Тестирование функциональности агента"
    
    echo
    log_info "🔄 Ждем первых проверок агента (30 сек)..."
    sleep 30
    
    echo
    log_info "📊 Проверка создания отчетов:"
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "ls -la $PROJECT_PATH/logs/agent-status.json $PROJECT_PATH/logs/sync-report.json 2>/dev/null || echo 'Отчеты еще не созданы'" || true
    
    echo
    log_info "🔄 Проверка синхронизации с Cursor:"
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "tail -5 $PROJECT_PATH/.cursor/sync-status.log 2>/dev/null || echo 'Лог синхронизации пока пуст'" || true
}

show_management_commands() {
    echo
    log_info "🎛️ КОМАНДЫ УПРАВЛЕНИЯ АГЕНТОМ:"
    echo
    echo -e "${YELLOW}Подключение к серверу:${NC}"
    echo "   ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
    echo
    echo -e "${YELLOW}Управление сервисом:${NC}"
    echo "   sudo systemctl status yandex-server-agent"
    echo "   sudo systemctl restart yandex-server-agent"
    echo "   sudo systemctl stop yandex-server-agent"
    echo
    echo -e "${YELLOW}Мониторинг:${NC}"
    echo "   journalctl -u yandex-server-agent -f"
    echo "   $PROJECT_PATH/server-agent/monitor-agent.sh"
    echo
    echo -e "${YELLOW}Логи и отчеты:${NC}"
    echo "   tail -f $PROJECT_PATH/logs/server-agent.log"
    echo "   cat $PROJECT_PATH/logs/agent-status.json"
    echo "   cat $PROJECT_PATH/logs/sync-report.json"
    echo
    echo -e "${YELLOW}Конфигурация:${NC}"
    echo "   nano $PROJECT_PATH/server-agent/agent-config.json"
    echo "   sudo systemctl restart yandex-server-agent  # после изменений"
    echo
}

cleanup_on_error() {
    log_warning "🧹 Очистка после ошибки"
    
    ssh -i "${SSH_KEY/#\~/$HOME}" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
        "sudo systemctl stop yandex-server-agent 2>/dev/null || true; sudo systemctl disable yandex-server-agent 2>/dev/null || true"
    
    log_info "ℹ️ Частичная установка очищена"
}

main() {
    show_header
    
    # Проверки перед установкой
    if ! check_local_files; then
        log_error "❌ Не все локальные файлы найдены"
        exit 1
    fi
    echo
    
    if ! check_server_connection; then
        log_error "❌ Проблемы с подключением к серверу"
        exit 1
    fi
    echo
    
    # Основная установка
    log_info "🚀 Начинаем развертывание агента"
    echo
    
    if upload_files; then
        echo
        if install_agent_on_server; then
            echo
            verify_installation
            echo
            test_agent_functionality
            echo
            show_management_commands
            echo
            log_success "🎉 РАЗВЕРТЫВАНИЕ ЗАВЕРШЕНО УСПЕШНО!"
            echo
            log_info "🤖 Yandex Server Agent теперь работает автономно на сервере"
            log_info "🔄 Агент автоматически синхронизируется с Cursor IDE"
            log_info "📊 Мониторинг сервера запущен в режиме 24/7"
        else
            cleanup_on_error
            exit 1
        fi
    else
        log_error "❌ Ошибка загрузки файлов"
        exit 1
    fi
}

# Проверяем аргументы
if [[ $# -gt 0 ]]; then
    case "$1" in
        "test")
            log_info "🧪 Режим тестирования"
            check_local_files && check_server_connection
            ;;
        "verify")
            log_info "✅ Проверка установленного агента"
            verify_installation
            test_agent_functionality
            ;;
        "clean")
            log_info "🧹 Очистка агента с сервера"
            cleanup_on_error
            ;;
        *)
            echo "Использование: $0 [test|verify|clean]"
            echo "  test   - проверить готовность к установке"
            echo "  verify - проверить установленного агента"
            echo "  clean  - удалить агента с сервера"
            exit 1
            ;;
    esac
else
    main
fi
