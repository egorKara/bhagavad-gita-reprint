#!/bin/bash

# Скрипт проверки здоровья системы для Gita 1972
# Автоматическое восстановление при проблемах

LOG_FILE="/var/log/gita-health-check.log"
ALERT_EMAIL="admin@gita-1972-reprint.ru"
TELEGRAM_BOT_TOKEN=""  # Добавить токен бота
TELEGRAM_CHAT_ID=""    # Добавить ID чата

# Функция логирования
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a "$LOG_FILE"
}

# Функция отправки уведомлений
send_alert() {
    local message="$1"
    local priority="$2"  # LOW, MEDIUM, HIGH, CRITICAL
    
    log "ALERT [$priority]: $message"
    
    # Email уведомление
    if command -v mail &> /dev/null && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[$priority] Gita Server Alert" "$ALERT_EMAIL"
    fi
    
    # Telegram уведомление
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
            -d chat_id="$TELEGRAM_CHAT_ID" \
            -d text="🚨 [$priority] Gita Server Alert: $message"
    fi
}

# Проверка дискового пространства
check_disk_space() {
    local usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$usage" -gt 95 ]; then
        send_alert "Критически мало места на диске: ${usage}% использовано" "CRITICAL"
        # Экстренная очистка
        sudo find /tmp -type f -atime +1 -delete
        sudo journalctl --vacuum-size=100M
        return 1
    elif [ "$usage" -gt 85 ]; then
        send_alert "Мало места на диске: ${usage}% использовано" "HIGH"
        return 1
    fi
    
    return 0
}

# Проверка памяти
check_memory() {
    local memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [ "$memory_usage" -gt 95 ]; then
        send_alert "Критически высокое использование памяти: ${memory_usage}%" "CRITICAL"
        # Перезапуск API для освобождения памяти
        sudo systemctl restart gita-api
        return 1
    elif [ "$memory_usage" -gt 85 ]; then
        send_alert "Высокое использование памяти: ${memory_usage}%" "HIGH"
        return 1
    fi
    
    return 0
}

# Проверка загрузки CPU
check_cpu_load() {
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    local cpu_cores=$(nproc)
    local load_percent=$(echo "$load_avg * 100 / $cpu_cores" | bc -l | awk '{printf "%.0f", $1}')
    
    if [ "$load_percent" -gt 90 ]; then
        send_alert "Критически высокая загрузка CPU: ${load_percent}%" "CRITICAL"
        return 1
    elif [ "$load_percent" -gt 70 ]; then
        send_alert "Высокая загрузка CPU: ${load_percent}%" "MEDIUM"
        return 1
    fi
    
    return 0
}

# Проверка Nginx
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        send_alert "Nginx остановлен. Попытка перезапуска..." "HIGH"
        sudo systemctl start nginx
        sleep 5
        
        if systemctl is-active --quiet nginx; then
            send_alert "Nginx успешно перезапущен" "MEDIUM"
            return 0
        else
            send_alert "Не удалось запустить Nginx!" "CRITICAL"
            return 1
        fi
    fi
    
    # Проверка конфигурации
    if ! sudo nginx -t &>/dev/null; then
        send_alert "Ошибка в конфигурации Nginx!" "HIGH"
        return 1
    fi
    
    return 0
}

# Проверка API сервиса
check_api_service() {
    if ! systemctl is-active --quiet gita-api; then
        send_alert "API сервис остановлен. Попытка перезапуска..." "HIGH"
        sudo systemctl start gita-api
        sleep 10
        
        if systemctl is-active --quiet gita-api; then
            send_alert "API сервис успешно перезапущен" "MEDIUM"
            return 0
        else
            send_alert "Не удалось запустить API сервис!" "CRITICAL"
            return 1
        fi
    fi
    
    return 0
}

# Проверка доступности API
check_api_endpoint() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --max-time 10 http://localhost:3000/api/status >/dev/null; then
            return 0
        fi
        
        log "API не отвечает (попытка $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    send_alert "API endpoint не отвечает после $max_attempts попыток" "HIGH"
    
    # Попытка перезапуска API
    sudo systemctl restart gita-api
    sleep 15
    
    if curl -s --max-time 10 http://localhost:3000/api/status >/dev/null; then
        send_alert "API восстановлен после перезапуска" "MEDIUM"
        return 0
    else
        send_alert "API не восстановлен даже после перезапуска!" "CRITICAL"
        return 1
    fi
}

# Проверка портов
check_ports() {
    local ports=(80 443 3000)
    local failed_ports=()
    
    for port in "${ports[@]}"; do
        if ! ss -tulpn | grep -q ":$port "; then
            failed_ports+=($port)
        fi
    done
    
    if [ ${#failed_ports[@]} -gt 0 ]; then
        send_alert "Порты не слушаются: ${failed_ports[*]}" "HIGH"
        return 1
    fi
    
    return 0
}

# Проверка SSL сертификатов
check_ssl_certificates() {
    local domains=("gita-1972-reprint.ru" "api.gita-1972-reprint.ru")
    
    for domain in "${domains[@]}"; do
        if command -v openssl &> /dev/null; then
            local expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | 
                          openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
            
            if [ -n "$expiry" ]; then
                local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
                local current_epoch=$(date +%s)
                local days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
                
                if [ "$days_left" -lt 7 ]; then
                    send_alert "SSL сертификат для $domain истекает через $days_left дней!" "CRITICAL"
                elif [ "$days_left" -lt 30 ]; then
                    send_alert "SSL сертификат для $domain истекает через $days_left дней" "HIGH"
                fi
            fi
        fi
    done
}

# Проверка логов на ошибки
check_error_logs() {
    local error_threshold=10
    
    # Nginx ошибки за последний час
    local nginx_errors=$(grep "$(date -d '1 hour ago' '+%d/%b/%Y:%H')" /var/log/nginx/error.log 2>/dev/null | wc -l)
    if [ "$nginx_errors" -gt $error_threshold ]; then
        send_alert "Много ошибок Nginx за последний час: $nginx_errors" "MEDIUM"
    fi
    
    # Системные ошибки
    local system_errors=$(journalctl --since "1 hour ago" --priority=err --no-pager | wc -l)
    if [ "$system_errors" -gt $error_threshold ]; then
        send_alert "Много системных ошибок за последний час: $system_errors" "MEDIUM"
    fi
    
    # API ошибки
    local api_errors=$(journalctl -u gita-api --since "1 hour ago" --priority=err --no-pager | wc -l)
    if [ "$api_errors" -gt 5 ]; then
        send_alert "Ошибки API сервиса за последний час: $api_errors" "HIGH"
    fi
}

# Проверка производительности
check_performance() {
    # Время отклика API
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/api/status 2>/dev/null || echo "999")
    local response_ms=$(echo "$response_time * 1000" | bc | awk '{printf "%.0f", $1}')
    
    if [ "$response_ms" -gt 5000 ]; then
        send_alert "Медленный отклик API: ${response_ms}ms" "MEDIUM"
    fi
    
    # Количество процессов
    local process_count=$(ps aux | wc -l)
    if [ "$process_count" -gt 200 ]; then
        send_alert "Много активных процессов: $process_count" "LOW"
    fi
}

# Автоматическое восстановление
auto_recovery() {
    log "Запуск процедуры автоматического восстановления..."
    
    # Очистка временных файлов
    sudo find /tmp -type f -atime +1 -delete 2>/dev/null
    
    # Очистка логов если места мало
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        sudo journalctl --vacuum-time=3d
        sudo find /var/log -name "*.log" -type f -mtime +7 -delete
    fi
    
    # Перезапуск сервисов если проблемы
    if ! curl -s http://localhost:3000/api/status >/dev/null; then
        sudo systemctl restart gita-api nginx
        sleep 15
    fi
    
    log "Автоматическое восстановление завершено"
}

# Генерация отчета о здоровье
generate_health_report() {
    local report_file="/tmp/health-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "ОТЧЕТ О ЗДОРОВЬЕ СЕРВЕРА GITA 1972"
        echo "================================="
        echo "Время: $(date)"
        echo ""
        
        echo "СИСТЕМНЫЕ РЕСУРСЫ:"
        echo "Диск: $(df -h / | tail -1)"
        echo "Память: $(free -h | grep Mem)"
        echo "CPU Load: $(uptime)"
        echo ""
        
        echo "СЕРВИСЫ:"
        systemctl is-active nginx && echo "✅ Nginx: работает" || echo "❌ Nginx: проблема"
        systemctl is-active gita-api && echo "✅ API: работает" || echo "❌ API: проблема"
        echo ""
        
        echo "СЕТЬ:"
        echo "Порты: $(ss -tulpn | grep LISTEN | wc -l) активных"
        curl -s http://localhost:3000/api/status >/dev/null && echo "✅ API endpoint: отвечает" || echo "❌ API endpoint: не отвечает"
        echo ""
        
        echo "ПОСЛЕДНИЕ ОШИБКИ:"
        journalctl --since "1 hour ago" --priority=err --no-pager | tail -5
        
    } > "$report_file"
    
    echo "$report_file"
}

# Основная функция проверки
main_health_check() {
    log "=== Начало проверки здоровья системы ==="
    
    local issues=0
    
    # Выполнение всех проверок
    check_disk_space || ((issues++))
    check_memory || ((issues++))
    check_cpu_load || ((issues++))
    check_nginx || ((issues++))
    check_api_service || ((issues++))
    check_api_endpoint || ((issues++))
    check_ports || ((issues++))
    check_ssl_certificates || ((issues++))
    check_error_logs || ((issues++))
    check_performance || ((issues++))
    
    # Если есть проблемы, попытаться восстановить
    if [ $issues -gt 0 ]; then
        log "Обнаружено проблем: $issues. Запуск автовосстановления..."
        auto_recovery
    else
        log "Все проверки пройдены успешно ✅"
    fi
    
    # Генерация отчета
    local report=$(generate_health_report)
    log "Отчет о здоровье: $report"
    
    log "=== Проверка здоровья завершена ==="
    
    return $issues
}

# Запуск в режиме демона
daemon_mode() {
    log "Запуск в режиме демона. PID: $$"
    
    while true; do
        main_health_check
        sleep 300  # Проверка каждые 5 минут
    done
}

# Обработка аргументов командной строки
case "${1:-check}" in
    "check")
        main_health_check
        ;;
    "daemon")
        daemon_mode
        ;;
    "report")
        generate_health_report
        ;;
    "test-alert")
        send_alert "Тестовое уведомление от системы мониторинга" "LOW"
        ;;
    *)
        echo "Использование: $0 [check|daemon|report|test-alert]"
        echo ""
        echo "  check      - Однократная проверка (по умолчанию)"
        echo "  daemon     - Непрерывный мониторинг"
        echo "  report     - Генерация отчета о здоровье"
        echo "  test-alert - Тест системы уведомлений"
        exit 1
        ;;
esac
