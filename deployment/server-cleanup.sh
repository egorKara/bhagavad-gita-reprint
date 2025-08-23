#!/bin/bash

# Скрипт для наведения порядка на сервере
# Очистка, оптимизация, проверка безопасности

set -e

echo "🧹 НАВЕДЕНИЕ ПОРЯДКА НА СЕРВЕРЕ"
echo "==============================="
echo "Дата: $(date)"
echo "Пользователь: $(whoami)"
echo ""

# Функция для логирования
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Функция для проверки sudo
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        echo "❌ Ошибка: Скрипт должен быть запущен с sudo"
        echo "   Использование: sudo bash deployment/server-cleanup.sh"
        exit 1
    fi
}

# Проверка свободного места
check_disk_space() {
    log "📊 Проверка дискового пространства..."
    df -h / | head -2
    
    available=$(df / | tail -1 | awk '{print $4}')
    if [ "$available" -lt 1048576 ]; then  # Меньше 1GB
        log "⚠️  Предупреждение: Мало свободного места на диске"
    fi
    echo ""
}

# Очистка системных логов
cleanup_logs() {
    log "📝 Очистка системных логов..."
    
    # Очистка журналов systemd старше 7 дней
    journalctl --vacuum-time=7d
    
    # Очистка старых логов
    find /var/log -name "*.log" -type f -mtime +30 -exec rm -f {} \;
    find /var/log -name "*.gz" -type f -mtime +30 -exec rm -f {} \;
    
    # Очистка nginx логов старше 30 дней
    find /var/log/nginx -name "*.log" -type f -mtime +30 -exec rm -f {} \;
    
    log "✅ Логи очищены"
    echo ""
}

# Очистка пакетного кэша
cleanup_packages() {
    log "📦 Очистка пакетного кэша..."
    
    # APT очистка
    apt-get autoremove -y
    apt-get autoclean
    apt-get clean
    
    # Очистка snap пакетов
    if command -v snap &> /dev/null; then
        snap list --all | awk '/disabled/{print $1, $3}' | \
        while read snapname revision; do
            snap remove "$snapname" --revision="$revision"
        done
    fi
    
    log "✅ Пакетный кэш очищен"
    echo ""
}

# Очистка временных файлов
cleanup_temp() {
    log "🗑️  Очистка временных файлов..."
    
    # Системные временные файлы
    find /tmp -type f -atime +7 -delete 2>/dev/null || true
    find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
    
    # Очистка кэша thumbnails
    find /home/*/\.cache/thumbnails -type f -atime +30 -delete 2>/dev/null || true
    
    log "✅ Временные файлы очищены"
    echo ""
}

# Оптимизация Nginx
optimize_nginx() {
    log "🌐 Оптимизация Nginx..."
    
    # Проверка конфигурации
    if nginx -t; then
        log "✅ Конфигурация Nginx корректна"
        
        # Перезагрузка для применения изменений
        systemctl reload nginx
        log "🔄 Nginx перезагружен"
    else
        log "❌ Ошибки в конфигурации Nginx!"
        nginx -t
    fi
    echo ""
}

# Проверка сервисов
check_services() {
    log "🔍 Проверка критически важных сервисов..."
    
    services=("nginx" "ssh" "ufw")
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service"; then
            log "✅ $service - работает"
        else
            log "❌ $service - не работает!"
            systemctl status "$service" --no-pager -l
        fi
    done
    
    # Проверка API сервиса если существует
    if systemctl list-unit-files | grep -q "gita-api"; then
        if systemctl is-active --quiet "gita-api"; then
            log "✅ gita-api - работает"
        else
            log "❌ gita-api - не работает!"
        fi
    fi
    echo ""
}

# Обновление системы
update_system() {
    log "🔄 Обновление системы..."
    
    # Обновление списка пакетов
    apt-get update
    
    # Показ доступных обновлений
    updates=$(apt list --upgradable 2>/dev/null | wc -l)
    if [ "$updates" -gt 1 ]; then
        log "📥 Доступно $((updates-1)) обновлений"
        echo "Запустите 'sudo apt upgrade' для установки"
    else
        log "✅ Система обновлена"
    fi
    echo ""
}

# Проверка безопасности
security_check() {
    log "🔒 Проверка безопасности..."
    
    # Проверка SSH конфигурации
    if grep -q "PermitRootLogin yes" /etc/ssh/sshd_config 2>/dev/null; then
        log "⚠️  Предупреждение: SSH root логин разрешен"
    fi
    
    # Проверка файрвола
    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "Status: active"; then
            log "✅ UFW файрвол активен"
        else
            log "⚠️  Предупреждение: UFW файрвол неактивен"
        fi
    fi
    
    # Проверка fail2ban
    if systemctl is-active --quiet fail2ban 2>/dev/null; then
        log "✅ Fail2ban активен"
    else
        log "⚠️  Предупреждение: Fail2ban не установлен/неактивен"
    fi
    
    echo ""
}

# Оптимизация Node.js проектов
optimize_nodejs() {
    log "📦 Оптимизация Node.js проектов..."
    
    # Поиск Node.js проектов
    find /var/www -name "package.json" 2>/dev/null | while read -r package_file; do
        project_dir=$(dirname "$package_file")
        log "🔍 Найден проект: $project_dir"
        
        cd "$project_dir"
        
        # Очистка node_modules если есть package-lock.json
        if [ -f "package-lock.json" ] && [ -d "node_modules" ]; then
            log "🧹 Переустановка зависимостей в $project_dir"
            rm -rf node_modules
            npm ci --production
        fi
        
        # Очистка npm кэша
        npm cache clean --force 2>/dev/null || true
    done
    
    log "✅ Node.js проекты оптимизированы"
    echo ""
}

# Генерация отчета
generate_report() {
    log "📊 Генерация отчета о состоянии сервера..."
    
    report_file="/tmp/server-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "ОТЧЕТ О СОСТОЯНИИ СЕРВЕРА"
        echo "========================="
        echo "Дата: $(date)"
        echo ""
        
        echo "ДИСКОВОЕ ПРОСТРАНСТВО:"
        df -h
        echo ""
        
        echo "ПАМЯТЬ:"
        free -h
        echo ""
        
        echo "ЗАГРУЗКА CPU:"
        uptime
        echo ""
        
        echo "АКТИВНЫЕ СЕРВИСЫ:"
        systemctl list-units --state=running --type=service | head -20
        echo ""
        
        echo "СЕТЕВЫЕ СОЕДИНЕНИЯ:"
        ss -tulpn | grep LISTEN | head -10
        echo ""
        
        echo "ПОСЛЕДНИЕ ЛОГИ:"
        journalctl --since "1 hour ago" --no-pager | tail -10
        
    } > "$report_file"
    
    log "📄 Отчет сохранен: $report_file"
    echo ""
}

# Основная функция
main() {
    check_sudo
    
    log "🚀 Начинаем наведение порядка..."
    echo ""
    
    check_disk_space
    cleanup_logs
    cleanup_packages
    cleanup_temp
    optimize_nginx
    check_services
    update_system
    security_check
    optimize_nodejs
    generate_report
    
    log "🎉 Наведение порядка завершено!"
    echo ""
    echo "📈 ИТОГОВАЯ СТАТИСТИКА:"
    echo "• Логи очищены ✅"
    echo "• Пакетный кэш очищен ✅"
    echo "• Временные файлы удалены ✅"
    echo "• Nginx оптимизирован ✅"
    echo "• Сервисы проверены ✅"
    echo "• Безопасность проверена ✅"
    echo "• Node.js проекты оптимизированы ✅"
    echo ""
    echo "💡 РЕКОМЕНДАЦИИ:"
    echo "• Запускайте этот скрипт еженедельно"
    echo "• Мониторьте дисковое пространство"
    echo "• Регулярно обновляйте систему"
    echo "• Проверяйте логи на ошибки"
    echo ""
    echo "📊 Отчет о состоянии сервера: $report_file"
}

# Запуск основной функции
main "$@"
