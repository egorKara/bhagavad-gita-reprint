# 🚀 Оптимизация Tor Browser для быстрой работы

## ⚡ Настройки производительности

### 1️⃣ В самом Tor Browser:

#### 🔧 Основные настройки:
- **Адрес:** `about:preferences`
- **Приватность:** Установить уровень "Safer" (не "Safest")
- **NoScript:** Разрешить JavaScript только для нужных сайтов

#### 📊 Advanced настройки (`about:config`):
```
network.http.pipelining = true
network.http.pipelining.maxrequests = 8
network.http.max-connections = 48
network.http.max-connections-per-server = 16
```

### 2️⃣ Отключение тяжёлых функций:

#### 🖼️ Изображения и медиа:
- **Настройки → Приватность → Блокировать изображения**
- **Или выборочно:** только на медленных сайтах

#### 📡 WebRTC отключение:
```
about:config → media.peerconnection.enabled = false
```

#### 🎥 Автовоспроизведение:
```
about:config → media.autoplay.default = 5 (блокировать всё)
```

## 🌐 Сетевые оптимизации

### 3️⃣ Tor конфигурация:

#### 📁 Создать файл `torrc` (если нет):
```bash
mkdir -p ~/.tor
cat > ~/.tor/torrc << 'EOF'
# Оптимизация производительности
CircuitBuildTimeout 15
LearnCircuitBuildTimeout 0
MaxCircuitDirtiness 600

# Предпочтительные страны (ближайшие)
ExitNodes {RU},{BY},{KZ},{UA},{GE}
StrictNodes 0

# Bandwidth оптимизация  
BandwidthRate 1024 KB
BandwidthBurst 2048 KB
RelayBandwidthRate 512 KB
RelayBandwidthBurst 1024 KB

# Быстрые соединения
FastFirstHopPK 1
EOF
```

### 4️⃣ Bridge relay (для обхода блокировок):

#### 🌉 Настройка мостов:
- **Tor Browser → Настройки → Tor**
- **Включить:** "Использовать мост"
- **Тип:** obfs4 (рекомендуется)

## 🧹 Регулярное обслуживание

### 5️⃣ Очистка и оптимизация:

#### 📁 Очистка данных (еженедельно):
```bash
# Очистка Tor Browser данных
rm -rf ~/.tor-browser/Browser/TorBrowser/Data/Browser/profile.default/cache2/*
rm -rf ~/.tor-browser/Browser/TorBrowser/Data/Browser/profile.default/storage/*
```

#### 🔄 Новая цепочка:
- **Горячие клавиши:** `Ctrl+Shift+L`
- **Или:** Кнопка обновления цепочки

### 6️⃣ Мониторинг производительности:

#### 📊 Проверка скорости:
- **Тест:** https://check.torproject.org/
- **Speedtest:** https://www.speedtest.net/ (через Tor)

## 🎯 Быстрые улучшения

### ⚡ Немедленные действия:

1. **🔧 Настройки → Приватность → "Safer"** (не Safest)
2. **🖼️ Блокировать изображения** на медленных сайтах
3. **🔄 Новая цепочка** если медленно: `Ctrl+Shift+L`
4. **🧹 Очистить данные:** Settings → Privacy → Clear Data

### 🎨 Для работы с Figma:

1. **🌐 Используйте обычный Chrome** с VPN для Figma
2. **🔒 Tor Browser** оставьте для других задач
3. **⚡ Figma Desktop** уже работает без Tor

## 💡 Рекомендация

**Для дизайн-работы используйте Figma Desktop (уже настроен).**
**Tor Browser оптимизируйте для других задач безопасности.**

---

**🎯 Tor Browser станет быстрее, но для Figma лучше использовать Desktop версию!**
