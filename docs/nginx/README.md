# 🌐 Nginx Конфигурации

## 📋 Обзор

Этот каталог содержит конфигурации Nginx для проекта "Бхагавад-Гита как она есть".

---

## 📁 **Файлы в этом каталоге**

### **✅ main.conf** 
**Назначение:** Конфигурация для основного сайта `gita-1972-reprint.ru`

**Возможности:**
- 🔒 **HTTPS с Let's Encrypt** сертификатами
- 🔄 **HTTP → HTTPS редирект**
- 📁 **Статические файлы** из `/var/www/gita-1972-reprint/public`
- 💾 **Кэширование** статических ресурсов (30 дней)
- 🛡️ **Заголовки безопасности** (HSTS, X-Frame-Options и др.)
- 📝 **Логирование** в отдельные файлы

### **🗑️ api.conf** *(УДАЛЕН)*
**Причина удаления:** Небезопасная конфигурация (только HTTP, без SSL)

---

## 🚀 **Актуальные конфигурации**

### **Для продакшн сервера используйте:**

1. **Основной сайт:** `docs/nginx/main.conf`
2. **API сервер:** `deployment/nginx-ssl.conf` ✅ **РЕКОМЕНДУЕТСЯ**

---

## ⚙️ **Установка конфигураций**

### **1. Основной сайт:**
```bash
# Копирование конфигурации
sudo cp docs/nginx/main.conf /etc/nginx/sites-available/gita-1972-reprint.ru

# Включение сайта
sudo ln -sf /etc/nginx/sites-available/gita-1972-reprint.ru /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезапуск nginx
sudo systemctl reload nginx
```

### **2. API сервер:**
```bash
# Копирование актуальной конфигурации
sudo cp deployment/nginx-ssl.conf /etc/nginx/sites-available/api.gita-1972-reprint.ru

# Включение сайта
sudo ln -sf /etc/nginx/sites-available/api.gita-1972-reprint.ru /etc/nginx/sites-enabled/

# Проверка и перезапуск
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🔒 **SSL Сертификаты**

### **Получение Let's Encrypt сертификатов:**
```bash
# Установка certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Основной сайт
sudo certbot --nginx -d gita-1972-reprint.ru --non-interactive --agree-tos -m admin@gita-1972-reprint.ru

# API сайт
sudo certbot --nginx -d api.gita-1972-reprint.ru --non-interactive --agree-tos -m admin@gita-1972-reprint.ru
```

### **Автообновление сертификатов:**
```bash
# Добавить в crontab
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

---

## 🛡️ **Особенности безопасности**

### **В конфигурациях включены:**
- 🔒 **TLS 1.2/1.3** только современные протоколы
- 🛡️ **HSTS** принудительное использование HTTPS
- 🚫 **X-Frame-Options DENY** защита от clickjacking
- 🔒 **X-Content-Type-Options nosniff** защита от MIME sniffing
- 🛡️ **XSS Protection** базовая защита от XSS

### **Для API дополнительно:**
- 🌐 **CORS настройки** для правильной работы с фронтендом
- ⏱️ **Таймауты** для предотвращения зависания
- 📊 **Rate limiting** (в deployment версии)

---

## 📊 **Мониторинг**

### **Логи располагаются в:**
```
/var/log/nginx/gita-main-access.log    # Основной сайт (доступ)
/var/log/nginx/gita-main-error.log     # Основной сайт (ошибки)
/var/log/nginx/api.gita-access.log     # API (доступ)
/var/log/nginx/api.gita-error.log      # API (ошибки)
```

### **Полезные команды:**
```bash
# Проверка статуса nginx
sudo systemctl status nginx

# Просмотр конфигурации
sudo nginx -T

# Проверка синтаксиса
sudo nginx -t

# Перезагрузка без даунтайма
sudo systemctl reload nginx

# Мониторинг логов в реальном времени
sudo tail -f /var/log/nginx/*.log
```

---

## ⚠️ **Важные замечания**

1. **🔧 Перед применением конфигураций:**
   - Убедитесь, что домены указывают на ваш сервер
   - Получите SSL сертификаты
   - Проверьте пути к файлам проекта

2. **📁 Пути в конфигурациях:**
   - Проект: `/var/www/gita-1972-reprint`
   - Статические файлы: `/var/www/gita-1972-reprint/public`
   - API: `http://127.0.0.1:3000`

3. **🚀 Для автоматической установки:**
   - Используйте `deployment/install-service.sh`
   - Все настройки применятся автоматически

---

## 🔗 **Связанная документация**

- 📋 **Полное руководство:** `deployment/README.md`
- 🚨 **Устранение проблем:** `deployment/SERVER_FIX_INSTRUCTIONS.md`
- 🎛️ **Управление сервером:** `deployment/server-dashboard.sh`
- 📊 **Мониторинг:** `deployment/health-check.sh`

---

## ✅ **Проверка работоспособности**

После настройки должны работать:
- ✅ `https://gita-1972-reprint.ru` → основной сайт
- ✅ `https://api.gita-1972-reprint.ru` → API сервер
- ✅ `http://gita-1972-reprint.ru` → редирект на HTTPS
- ✅ SSL сертификаты валидны
- ✅ Все статические файлы кэшируются

**🎉 Конфигурации готовы к продакшн использованию!**
