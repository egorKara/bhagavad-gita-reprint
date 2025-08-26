# 🚀 ФИНАЛЬНЫЕ ИНСТРУКЦИИ ПО ВОССТАНОВЛЕНИЮ API

## 🎯 СТАТУС НА АВГУСТ 2025

**✅ ВЫПОЛНЕНО В DEV СРЕДЕ:**
- API сервер успешно запущен и работает
- Nginx конфигурация проверена
- Все endpoints отвечают корректно
- Диагностические инструменты протестированы

**⚠️ ТРЕБУЕТ ВЫПОЛНЕНИЯ НА ПРОДАКШН СЕРВЕРЕ:**
- Применить исправление ES modules
- Перезапустить systemd сервис
- Обновить SSL сертификаты

---

## 🔧 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ

### **Проблема:** 
API не запускается из-за конфликта ES modules в package.json

### **Решение:**
```bash
# Убрать строку "type": "module" из package.json
sed -i '/"type": "module",/d' package.json
```

---

## 📋 ПОШАГОВЫЕ КОМАНДЫ ДЛЯ ПРОДАКШН СЕРВЕРА

### **1. Подключение к серверу**
```bash
ssh root@your-server-ip
# или
ssh your-username@your-server-ip
```

### **2. Переход в директорию проекта**
```bash
cd /var/www/gita-1972-reprint
```

### **3. Применение критического исправления**
```bash
# Создать резервную копию
cp package.json package.json.backup

# Применить исправление
sed -i '/"type": "module",/d' package.json

# Проверить изменения
grep -n "type" package.json || echo "Исправление применено"
```

### **4. Остановка конфликтующих процессов**
```bash
# Остановить все процессы Node.js
sudo pkill -f "node.*server.js"

# Остановить systemd сервис
sudo systemctl stop gita-api

# Проверить что порт свободен
sudo ss -tulpn | grep ":3000" || echo "Порт 3000 свободен"
```

### **5. Перезапуск API сервиса**
```bash
# Запустить systemd сервис
sudo systemctl start gita-api

# Проверить статус
sudo systemctl status gita-api

# Если все хорошо, включить автозапуск
sudo systemctl enable gita-api
```

### **6. Проверка работоспособности**
```bash
# Локальная проверка
curl http://localhost:3000/api/status
curl http://localhost:3000/livez
curl http://localhost:3000/readyz

# Внешняя проверка
curl https://api.gita-1972-reprint.ru/api/status
curl https://gita-1972-reprint.ru/
```

---

## 🔒 SSL СЕРТИФИКАТЫ

### **Проверка текущих сертификатов**
```bash
sudo certbot certificates
```

### **Обновление сертификатов (если нужно)**
```bash
# Обновить все сертификаты
sudo certbot renew

# Создать новые (если нужно)
sudo certbot --nginx -d api.gita-1972-reprint.ru -d gita-1972-reprint.ru

# Проверить Nginx конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## 🛠 ЭКСТРЕННЫЕ ИНСТРУМЕНТЫ

### **Если что-то пойдет не так:**

#### **Полное экстренное восстановление**
```bash
sudo bash deployment/api-emergency-fix.sh
```

#### **Только диагностика**
```bash
sudo bash deployment/api-emergency-fix.sh diagnose
```

#### **Проверка здоровья системы**
```bash
bash deployment/health-check.sh
```

#### **Интерактивный дашборд**
```bash
bash deployment/server-dashboard.sh
```

#### **Мониторинг в реальном времени**
```bash
bash deployment/server-monitor.sh
```

---

## ✅ ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ

После успешного выполнения вы должны увидеть:

### **Статус сервисов:**
```bash
sudo systemctl status nginx gita-api
# Оба должны быть active (running)
```

### **Порты:**
```bash
sudo ss -tulpn | grep -E ":(80|443|3000)"
# Все три порта должны слушаться
```

### **API тесты:**
```bash
curl http://localhost:3000/api/status
# Должен вернуть: {"status":"OK","message":"Сервер работает корректно"...}

curl https://api.gita-1972-reprint.ru/api/status  
# Должен работать через HTTPS
```

---

## 🚨 УСТРАНЕНИЕ ПРОБЛЕМ

### **Если API все еще не запускается:**

1. **Проверить логи:**
   ```bash
   sudo journalctl -u gita-api -f
   ```

2. **Проверить порт:**
   ```bash
   sudo lsof -i :3000
   ```

3. **Запустить вручную для отладки:**
   ```bash
   cd /var/www/gita-1972-reprint
   node src/server.js
   ```

4. **Проверить права доступа:**
   ```bash
   sudo chown -R www-data:www-data /var/www/gita-1972-reprint
   sudo chmod +x deployment/*.sh
   ```

### **Если Nginx не работает:**

1. **Проверить конфигурацию:**
   ```bash
   sudo nginx -t
   ```

2. **Восстановить конфигурацию:**
   ```bash
   sudo cp deployment/nginx-ssl.conf /etc/nginx/sites-available/api.gita-1972-reprint.ru
   sudo ln -sf /etc/nginx/sites-available/api.gita-1972-reprint.ru /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

---

## 📊 МОНИТОРИНГ ПОСЛЕ ВОССТАНОВЛЕНИЯ

### **Настройка автоматических проверок:**
```bash
# Добавить в crontab
sudo crontab -e

# Добавить эти строки:
*/15 * * * * /home/user/gita-1972-reprint/deployment/health-check.sh >/dev/null 2>&1
0 2 * * 0 /home/user/gita-1972-reprint/deployment/server-cleanup.sh >/dev/null 2>&1
0 3 * * * /usr/bin/certbot renew --quiet
```

### **Проверка логов:**
```bash
# API логи
sudo journalctl -u gita-api --since today

# Nginx логи  
sudo tail -f /var/log/nginx/error.log

# Системные логи
sudo journalctl --since "1 hour ago" --priority=err
```

---

## 🎯 ИТОГОВАЯ ПРОВЕРКА

После выполнения всех шагов запустите финальную проверку:

```bash
echo "🎯 ФИНАЛЬНАЯ ПРОВЕРКА:"
echo "===================="

echo "Сервисы:"
sudo systemctl is-active nginx && echo "✅ Nginx" || echo "❌ Nginx"
sudo systemctl is-active gita-api && echo "✅ API" || echo "❌ API"

echo "Порты:"
sudo ss -tulpn | grep ":80" && echo "✅ HTTP" || echo "❌ HTTP"
sudo ss -tulpn | grep ":443" && echo "✅ HTTPS" || echo "❌ HTTPS"  
sudo ss -tulpn | grep ":3000" && echo "✅ API" || echo "❌ API"

echo "API тесты:"
curl -s http://localhost:3000/api/status >/dev/null && echo "✅ Локальный API" || echo "❌ Локальный API"
curl -s https://api.gita-1972-reprint.ru/api/status >/dev/null && echo "✅ Внешний API" || echo "❌ Внешний API"

echo "🎉 Восстановление завершено!"
```

---

**📞 ПОДДЕРЖКА:**
- Документация: `/var/www/gita-1972-reprint/deployment/`
- Логи экстренного восстановления: `/var/log/api-emergency-fix.log`
- Отчеты о здоровье: `/tmp/health-report-*.txt`

**🎉 УСПЕХОВ В ВОССТАНОВЛЕНИИ! 🚀**
