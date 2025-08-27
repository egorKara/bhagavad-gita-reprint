# 🔐 КРИТИЧЕСКИЕ ДАННЫЕ ДЛЯ GITHUB SECRETS

## 🚨 **ОБЯЗАТЕЛЬНЫЕ SECRETS:**

### **🔑 SSH И ПОДКЛЮЧЕНИЕ:**
```
SSH_PRIVATE_KEY=
# Содержимое ~/.ssh/ssh-key-1753182147967

VM_IP_ADDRESS=46.21.247.218
VM_ID=fhmqd2mct32i12bapfn1
VM_USER=yc-user
```

### **📱 TELEGRAM BOT:**
```
TELEGRAM_BOT_TOKEN=8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s
TELEGRAM_CHAT_ID=6878699213
TELEGRAM_BOT_USERNAME=Gita_server_monitor_bot
```

### **☁️ YANDEX CLOUD:**
```
YANDEX_CLOUD_TOKEN=
# IAM токен для API

YANDEX_FOLDER_ID=
# ID папки в Yandex Cloud

YANDEX_SERVICE_ACCOUNT_KEY=
# JSON ключ сервисного аккаунта
```

### **🤖 AI И API:**
```
YANDEX_GPT_API_KEY=
# API ключ для YandexGPT

ADMIN_TOKEN=admin123
METRICS_TOKEN=metrics123
```

### **🔧 УПРАВЛЕНИЕ:**
```
PROJECT_PATH=/home/yc-user/gita-1972
GITHUB_REPO=egorKara/bhagavad-gita-reprint
ENVIRONMENT=production
```

---

## 🎯 **КОМАНДЫ ДЛЯ НАСТРОЙКИ:**

### **📋 GitHub CLI:**
```bash
# Установка secrets через GitHub CLI
gh secret set SSH_PRIVATE_KEY < ~/.ssh/ssh-key-1753182147967
gh secret set TELEGRAM_BOT_TOKEN --body "8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s"
gh secret set TELEGRAM_CHAT_ID --body "6878699213"
gh secret set VM_IP_ADDRESS --body "46.21.247.218"
gh secret set VM_ID --body "fhmqd2mct32i12bapfn1"
```

### **🌐 Через веб-интерфейс:**
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

---

## 🔒 **ИСПОЛЬЗОВАНИЕ В WORKFLOWS:**

### **📝 GitHub Actions Example:**
```yaml
jobs:
  deploy:
    steps:
      - name: Deploy to Server
        env:
          SSH_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
        run: |
          echo "$SSH_KEY" > ssh_key
          chmod 600 ssh_key
          ssh -i ssh_key ${{ secrets.VM_USER }}@${{ secrets.VM_IP_ADDRESS }} 'command'
```

---

## ⚠️ **БЕЗОПАСНОСТЬ:**

1. **🚫 НЕ КОММИТИТЬ в код:**
   - SSH ключи
   - API токены  
   - Пароли
   - Chat ID

2. **✅ ИСПОЛЬЗОВАТЬ ТОЛЬКО через secrets:**
   - `${{ secrets.SECRET_NAME }}`
   - Environment variables
   - Encrypted storage

3. **🔄 РОТАЦИЯ:**
   - Регулярно обновлять токены
   - Мониторить доступы
   - Логировать использование

