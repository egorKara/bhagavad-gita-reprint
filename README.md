# 🕉️ Бхагавад-Гита 1972 - Официальный репринт

> Точное воспроизведение оригинального издания Бхагавад-Гиты 1972 года от Macmillan Publishing

[![License: BBT](https://img.shields.io/badge/License-BBT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0+-yellow.svg)](https://eslint.org/)

## 🚀 Новая архитектура (v4.0)

Проект полностью рефакторен с переходом на современные технологии:

- **ES Modules** вместо CommonJS
- **TypeScript** для типизации и безопасности
- **Современная архитектура сервисов** с разделением ответственности
- **Оптимизированная CSS структура** с исправлением специфичности
- **Улучшенная безопасность** с исправлением критических уязвимостей

## 📋 Содержание

- [Особенности](#особенности)
- [Технологии](#технологии)
- [Установка](#установка)
- [Разработка](#разработка)
- [Архитектура](#архитектура)
- [API](#api)
- [Безопасность](#безопасность)
- [Производительность](#производительность)
- [Лицензия](#лицензия)

## ✨ Особенности

- **Оригинальное издание 1972 года** - точный репринт с Macmillan Publishing
- **Полный текст с комментариями** А.Ч. Бхактиведанты Свами Прабхупады
- **Оригинальные иллюстрации** и оформление
- **Официальная лицензия** Bhaktivedanta Book Trust (BBT)
- **Доставка по России** с отслеживанием заказов
- **Многоязычная поддержка** (русский/английский)
- **Адаптивный дизайн** для всех устройств

## 🛠️ Технологии

### Backend
- **Node.js 18+** с ES Modules
- **Express.js** для API
- **TypeScript** для типизации
- **Helmet** для безопасности
- **Morgan** для логирования
- **Rate Limiting** для защиты от DDoS

### Frontend
- **Vanilla JavaScript** (ES2022)
- **CSS3** с CSS переменными
- **HTML5** семантическая разметка
- **Progressive Web App** возможности

### Инструменты
- **ESLint 9.x** с flat config
- **Prettier** для форматирования
- **Stylelint** для CSS
- **HTMLHint** для HTML
- **TypeScript** компилятор

## 🚀 Установка

### Требования
- Node.js 18+ 
- npm 9+

### Быстрый старт
```bash
# Клонирование репозитория
git clone https://github.com/egorKara/bhagavad-gita-reprint.git
cd bhagavad-gita-reprint

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск продакшн сервера
npm start
```

## 🔧 Разработка

### Доступные команды
```bash
# Форматирование кода
npm run format

# Линтинг
npm run lint:js      # JavaScript/TypeScript
npm run lint:css     # CSS
npm run lint:html    # HTML

# Проверка всего
npm run validate:all

# Документация
npm run docs

# Lighthouse анализ
npm run lighthouse
```

### Структура проекта
```
├── src/                    # Исходный код
│   ├── api/               # API endpoints
│   │   ├── controllers/   # Контроллеры
│   │   └── routes/        # Маршруты
│   ├── config/            # Конфигурация
│   ├── middleware/        # Middleware
│   ├── services/          # Бизнес-логика
│   ├── types/             # TypeScript типы
│   ├── utils/             # Утилиты
│   ├── app.js             # Express приложение
│   └── server.js          # Точка входа
├── public/                 # Статические файлы
│   ├── assets/            # Ресурсы
│   │   ├── css/           # Стили
│   │   ├── js/            # Скрипты
│   │   └── images/        # Изображения
│   └── *.html             # HTML страницы
├── tests/                  # Тесты
├── docs/                   # Документация
└── deployment/             # Конфигурация деплоя
```

## 🏗️ Архитектура

### Принципы
- **Разделение ответственности** - каждый модуль имеет одну задачу
- **Dependency Injection** - зависимости передаются извне
- **Type Safety** - полная типизация с TypeScript
- **Error Handling** - централизованная обработка ошибок
- **Logging** - структурированное логирование

### Слои
1. **Routes** - маршрутизация HTTP запросов
2. **Controllers** - обработка запросов и ответов
3. **Services** - бизнес-логика и работа с данными
4. **Utils** - вспомогательные функции

## 🔌 API

### Endpoints

#### Заказы
```http
POST   /api/orders/create          # Создание заказа
GET    /api/orders/list            # Список заказов (админ)
GET    /api/orders/:id             # Заказ по ID (админ)
PATCH  /api/orders/:id/status      # Обновление статуса (админ)
DELETE /api/orders/:id             # Удаление заказа (админ)
GET    /api/orders/search/:query   # Поиск заказов (админ)
GET    /api/orders/stats/overview  # Статистика (админ)
GET    /api/orders/export/csv      # Экспорт в CSV (админ)
```

#### Статус
```http
GET    /api/status                 # Статус API
GET    /healthz                    # Health check
GET    /livez                      # Liveness probe
GET    /readyz                     # Readiness probe
```

#### Переводы
```http
POST   /api/translate              # Перевод текста
```

### Аутентификация
- **Admin API**: Bearer token в заголовке `Authorization`
- **Public API**: CAPTCHA валидация (reCAPTCHA/Turnstile)

## 🔒 Безопасность

### Защита
- **Helmet** - HTTP заголовки безопасности
- **CORS** - настройка cross-origin запросов
- **Rate Limiting** - защита от DDoS
- **Input Validation** - валидация входных данных
- **CAPTCHA** - защита от ботов

### Исправленные уязвимости
- ✅ Generic Object Injection Sink
- ✅ CSS специфичность (166+ проблем)
- ✅ HTML валидация (137+ проблем)
- ✅ Безопасность модулей

## ⚡ Производительность

### Оптимизации
- **CSS минификация** и оптимизация
- **Изображения** с lazy loading
- **JavaScript** бандл оптимизация
- **HTTP/2** поддержка
- **Gzip** сжатие

### Метрики
- **Core Web Vitals** оптимизация
- **Lighthouse** CI интеграция
- **Performance** мониторинг

## 📱 Особенности

### Многоязычность
- Русский (основной)
- Английский (вторичный)
- Автоматическое переключение
- Сохранение выбора в localStorage

### Цветовые схемы
- Ведическая (по умолчанию)
- Классическая
- Современная
- Автоматическое определение ОС

### Адаптивность
- Mobile-first подход
- Responsive дизайн
- Touch-friendly интерфейс
- PWA возможности

## 📄 Лицензия

Проект распространяется под лицензией **Bhaktivedanta Book Trust (BBT)**.

Оригинальный текст Бхагавад-Гиты защищен авторским правом Bhaktivedanta Book Trust.

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Контакты

- **Веб-сайт**: [gita-1972-reprint.ru](https://gita-1972-reprint.ru)
- **Email**: [email protected]
- **GitHub**: [@egorKara](https://github.com/egorKara)

## 🙏 Благодарности

- **A.C. Bhaktivedanta Swami Prabhupada** - оригинальный автор
- **Bhaktivedanta Book Trust** - за лицензию и поддержку
- **Macmillan Publishing** - за оригинальное издание 1972 года

---

**Ом намо бхагавате васудевайа** 🕉️
