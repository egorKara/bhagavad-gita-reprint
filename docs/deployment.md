# Заметки по развертыванию проекта "Бхагавад-Гита как она есть" (1972 reprint)

## Общая информация

Этот документ описывает текущее состояние проекта и основные шаги для его развертывания и поддержки. Он создан для обеспечения возможности переноса проекта на другую платформу или восстановления его в случае необходимости.

## Структура репозитория

Проект использует ветку `main` для хранения полного стека - фронтенда и серверной части.

- `main`: Основная ветка, содержит:
  - **Frontend:** HTML, CSS, JS, изображения в `public/`
  - **Backend:** Node.js API в `src/`
  - **Deployment:** Скрипты и конфигурации в `deployment/`
  - **Documentation:** Руководства в `docs/`
- `gh-pages`: Ветка для GitHub Pages статического сайта, автоматически обновляется через CI/CD.

## Настройка Git и GitHub

### SSH-ключи

Для аутентификации на GitHub с сервера был сгенерирован SSH-ключ.

- Публичный ключ: `~/.ssh/id_ed25519.pub`
- Команда генерации:
  ssh-keygen -t ed25519 -C "yc-user@server-for-gita-project" -f ~/.ssh/id_ed25519 -N ""

- Добавление ключа на GitHub: Публичный ключ был добавлен в настройки аккаунта GitHub (`Settings` -> `SSH and GPG keys`) под названием `Server-for-gita-project`.

### Удаленные репозитории

- Origin: `git@github.com:egorKara/bhagavad-gita-reprint.git` (SSH)

## Основные команды

### Переключение между ветками

# Переключиться на ветку main
 git checkout main

# Переключиться на ветку gh-pages
 git checkout gh-pages

### Работа с изменениями

# Добавить все изменения в индекс
 git add .

# Сделать коммит
 git commit -m "Описание изменений"

# Отправить изменения в удаленный репозиторий
 git push origin main

# или
 git push origin gh-pages

### Получение последних изменений

# Получить изменения из удаленного репозитория (без слияния)
 git fetch origin

# Получить и слить изменения из удаленной ветки
 git pull origin main

# или
 git pull origin gh-pages

## GitHub Pages

Сайт размещается по адресу: https://egorkara.github.io/bhagavad-gita-reprint/

Для внесения изменений в сайт, необходимо внести изменения в ветку `gh-pages` и отправить их на GitHub.

## Сервер (Yandex.Cloud)

Сервер используется для:
- **Production сайта:** `gita-1972-reprint.ru`
- **API сервера:** `api.gita-1972-reprint.ru`
- **Автоматического развертывания** через GitHub Actions
- **Мониторинга и управления** через deployment скрипты

**⚠️ ВАЖНО:** Актуальная информация о сервере находится в `deployment/README.md`

**Для подключения к серверу обратитесь к администратору проекта.**

## Архитектура доменов (рекомендовано)

- Лендинг (GitHub Pages): `www.gita-1972-reprint.ru`
- Основной сайт (сервер): `gita-1972-reprint.ru`
- API (сервер): `api.gita-1972-reprint.ru`

### DNS записи

⚠️ **ВАЖНО:** Актуальные IP адреса и DNS настройки уточняйте у администратора проекта.

- `www.gita-1972-reprint.ru` → CNAME → `egorkara.github.io`
- `gita-1972-reprint.ru` → A → `[АКТУАЛЬНЫЙ IP СЕРВЕРА]`
- `api.gita-1972-reprint.ru` → A → `[АКТУАЛЬНЫЙ IP СЕРВЕРА]`

Почтовые записи (MX/TXT/SPF) оставьте без изменений.

### GitHub Pages (лендинг)

1. Ветка `gh-pages` публикуется через workflow; CNAME выставляется автоматически на `www.gita-1972-reprint.ru`.
2. В настройках репозитория включить GitHub Pages и HTTPS.
3. Все статические файлы лежат в `public/` и деплоятся в `gh-pages`.

### Сервер (основной сайт + API)

1. **Проект:** `/var/www/gita-1972-reprint`, `.env` содержит `PORT=3000`.
2. **API сервис:** systemd-сервис `gita-api` (см. `deployment/gita-api.service`).
3. **Nginx обслуживает:**
   - `gita-1972-reprint.ru` как статику из `/var/www/gita-1972-reprint/public` (HTTPS)
   - `api.gita-1972-reprint.ru` как прокси к `127.0.0.1:3000` (HTTPS)

**Актуальные конфигурации:** `deployment/nginx-ssl.conf` и `deployment/gita-api.service`

### Выпуск HTTPS сертификатов

Для каждого домена:
```
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gita-1972-reprint.ru --non-interactive --agree-tos -m you@example.com
sudo certbot --nginx -d api.gita-1972-reprint.ru --non-interactive --agree-tos -m you@example.com
```

## Современное состояние проекта

✅ **Серверная часть:** Полностью реализована в `src/` (Node.js + Express API)  
✅ **Развертывание:** Автоматизировано через `deployment/` скрипты  
✅ **CI/CD:** Настроены workflows для деплоя и мониторинга  
✅ **Мониторинг:** Реализован через `deployment/health-check.sh` и панель управления

## Актуальные руководства

- 📋 **Полное руководство по развертыванию:** `deployment/README.md`
- 🚨 **Экстренное восстановление API:** `deployment/SERVER_FIX_INSTRUCTIONS.md`
- 🎛️ **Управление сервером:** `deployment/server-dashboard.sh`
- 💾 **Резервное копирование:** `deployment/backup-restore.sh`

## Важно

Этот документ должен обновляться при внесении любых изменений в процесс развертывания или структуру проекта.
