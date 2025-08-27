#!/bin/bash
# 🔒 UFW Safe Setup - Безопасная настройка файервола для Yandex Server Agent
# Предотвращает блокировку SSH при настройке безопасности

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
    log_error "Скрипт должен запускаться с sudo"
    exit 1
fi

log_info "🔒 Настройка UFW файервола для Yandex Server Agent"
echo "================================================================"

# 1. Сброс UFW (если нужно)
log_info "1️⃣ Проверка текущего состояния UFW..."
ufw_status=$(ufw status | head -1)
echo "Текущий статус: $ufw_status"

# 2. Включение UFW с базовыми правилами
log_info "2️⃣ Настройка базовых правил..."

# КРИТИЧНО: SSH правила ПЕРВЫМИ!
log_warning "🚨 Добавление SSH правил (КРИТИЧНО)..."
ufw allow 22/tcp comment 'SSH access'
ufw allow ssh comment 'SSH backup rule'

# Веб-сервисы
log_info "🌐 Добавление веб-сервисов..."
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Локальные сервисы (API на порту 3000)
log_info "⚙️ Настройка локальных сервисов..."
ufw allow from 127.0.0.1 to any port 3000 comment 'Local API access'
ufw allow from ::1 to any port 3000 comment 'Local API IPv6'

# PostgreSQL только локально
ufw allow from 127.0.0.1 to any port 5432 comment 'Local PostgreSQL'

# DNS
ufw allow out 53 comment 'DNS queries'

# 3. Базовые политики
log_info "3️⃣ Установка базовых политик..."
ufw --force default deny incoming
ufw --force default allow outgoing

# 4. Включение UFW
log_info "4️⃣ Активация UFW..."
ufw --force enable

# 5. Проверка результата
log_info "5️⃣ Проверка настроек..."
echo ""
log_success "✅ UFW НАСТРОЕН УСПЕШНО!"
echo ""
ufw status verbose
echo ""

# 6. Тест SSH соединения
log_info "6️⃣ Тестирование SSH..."
if ss -tulpn | grep -q ":22 "; then
    log_success "✅ SSH порт слушается"
else
    log_error "❌ SSH порт не слушается!"
fi

# 7. Сохранение конфигурации
log_info "7️⃣ Сохранение конфигурации..."
iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
ip6tables-save > /etc/iptables/rules.v6 2>/dev/null || true

log_success "🎉 UFW настроен безопасно!"
log_warning "⚠️ Если SSH недоступен, используйте Yandex Cloud Console для восстановления"

# 8. Создание отчета
cat > /tmp/ufw-setup-report.txt << EOF
UFW SETUP REPORT
================
Время: $(date)

РАЗРЕШЕННЫЕ ПОРТЫ:
$(ufw status numbered)

АКТИВНЫЕ ПОДКЛЮЧЕНИЯ:
$(ss -tulpn | grep LISTEN)

ТЕСТ SSH:
$(ss -tulpn | grep ":22 " && echo "SSH OK" || echo "SSH PROBLEM")

РЕКОМЕНДАЦИИ:
1. Проверьте SSH подключение из безопасного места
2. Если SSH недоступен, используйте Yandex Console
3. Регулярно обновляйте правила UFW

EOF

log_info "📋 Отчет сохранен: /tmp/ufw-setup-report.txt"
