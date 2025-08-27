# 🔐 GitHub Secrets Setup for Yandex Server Agent

## 📋 ОБЯЗАТЕЛЬНЫЕ SECRETS:

### 🤖 **Yandex Server Agent & Telegram:**
```
YANDEX_VM_ID=fhmqd2mct32i12bapfn1
YANDEX_VM_IP=46.21.247.218
TELEGRAM_BOT_TOKEN=8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s
TELEGRAM_CHAT_ID=6878699213
TELEGRAM_BOT_NAME=Gita_server_monitor_bot
```

### ☁️ **Yandex Cloud API:**
```
YC_FOLDER_ID=b1ggm01ncoamcljg44qa
YC_ZONE=ru-central1-a
YC_TOKEN=<your-yc-token>
YC_SERVICE_ACCOUNT_KEY=<base64-encoded-key>
```

### 🌐 **Project Configuration:**
```
API_BASE_URL=http://46.21.247.218:3000
PROJECT_DOMAIN=gita-1972-reprint.ru
API_DOMAIN=api.gita-1972-reprint.ru
```

## 🚀 **Как добавить в GitHub:**

1. Перейти: https://github.com/egorKara/bhagavad-gita-reprint/settings/secrets/actions
2. Нажать "New repository secret"
3. Добавить каждый secret по очереди
4. Убедиться что все переменные добавлены

## ⚠️ **БЕЗОПАСНОСТЬ:**
- ❌ НЕ коммитить secrets в код
- ✅ Использовать только GitHub Secrets
- 🔄 Регулярно обновлять токены
- 🛡️ Проверять доступы к репозиторию
