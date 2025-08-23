# БЭМ Архитектура CSS классов

## 🎯 Цель
Внедрение БЭМ (Блок-Элемент-Модификатор) методологии для:
- Улучшения читаемости и поддержки кода
- Устранения конфликтов CSS классов
- Создания переиспользуемых компонентов

## 📋 Блоки и компоненты

### 1. Header (Шапка)
```css
/* Блок */
.header

/* Элементы */
.header__content
.header__nav
.header__nav-list
.header__nav-item
.header__nav-link

/* Модификаторы */
.header__nav-link--active
.header__nav-link--highlighted
```

### 2. Hero Section (Главная секция)
```css
/* Блок */
.hero

/* Элементы */
.hero__content
.hero__text
.hero__title
.hero__subtitle
.hero__description
.hero__features
.hero__image
.hero__cta-buttons

/* Модификаторы */
.hero--with-background
.hero__title--large
.hero__cta-buttons--centered
```

### 3. Feature (Особенности)
```css
/* Блок */
.feature

/* Элементы */
.feature__icon
.feature__text
.feature__list
.feature__item

/* Модификаторы */
.feature--highlighted
.feature__icon--large
```

### 4. Button (Кнопки)
```css
/* Блок */
.btn

/* Элементы */
.btn__text
.btn__icon

/* Модификаторы */
.btn--primary
.btn--secondary
.btn--large
.btn--small
.btn--full-width
```

### 5. Price Badge (Ценовая метка)
```css
/* Блок */
.price

/* Элементы */
.price__label
.price__value
.price__note

/* Модификаторы */
.price--highlighted
.price--large
.price--center
```

### 6. Book Cover (Обложка книги)
```css
/* Блок */
.book

/* Элементы */
.book__cover
.book__info
.book__title
.book__details

/* Модификаторы */
.book--featured
.book__cover--large
.book__cover--with-shadow
```

### 7. Section (Секции)
```css
/* Блок */
.section

/* Элементы */
.section__container
.section__title
.section__subtitle
.section__content
.section__image

/* Модификаторы */
.section--dark
.section--light
.section--padded
.section__title--centered
```

### 8. Footer (Подвал)
```css
/* Блок */
.footer

/* Элементы */
.footer__content
.footer__section
.footer__title
.footer__list
.footer__item
.footer__link

/* Модификаторы */
.footer--dark
.footer__section--contacts
.footer__link--highlighted
```

## 🔄 План миграции

### Этап 1: Header и Navigation
- Переименовать `hero-header` → `header`
- Внедрить БЭМ для навигации

### Этап 2: Hero Section
- Структурировать главную секцию
- Создать компоненты для кнопок и особенностей

### Этап 3: Content Sections
- Унифицировать секции контента
- Создать переиспользуемые блоки

### Этап 4: Footer и Forms
- Структурировать подвал
- Оптимизировать формы

## ✅ Преимущества БЭМ
1. **Читаемость**: Понятная структура классов
2. **Модульность**: Переиспользуемые компоненты
3. **Масштабируемость**: Легкое добавление новых элементов
4. **Отсутствие конфликтов**: Изолированные стили
