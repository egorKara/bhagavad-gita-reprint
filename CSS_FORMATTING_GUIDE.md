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
# Проверить CSS на ошибки
npm run lint:css

# Автоматически исправить CSS ошибки
npm run lint:css:fix

# Отформатировать все файлы (CSS, HTML, JS, JSON)
npm run format

# Отформатировать только CSS файлы
npm run format:css

# Проверить все файлы без изменений
npm run check

# Запустить локальный сервер для разработки
npm run dev      # порт 8000
npm run serve    # порт 8002
```

## ⚙️ Настройки

### Prettier (`.prettierrc`)
```json
{
  "tabWidth": 4,
  "useTabs": false,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "none"
}
```

### stylelint (`.stylelintrc.json`)
- Использует стандартную конфигурацию
- Отступы: 4 пробела
- Одинарные кавычки в CSS
- Короткие hex-цвета (#fff вместо #ffffff)
- Строчные hex-цвета (#fff вместо #FFF)

## 🎯 Основные правила

### ✅ Правильно:
```css
.header-nav-link {
    color: #000;
    background: rgb(255 255 255 / 90%);
    border-radius: 8px;
}

.header-nav-link:hover {
    transform: translateY(-2px);
}
```

### ❌ Неправильно:
```css
.header__nav-link {  /* BEM не kebab-case */
    color: #000000;  /* Длинный hex */
    background: rgba(255, 255, 255, 0.9);  /* Старый синтаксис */
    border-radius:8px /* Нет пробела после : */
}
```

## 🔧 Автоматизация в Cursor IDE

### Настройки VS Code (`.vscode/settings.json`)
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.stylelint": true
    }
}
```

### Рекомендуемые расширения (`.vscode/extensions.json`)
- **Prettier** - Code formatter
- **stylelint** - CSS/SCSS/Sass linter  
- **CSS Peek** - Переход к CSS классам
- **Auto Rename Tag** - Переименование парных тегов

## 🚀 Рабочий процесс

1. **Написание CSS** - пишите код как обычно
2. **Автосохранение** - при Ctrl+S код автоматически форматируется
3. **Перед коммитом** - запустите `npm run check`
4. **Исправление ошибок** - `npm run lint:css:fix`

## 🎨 Преимущества

- ✅ **Единообразный код** во всей команде
- ✅ **Автоматическое исправление** большинства ошибок  
- ✅ **Современные CSS практики**
- ✅ **Лучшая читаемость** кода
- ✅ **Меньше конфликтов** в Git
- ✅ **Профессиональное качество** кода

## 🔍 Полезные функции

### В Cursor IDE:
- **Ctrl+Shift+P** → "Format Document" - форматирование файла
- **Ctrl+Shift+P** → "Fix all auto-fixable problems" - исправление CSS
- **F2** на CSS классе - переименование во всём проекте

### Горячие клавиши:
- **Ctrl+S** - сохранить и автоформатировать
- **Ctrl+K Ctrl+F** - форматировать выделенный код
- **Alt+Shift+F** - форматировать весь файл

---

**Теперь ваш CSS всегда будет идеально отформатирован! 🎉**
