#!/bin/bash

echo "🌐 Автоматическое исправление проблем с сетью..."

# Функция для проверки соединения
check_connection() {
    if ping -c 1 -W 5 8.8.8.8 &> /dev/null; then
        echo "✅ Соединение с интернетом работает"
        return 0
    else
        echo "❌ Проблема с соединением"
        return 1
    fi
}

# Функция для перезапуска сетевых сервисов
restart_network_services() {
    echo "🔄 Перезапуск сетевых сервисов..."
    
    # Перезапуск NetworkManager
    sudo systemctl restart NetworkManager
    
    # Перезапуск systemd-resolved (DNS)
    sudo systemctl restart systemd-resolved
    
    # Очистка DNS кэша
    sudo systemd-resolve --flush-caches
    
    echo "⏳ Ожидание 10 секунд..."
    sleep 10
}

# Функция для сброса сетевых настроек
reset_network_settings() {
    echo "🔄 Сброс сетевых настроек..."
    
    # Отключение и включение основного интерфейса
    INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
    if [ ! -z "$INTERFACE" ]; then
        echo "📡 Сброс интерфейса: $INTERFACE"
        sudo ip link set $INTERFACE down
        sleep 2
        sudo ip link set $INTERFACE up
    fi
    
    # Сброс маршрутов
    sudo ip route flush cache
}

# Функция для проверки и исправления DNS
fix_dns() {
    echo "🔧 Исправление DNS..."
    
    # Проверка текущих DNS серверов
    echo "📋 Текущие DNS серверы:"
    cat /etc/resolv.conf
    
    # Добавление надежных DNS серверов
    echo "📡 Добавление надежных DNS серверов..."
    echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf.backup
    echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf.backup
    echo "nameserver 1.1.1.1" | sudo tee -a /etc/resolv.conf.backup
    
    # Восстановление из резервной копии если нужно
    if ! check_connection; then
        echo "🔄 Восстановление DNS настроек..."
        sudo cp /etc/resolv.conf.backup /etc/resolv.conf
    fi
}

# Функция для проверки VPN
check_vpn() {
    echo "🔍 Проверка VPN соединений..."
    
    # Проверка активных VPN соединений
    if pgrep -x "openvpn" > /dev/null; then
        echo "🔒 OpenVPN активен"
        # Перезапуск OpenVPN если есть проблемы
        if ! check_connection; then
            echo "🔄 Перезапуск OpenVPN..."
            sudo systemctl restart openvpn
        fi
    fi
    
    # Проверка других VPN сервисов
    if pgrep -x "wireguard" > /dev/null; then
        echo "🔒 WireGuard активен"
    fi
}

# Функция для оптимизации сетевых параметров
optimize_network() {
    echo "⚡ Оптимизация сетевых параметров..."
    
    # Увеличение размера буфера TCP
    echo "📊 Оптимизация TCP буферов..."
    echo 'net.core.rmem_max = 16777216' | sudo tee -a /etc/sysctl.conf
    echo 'net.core.wmem_max = 16777216' | sudo tee -a /etc/sysctl.conf
    echo 'net.ipv4.tcp_rmem = 4096 87380 16777216' | sudo tee -a /etc/sysctl.conf
    echo 'net.ipv4.tcp_wmem = 4096 65536 16777216' | sudo tee -a /etc/sysctl.conf
    
    # Применение изменений
    sudo sysctl -p
}

# Основная логика
main() {
    echo "🚀 Начинаем исправление проблем с сетью..."
    
    # Проверяем текущее соединение
    if check_connection; then
        echo "✅ Соединение работает, но выполняем профилактику..."
    fi
    
    # Выполняем исправления
    restart_network_services
    reset_network_settings
    fix_dns
    check_vpn
    optimize_network
    
    # Финальная проверка
    echo "🔍 Финальная проверка соединения..."
    if check_connection; then
        echo "🎉 Проблемы с сетью исправлены!"
    else
        echo "⚠️ Проблемы остались. Попробуйте перезагрузить систему."
    fi
    
    echo ""
    echo "📋 Рекомендации для предотвращения проблем:"
    echo "   • Используйте стабильные DNS серверы (8.8.8.8, 1.1.1.1)"
    echo "   • Проверяйте VPN соединение"
    echo "   • Мониторьте качество интернет-соединения"
    echo "   • Запускайте этот скрипт при возникновении проблем"
}

# Запуск основной функции
main "$@"
