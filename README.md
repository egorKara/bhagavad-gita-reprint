# Бхагавад-Гита 1972 — Лицензированный репринт  
[![Deploy to GitHub Pages](https://github.com/egorKara/bhagavad-gita-reprint/actions/workflows/deploy-gh-pages.yml/badge.svg)](https://github.com/egorKara/bhagavad-gita-reprint/actions/workflows/deploy-gh-pages.yml)
Официальное издание, одобренное **Bhaktivedanta Book Trust**.  
Купить можно на [сайте](https://egorkara.github.io/bhagavad-gita-reprint/).

## Локальный запуск

1. Установите зависимости
   - Node.js 20+ (рекомендуется)
   - npm i
2. Создайте `.env` (см. `.env.example`)
3. Запуск
   - Разработка: `npm run dev`
   - Прод: `npm start`

## Команды

- Линтинг: `npm run lint`
- Форматирование: `npm run format`

## Структура

```
src/
  config/           # env-конфиг
  api/
    routes/         # API маршруты
    controllers/    # API контроллеры
public/             # статические файлы
docs/               # документация
```
