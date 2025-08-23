# 🚨 ЭКСТРЕННЫЕ ИНСТРУКЦИИ ПО ВОССТАНОВЛЕНИЮ API

## ⚠️ **ПРОБЛЕМА**
API сервер `https://api.gita-1972-reprint.ru/` возвращает **502 Bad Gateway**, что означает, что Nginx не может соединиться с backend сервисом (Node.js API).

---

## 🔧 **БЫСТРОЕ ИСПРАВЛЕНИЕ (5 минут)**

### **Шаг 1: Подключение к серверу**
```bash
ssh root@your-server-ip
# или
ssh ubuntu@your-server-ip
```

### **Шаг 2: Загрузка и запуск скрипта экстренного восстановления**
```bash
# Переход в директорию проекта
cd /var/www/gita-1972-reprint

# Загрузка последних изменений
git pull origin main

# Запуск экстренного восстановления
bash deployment/api-emergency-fix.sh auto
```

**Скрипт автоматически:**
- ✅ Проведет полную диагностику
- ✅ Установит недостающие зависимости
- ✅ Создаст systemd сервис
- ✅ Запустит API сервер
- ✅ Перезапустит Nginx
- ✅ Проверит работоспособность

---

## 🔍 **РУЧНАЯ ДИАГНОСТИКА**

### **Проверка 1: Статус сервисов**
```bash
systemctl status nginx
systemctl status gita-api
```

### **Проверка 2: Слушаются ли порты**
```bash
ss -tulpn | grep -E ":(80|443|3000) "
```
**Ожидаемый результат:**
- ✅ Порт 80: nginx
- ✅ Порт 443: nginx  
- ✅ Порт 3000: node (API)

### **Проверка 3: Процессы Node.js**
```bash
ps aux | grep -v grep | grep "node.*server.js"
```

### **Проверка 4: Логи ошибок**
```bash
# Nginx ошибки
tail -20 /var/log/nginx/error.log

# Системные ошибки
journalctl -u gita-api --since "1 hour ago"

# Ошибки API
journalctl -u gita-api -f
```

---

## 🛠️ **РУЧНОЕ ИСПРАВЛЕНИЕ**

### **Вариант 1: Проблема с systemd сервисом**

#### **1.1. Создание сервиса**
```bash
# Копирование файла сервиса
sudo cp /var/www/gita-1972-reprint/deployment/gita-api.service /etc/systemd/system/

# Перезагрузка systemd
sudo systemctl daemon-reload

# Включение и запуск
sudo systemctl enable gita-api
sudo systemctl start gita-api
```

#### **1.2. Проверка статуса**
```bash
sudo systemctl status gita-api
```

### **Вариант 2: Проблема с зависимостями Node.js**

#### **2.1. Проверка Node.js**
```bash
node --version
npm --version
```

#### **2.2. Установка зависимостей**
```bash
cd /var/www/gita-1972-reprint
npm install --production
```

#### **2.3. Тестовый запуск**
```bash
# Тест API
node src/server.js &
sleep 5
curl http://localhost:3000/api/status
```

### **Вариант 3: Проблема с правами доступа**

#### **3.1. Исправление владельца**
```bash
sudo chown -R www-data:www-data /var/www/gita-1972-reprint
sudo chmod -R 755 /var/www/gita-1972-reprint
```

#### **3.2. Исправление .env файла**
```bash
sudo chmod 600 /var/www/gita-1972-reprint/.env
sudo chown www-data:www-data /var/www/gita-1972-reprint/.env
```

### **Вариант 4: Проблема с конфигурацией Nginx**

#### **4.1. Проверка конфигурации**
```bash
sudo nginx -t
```

#### **4.2. Исправление конфигурации**
```bash
# Копирование правильной конфигурации
sudo cp /var/www/gita-1972-reprint/deployment/nginx-ssl.conf /etc/nginx/sites-available/api.gita-1972-reprint.ru

# Включение сайта
sudo ln -sf /etc/nginx/sites-available/api.gita-1972-reprint.ru /etc/nginx/sites-enabled/

# Перезапуск nginx
sudo systemctl restart nginx
```

---

## ✅ **ПРОВЕРКА ВОССТАНОВЛЕНИЯ**

### **1. Локальная проверка**
```bash
curl http://localhost:3000/api/status
```
**Ожидаемый ответ:** `{"status":"ok","timestamp":"..."}`

### **2. Внешняя проверка**
```bash
curl https://api.gita-1972-reprint.ru/api/status
```

### **3. Проверка в браузере**
Откройте: `https://api.gita-1972-reprint.ru/api/status`

---

## 🚨 **ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ**

### **Крайние меры:**

#### **1. Полная переустановка сервиса**
```bash
# Остановка всего
sudo systemctl stop gita-api nginx
sudo pkill -f "node.*server.js"

# Переустановка
cd /var/www/gita-1972-reprint
bash deployment/install-service.sh

# Запуск
sudo systemctl start nginx gita-api
```

#### **2. Ручной запуск для отладки**
```bash
cd /var/www/gita-1972-reprint
sudo -u www-data NODE_ENV=production PORT=3000 node src/server.js
```

#### **3. Проверка firewall**
```bash
# Проверка UFW
sudo ufw status

# Открытие портов если нужно
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
```

---

## 📞 **КОНТАКТЫ ДЛЯ ЭКСТРЕННОЙ ПОМОЩИ**

Если проблема не решается:

1. **Сохраните логи:**
```bash
# Создание архива логов
tar -czf /tmp/gita-debug-$(date +%Y%m%d_%H%M%S).tar.gz \
    /var/log/nginx/ \
    /var/log/journal/ \
    /var/www/gita-1972-reprint/.env \
    /etc/nginx/sites-available/api.gita-1972-reprint.ru
```

2. **Создайте отчет:**
```bash
bash /var/www/gita-1972-reprint/deployment/api-emergency-fix.sh report
```

3. **Предоставьте информацию:**
   - Версия системы: `lsb_release -a`
   - Использование ресурсов: `df -h && free -h`
   - Статус сервисов: `systemctl status nginx gita-api`

---

## ⏰ **ВРЕМЕННАЯ МЕРА**

Если API критично нужен прямо сейчас:

```bash
# Простой запуск без systemd
cd /var/www/gita-1972-reprint
nohup node src/server.js > /var/log/gita-api-manual.log 2>&1 &
```

**⚠️ Помните:** Это временное решение. После восстановления обязательно настройте systemd сервис.

---

## 🎯 **УСПЕХ!**

После успешного восстановления API должен отвечать:
- ✅ `https://api.gita-1972-reprint.ru/api/status` → `{"status":"ok"}`
- ✅ Без ошибок 502 Bad Gateway
- ✅ Быстрый отклик (< 1 секунды)

**🎉 API восстановлен и готов к работе!**
