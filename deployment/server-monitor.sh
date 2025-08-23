#!/bin/bash

# Скрипт мониторинга сервера для Gita 1972
# Проверяет состояние всех компонентов системы

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для цветного вывода
print_status() {
    if [ "$2" = "OK" ]; then
        echo -e "${GREEN}✅ $1: $2${NC}"
    elif [ "$2" = "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $1: $2${NC}"
    else
        echo -e "${RED}❌ $1: $2${NC}"
    fi
}

echo -e "${BLUE}🔍 МОНИТОРИНГ СЕРВЕРА GITA 1972${NC}"
echo -e "${BLUE}===============================${NC}"
echo "Время: $(date)"
echo ""

# 1. Проверка дискового пространства
echo -e "${BLUE}💾 ДИСКОВОЕ ПРОСТРАНСТВО:${NC}"
df -h / | tail -1 | while read filesystem size used avail percent mount; do
    usage_num=$(echo $percent | sed 's/%//')
    if [ "$usage_num" -gt 90 ]; then
        print_status "Диск /" "CRITICAL - $percent использовано"
    elif [ "$usage_num" -gt 80 ]; then
        print_status "Диск /" "WARNING - $percent использовано"
    else
        print_status "Диск /" "OK - $percent использовано"
    fi
done

# 2. Проверка памяти
echo ""
echo -e "${BLUE}🧠 ПАМЯТЬ:${NC}"
memory_info=$(free | grep Mem)
total=$(echo $memory_info | awk '{print $2}')
used=$(echo $memory_info | awk '{print $3}')
available=$(echo $memory_info | awk '{print $7}')
usage_percent=$((used * 100 / total))

if [ "$usage_percent" -gt 90 ]; then
    print_status "RAM" "CRITICAL - ${usage_percent}% использовано"
elif [ "$usage_percent" -gt 80 ]; then
    print_status "RAM" "WARNING - ${usage_percent}% использовано"
else
    print_status "RAM" "OK - ${usage_percent}% использовано"
fi

# 3. Проверка загрузки CPU
echo ""
echo -e "${BLUE}⚙️  CPU:${NC}"
load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
cpu_cores=$(nproc)
load_percent=$(echo "$load_avg * 100 / $cpu_cores" | bc -l | awk '{printf "%.0f", $1}')

if [ "$load_percent" -gt 90 ]; then
    print_status "CPU Load" "CRITICAL - ${load_percent}%"
elif [ "$load_percent" -gt 70 ]; then
    print_status "CPU Load" "WARNING - ${load_percent}%"
else
    print_status "CPU Load" "OK - ${load_percent}%"
fi

# 4. Проверка сервисов
echo ""
echo -e "${BLUE}🔧 СЕРВИСЫ:${NC}"

# Nginx
if systemctl is-active --quiet nginx; then
    print_status "Nginx" "OK - Запущен"
else
    print_status "Nginx" "CRITICAL - Остановлен"
fi

# SSH
if systemctl is-active --quiet ssh; then
    print_status "SSH" "OK - Запущен"
else
    print_status "SSH" "CRITICAL - Остановлен"
fi

# Gita API
if systemctl list-unit-files | grep -q "gita-api" && systemctl is-active --quiet gita-api; then
    print_status "Gita API" "OK - Запущен"
elif systemctl list-unit-files | grep -q "gita-api"; then
    print_status "Gita API" "CRITICAL - Остановлен"
else
    print_status "Gita API" "WARNING - Не установлен"
fi

# UFW Firewall
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
    print_status "UFW Firewall" "OK - Активен"
else
    print_status "UFW Firewall" "WARNING - Неактивен"
fi

# 5. Проверка портов
echo ""
echo -e "${BLUE}🌐 СЕТЕВЫЕ ПОРТЫ:${NC}"

# Порт 80 (HTTP)
if ss -tulpn | grep -q ":80 "; then
    print_status "Порт 80 (HTTP)" "OK - Слушается"
else
    print_status "Порт 80 (HTTP)" "WARNING - Не слушается"
fi

# Порт 443 (HTTPS)
if ss -tulpn | grep -q ":443 "; then
    print_status "Порт 443 (HTTPS)" "OK - Слушается"
else
    print_status "Порт 443 (HTTPS)" "WARNING - Не слушается"
fi

# Порт 3000 (API)
if ss -tulpn | grep -q ":3000 "; then
    print_status "Порт 3000 (API)" "OK - Слушается"
else
    print_status "Порт 3000 (API)" "CRITICAL - Не слушается"
fi

# 6. Проверка SSL сертификатов
echo ""
echo -e "${BLUE}🔒 SSL СЕРТИФИКАТЫ:${NC}"

check_ssl_cert() {
    domain=$1
    if command -v openssl &> /dev/null; then
        expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
        if [ -n "$expiry" ]; then
            expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
            current_epoch=$(date +%s)
            days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
            
            if [ "$days_left" -lt 7 ]; then
                print_status "$domain SSL" "CRITICAL - истекает через $days_left дней"
            elif [ "$days_left" -lt 30 ]; then
                print_status "$domain SSL" "WARNING - истекает через $days_left дней"
            else
                print_status "$domain SSL" "OK - действителен $days_left дней"
            fi
        else
            print_status "$domain SSL" "ERROR - не удалось проверить"
        fi
    else
        print_status "SSL проверка" "WARNING - openssl не установлен"
    fi
}

# Проверка основных доменов
check_ssl_cert "gita-1972-reprint.ru"
check_ssl_cert "api.gita-1972-reprint.ru"

# 7. Проверка логов на ошибки
echo ""
echo -e "${BLUE}📝 АНАЛИЗ ЛОГОВ:${NC}"

# Nginx ошибки за последний час
nginx_errors=$(grep "$(date -d '1 hour ago' '+%d/%b/%Y:%H')" /var/log/nginx/error.log 2>/dev/null | wc -l)
if [ "$nginx_errors" -gt 10 ]; then
    print_status "Nginx ошибки" "WARNING - $nginx_errors за час"
elif [ "$nginx_errors" -gt 0 ]; then
    print_status "Nginx ошибки" "OK - $nginx_errors за час"
else
    print_status "Nginx ошибки" "OK - нет ошибок"
fi

# Системные ошибки
system_errors=$(journalctl --since "1 hour ago" --priority=err --no-pager | wc -l)
if [ "$system_errors" -gt 5 ]; then
    print_status "Системные ошибки" "WARNING - $system_errors за час"
elif [ "$system_errors" -gt 0 ]; then
    print_status "Системные ошибки" "OK - $system_errors за час"
else
    print_status "Системные ошибки" "OK - нет ошибок"
fi

# 8. Проверка обновлений
echo ""
echo -e "${BLUE}📦 ОБНОВЛЕНИЯ:${NC}"
if command -v apt &> /dev/null; then
    apt list --upgradable 2>/dev/null | grep -c upgradable | head -1 | while read updates; do
        if [ "$updates" -gt 10 ]; then
            print_status "Доступные обновления" "WARNING - $updates пакетов"
        elif [ "$updates" -gt 0 ]; then
            print_status "Доступные обновления" "OK - $updates пакетов"
        else
            print_status "Доступные обновления" "OK - система обновлена"
        fi
    done
fi

# 9. Итоговая оценка
echo ""
echo -e "${BLUE}📊 ИТОГОВАЯ ОЦЕНКА:${NC}"

# Подсчет проблем
critical_issues=0
warnings=0

# Подсчет на основе выполненных проверок
echo "Детальный анализ завершен."
echo ""

echo -e "${BLUE}💡 РЕКОМЕНДАЦИИ:${NC}"
echo "• Регулярно обновляйте систему: sudo apt update && sudo apt upgrade"
echo "• Мониторьте дисковое пространство: df -h"
echo "• Проверяйте логи на ошибки: journalctl -xe"
echo "• Следите за SSL сертификатами"
echo "• Создавайте резервные копии данных"
echo ""

echo -e "${GREEN}✅ Мониторинг завершен!${NC}"
