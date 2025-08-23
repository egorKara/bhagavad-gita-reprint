# Руководство по форматированию CSS в проекте

## 🛠️ Установленные инструменты

В проекте настроены профессиональные инструменты для автоматического форматирования и проверки качества CSS:

### **Prettier** - универсальный форматтер
- Автоматическое форматирование CSS, HTML, JS, JSON
- Настроен для работы при сохранении файлов
- Единообразный стиль кода

### **stylelint** - специализированный CSS линтер  
- Проверка ошибок и соблюдения стандартов CSS
- Автоматическое исправление проблем
- Современные CSS практики

## 📋 Доступные команды

```bash
# === CSS КОМАНДЫ ===
# Проверить CSS на ошибки
npm run lint:css

# Автоматически исправить CSS ошибки
npm run lint:css:fix

# Отформатировать только CSS файлы
npm run format:css

# === HTML КОМАНДЫ ===
# Проверить HTML на ошибки (137 правил)
npm run lint:html

# Отформатировать только HTML файлы
npm run format:html

# === УНИВЕРСАЛЬНЫЕ КОМАНДЫ ===
# Отформатировать все файлы (CSS, HTML, JS, JSON)
npm run format

# Полная проверка всего проекта
npm run validate:all

# Проверить все файлы без изменений
npm run check

# === СЕРВЕРЫ РАЗРАБОТКИ ===
# Запустить локальный сервер для разработки
npm run dev      # порт 8000
npm run serve    # порт 8002  
```

## 🎯 Конфигурация

### **.prettierrc** - настройки форматирования:
```json
{
  "tabWidth": 4,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 120,
  "bracketSpacing": true
}
```

### **.stylelintrc.json** - правила для CSS:
```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "indentation": 4,
    "string-quotes": "single",
    "color-hex-case": "lower",
    "color-hex-length": "short"
  }
}
```

## 🔧 Настройки IDE (Cursor)

### **Автоматизация работы:**
- ✅ Форматирование при сохранении (Ctrl+S)
- ✅ Автоисправление CSS ошибок
- ✅ Подсветка ошибок в реальном времени
- ✅ Предложения улучшений кода

### **Рекомендуемые расширения:**
- `Prettier` - форматирование кода
- `stylelint` - проверка CSS
- `Auto Rename Tag` - синхронизация HTML тегов
- `HTML CSS Support` - автодополнение
- `CSS Modules` - поддержка модулей

## 📚 Примеры использования

### ✅ **Правильное форматирование CSS:**
```css
.hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 80px 0;
    text-align: center;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}
```

### ❌ **Неправильное форматирование:**
```css
.hero-section{background:linear-gradient(135deg,var(--primary-color),var(--secondary-color));color:white;padding:80px 0;text-align:center;}
.nav-link{color:white;text-decoration:none;padding:12px 20px;border-radius:8px;transition:all 0.3s ease;}
.nav-link:hover{background:rgba(255,255,255,0.2);transform:translateY(-2px);}
```

## 🎨 Лучшие практики

### **1. Структура CSS файлов:**
```css
/* ===== ПЕРЕМЕННЫЕ ===== */
:root {
    --primary-color: #8b0000;
    --transition: all 0.3s ease;
}

/* ===== БАЗОВЫЕ СТИЛИ ===== */
body {
    font-family: Georgia, serif;
    line-height: 1.6;
}

/* ===== КОМПОНЕНТЫ ===== */
.button {
    /* стили кнопки */
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (width <= 768px) {
    /* мобильные стили */
}
```

### **2. БЭМ методология:**
```css
/* Блок */
.card { }

/* Элемент */
.card__header { }
.card__content { }

/* Модификатор */
.card--primary { }
.card__header--large { }
```

### **3. Использование переменных:**
```css
:root {
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
}

.component {
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
}
```

## 🚀 Горячие клавиши

### **В Cursor IDE:**
- `Ctrl + S` - сохранить и автоформатировать
- `Ctrl + Shift + P` - палитра команд
- `Alt + Shift + F` - форматировать документ
- `Ctrl + Shift + I` - организовать импорты

### **Полезные команды палитры:**
- `Format Document` - форматировать файл
- `Format Selection` - форматировать выделение
- `stylelint: Fix all auto-fixable Problems` - исправить CSS

## 🔍 Диагностика проблем

### **Если форматирование не работает:**
```bash
# Проверить установку зависимостей
npm list prettier stylelint

# Переустановить пакеты
npm install

# Проверить конфигурацию
npm run lint:css -- --print-config path/to/file.css
```

### **Частые ошибки и решения:**

#### ❌ **Ошибка: "Expected 4 spaces"**
```css
/* НЕПРАВИЛЬНО */
.button {
  padding: 12px;
}

/* ПРАВИЛЬНО */
.button {
    padding: 12px;
}
```

#### ❌ **Ошибка: "Expected single quotes"**
```css
/* НЕПРАВИЛЬНО */
.button::before {
    content: "★";
}

/* ПРАВИЛЬНО */
.button::before {
    content: '★';
}
```

#### ❌ **Ошибка: "Expected lowercase"**
```css
/* НЕПРАВИЛЬНО */
.button {
    color: #FF0000;
}

/* ПРАВИЛЬНО */
.button {
    color: #f00;
}
```

## 📈 РЕКОМЕНДАЦИИ ДЛЯ ЕЖЕДНЕВНОЙ РАБОТЫ

### **🌅 НАЧАЛО РАБОЧЕГО ДНЯ:**

#### **1. Проверка инструментов (1 раз в день):**
```bash
# Убедиться что все инструменты работают
npm run check
echo "✅ Инструменты готовы к работе"
```

#### **2. Проверка состояния CSS и HTML (перед началом работы):**
```bash
# Быстрая проверка всего CSS
npm run lint:css
echo "📊 Состояние CSS проверено"

# Проверка HTML на ошибки
npm run lint:html
echo "🔍 HTML проверен (137 правил)"

# Форматирование HTML файлов
npm run format:html
echo "✨ HTML файлы отформатированы"
```

### **💻 ВО ВРЕМЯ РАБОТЫ:**

#### **3. После каждого изменения CSS:**
```bash
# Автоисправление CSS (после каждого редактирования)
npm run lint:css:fix
echo "🔧 CSS автоматически исправлен"
```

#### **4. После каждого изменения HTML:**
```bash
# Проверка HTML на ошибки
npm run lint:html
echo "🔍 HTML проверен"

# Форматирование HTML
npm run format:html
echo "✨ HTML отформатирован"
```

#### **5. Проверка форматирования (каждые 30 минут):**
```bash
# Форматирование всех файлов (CSS + HTML + JS + JSON)
npm run format
echo "✨ Все файлы отформатированы"
```

#### **6. Раздельная проверка (при больших изменениях):**
```bash
# Форматирование только CSS файлов
npm run format:css
echo "🎨 CSS файлы отформатированы"

# Форматирование только HTML файлов
npm run format:html
echo "📄 HTML файлы отформатированы"
```

### **🌅 КОНЕЦ РАБОЧЕГО ДНЯ:**

#### **7. Финальная проверка (перед коммитом):**
```bash
# Полная проверка всего проекта
npm run validate:all
echo "🎯 Полная проверка завершена"

# Или пошагово:
npm run format      # Форматирование всех файлов
npm run lint:css    # Проверка CSS
npm run lint:html   # Проверка HTML
npm run check       # Финальная проверка
echo "🏁 Код готов к коммиту"
```

#### **8. Еженедельная очистка (пятница):**
```bash
# Переустановка пакетов (раз в неделю)
rm -rf node_modules package-lock.json
npm install
echo "🧹 Еженедельная очистка выполнена"

# Полная проверка после переустановки
npm run validate:all
echo "✅ Все инструменты проверены после обновления"
```

### **⚡ БЫСТРЫЕ КОМАНДЫ:**

```bash
# Алиасы для быстрого доступа (добавить в .bashrc/.zshrc)
alias css-check="npm run lint:css"
alias css-fix="npm run lint:css:fix"  
alias html-check="npm run lint:html"
alias html-format="npm run format:html"
alias format-all="npm run format"
alias css-format="npm run format:css"
alias check-all="npm run check"
alias validate-all="npm run validate:all"

# Использование:
css-fix       # Быстрое исправление CSS
html-check    # Проверка HTML на 137 правил
html-format   # Форматирование HTML
format-all    # Форматирование всех файлов
validate-all  # Полная проверка проекта
check-all     # Базовая проверка
```

### **📋 ЧЕКЛИСТ ЕЖЕДНЕВНЫХ ПРОВЕРОК:**

#### **☑️ Утром (7 минут):**
- [ ] `npm run check` - проверка инструментов
- [ ] `npm run lint:css` - состояние CSS (169 ошибок отслеживается)
- [ ] `npm run lint:html` - проверка HTML (137 правил)
- [ ] `npm run format:html` - форматирование HTML
- [ ] Проверка работы Prettier в IDE (Ctrl+S)

#### **☑️ В процессе работы:**
- [ ] Автосохранение форматирует код (Ctrl+S)
- [ ] `npm run lint:css:fix` - после изменений CSS
- [ ] `npm run lint:html` - после изменений HTML
- [ ] `npm run format:html` - форматирование HTML
- [ ] `npm run format` - каждые 30 минут (все файлы)

#### **☑️ Перед коммитом:**
- [ ] `npm run validate:all` - полная проверка проекта
- [ ] Или поэтапно:
  - [ ] `npm run format` - все отформатировано
  - [ ] `npm run lint:css` - CSS проверен  
  - [ ] `npm run lint:html` - HTML проверен
  - [ ] `npm run check` - финальная проверка
- [ ] Визуальная проверка в браузере

#### **☑️ Еженедельно (пятница):**
- [ ] `rm -rf node_modules && npm install` - обновление
- [ ] `npm run validate:all` - проверка после обновления
- [ ] Проверка новых версий зависимостей
- [ ] Создание резервной копии конфигурации

## 🎖️ Значки качества

После выполнения команд вы увидите эти индикаторы:

### **CSS (stylelint):**
- ✅ **ОТЛИЧНО** - без ошибок и предупреждений
- ⚠️ **ВНИМАНИЕ** - есть предупреждения, но работает  
- ❌ **ОШИБКА** - требует немедленного исправления
- 🔧 **ИСПРАВЛЕНО** - проблемы автоматически устранены
- 📊 **ПРОВЕРЕНО** - анализ выполнен успешно

### **HTML (HTMLHint):**
- ✅ **ОТЛИЧНО** - 0 ошибок HTML
- 🔍 **ПРОВЕРЕНО** - 137 правил применено
- ❌ **НАЙДЕНЫ ОШИБКИ** - требуется исправление
- 📄 **ОТФОРМАТИРОВАНО** - Prettier обработал HTML
- 🎯 **ПОЛНАЯ ПРОВЕРКА** - CSS + HTML + JS проверены

## 📞 Поддержка

При возникновении проблем:

1. **Проверить настройки:** убедиться что VS Code/Cursor правильно настроен
2. **Перезапустить IDE:** иногда помогает простая перезагрузка
3. **Переустановить пакеты:** `rm -rf node_modules && npm install`
4. **Проверить конфигурацию:** все файлы `.prettierrc`, `.stylelintrc.json` на месте

**🎯 ПОМНИТЕ:** Эти инструменты созданы для того, чтобы код был качественным и единообразным. Используйте `npm run validate:all` ежедневно для достижения профессионального результата!

---

## 📚 **ДОПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ**

- **CSS_FORMATTING_GUIDE.md** (этот файл) - полное руководство
- **HTML_FORMATTING_GUIDE.md** - специализированное руководство по HTML
- **CSS_OPTIMIZATION_REPORT.md** - отчёт по оптимизации CSS структуры

### **🎊 ИТОГ: ПРОФЕССИОНАЛЬНАЯ СРЕДА РАЗРАБОТКИ**

Теперь у вас есть **полный набор инструментов** для ежедневной работы:
- ✅ **CSS**: stylelint + Prettier (169 ошибок отслеживается)  
- ✅ **HTML**: HTMLHint + Prettier (137 правил проверки)
- ✅ **Универсальные**: validate:all, format, check
- ✅ **Ежедневные чеклисты** для контроля качества
- ✅ **Быстрые команды** для эффективной работы