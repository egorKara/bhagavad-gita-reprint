# 🤖 РАЗВЕРТЫВАНИЕ YANDEX SERVER AGENT

## 📋 Краткое описание

**Yandex Server Agent** - автономный агент для поддержания сервера Yandex Cloud в отличном состоянии. Агент автоматически:

- 🔍 Мониторит API, сервисы и ресурсы системы
- 🔧 Автоматически исправляет проблемы
- 🔄 Синхронизируется с Cursor IDE и другими агентами
- 📊 Генерирует отчеты о состоянии
- 🚨 Выполняет экстренное восстановление

---

## 🚀 БЫСТРОЕ РАЗВЕРТЫВАНИЕ

### Шаг 1: Загрузка файлов на сервер

```bash
# Подключение к серверу
yc compute ssh --id fhmmuttj78nf215noffh --identity-file ~/.ssh/ssh-key-1753182147967 --login yc-user

# Переход в директорию проекта
cd /home/yc-user/gita-1972/

# Создание директории агента
mkdir -p server-agent

# Загрузка файлов (с локальной машины через scp)
scp -i ~/.ssh/ssh-key-1753182147967 server-agent/* yc-user@46.21.247.218:/home/yc-user/gita-1972/server-agent/
```

### Шаг 2: Установка агента

```bash
# Переход в директорию агента
cd /home/yc-user/gita-1972/server-agent/

# Запуск установки
sudo bash install-agent.sh
```

### Шаг 3: Проверка работы

```bash
# Статус сервиса
systemctl status yandex-server-agent

# Просмотр логов
journalctl -u yandex-server-agent -f

# Мониторинг агента
./monitor-agent.sh
```

---

## 📁 СТРУКТУРА ФАЙЛОВ

```
server-agent/
├── yandex-server-agent.py      # Основной скрипт агента
├── agent-config.json           # Конфигурация агента
├── sync-with-cursor.py         # Модуль синхронизации с Cursor
├── install-agent.sh           # Установочный скрипт
├── monitor-agent.sh           # Скрипт мониторинга (создается при установке)
└── DEPLOYMENT_INSTRUCTIONS.md # Эта инструкция
```

### На сервере после установки:
```
/home/yc-user/gita-1972/
├── server-agent/              # Файлы агента
├── logs/
│   ├── server-agent.log      # Логи агента
│   ├── agent-status.json     # Статус агента
│   └── sync-report.json      # Отчеты синхронизации
└── .cursor/
    ├── memory-bank/
    │   └── server-status.md  # Обновляется агентом
    └── sync-status.log       # Статус синхронизации
```

---

## ⚙️ КОНФИГУРАЦИЯ

### Основные параметры в `agent-config.json`:

```json
{
  "monitoring": {
    "interval_minutes": 15,        // Интервал проверок
    "working_hours": "24/7",       // Режим работы
    "alerts": {
      "cpu_threshold": 80,         // Порог CPU %
      "memory_threshold": 80,      // Порог RAM %
      "disk_threshold": 85         // Порог диска %
    }
  },
  "automation": {
    "auto_restart_services": true,  // Автоперезапуск сервисов
    "auto_cleanup_logs": true,      // Автоочистка логов
    "auto_ssl_renewal": true,       // Автообновление SSL
    "emergency_recovery": true      // Экстренное восстановление
  }
}
```

---

## 🔄 СИНХРОНИЗАЦИЯ С CURSOR IDE

### Автоматическая синхронизация:

1. **Чтение приоритетов** из `.cursor/rules/agent-priorities.mdc`
2. **Обновление статуса** в `.cursor/sync-status.log`
3. **Синхронизация Memory Bank** в `.cursor/memory-bank/server-status.md`
4. **Git синхронизация** с GitHub репозиторием

### Интервалы синхронизации:
- **С Cursor:** каждый час
- **С GitHub:** каждые 30 минут
- **Memory Bank:** каждые 5 минут

---

## 📊 МОНИТОРИНГ И УПРАВЛЕНИЕ

### Команды управления:

```bash
# Проверка статуса
systemctl status yandex-server-agent

# Перезапуск агента
sudo systemctl restart yandex-server-agent

# Просмотр логов в реальном времени
journalctl -u yandex-server-agent -f

# Просмотр конфигурации
cat /home/yc-user/gita-1972/server-agent/agent-config.json

# Мониторинг системы
/home/yc-user/gita-1972/server-agent/monitor-agent.sh
```

### Файлы логов:

- **Основные логи:** `/home/yc-user/gita-1972/logs/server-agent.log`
- **Системные логи:** `journalctl -u yandex-server-agent`
- **Статус агента:** `/home/yc-user/gita-1972/logs/agent-status.json`
- **Отчеты синхронизации:** `/home/yc-user/gita-1972/logs/sync-report.json`

---

## 🎯 АВТОМАТИЧЕСКИЕ ДЕЙСТВИЯ АГЕНТА

### Критические проверки (каждые 15 минут):
- ✅ Доступность API: `https://api.gita-1972-reprint.ru/api/status`
- ✅ Статус systemd сервисов: `gita-api`, `nginx`
- ✅ Ресурсы системы: CPU, RAM, диск
- ✅ SSL сертификаты: срок действия

### Автоматические исправления:
- 🔧 **Перезапуск упавших сервисов**
- 🧹 **Очистка логов при заполнении диска**
- 🔒 **Обновление SSL сертификатов**
- 🚨 **Экстренное восстановление API**

### Синхронизация:
- 🔄 **Обновление приоритетов из Cursor IDE**
- 📊 **Отправка метрик в Memory Bank**
- 📝 **Коммиты изменений в GitHub**
- 📋 **Обновление статуса синхронизации**

---

## 🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ

При обнаружении критических проблем агент автоматически:

1. **Запускает** `deployment/api-emergency-fix.sh`
2. **Перезапускает** все сервисы
3. **Очищает** временные файлы
4. **Уведомляет** через логи и синхронизацию

---

## 🔧 РАСШИРЕННАЯ НАСТРОЙКА

### Изменение интервала мониторинга:

```bash
# Редактирование конфигурации
nano /home/yc-user/gita-1972/server-agent/agent-config.json

# Изменить interval_minutes с 15 на нужное значение
# Перезапуск агента
sudo systemctl restart yandex-server-agent
```

### Добавление новых проверок:

1. Отредактировать `yandex-server-agent.py`
2. Добавить новую функцию проверки
3. Включить в `perform_critical_checks()`
4. Перезапустить агент

### Настройка уведомлений:

Агент поддерживает расширение для:
- Email уведомлений
- Slack интеграции
- Webhook вызовов
- SMS алертов

---

## 🐛 УСТРАНЕНИЕ НЕИСПРАВНОСТЕЙ

### Агент не запускается:

```bash
# Проверка логов
journalctl -u yandex-server-agent -n 50

# Проверка Python зависимостей
python3 -c "import requests, schedule, psutil; print('Dependencies OK')"

# Ручной запуск для отладки
cd /home/yc-user/gita-1972/server-agent/
python3 yandex-server-agent.py
```

### Проблемы с синхронизацией:

```bash
# Проверка доступности GitHub
git status
git pull

# Проверка файлов Cursor
ls -la /home/yc-user/gita-1972/.cursor/

# Ручная синхронизация
cd /home/yc-user/gita-1972/server-agent/
python3 sync-with-cursor.py
```

### Высокое использование ресурсов:

```bash
# Мониторинг процессов
top -p $(pgrep -f yandex-server-agent)

# Проверка размера логов
du -h /home/yc-user/gita-1972/logs/

# Очистка старых логов
find /home/yc-user/gita-1972/logs/ -name "*.log" -mtime +7 -delete
```

---

## 📈 ПРОИЗВОДИТЕЛЬНОСТЬ

### Ресурсы агента:
- **CPU:** < 5% среднее использование
- **RAM:** < 100MB потребление
- **Диск:** < 500MB логи и данные
- **Сеть:** минимальный трафик

### Оптимизация:
- Логи ротируются автоматически (30 дней)
- Проверки оптимизированы по времени
- Кэширование результатов
- Graceful handling ошибок

---

## 🔒 БЕЗОПАСНОСТЬ

### Права доступа:
- Агент работает от пользователя `yc-user`
- Sudo права только для системных операций
- Логи защищены правами 644
- Конфигурация 600

### Аудит:
- Все действия логируются
- Изменения отслеживаются в Git
- Статус синхронизируется с Cursor
- Отчеты сохраняются локально

---

*Создано: 26 августа 2025*  
*Версия: 1.0*  
*Автор: AI Assistant*
