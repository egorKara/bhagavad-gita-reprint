# 📊 Мониторинг и управление сервером Gita 1972

**Последнее обновление:** 23 декабря 2024  
**Статус:** ✅ АКТУАЛЬНАЯ ВЕРСИЯ

---

## 🎛️ **Главный инструмент: Интерактивная панель управления**

### **🚀 Запуск панели управления:**
```bash
# Переход в директорию проекта
cd /var/www/gita-1972-reprint

# Запуск интерактивной панели (16 функций)
bash deployment/server-dashboard.sh
```

### **🎯 Возможности панели:**
- 📊 **Полный статус сервера** с цветной индикацией
- 📡 **Мониторинг в реальном времени** (обновление каждые 5 сек)
- 📝 **Анализ логов** (API, Nginx, системные)
- 🔍 **Проверка API** с тестом производительности
- 🔧 **Управление сервисами** (запуск/остановка/перезапуск)
- 🧹 **Обслуживание сервера** (очистка, обновления)
- 💾 **Резервное копирование**
- 🤖 **Настройка автоматизации**

---

## 🏥 **Автоматическая диагностика и восстановление**

### **🔧 Health Check System:**
```bash
# Однократная проверка
bash deployment/health-check.sh check

# Непрерывный мониторинг (демон)
bash deployment/health-check.sh daemon &

# Генерация отчета о здоровье
bash deployment/health-check.sh report

# Тест системы уведомлений
bash deployment/health-check.sh test-alert
```

### **🎯 Автоматические проверки:**
- 💾 **Дисковое пространство** (критично при 95%)
- 🧠 **Память** (перезапуск API при 95%)
- ⚙️ **CPU нагрузка** с уведомлениями
- 🌐 **Статус сервисов** с автоперезапуском
- 🔗 **API endpoint** с восстановлением
- 🌐 **Порты и соединения**
- 🔒 **SSL сертификаты** с предупреждениями
- 📝 **Анализ логов** на ошибки
- 📊 **Производительность API**

---

## 🌐 **API Endpoints для мониторинга**

### **📋 Основные endpoint'ы:**
```bash
# Статус API сервера
curl https://api.gita-1972-reprint.ru/api/status

# Системная информация (требует авторизацию)
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     https://api.gita-1972-reprint.ru/api/system-info

# Prometheus метрики
curl https://api.gita-1972-reprint.ru/metrics
```

### **📊 Доступные метрики:**
- `process_cpu_seconds_total` - CPU время процесса
- `process_resident_memory_bytes` - Использование памяти
- `http_request_duration_seconds` - Время ответа API
- `http_requests_total` - Общее количество запросов
- `nodejs_heap_size_total_bytes` - Размер heap Node.js

---

## 🛠️ **Управление сервисами**

### **🔧 Основные сервисы:**
```bash
# Статус всех сервисов
systemctl status nginx gita-api

# Управление API сервисом
sudo systemctl start gita-api      # Запуск
sudo systemctl stop gita-api       # Остановка
sudo systemctl restart gita-api    # Перезапуск
sudo systemctl status gita-api     # Статус

# Управление Nginx
sudo systemctl reload nginx        # Перезагрузка конфигурации
sudo systemctl restart nginx       # Полный перезапуск
sudo nginx -t                      # Проверка конфигурации
```

### **📝 Просмотр логов:**
```bash
# Логи API сервиса
sudo journalctl -u gita-api -f

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Системные логи
sudo journalctl -f

# Логи с фильтрацией по времени
sudo journalctl -u gita-api --since "1 hour ago"
```

---

## 💾 **Резервное копирование и восстановление**

### **🔄 Система backup'ов:**
```bash
# Полный backup
bash deployment/backup-restore.sh full

# Инкрементальный backup
bash deployment/backup-restore.sh incremental

# Список доступных backup'ов
bash deployment/backup-restore.sh list

# Восстановление из backup'а
bash deployment/backup-restore.sh restore backup.tar.gz safe

# Проверка целостности backup'ов
bash deployment/backup-restore.sh verify
```

### **📁 Что включается в backup:**
- 📂 **Проект:** Все файлы из `/var/www/gita-1972-reprint`
- ⚙️ **Конфигурации:** Nginx, systemd, .env файлы
- 🔒 **SSL сертификаты:** Let's Encrypt сертификаты
- 📝 **Логи:** Последние 7 дней логов
- 📊 **Метаданные:** Информация о системе и версиях

---

## 🧹 **Обслуживание сервера**

### **🔄 Регулярная очистка:**
```bash
# Полная очистка и оптимизация
bash deployment/server-cleanup.sh

# Мониторинг состояния
bash deployment/server-monitor.sh
```

### **📋 Что включает очистка:**
- 🗑️ **Логи:** Ротация и архивирование
- 📦 **Пакеты:** Удаление неиспользуемых
- 🧹 **Temp файлы:** Очистка временных каталогов
- 🔄 **Nginx оптимизация:** Настройка производительности
- 🔧 **Проверка сервисов:** Автозапуск и работоспособность
- 🔒 **Безопасность:** Проверка обновлений и уязвимостей

---

## 🤖 **Автоматизация**

### **⏰ Настройка cron задач:**
```bash
# Установка автоматических задач
sudo bash -c 'cat deployment/crontab.example >> /etc/crontab'

# Или ручная настройка
sudo crontab -e
```

### **📋 Рекомендуемые cron задачи:**
```bash
# Еженедельная очистка (воскресенье в 2:00)
0 2 * * 0 /var/www/gita-1972-reprint/deployment/server-cleanup.sh

# Мониторинг каждые 15 минут
*/15 * * * * /var/www/gita-1972-reprint/deployment/server-monitor.sh

# Ежедневный backup (в 1:00)
0 1 * * * /var/www/gita-1972-reprint/deployment/backup-restore.sh auto

# Проверка API каждые 5 минут с автовосстановлением
*/5 * * * * curl -f http://localhost:3000/api/status || systemctl restart gita-api

# Обновление SSL сертификатов (ежемесячно)
0 0 1 * * /usr/bin/certbot renew --quiet
```

---

## 🚨 **Система алертов и уведомлений**

### **📧 Настройка уведомлений:**
```bash
# Редактирование конфигурации
nano deployment/health-check.sh

# Настройка email
ALERT_EMAIL="admin@gita-1972-reprint.ru"

# Настройка Telegram (опционально)
TELEGRAM_BOT_TOKEN="ваш_токен_бота"
TELEGRAM_CHAT_ID="ваш_chat_id"
```

### **🎯 Уровни алертов:**
- 🟢 **LOW:** Информационные сообщения
- 🟡 **MEDIUM:** Предупреждения (требует внимания)
- 🟠 **HIGH:** Важные проблемы (требует действий)
- 🔴 **CRITICAL:** Критические сбои (немедленное вмешательство)

---

## 🔍 **Диагностика проблем**

### **📋 Быстрая диагностика:**
```bash
# Экстренная диагностика API
bash deployment/api-emergency-fix.sh diagnose

# Полная проверка здоровья
bash deployment/health-check.sh check

# Интерактивная панель управления
bash deployment/server-dashboard.sh
```

### **🔧 Частые проблемы и решения:**

#### **❌ API не отвечает (502 Bad Gateway):**
```bash
# Автоматическое исправление
bash deployment/api-emergency-fix.sh auto
```

#### **❌ Nginx ошибки конфигурации:**
```bash
# Проверка синтаксиса
sudo nginx -t

# Восстановление конфигурации
sudo cp deployment/nginx-ssl.conf /etc/nginx/sites-available/api.gita-1972-reprint.ru
sudo systemctl reload nginx
```

#### **❌ Заполнен диск:**
```bash
# Экстренная очистка
bash deployment/server-cleanup.sh

# Проверка места
df -h /
```

#### **❌ Высокая нагрузка:**
```bash
# Проверка процессов
htop

# Перезапуск сервисов
sudo systemctl restart gita-api nginx
```

---

## 📊 **Производительность и метрики**

### **🎯 Целевые показатели:**
- ⚡ **API Response Time:** < 500ms
- 🌐 **Uptime:** > 99.9%
- 💾 **Disk Usage:** < 80%
- 🧠 **Memory Usage:** < 80%
- ⚙️ **CPU Load:** < 70%

### **📈 Мониторинг производительности:**
```bash
# Время отклика API
curl -o /dev/null -s -w 'Response time: %{time_total}s\n' \
     https://api.gita-1972-reprint.ru/api/status

# Использование ресурсов
free -h          # Память
df -h            # Диск  
uptime           # Нагрузка CPU
```

---

## 🔗 **Связанная документация**

- 🚨 **Экстренное восстановление:** `deployment/SERVER_FIX_INSTRUCTIONS.md`
- 📋 **Полное руководство:** `deployment/README.md`
- 🔧 **Анализ ошибок API:** `deployment/API_ERROR_ANALYSIS.md`
- 💾 **Руководство по backup:** `deployment/backup-restore.sh --help`
- 🌐 **Nginx конфигурации:** `docs/nginx/README.md`

---

## ✅ **Проверочный чек-лист**

### **📋 Ежедневные проверки:**
- [ ] API отвечает: `curl https://api.gita-1972-reprint.ru/api/status`
- [ ] Сайт доступен: `curl https://gita-1972-reprint.ru`
- [ ] Сервисы работают: `systemctl status nginx gita-api`
- [ ] Место на диске: `df -h /`

### **📋 Еженедельные проверки:**
- [ ] Обновления системы: `apt list --upgradable`
- [ ] Логи ошибок: `journalctl --priority=err --since "1 week ago"`
- [ ] SSL сертификаты: `certbot certificates`
- [ ] Backup'ы созданы: `ls -la /backup/`

### **📋 Ежемесячные проверки:**
- [ ] Производительность системы
- [ ] Анализ трафика и метрик
- [ ] Обновление документации
- [ ] Тестирование процедур восстановления

---

## 🎉 **Заключение**

**Система мониторинга проекта "Бхагавад-Гита как она есть" обеспечивает:**

- 🤖 **Автоматическое обнаружение** проблем
- 🔧 **Самовосстановление** при сбоях
- 📊 **Комплексный мониторинг** всех компонентов
- 🚨 **Мгновенные уведомления** о критических проблемах
- 💾 **Надежное резервное копирование**
- 🎛️ **Удобное управление** через интерактивную панель

**🚀 Сервер готов к продакшн нагрузкам и самостоятелен в обслуживании!**