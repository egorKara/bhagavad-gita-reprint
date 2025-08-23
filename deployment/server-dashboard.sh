#!/bin/bash

# Интерактивная панель управления сервером Gita 1972
# Предоставляет удобный интерфейс для всех операций

# Цвета для интерфейса
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Функция очистки экрана
clear_screen() {
    clear
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    ${WHITE}ПАНЕЛЬ УПРАВЛЕНИЯ СЕРВЕРОМ${BLUE}                     ║${NC}"
    echo -e "${BLUE}║                       ${CYAN}Gita 1972 Project${BLUE}                           ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Функция показа статуса
show_status() {
    echo -e "${WHITE}📊 ТЕКУЩИЙ СТАТУС СЕРВЕРА${NC}"
    echo -e "${BLUE}══════════════════════════${NC}"
    
    # Время работы
    echo -e "${CYAN}⏰ Время работы:${NC} $(uptime | cut -d',' -f1 | cut -d' ' -f4-)"
    
    # Дисковое пространство
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        echo -e "${RED}💾 Диск: ${disk_usage}% (КРИТИЧНО)${NC}"
    else
        echo -e "${GREEN}💾 Диск: ${disk_usage}% (OK)${NC}"
    fi
    
    # Память
    memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$memory_usage" -gt 80 ]; then
        echo -e "${RED}🧠 RAM: ${memory_usage}% (ВЫСОКАЯ)${NC}"
    else
        echo -e "${GREEN}🧠 RAM: ${memory_usage}% (OK)${NC}"
    fi
    
    # Сервисы
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}🌐 Nginx: РАБОТАЕТ${NC}"
    else
        echo -e "${RED}🌐 Nginx: ОСТАНОВЛЕН${NC}"
    fi
    
    if systemctl is-active --quiet gita-api 2>/dev/null; then
        echo -e "${GREEN}🔧 API: РАБОТАЕТ${NC}"
    else
        echo -e "${RED}🔧 API: ОСТАНОВЛЕН${NC}"
    fi
    
    echo ""
}

# Главное меню
show_menu() {
    echo -e "${WHITE}🎛️  ГЛАВНОЕ МЕНЮ${NC}"
    echo -e "${BLUE}═══════════════${NC}"
    echo ""
    echo -e "${CYAN}📊 МОНИТОРИНГ:${NC}"
    echo "  1) Полный статус сервера"
    echo "  2) Мониторинг в реальном времени"
    echo "  3) Анализ логов"
    echo "  4) Проверка API"
    echo ""
    echo -e "${CYAN}🔧 УПРАВЛЕНИЕ СЕРВИСАМИ:${NC}"
    echo "  5) Управление API сервисом"
    echo "  6) Управление Nginx"
    echo "  7) Перезапуск всех сервисов"
    echo ""
    echo -e "${CYAN}🧹 ОБСЛУЖИВАНИЕ:${NC}"
    echo "  8) Очистка сервера"
    echo "  9) Обновление системы"
    echo "  10) Резервное копирование"
    echo ""
    echo -e "${CYAN}🔧 НАСТРОЙКА:${NC}"
    echo "  11) Установка/переустановка API"
    echo "  12) Настройка автоматизации"
    echo "  13) Проверка безопасности"
    echo ""
    echo -e "${CYAN}📋 ИНФОРМАЦИЯ:${NC}"
    echo "  14) Показать конфигурацию"
    echo "  15) Экспорт логов"
    echo "  16) Помощь"
    echo ""
    echo -e "${RED}0) Выход${NC}"
    echo ""
    echo -n -e "${YELLOW}Выберите опцию [0-16]: ${NC}"
}

# Функция мониторинга в реальном времени
real_time_monitor() {
    clear_screen
    echo -e "${WHITE}📡 МОНИТОРИНГ В РЕАЛЬНОМ ВРЕМЕНИ${NC}"
    echo -e "${BLUE}════════════════════════════════${NC}"
    echo ""
    echo "Нажмите Ctrl+C для выхода"
    echo ""
    
    while true; do
        # Очистка предыдущего вывода
        tput cup 6 0
        tput ed
        
        # Время
        echo -e "${CYAN}⏰ $(date '+%Y-%m-%d %H:%M:%S')${NC}"
        
        # CPU и память
        cpu_load=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
        memory_info=$(free | grep Mem)
        memory_usage=$(echo $memory_info | awk '{printf "%.1f", $3/$2 * 100.0}')
        
        echo -e "${CYAN}💻 CPU Load: ${cpu_load}${NC}"
        echo -e "${CYAN}🧠 Memory: ${memory_usage}%${NC}"
        
        # Активные соединения
        connections=$(ss -tuln | grep LISTEN | wc -l)
        echo -e "${CYAN}🌐 Active Connections: ${connections}${NC}"
        
        # API статус
        if curl -s http://localhost:3000/api/status >/dev/null 2>&1; then
            echo -e "${GREEN}✅ API: Отвечает${NC}"
        else
            echo -e "${RED}❌ API: Не отвечает${NC}"
        fi
        
        # Последние логи
        echo ""
        echo -e "${CYAN}📝 Последние события:${NC}"
        journalctl -u gita-api --since "30 seconds ago" --no-pager | tail -3 | cut -c1-80
        
        sleep 5
    done
}

# Управление API сервисом
manage_api() {
    clear_screen
    echo -e "${WHITE}🔧 УПРАВЛЕНИЕ API СЕРВИСОМ${NC}"
    echo -e "${BLUE}══════════════════════════${NC}"
    echo ""
    
    if systemctl is-active --quiet gita-api 2>/dev/null; then
        echo -e "${GREEN}Статус: РАБОТАЕТ${NC}"
    else
        echo -e "${RED}Статус: ОСТАНОВЛЕН${NC}"
    fi
    echo ""
    
    echo "1) Запустить API"
    echo "2) Остановить API"
    echo "3) Перезапустить API"
    echo "4) Показать логи"
    echo "5) Показать статус"
    echo "0) Назад"
    echo ""
    echo -n "Выберите действие: "
    read choice
    
    case $choice in
        1) sudo systemctl start gita-api && echo -e "${GREEN}✅ API запущен${NC}" ;;
        2) sudo systemctl stop gita-api && echo -e "${YELLOW}⏹️  API остановлен${NC}" ;;
        3) sudo systemctl restart gita-api && echo -e "${GREEN}🔄 API перезапущен${NC}" ;;
        4) sudo journalctl -u gita-api -f ;;
        5) sudo systemctl status gita-api ;;
        0) return ;;
    esac
    
    echo ""
    echo "Нажмите Enter для продолжения..."
    read
}

# Анализ логов
analyze_logs() {
    clear_screen
    echo -e "${WHITE}📝 АНАЛИЗ ЛОГОВ${NC}"
    echo -e "${BLUE}══════════════${NC}"
    echo ""
    
    echo "1) Логи API сервиса"
    echo "2) Логи Nginx"
    echo "3) Системные логи"
    echo "4) Логи ошибок"
    echo "5) Поиск в логах"
    echo "0) Назад"
    echo ""
    echo -n "Выберите тип логов: "
    read choice
    
    case $choice in
        1)
            echo -e "${CYAN}📋 Логи API сервиса (последние 50 строк):${NC}"
            sudo journalctl -u gita-api -n 50 --no-pager
            ;;
        2)
            echo -e "${CYAN}📋 Логи Nginx:${NC}"
            echo "Access log:"
            sudo tail -20 /var/log/nginx/access.log
            echo ""
            echo "Error log:"
            sudo tail -20 /var/log/nginx/error.log
            ;;
        3)
            echo -e "${CYAN}📋 Системные логи (последний час):${NC}"
            sudo journalctl --since "1 hour ago" -n 30 --no-pager
            ;;
        4)
            echo -e "${CYAN}📋 Критические ошибки:${NC}"
            sudo journalctl -p err --since "24 hours ago" --no-pager
            ;;
        5)
            echo -n "Введите поисковый запрос: "
            read search_term
            echo -e "${CYAN}🔍 Поиск '$search_term' в логах:${NC}"
            sudo journalctl | grep -i "$search_term" | tail -20
            ;;
        0) return ;;
    esac
    
    echo ""
    echo "Нажмите Enter для продолжения..."
    read
}

# Проверка API
check_api() {
    clear_screen
    echo -e "${WHITE}🔍 ПРОВЕРКА API${NC}"
    echo -e "${BLUE}═════════════${NC}"
    echo ""
    
    echo -e "${CYAN}Проверка доступности API...${NC}"
    
    # Локальная проверка
    if curl -s http://localhost:3000/api/status >/dev/null; then
        echo -e "${GREEN}✅ Локальный API: Доступен${NC}"
    else
        echo -e "${RED}❌ Локальный API: Недоступен${NC}"
    fi
    
    # Внешняя проверка
    if curl -s https://api.gita-1972-reprint.ru/api/status >/dev/null; then
        echo -e "${GREEN}✅ Внешний API: Доступен${NC}"
    else
        echo -e "${RED}❌ Внешний API: Недоступен${NC}"
    fi
    
    # Проверка портов
    echo ""
    echo -e "${CYAN}Проверка портов:${NC}"
    if ss -tulpn | grep -q ":3000 "; then
        echo -e "${GREEN}✅ Порт 3000: Слушается${NC}"
    else
        echo -e "${RED}❌ Порт 3000: Не слушается${NC}"
    fi
    
    # Тест производительности
    echo ""
    echo -e "${CYAN}Тест производительности API:${NC}"
    response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/api/status)
    echo "Время ответа: ${response_time}s"
    
    echo ""
    echo "Нажмите Enter для продолжения..."
    read
}

# Резервное копирование
backup_system() {
    clear_screen
    echo -e "${WHITE}💾 РЕЗЕРВНОЕ КОПИРОВАНИЕ${NC}"
    echo -e "${BLUE}═══════════════════════${NC}"
    echo ""
    
    backup_dir="/backup"
    date_str=$(date +%Y%m%d_%H%M%S)
    
    echo -e "${CYAN}Создание резервной копии...${NC}"
    
    # Создание директории бэкапа
    sudo mkdir -p "$backup_dir"
    
    # Бэкап проекта
    echo "📁 Архивирование проекта..."
    sudo tar -czf "$backup_dir/gita-project-$date_str.tar.gz" \
        -C /var/www gita-1972-reprint \
        --exclude=node_modules \
        --exclude=.git
    
    # Бэкап конфигураций
    echo "⚙️  Архивирование конфигураций..."
    sudo tar -czf "$backup_dir/gita-configs-$date_str.tar.gz" \
        /etc/nginx/sites-available/api.gita-1972-reprint.ru \
        /etc/systemd/system/gita-api.service \
        /var/www/gita-1972-reprint/.env 2>/dev/null
    
    # Бэкап логов
    echo "📝 Архивирование логов..."
    sudo tar -czf "$backup_dir/gita-logs-$date_str.tar.gz" \
        /var/log/nginx/ \
        /var/log/journal/ 2>/dev/null
    
    # Очистка старых бэкапов (старше 30 дней)
    echo "🧹 Очистка старых бэкапов..."
    sudo find "$backup_dir" -name "gita-*" -type f -mtime +30 -delete
    
    echo ""
    echo -e "${GREEN}✅ Резервное копирование завершено!${NC}"
    echo "Файлы сохранены в: $backup_dir"
    ls -lh "$backup_dir"/gita-*"$date_str"* 2>/dev/null
    
    echo ""
    echo "Нажмите Enter для продолжения..."
    read
}

# Настройка автоматизации
setup_automation() {
    clear_screen
    echo -e "${WHITE}🤖 НАСТРОЙКА АВТОМАТИЗАЦИИ${NC}"
    echo -e "${BLUE}═══════════════════════════${NC}"
    echo ""
    
    echo "1) Установить cron задачи"
    echo "2) Показать текущие задачи"
    echo "3) Тест автоматической очистки"
    echo "4) Настроить email уведомления"
    echo "0) Назад"
    echo ""
    echo -n "Выберите действие: "
    read choice
    
    case $choice in
        1)
            echo -e "${CYAN}Установка cron задач...${NC}"
            # Добавление основных задач
            (sudo crontab -l 2>/dev/null; cat <<EOF
# Gita 1972 Automation
0 2 * * 0 /var/www/gita-1972-reprint/deployment/server-cleanup.sh >> /var/log/server-cleanup.log 2>&1
*/15 * * * * /var/www/gita-1972-reprint/deployment/server-monitor.sh > /var/log/server-monitor.log
0 1 * * * tar -czf /backup/gita-\$(date +\%Y\%m\%d).tar.gz /var/www/gita-1972-reprint
*/5 * * * * curl -f http://localhost:3000/api/status > /dev/null 2>&1 || systemctl restart gita-api
EOF
            ) | sudo crontab -
            echo -e "${GREEN}✅ Cron задачи установлены${NC}"
            ;;
        2)
            echo -e "${CYAN}Текущие cron задачи:${NC}"
            sudo crontab -l
            ;;
        3)
            echo -e "${CYAN}Запуск тестовой очистки...${NC}"
            bash /var/www/gita-1972-reprint/deployment/server-cleanup.sh
            ;;
        4)
            echo -n "Введите email для уведомлений: "
            read email
            echo "MAILTO=$email" | sudo crontab -
            echo -e "${GREEN}✅ Email настроен: $email${NC}"
            ;;
        0) return ;;
    esac
    
    echo ""
    echo "Нажмите Enter для продолжения..."
    read
}

# Основной цикл
main_loop() {
    while true; do
        clear_screen
        show_status
        show_menu
        read choice
        
        case $choice in
            1) bash /var/www/gita-1972-reprint/deployment/server-monitor.sh; echo ""; echo "Нажмите Enter..."; read ;;
            2) real_time_monitor ;;
            3) analyze_logs ;;
            4) check_api ;;
            5) manage_api ;;
            6) 
                echo -e "${CYAN}Управление Nginx:${NC}"
                echo "1) Перезапуск 2) Статус 3) Тест конфигурации"
                read nginx_choice
                case $nginx_choice in
                    1) sudo systemctl restart nginx && echo "✅ Nginx перезапущен" ;;
                    2) sudo systemctl status nginx ;;
                    3) sudo nginx -t ;;
                esac
                echo ""; echo "Нажмите Enter..."; read
                ;;
            7) 
                echo -e "${CYAN}Перезапуск всех сервисов...${NC}"
                sudo systemctl restart nginx gita-api
                echo -e "${GREEN}✅ Все сервисы перезапущены${NC}"
                echo ""; echo "Нажмите Enter..."; read
                ;;
            8) sudo bash /var/www/gita-1972-reprint/deployment/server-cleanup.sh; echo ""; echo "Нажмите Enter..."; read ;;
            9) 
                echo -e "${CYAN}Обновление системы...${NC}"
                sudo apt update && sudo apt upgrade -y
                echo ""; echo "Нажмите Enter..."; read
                ;;
            10) backup_system ;;
            11) sudo bash /var/www/gita-1972-reprint/deployment/install-service.sh; echo ""; echo "Нажмите Enter..."; read ;;
            12) setup_automation ;;
            13) 
                echo -e "${CYAN}Проверка безопасности...${NC}"
                ufw status
                fail2ban-client status 2>/dev/null || echo "Fail2ban не установлен"
                echo ""; echo "Нажмите Enter..."; read
                ;;
            14) 
                echo -e "${CYAN}Конфигурация системы:${NC}"
                echo "Node.js: $(node --version 2>/dev/null || echo 'не установлен')"
                echo "Nginx: $(nginx -v 2>&1 | head -1)"
                echo "Система: $(lsb_release -d 2>/dev/null | cut -f2 || uname -a)"
                echo ""; echo "Нажмите Enter..."; read
                ;;
            15) 
                log_export="/tmp/gita-logs-$(date +%Y%m%d_%H%M%S).tar.gz"
                sudo tar -czf "$log_export" /var/log/nginx/ /var/log/journal/ 2>/dev/null
                echo -e "${GREEN}✅ Логи экспортированы: $log_export${NC}"
                echo ""; echo "Нажмите Enter..."; read
                ;;
            16) 
                echo -e "${CYAN}📚 Помощь:${NC}"
                echo "• Используйте цифры для навигации по меню"
                echo "• Все операции логируются в системные журналы"
                echo "• При проблемах начните с опции 1 (полный статус)"
                echo "• Для экстренных ситуаций используйте опцию 7"
                echo "• Документация: deployment/README.md"
                echo ""; echo "Нажмите Enter..."; read
                ;;
            0) 
                echo -e "${GREEN}До свидания!${NC}"
                exit 0
                ;;
            *) 
                echo -e "${RED}Неверный выбор. Попробуйте еще раз.${NC}"
                sleep 2
                ;;
        esac
    done
}

# Проверка прав доступа
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Предупреждение: Запущено от root. Некоторые функции могут работать некорректно.${NC}"
    sleep 2
fi

# Запуск главного цикла
main_loop
