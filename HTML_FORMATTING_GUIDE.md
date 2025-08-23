# 🎨 HTML Форматирование в проекте

## 🛠️ **УСТАНОВЛЕННЫЕ ИНСТРУМЕНТЫ**

### **Prettier** (основной форматтер)
- ✅ Автоматическое форматирование HTML при сохранении
- ✅ Единообразные отступы и структура
- ✅ Настройка через `.prettierrc`

### **HTMLHint** (HTML линтер)
- ✅ Проверка семантики HTML
- ✅ Выявление ошибок структуры
- ✅ Настройка через `.htmlhintrc`

### **Встроенные VS Code расширения**
- ✅ Auto Rename Tag - синхронизация парных тегов
- ✅ HTML CSS Support - автодополнение CSS классов
- ✅ Path Intellisense - автодополнение путей к файлам

## 📋 **ДОСТУПНЫЕ КОМАНДЫ**

```bash
# Форматирование HTML файлов
npm run format:html

# Проверка HTML на ошибки
npm run lint:html

# Форматирование всех файлов (HTML, CSS, JS)
npm run format

# Полная проверка проекта
npm run validate:all

# Быстрая проверка
npm run check
```

## ⚡ **ГОРЯЧИЕ КЛАВИШИ**

| Действие | Клавиша | Описание |
|----------|---------|----------|
| **Автоформат** | `Shift+Alt+F` | Форматировать текущий файл |
| **Форматирование при сохранении** | `Ctrl+S` | Автоматически при сохранении |
| **Переименование тега** | Автоматически | Синхронно изменяет парные теги |
| **Автодополнение** | `Ctrl+Space` | CSS классы и пути к файлам |

## 🎯 **ПРАВИЛА ФОРМАТИРОВАНИЯ**

### **HTML Структура**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Заголовок страницы</title>
</head>
<body>
    <header class="header">
        <nav class="header__nav">
            <!-- Контент -->
        </nav>
    </header>
</body>
</html>
```

### **БЭМ Методология (рекомендуется)**
```html
<!-- Блок -->
<div class="card">
    <!-- Элемент -->
    <h2 class="card__title">Заголовок</h2>
    <p class="card__text">Текст</p>
    <!-- Модификатор -->
    <button class="card__button card__button--primary">Кнопка</button>
</div>
```

### **Семантическая разметка**
```html
<article class="article">
    <header class="article__header">
        <h1 class="article__title">Заголовок статьи</h1>
        <time class="article__date" datetime="2025-01-23">23 января 2025</time>
    </header>
    
    <main class="article__content">
        <p class="article__text">Основной контент</p>
    </main>
    
    <footer class="article__footer">
        <p class="article__author">Автор</p>
    </footer>
</article>
```

## 🔧 **НАСТРОЙКИ ПРОЕКТА**

### **.htmlhintrc**
```json
{
    "tagname-lowercase": true,
    "attr-lowercase": true,
    "attr-value-double-quotes": true,
    "doctype-html5": true,
    "alt-require": true,
    "title-require": true
}
```

### **Prettier настройки для HTML**
```json
{
    "tabWidth": 4,
    "useTabs": false,
    "htmlWhitespaceSensitivity": "css",
    "bracketSameLine": false,
    "printWidth": 120
}
```

## ⚠️ **ЧАСТЫЕ ОШИБКИ И ИСПРАВЛЕНИЯ**

### **1. Отсутствует alt у изображений**
```html
<!-- ❌ Неправильно -->
<img src="image.jpg" class="image">

<!-- ✅ Правильно -->
<img src="image.jpg" alt="Описание изображения" class="image">
```

### **2. Неправильная структура заголовков**
```html
<!-- ❌ Неправильно -->
<h1>Главный заголовок</h1>
<h3>Подзаголовок</h3> <!-- Пропущен h2 -->

<!-- ✅ Правильно -->
<h1>Главный заголовок</h1>
<h2>Подзаголовок</h2>
<h3>Подподзаголовок</h3>
```

### **3. Неправильные атрибуты**
```html
<!-- ❌ Неправильно -->
<div CLASS="card" ID="myCard">

<!-- ✅ Правильно -->
<div class="card" id="my-card">
```

## 🚀 **БЫСТРЫЙ СТАРТ**

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Проверка HTML:**
   ```bash
   npm run lint:html
   ```

3. **Форматирование:**
   ```bash
   npm run format:html
   ```

4. **Полная проверка:**
   ```bash
   npm run validate:all
   ```

## 📚 **ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ**

- [HTML5 семантика](https://developer.mozilla.org/ru/docs/Web/HTML/Element)
- [БЭМ методология](https://ru.bem.info/methodology/)
- [HTMLHint правила](https://htmlhint.com/docs/user-guide/list-rules)
- [Prettier HTML опции](https://prettier.io/docs/en/options.html#html-whitespace-sensitivity)

---

## 🎉 **ИТОГ**

Теперь у вас есть полный набор инструментов для профессионального форматирования HTML:

- ✅ **Prettier** - автоматическое форматирование
- ✅ **HTMLHint** - проверка качества
- ✅ **Auto Rename Tag** - работа с тегами
- ✅ **IntelliSense** - автодополнение
- ✅ **Настроенные команды** - быстрый доступ
- ✅ **Горячие клавиши** - эффективная работа

**Используйте `npm run validate:all` перед каждым коммитом!**
