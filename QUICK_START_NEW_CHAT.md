# 🚀 БЫСТРЫЙ СТАРТ В НОВОМ ЧАТЕ

**Проблема:** Telegram бот не отвечает на команды  
**Статус:** Simple handler запущен для диагностики  
**Сервер:** fhmqd2mct32i12bapfn1 (46.21.247.218)

---

## ⚡ **ПЕРВЫЕ 3 МИНУТЫ**

### **1️⃣ ПРОВЕРИТЬ SIMPLE HANDLER (30 сек)**
```bash
yc compute ssh fhmqd2mct32i12bapfn1
ps aux | grep simple-telegram-handler
```

### **2️⃣ ДИАГНОСТИКА ОСНОВНОГО АГЕНТА (1 мин)**
```bash
sudo systemctl status yandex-server-agent --no-pager
sudo journalctl -u yandex-server-agent --no-pager -n 10
```

### **3️⃣ ТЕСТ TELEGRAM (1 мин)**
- Отправить боту: `/status`
- Проверить ответ от simple handler
- Если НЕТ ответа → проблема с Telegram API
- Если ЕСТЬ ответ → проблема с основным агентом

---

## 🔧 **БЫСТРЫЕ КОМАНДЫ**

### **SSH ПОДКЛЮЧЕНИЕ:**
```bash
yc compute ssh fhmqd2mct32i12bapfn1
# ИЛИ
ssh -i ~/.ssh/ssh-key-1753182147967 egorkara@46.21.247.218
```

### **УПРАВЛЕНИЕ АГЕНТОМ:**
```bash
sudo systemctl restart yandex-server-agent    # Перезапуск
sudo systemctl status yandex-server-agent     # Статус
sudo journalctl -u yandex-server-agent -f     # Логи в реальном времени
```

### **SIMPLE HANDLER:**
```bash
# Запуск
cd /home/egorkara && python3 simple-telegram-handler.py &

# Остановка
pkill -f simple-telegram-handler

# Проверка
ps aux | grep simple-telegram-handler
```

---

## 📋 **КРИТИЧЕСКИЕ ДАННЫЕ**

- **VM:** fhmqd2mct32i12bapfn1 
- **Bot:** @Gita_server_monitor_bot
- **Token:** 8319867749:AAFOq66KNx85smfgtrvFsoBc-KABOPbcX0s
- **Chat:** 6878699213
- **GitHub:** egorKara/bhagavad-gita-reprint

---

## 🎯 **СЛЕДУЮЩИЕ ШАГИ**

1. **Проверить результат simple handler**
2. **Исправить основной агент ИЛИ заменить на простой**
3. **Протестировать все команды**
4. **Настроить автозапуск решения**

**📄 Полная информация:** `TRANSFER_TO_NEW_CHAT_INFO.md`
