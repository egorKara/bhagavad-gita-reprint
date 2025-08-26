# 🚀 Развертывание и обслуживание сервера

Этот каталог содержит все необходимые файлы и скрипты для развертывания, настройки и обслуживания сервера проекта "Бхагавад-Гита 1972".

## 🚨 ТЕКУЩИЙ СТАТУС

### ❌ Критические проблемы
- **API сервер недоступен:** https://api.gita-1972-reprint.ru
- **Основной сайт недоступен:** https://gita-1972-reprint.ru
- **GitHub Pages работает:** https://egorkara.github.io/bhagavad-gita-reprint ✅

### 🔧 Что нужно восстановить
1. **systemd сервис** gita-api не запущен
2. **Nginx** не настроен или не работает
3. **SSL сертификаты** возможно истекли
4. **Мониторинг** не активен

## 📁 Структура файлов

```
deployment/
├── README.md                   # Это руководство
├── gita-api.service           # Systemd сервис для API
├── env.production.example     # Пример .env файла
├── install-service.sh         # Скрипт установки сервиса
├── nginx-ssl.conf            # Полная Nginx конфигурация с SSL
├── server-cleanup.sh         # Скрипт очистки и оптимизации
├── server-monitor.sh         # Скрипт мониторинга состояния
├── server-dashboard.sh       # Дашборд состояния сервера
├── health-check.sh           # Проверка здоровья сервисов
├── api-emergency-fix.sh      # Экстренное восстановление API
├── backup-restore.sh         # Бэкап и восстановление
├── crontab.example          # Примеры cron задач
└── SERVER_FIX_INSTRUCTIONS.md # Инструкции по восстановлению
```

## 🚨 ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ

### Быстрое восстановление API

```bash
# 1. Подключиться к серверу
ssh root@your-server-ip

# 2. Перейти в директорию проекта
cd /var/www/gita-1972-reprint

# 3. Запустить экстренное восстановление
sudo bash deployment/api-emergency-fix.sh

# 4. Проверить статус
sudo systemctl status gita-api nginx
```

### Проверка критических сервисов

```bash
# Проверить статус всех сервисов
bash deployment/health-check.sh

# Запустить мониторинг
bash deployment/server-monitor.sh

# Показать дашборд
bash deployment/server-dashboard.sh
```

## 🏗️ Первоначальная настройка

### 1. Установка API сервиса

```bash
# 1. Загрузить проект на сервер в /var/www/gita-1972-reprint
sudo git clone https://github.com/egorkara/bhagavad-gita-reprint.git /var/www/gita-1972-reprint

# 2. Установить Node.js зависимости
cd /var/www/gita-1972-reprint
sudo npm ci --production

# 3. Запустить скрипт установки сервиса
sudo bash deployment/install-service.sh
```

### 2. Настройка Nginx с SSL

```bash
# 1. Скопировать конфигурацию
sudo cp deployment/nginx-ssl.conf /etc/nginx/sites-available/api.gita-1972-reprint.ru

# 2. Создать симлинк
sudo ln -s /etc/nginx/sites-available/api.gita-1972-reprint.ru /etc/nginx/sites-enabled/

# 3. Получить SSL сертификат (сначала без SSL конфигурации)
sudo certbot --nginx -d api.gita-1972-reprint.ru

# 4. Проверить и перезагрузить Nginx
sudo nginx -t && sudo nginx -s reload
```

### 3. Настройка переменных окружения

```bash
# 1. Создать .env файл из примера
sudo cp deployment/env.production.example /var/www/gita-1972-reprint/.env

# 2. Отредактировать с реальными значениями
sudo nano /var/www/gita-1972-reprint/.env

# 3. Установить правильные права
sudo chown www-data:www-data /var/www/gita-1972-reprint/.env
sudo chmod 600 /var/www/gita-1972-reprint/.env
```

## 🔧 Обслуживание сервера

### Очистка и оптимизация

```bash
# Запуск еженедельной очистки
sudo bash deployment/server-cleanup.sh
```

**Что делает скрипт:**
- ✅ Очищает системные логи старше 7 дней
- ✅ Удаляет старые пакеты и кэши
- ✅ Очищает временные файлы
- ✅ Оптимизирует Nginx конфигурацию
- ✅ Проверяет статус сервисов
- ✅ Обновляет список пакетов
- ✅ Проверяет безопасность
- ✅ Переустанавливает Node.js зависимости

### Мониторинг состояния

```bash
# Проверка текущего состояния
bash deployment/server-monitor.sh
```

**Что проверяется:**
- 💾 Дисковое пространство
- 🧠 Использование памяти
- ⚙️ Загрузка CPU
- 🔧 Статус сервисов
- 🌐 Доступность портов
- 🔒 SSL сертификаты
- 📝 Анализ логов
- 📦 Доступные обновления

### Автоматизация с Cron

```bash
# 1. Открыть crontab
sudo crontab -e

# 2. Добавить задачи из примера
cat deployment/crontab.example
```

**Рекомендуемые задачи:**
- 🧹 Еженедельная очистка (воскресенье в 2:00)
- 🔍 Мониторинг каждые 15 минут
- 🔐 Обновление SSL сертификатов
- 💾 Ежедневные бэкапы
- 🛡️ Проверки безопасности

## 🚨 Устранение неполадок

### API не отвечает (502 Bad Gateway)

```bash
# 1. Проверить статус сервиса
sudo systemctl status gita-api

# 2. Перезапустить если нужно
sudo systemctl restart gita-api

# 3. Проверить логи
sudo journalctl -u gita-api -f

# 4. Проверить порт
sudo ss -tulpn | grep :3000

# 5. Запустить экстренное восстановление
sudo bash deployment/api-emergency-fix.sh
```

### Проблемы с SSL

```bash
# 1. Проверить сертификат
sudo certbot certificates

# 2. Обновить если нужно
sudo certbot renew

# 3. Проверить Nginx конфигурацию
sudo nginx -t

# 4. Перезагрузить Nginx
sudo nginx -s reload
```

### Нехватка места на диске

```bash
# 1. Запустить очистку
sudo bash deployment/server-cleanup.sh

# 2. Проверить использование
df -h
du -sh /var/* | sort -hr | head -10

# 3. Очистить Docker если используется
docker system prune -a
```

### Полное восстановление сервера

```bash
# 1. Запустить полную диагностику
bash deployment/health-check.sh

# 2. Показать дашборд состояния
bash deployment/server-dashboard.sh

# 3. Запустить экстренное восстановление
sudo bash deployment/api-emergency-fix.sh

# 4. Проверить результат
bash deployment/server-monitor.sh
```

## 📊 Управление сервисом

### Основные команды

```bash
# Статус сервиса
sudo systemctl status gita-api

# Запуск
sudo systemctl start gita-api

# Остановка
sudo systemctl stop gita-api

# Перезапуск
sudo systemctl restart gita-api

# Перезагрузка конфигурации
sudo systemctl reload gita-api

# Включить автозапуск
sudo systemctl enable gita-api

# Отключить автозапуск
sudo systemctl disable gita-api
```

### Просмотр логов

```bash
# Последние логи
sudo journalctl -u gita-api

# Логи в реальном времени
sudo journalctl -u gita-api -f

# Логи за сегодня
sudo journalctl -u gita-api --since today

# Логи с ошибками
sudo journalctl -u gita-api -p err
```

## 🔒 Безопасность

### Рекомендации

1. **Файрвол:**
   ```bash
   sudo ufw enable
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   ```

2. **Fail2Ban:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Автоматические обновления безопасности:**
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure unattended-upgrades
   ```

4. **Мониторинг SSH:**
   ```bash
   # Отключить root логин
   sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   ```

## 📈 Производительность

### Настройка Nginx

Файл `nginx-ssl.conf` уже содержит оптимизированные настройки:
- ✅ HTTP/2 поддержка
- ✅ SSL оптимизация
- ✅ Правильные заголовки безопасности
- ✅ CORS настройки
- ✅ Проксирование с таймаутами

### Мониторинг ресурсов

```bash
# Использование памяти
free -h

# Загрузка CPU
htop

# Дисковая активность
iotop

# Сетевая активность
nethogs
```

## 🆘 Экстренные процедуры

### Быстрое восстановление

```bash
# 1. Перезапуск всех сервисов
sudo systemctl restart nginx gita-api

# 2. Проверка состояния
bash deployment/server-monitor.sh

# 3. Очистка если нужно
sudo bash deployment/server-cleanup.sh

# 4. Экстренное восстановление если не помогло
sudo bash deployment/api-emergency-fix.sh
```

### Откат к предыдущей версии

```bash
# 1. Остановить сервис
sudo systemctl stop gita-api

# 2. Откатить код
cd /var/www/gita-1972-reprint
sudo git checkout HEAD~1

# 3. Переустановить зависимости
sudo npm ci --production

# 4. Запустить сервис
sudo systemctl start gita-api
```

### Полное восстановление из бэкапа

```bash
# 1. Остановить все сервисы
sudo systemctl stop nginx gita-api

# 2. Восстановить из бэкапа
sudo bash deployment/backup-restore.sh --restore

# 3. Запустить сервисы
sudo systemctl start nginx gita-api

# 4. Проверить состояние
bash deployment/health-check.sh
```

## 📞 Поддержка

При возникновении проблем:

1. 📋 Запустите диагностику: `bash deployment/health-check.sh`
2. 📊 Покажите дашборд: `bash deployment/server-dashboard.sh`
3. 📝 Проверьте логи: `sudo journalctl -u gita-api -f`
4. 🧹 Выполните очистку: `sudo bash deployment/server-cleanup.sh`
5. 🚨 Запустите экстренное восстановление: `sudo bash deployment/api-emergency-fix.sh`
6. 📧 Отправьте отчет администратору

### Приоритеты восстановления

1. **Критично:** Восстановить API сервер
2. **Критично:** Восстановить основной сайт
3. **Важно:** Проверить SSL сертификаты
4. **Важно:** Запустить systemd сервисы
5. **Средне:** Обновить мониторинг

---

**Автор:** Система автоматизации Gita 1972  
**Версия:** 1.1  
**Дата:** Август 2025  
**Статус:** ⚠️ ТРЕБУЕТ ВОССТАНОВЛЕНИЯ API
