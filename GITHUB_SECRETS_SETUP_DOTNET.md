# 🔐 НАСТРОЙКА GITHUB SECRETS ДЛЯ .NET ПРОЕКТА

## 🎯 **ЦЕЛЬ**
Настроить безопасное хранение всех секретных данных в GitHub Secrets для проекта GitaLanding.

---

## 📍 **ДОСТУП К НАСТРОЙКАМ**

### **🔗 Прямая ссылка:**
```
https://github.com/egorKara/bhagavad-gita-reprint/settings/secrets/actions
```

### **📋 Пошаговый путь:**
1. Repository → Settings
2. Secrets and variables → Actions
3. New repository secret

---

## 🔑 **ОБЯЗАТЕЛЬНЫЕ SECRETS**

### **🤖 TELEGRAM BOT**
```
Name: TELEGRAM_BOT_TOKEN
Value: 8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s
Description: Токен Telegram бота для уведомлений
```

```
Name: TELEGRAM_CHAT_ID
Value: 6878699213
Description: ID чата для отправки уведомлений
```

### **🗄️ БАЗА ДАННЫХ**
```
Name: DB_CONNECTION_STRING
Value: Host=localhost;Database=gitalanding;Username=gita_user;Password=your_secure_password;Port=5432
Description: Строка подключения к PostgreSQL
```

### **🔑 API ТОКЕНЫ**
```
Name: ADMIN_TOKEN
Value: your_secure_admin_token_here
Description: Токен для административных операций
```

```
Name: METRICS_TOKEN
Value: your_secure_metrics_token_here
Description: Токен для доступа к метрикам
```

---

## 🌐 **ДОПОЛНИТЕЛЬНЫЕ SECRETS**

### **🔒 БЕЗОПАСНОСТЬ**
```
Name: RECAPTCHA_SECRET
Value: your_recaptcha_secret_here
Description: Секретный ключ Google reCAPTCHA
```

```
Name: TURNSTILE_SECRET
Value: your_turnstile_secret_here
Description: Секретный ключ Cloudflare Turnstile
```

### **🔧 ВНЕШНИЕ API**
```
Name: TRANSLATOR_API_KEY
Value: your_translator_api_key_here
Description: Ключ API для переводчика
```

```
Name: GOOGLE_TRANSLATE_KEY
Value: your_google_api_key_here
Description: Ключ Google Translate API
```

```
Name: DEEPL_API_KEY
Value: your_deepl_api_key_here
Description: Ключ DeepL API
```

```
Name: YANDEX_API_KEY
Value: your_yandex_api_key_here
Description: Ключ Yandex API
```

---

## 🚀 **DEPLOYMENT SECRETS**

### **☁️ YANDEX CLOUD**
```
Name: YANDEX_CLOUD_TOKEN
Value: your_yandex_cloud_token_here
Description: Токен для доступа к Yandex Cloud
```

```
Name: YANDEX_SERVICE_ACCOUNT_KEY
Value: [base64-encoded-json-key]
Description: Ключ сервисного аккаунта Yandex Cloud
```

### **🔐 SSH ДОСТУП**
```
Name: SSH_PRIVATE_KEY
Value: [содержимое приватного SSH ключа]
Description: Приватный SSH ключ для доступа к серверу
```

```
Name: SERVER_HOST
Value: 46.21.247.218
Description: IP адрес сервера
```

```
Name: SERVER_USER
Value: egorkara
Description: Пользователь для SSH подключения
```

---

## 📋 **ПОШАГОВАЯ НАСТРОЙКА**

### **1️⃣ Подготовка данных**
- Соберите все токены и ключи
- Убедитесь, что они актуальны
- Подготовьте описания для каждого secret

### **2️⃣ Добавление в GitHub**
- Перейдите по ссылке выше
- Нажмите "New repository secret"
- Заполните Name, Value и Description
- Нажмите "Add secret"

### **3️⃣ Проверка**
- Убедитесь, что все secrets добавлены
- Проверьте, что нет дубликатов
- Убедитесь, что описания понятны

---

## 🔒 **БЕЗОПАСНОСТЬ**

### **✅ ЧТО ДЕЛАТЬ:**
- ✅ Хранить все секреты в GitHub Secrets
- ✅ Использовать описательные имена
- ✅ Регулярно обновлять токены
- ✅ Логировать использование

### **❌ ЧЕГО НЕ ДЕЛАТЬ:**
- ❌ НЕ коммитить секреты в код
- ❌ НЕ оставлять токены в логах
- ❌ НЕ передавать секреты в чатах
- ❌ НЕ использовать простые пароли

---

## 🧪 **ТЕСТИРОВАНИЕ**

### **🔍 Проверка доступности:**
```bash
# В GitHub Actions workflow
- name: Test Secrets
  run: |
    echo "Testing secrets availability..."
    if [ -n "${{ secrets.TELEGRAM_BOT_TOKEN }}" ]; then
      echo "✅ TELEGRAM_BOT_TOKEN доступен"
    else
      echo "❌ TELEGRAM_BOT_TOKEN недоступен"
    fi
```

---

## 📊 **СТАТУС НАСТРОЙКИ**

| Secret | Статус | Приоритет |
|--------|--------|-----------|
| TELEGRAM_BOT_TOKEN | 🔴 Требует настройки | Высокий |
| DB_CONNECTION_STRING | 🔴 Требует настройки | Высокий |
| ADMIN_TOKEN | 🔴 Требует настройки | Средний |
| YANDEX_CLOUD_TOKEN | 🔴 Требует настройки | Средний |
| SSH_PRIVATE_KEY | 🔴 Требует настройки | Высокий |

---

## 🎯 **СЛЕДУЮЩИЕ ШАГИ**

1. **Настроить все обязательные secrets**
2. **Протестировать доступность в workflows**
3. **Обновить конфигурацию приложения**
4. **Провести тестирование безопасности**

---

**🔐 ВСЕ СЕКРЕТЫ ДОЛЖНЫ БЫТЬ В GITHUB SECRETS!**
**❌ НИКОГДА НЕ КОММИТИТЬ СЕКРЕТЫ В КОД!**