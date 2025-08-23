# 🚨 Руководство по устранению проблемы API

## 📊 Диагностика проблемы

**Ошибка:** 502 Bad Gateway на https://api.gita-1972-reprint.ru/  
**Причина:** Nginx не может достучаться до Node.js backend сервера

## 🔍 Проверка на сервере

### 1. Проверить статус Nginx
```bash
sudo systemctl status nginx
sudo nginx -t  # проверка конфигурации
```

### 2. Проверить запущен ли Node.js сервер
```bash
ps aux | grep node
sudo netstat -tulpn | grep :3000
```

### 3. Проверить логи
```bash
# Nginx error log
sudo tail -f /var/log/nginx/error.log

# Если есть systemd сервис для приложения
sudo journalctl -u gita-api -f

# PM2 логи (если используется)
pm2 logs
```

## 🛠️ Решение проблемы

### Вариант 1: Запуск сервера вручную
```bash
cd /path/to/project
npm install
npm start  # или node src/server.js
```

### Вариант 2: Systemd сервис (рекомендуется)

1. Создать файл сервиса:
```bash
sudo nano /etc/systemd/system/gita-api.service
```

2. Содержимое сервиса:
```ini
[Unit]
Description=Gita 1972 API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/gita-1972-reprint
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

3. Запустить сервис:
```bash
sudo systemctl daemon-reload
sudo systemctl enable gita-api
sudo systemctl start gita-api
sudo systemctl status gita-api
```

### Вариант 3: PM2 (альтернатива)
```bash
npm install -g pm2
pm2 start src/server.js --name gita-api
pm2 startup
pm2 save
```

## ⚙️ Конфигурация

### Nginx upstream (docs/nginx/api.conf)
```nginx
server {
    listen 80;
    server_name api.gita-1972-reprint.ru;

    location / {
        proxy_pass http://127.0.0.1:3000/;  # ← проверить что порт совпадает
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Environment файл (.env)
```bash
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://gita-1972-reprint.ru,https://www.gita-1972-reprint.ru
```

## 🔧 Быстрое решение

1. **Проверить порт:**
   ```bash
   sudo ss -tulpn | grep :3000
   ```

2. **Если порт свободен - запустить сервер:**
   ```bash
   cd /var/www/gita-1972-reprint  # путь к проекту
   node src/server.js
   ```

3. **Проверить работу API:**
   ```bash
   curl http://localhost:3000/api/status
   ```

4. **Если работает локально - проблема в Nginx или SSL:**
   ```bash
   sudo nginx -s reload
   ```

## 📋 Checklist

- [ ] Nginx запущен и работает
- [ ] Порт 3000 слушается Node.js процессом  
- [ ] Nginx проксирует на правильный порт
- [ ] SSL сертификат действителен
- [ ] Файрвол не блокирует соединения
- [ ] Достаточно места на диске для логов

## 💡 Дополнительные команды

```bash
# Перезапуск всех сервисов
sudo systemctl restart nginx
sudo systemctl restart gita-api

# Проверка конфигурации Nginx
sudo nginx -t && sudo nginx -s reload

# Мониторинг в реальном времени
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

После выполнения этих шагов API должен снова заработать! 🚀
