#!/bin/bash

# Скрипт для постоянного мониторинга сетевого соединения
# Запускается как systemd сервис

LOG_FILE="/var/log/network-monitor.log"
CHECK_INTERVAL=60  # Проверка каждые 60 секунд
MAX_FAILURES=3     # Максимальное количество неудач перед исправлением

# Функция логирования
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | sudo tee -a "$LOG_FILE"
}

# Функция проверки соединения
check_connection() {
    # Проверяем несколько серверов
    if ping -c 1 -W 5 8.8.8.8 &> /dev/null; then
        return 0
    elif ping -c 1 -W 5 1.1.1.1 &> /dev/null; then
        return 0
    elif ping -c 1 -W 5 208.67.222.222 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Функция быстрого исправления
quick_fix() {
    log_message "🔧 Выполняем быстрое исправление..."
    
    # Перезапуск DNS
    sudo systemctl restart systemd-resolved
    
    # Очистка DNS кэша
    sudo systemd-resolve --flush-caches
    
    # Сброс маршрутов
    sudo ip route flush cache
    
    # Небольшая пауза
    sleep 5
}

# Функция полного исправления
full_fix() {
    log_message "🔄 Выполняем полное исправление..."
    
    # Перезапуск NetworkManager
    sudo systemctl restart NetworkManager
    
    # Сброс сетевого интерфейса
    INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
    if [ ! -z "$INTERFACE" ]; then
        log_message "📡 Сброс интерфейса: $INTERFACE"
        sudo ip link set $INTERFACE down
        sleep 3
        sudo ip link set $INTERFACE up
    fi
    
    # Ожидание восстановления
    sleep 15
}

# Основной цикл мониторинга
main() {
    log_message "🚀 Запуск мониторинга сети..."
    
    failure_count=0
    
    while true; do
        if check_connection; then
            if [ $failure_count -gt 0 ]; then
                log_message "✅ Соединение восстановлено после $failure_count неудач"
                failure_count=0
            fi
        else
            failure_count=$((failure_count + 1))
            log_message "❌ Соединение потеряно (попытка $failure_count/$MAX_FAILURES)"
            
            if [ $failure_count -eq 1 ]; then
                quick_fix
            elif [ $failure_count -ge $MAX_FAILURES ]; then
                full_fix
                failure_count=0
            fi
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Запуск основной функции
main "$@"
