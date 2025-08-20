# 📊 Мониторинг сервера Gita

## 🚀 Доступные инструменты

### 1. Веб-дашборд
- **URL**: `https://gita-1972-reprint.ru/dashboard.html`
- **Функции**: Мониторинг в реальном времени всех сервисов
- **Автообновление**: Каждые 30 секунд

### 2. API endpoints для мониторинга
- **Статус API**: `GET /api/status`
- **Системная информация**: `GET /api/system-info`
- **Статус безопасности**: `GET /api/security-status`
- **Статистика Nginx**: `GET /api/nginx-stats`
- **Prometheus метрики**: `GET /metrics`

### 3. Скрипт мониторинга
- **Путь**: `/srv/gita/monitor.sh`
- **Запуск**: `sudo /srv/gita/monitor.sh`
- **Автоматический запуск**: Каждые 5 минут через systemd timer

## 🔧 Автоматизация

### Автоматическое развертывание
- **Сервис**: `gita-deploy.service`
- **Таймер**: `gita-deploy.timer` (каждые 30 минут)
- **Логи**: `journalctl -u gita-deploy.service`

### Автоматический мониторинг
- **Сервис**: `gita-monitor.service`
- **Таймер**: `gita-monitor.timer` (каждые 5 минут)
- **Логи**: `journalctl -u gita-monitor.service`

## 📈 Метрики

### Системные ресурсы
- **CPU**: Загрузка процессора в процентах
- **Memory**: Использование оперативной памяти
- **Disk**: Использование дискового пространства
- **Uptime**: Время работы сервера

### Nginx статистика
- **Active Connections**: Активные соединения
- **Total Requests**: Общее количество запросов
- **Reading/Writing**: Текущие операции

### Безопасность
- **Fail2ban**: Статус системы защиты
- **SSL**: Статус HTTPS сертификатов
- **Security Headers**: Заголовки безопасности

## 🛠️ Управление

### Просмотр статуса
```bash
# Все сервисы
sudo systemctl status nginx gita fail2ban

# Все таймеры
sudo systemctl list-timers

# Логи мониторинга
journalctl -u gita-monitor.service -f

# Логи развертывания
journalctl -u gita-deploy.service -f
```

### Ручной запуск
```bash
# Мониторинг
sudo systemctl start gita-monitor.service

# Развертывание
sudo systemctl start gita-deploy.service

# Скрипт мониторинга
sudo /srv/gita/monitor.sh
```

### Остановка/запуск таймеров
```bash
# Остановить мониторинг
sudo systemctl stop gita-monitor.timer

# Запустить мониторинг
sudo systemctl start gita-monitor.timer

# Отключить автозапуск
sudo systemctl disable gita-monitor.timer
```

## 🔍 Диагностика

### Проверка конфигурации
```bash
# Nginx
sudo nginx -t

# Systemd
sudo systemctl daemon-reload
```

### Просмотр логов
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -f
```

### Проверка безопасности
```bash
# Fail2ban статус
sudo fail2ban-client status

# Заблокированные IP
sudo fail2ban-client banned
```

## 📊 Prometheus метрики

### Доступные метрики
- `process_cpu_seconds_total` - CPU время
- `process_resident_memory_bytes` - Использование памяти
- `http_request_duration_seconds` - Время ответа API
- `http_requests_total` - Общее количество запросов

### Интеграция
Метрики доступны по адресу `/metrics` и могут быть собраны Prometheus сервером для долгосрочного мониторинга и алертов.

## 🚨 Алерты

### Автоматические проверки
- Мониторинг каждые 5 минут
- Проверка статуса всех сервисов
- Отслеживание использования ресурсов
- Мониторинг безопасности

### Ручные проверки
```bash
# Полный отчет
sudo /srv/gita/monitor.sh

# Проверка конкретного сервиса
sudo systemctl is-active nginx
curl -s http://localhost:3000/api/status
```
