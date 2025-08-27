# 🔐 ПОШАГОВАЯ НАСТРОЙКА GITHUB SECRETS

## 🎯 **БЫСТРАЯ НАСТРОЙКА (5 минут):**

### **📱 ШАГ 1: Откройте GitHub Repository**
```
https://github.com/egorKara/bhagavad-gita-reprint
```

### **⚙️ ШАГ 2: Перейдите в Settings**
```
Repository → Settings → Secrets and variables → Actions
```

### **🔑 ШАГ 3: Добавьте Secrets (кнопка "New repository secret"):**

#### **🤖 TELEGRAM BOT:**
```
Name: TELEGRAM_BOT_TOKEN
Value: 8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s

Name: TELEGRAM_CHAT_ID  
Value: 6878699213

Name: TELEGRAM_BOT_USERNAME
Value: Gita_server_monitor_bot
```

#### **💻 SERVER CONNECTION:**
```
Name: VM_IP_ADDRESS
Value: 46.21.247.218

Name: VM_ID
Value: fhmqd2mct32i12bapfn1

Name: VM_USER
Value: yc-user
```

#### **🔧 SYSTEM TOKENS:**
```
Name: ADMIN_TOKEN
Value: admin123

Name: METRICS_TOKEN
Value: metrics123

Name: PROJECT_PATH
Value: /home/yc-user/gita-1972
```

#### **☁️ YANDEX CLOUD (Заполнить позже):**
```
Name: YANDEX_CLOUD_TOKEN
Value: [Получить в Yandex Cloud Console]

Name: YANDEX_FOLDER_ID
Value: [ID папки из консоли]

Name: YANDEX_SERVICE_ACCOUNT_KEY
Value: [JSON ключ сервисного аккаунта]

Name: YANDEX_GPT_API_KEY
Value: [API ключ для YandexGPT]
```

#### **🔑 SSH KEY (ВАЖНО!):**
```
Name: SSH_PRIVATE_KEY
Value: [Содержимое файла ~/.ssh/ssh-key-1753182147967]
```

---

## 🚀 **ПОСЛЕ НАСТРОЙКИ SECRETS:**

### **✅ ПРОВЕРКА:**
- Все secrets добавлены без ошибок
- SSH ключ корректно скопирован
- Telegram токены активны

### **🎯 СЛЕДУЮЩИЕ ШАГИ:**
1. **☁️ Yandex Cloud API** - создать Service Account
2. **🤖 YandexGPT** - получить API ключ  
3. **🔄 GitHub Actions** - активировать CI/CD
4. **📊 Мониторинг** - настроить дашборды

---

## 🛡️ **БЕЗОПАСНОСТЬ:**
- ✅ Все критические данные в Secrets
- ✅ Никаких токенов в коде
- ✅ Шифрованное хранение
- ✅ Контролируемый доступ
