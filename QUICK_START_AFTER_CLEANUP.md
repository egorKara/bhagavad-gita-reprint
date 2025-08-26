# 🚀 БЫСТРЫЙ СТАРТ ПОСЛЕ ОЧИСТКИ

## 📁 Текущая структура проекта
```
bhagavad-gita-reprint/
├── landing-gita-1972-reprint/          # 🆕 Новая версия
│   ├── frontend/                        # TypeScript + Vite
│   ├── GitaLanding.API/                 # .NET API
│   ├── GitaLanding.Core/                # .NET компоненты
│   └── GitaLanding.Data/                # .NET данные
├── src/                                 # Express.js сервер
├── docs/                                # Документация
├── deployment/                          # Скрипты развертывания
├── package.json                         # Новый (для Express.js)
└── node_modules/                        # Новые зависимости
```

## 🎯 Основные компоненты

### 1. **Landing версия** (основная)
- **Технологии:** TypeScript + Vite
- **Назначение:** Фронтенд сайта
- **Путь:** `landing-gita-1972-reprint/frontend/`

### 2. **Express.js сервер**
- **Технологии:** Node.js + Express
- **Назначение:** API + статические файлы
- **Путь:** `src/`

### 3. **.NET API**
- **Технологии:** ASP.NET Core 8
- **Назначение:** Альтернативный API
- **Путь:** `landing-gita-1972-reprint/GitaLanding.API/`

---

## 🚀 Команды для запуска

### **Вариант 1: Только Landing версия**
```bash
cd landing-gita-1972-reprint/frontend
npm run build          # Сборка
npm run dev            # Разработка (Vite dev server)
```

### **Вариант 2: Landing + Express.js API**
```bash
# 1. Собрать frontend
cd landing-gita-1972-reprint/frontend
npm run build

# 2. Запустить Express.js сервер
cd ../../src
npm start              # Сервер будет обслуживать frontend
```

### **Вариант 3: Landing + .NET API**
```bash
# 1. Собрать frontend
cd landing-gita-1972-reprint/frontend
npm run build

# 2. Запустить .NET API
cd ..
./start-api.sh         # .NET API на порту 5246
```

---

## 🔧 Устранение проблем

### **Если Express.js не запускается:**
```bash
cd src
npm install            # Установить зависимости
npm start              # Запустить сервер
```

### **Если Landing версия не собирается:**
```bash
cd landing-gita-1972-reprint/frontend
npm install            # Установить зависимости
npm run build          # Собрать проект
```

### **Если .NET API не запускается:**
```bash
cd landing-gita-1972-reprint
dotnet restore         # Восстановить пакеты
./start-api.sh         # Запустить API
```

---

## 📊 Порты по умолчанию

- **Vite dev server:** 8000 (если не занят)
- **Express.js сервер:** 3000 (настраивается в коде)
- **.NET API:** 5246 (настраивается в start-api.sh)

---

## 🔒 Безопасность

### **Бэкапы созданы:**
- Git ветка: `backup/before-cleanup-20250825-0508`
- Папки: `frontend-backup/`, `public-backup/`
- Файлы: `package.json.backup`

### **Откат изменений:**
```bash
git checkout backup/before-cleanup-20250825-0508
```

---

## 📝 Документация

- **Полная документация:** `CLEANUP_DOCUMENTATION.md`
- **Чек-лист:** `CLEANUP_CHECKLIST.md`
- **Быстрый старт:** `QUICK_START_AFTER_CLEANUP.md`

---
**Дата:** 25 августа 2025, 05:15  
**Статус:** Готово к использованию ✅
