# 🎯 ШПАРГАЛКА ПО ПОРЯДКУ ПРОВЕРОК

## **🚨 КРИТИЧЕСКИЙ ПОРЯДОК (по приоритету)**

### **1️⃣ БЕЗОПАСНОСТЬ (OWASP Priority)**
```bash
npm audit --audit-level moderate    # Зависимости
npm run lint:js                     # Код (Security Plugin)
```

### **2️⃣ СТРУКТУРНАЯ ЦЕЛОСТНОСТЬ (Google Engineering)**
```bash
npm run lint:js                     # JavaScript синтаксис
npm run lint:css                    # CSS структура  
npm run lint:html                   # HTML валидация
```

### **3️⃣ КАЧЕСТВО КОДА (Airbnb Standards)**
```bash
npm run format                      # Форматирование
npm run validate:all               # Комплексная проверка
```

### **4️⃣ ПРОИЗВОДИТЕЛЬНОСТЬ (Web.dev)**
```bash
npm run lighthouse                 # Анализ производительности
```

---

## **⏰ ЧАСТОТА ВЫПОЛНЕНИЯ**

| **Проверка** | **Частота** | **Команда** | **Приоритет** |
|--------------|-------------|-------------|---------------|
| **Безопасность** | Каждый день | `npm audit` | 🔴 **КРИТИЧНО** |
| **Синтаксис** | При изменении | `npm run lint:js` | 🟠 **ВАЖНО** |
| **Форматирование** | При сохранении | `npm run format` | 🟡 **СРЕДНЕ** |
| **Производительность** | Раз в 2 часа | `npm run lighthouse` | 🟢 **ПОЛЕЗНО** |

---

## **🚀 БЫСТРЫЕ КОМАНДЫ**

### **Утро (5 минут):**
```bash
npm audit && npm run lint:js && npm run format
```

### **День (каждые 30 мин):**
```bash
git diff --name-only | xargs npm run lint:js
```

### **Вечер (10 минут):**
```bash
npm audit --audit-level high && npm run validate:all
```

### **Неделя (15 минут):**
```bash
npm update && npm audit fix && npm run docs
```

---

## **🎯 ПРИНЦИПЫ**

1. **БЕЗОПАСНОСТЬ ПРЕЖДЕ ВСЕГО** - OWASP Top 10
2. **СИНТАКСИС → СТРУКТУРА → КАЧЕСТВО** - Google Engineering
3. **АВТОМАТИЗАЦИЯ** - Microsoft DevOps
4. **ПРОИЗВОДИТЕЛЬНОСТЬ** - Web.dev Standards

---

**💡 ЗАПОМНИТЕ: Безопасность → Структура → Качество → Производительность**
