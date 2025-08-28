# 🔐 GitHub Secrets - Финальная Настройка Безопасности

## 📋 **ОБЗОР**
Полное руководство по настройке GitHub Secrets для защиты всех токенов и конфиденциальной информации.

---

## 🎯 **ЦЕЛЬ**
Переместить все оставшиеся токены в GitHub Secrets для:
- ✅ 100% защиты конфиденциальной информации
- ✅ Централизованного управления секретами
- ✅ Безопасного CI/CD процесса
- ✅ Соответствия best practices безопасности

---

## 🔍 **ТЕКУЩИЙ СТАТУС СЕКРЕТОВ**

### ✅ **УЖЕ ЗАЩИЩЕНО:**
- 🤖 **Telegram Bot Token** - отозван и пересоздан
- 🔒 **Репозиторий** - сделан приватным
- 🧹 **Git история** - очищена от секретов
- 📝 **Код** - использует переменные окружения

### ⚠️ **ТРЕБУЕТ НАСТРОЙКИ GITHUB SECRETS:**
- 🔑 **TELEGRAM_BOT_TOKEN** - новый токен бота
- 💬 **ADMIN_CHAT_ID** - ID чата администратора
- 🌐 **SERVER_IP** - IP адрес сервера
- 🔗 **SERVER_API_URL** - URL API сервера
- ☁️ **YANDEX_CLOUD_TOKEN** - токен Yandex Cloud
- 🗂️ **YANDEX_FOLDER_ID** - ID папки Yandex Cloud

---

## 📋 **ПОШАГОВАЯ ИНСТРУКЦИЯ**

### **Шаг 1: Доступ к GitHub Secrets**
```
1. Откройте GitHub репозиторий: egorKara/bhagavad-gita-reprint
2. Перейдите в: Settings → Secrets and variables → Actions
3. Нажмите "New repository secret"
```

### **Шаг 2: Добавление основных секретов**

#### 🤖 **TELEGRAM_BOT_TOKEN**
```
Name: TELEGRAM_BOT_TOKEN
Value: 8319867749:AAEDKiPXk7oiqrxMDNNqkK07FVW-jqkpiP8
Description: Новый токен Telegram бота для управления агентами
```

#### 💬 **ADMIN_CHAT_ID**
```
Name: ADMIN_CHAT_ID
Value: 6878699213
Description: ID чата администратора для получения уведомлений
```

#### 🌐 **SERVER_IP**
```
Name: SERVER_IP
Value: 46.21.247.218
Description: IP адрес продакшн сервера Yandex Cloud
```

#### 🔗 **SERVER_API_URL**
```
Name: SERVER_API_URL
Value: https://api.gita-1972-reprint.ru
Description: URL API сервера для мониторинга
```

### **Шаг 3: Yandex Cloud интеграция**

#### ☁️ **YANDEX_CLOUD_TOKEN**
```
Name: YANDEX_CLOUD_TOKEN
Value: [получить из: yc iam create-token]
Description: OAuth токен для Yandex Cloud API
```

#### 🗂️ **YANDEX_FOLDER_ID**
```
Name: YANDEX_FOLDER_ID
Value: [получить из: yc config list]
Description: ID папки Yandex Cloud для ресурсов
```

---

## 🔧 **ОБНОВЛЕНИЕ CI/CD WORKFLOW**

### **Создание GitHub Actions файла:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      env:
        TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
        ADMIN_CHAT_ID: ${{ secrets.ADMIN_CHAT_ID }}
        SERVER_IP: ${{ secrets.SERVER_IP }}
        SERVER_API_URL: ${{ secrets.SERVER_API_URL }}
        YANDEX_CLOUD_TOKEN: ${{ secrets.YANDEX_CLOUD_TOKEN }}
        YANDEX_FOLDER_ID: ${{ secrets.YANDEX_FOLDER_ID }}
      run: |
        echo "Deploying with protected secrets..."
        # Deployment commands here
```

---

## 🛡️ **ПРОВЕРКА БЕЗОПАСНОСТИ**

### **После настройки проверить:**
- ✅ Все секреты добавлены в GitHub
- ✅ Локальные .env файлы не содержат реальных значений
- ✅ Код использует process.env.SECRET_NAME
- ✅ .gitignore защищает .env файлы
- ✅ Нет hardcoded токенов в коде

### **Команды для проверки:**
```bash
# Поиск потенциальных секретов в коде
grep -r "8319867749" . --exclude-dir=node_modules
grep -r "6878699213" . --exclude-dir=node_modules
grep -r "46.21.247.218" . --exclude-dir=node_modules

# Проверка .env файлов
find . -name ".env*" -exec ls -la {} \;
```

---

## 📊 **ФИНАЛЬНЫЙ ЧЕКЛИСТ**

### **GitHub Repository:**
- [ ] Репозиторий приватный
- [ ] Все секреты в GitHub Secrets
- [ ] CI/CD workflow обновлён
- [ ] .gitignore настроен

### **Код:**
- [ ] Нет hardcoded токенов
- [ ] Используются переменные окружения
- [ ] .env.example создан
- [ ] Документация обновлена

### **Сервер:**
- [ ] .env файл обновлён с новыми токенами
- [ ] Права доступа chmod 600 .env
- [ ] Сервисы перезапущены
- [ ] Логи проверены

---

## 🚨 **КРИТИЧЕСКИЕ МОМЕНТЫ**

### ⚠️ **ОБЯЗАТЕЛЬНО:**
1. **НЕ** коммитить .env файлы
2. **НЕ** использовать echo в CI/CD с секретами
3. **ВСЕГДА** использовать ${{ secrets.NAME }}
4. **РЕГУЛЯРНО** ротировать токены

### 🔄 **РОТАЦИЯ ТОКЕНОВ:**
- Telegram Bot Token: каждые 3 месяца
- Yandex Cloud Token: каждый месяц
- API ключи: каждые 6 месяцев

---

## 📞 **ЭКСТРЕННАЯ ПОМОЩЬ**

### **При утечке секрета:**
1. Немедленно отозвать скомпрометированный токен
2. Создать новый токен
3. Обновить GitHub Secret
4. Перезапустить сервисы
5. Проверить логи на подозрительную активность

### **Команды восстановления:**
```bash
# Экстренная смена Telegram токена
# 1. @BotFather → /revoke
# 2. @BotFather → /newbot
# 3. GitHub → Settings → Secrets → Update TELEGRAM_BOT_TOKEN
# 4. На сервере: nano .env && systemctl restart yandex-server-agent
```

---

## ✅ **ЗАВЕРШЕНИЕ**

**После выполнения всех шагов:**
- 🔒 100% защита секретов достигнута
- 🛡️ Соответствие industry standards
- 📈 Готовность к масштабированию
- 🚀 Безопасный CI/CD процесс

**🎯 РЕЗУЛЬТАТ: Полная защита всех токенов и конфиденциальной информации!**
