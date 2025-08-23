## Контекст для агентов (Cursor / Copilot / GitHub Actions)

Цель: синхронизировать понимание проекта между всеми агентами и устройствами.

### Project Goals
- Sale of licensed reprint of "Bhagavad-Gita As It Is" (1972 original edition)
- Frontend on GitHub Pages, API on server (Yandex Cloud), domains: `gita-1972-reprint.ru` and `api.gita-1972-reprint.ru`
- Security, monitoring, reliability, multilingual support (English primary, Russian secondary)

### Технические договоренности
- Архитектура: `public/` — статика, `src/` — API (Express)
- Качество кода: ESLint + Prettier + Husky
- Безопасность: Helmet, rate limiting, morgan, Nginx заголовки
- Мониторинг: Prometheus `/metrics`, Nginx `stub_status`, systemd, Fail2ban
- i18n: universal translator system, `localStorage` stores language preference (English primary, Russian secondary)
- Themes: CSS variables + theme switcher, saved in `localStorage`

### Правила работы агентов
1. Всегда коммитьте атомарные изменения, описывайте цель коммита.
2. Перед началом работы — `git pull --rebase`. После завершения — `git push`.
3. Все задачи ведутся в `PROJECT_TODO.md` или GitHub Issues. Обновляйте статусы.
4. Не ломать сборку и линтер. При ошибках — править до зелёного состояния.
5. Чувствительные секреты — только через `.env`/GitHub Secrets. Не коммитить приватные данные.

### Приоритеты ближайших задач
1) Графика: заменить заглушки на реальные изображения и оптимизировать
2) Заказ/оповещение: интеграция с Telegram/WhatsApp/SMS
3) Мониторинг и безопасность: довести до production‑уровня

### Быстрый старт (для бэкграунд‑агентов Cursor)
1. Перед началом: `git fetch --all --prune && git pull --rebase --autostash`
2. После изменений: `npm run lint` (по необходимости) и `git push`
3. Деплой: пуш в `main` триггерит workflow `.github/workflows/deploy-gh-pages.yml`.
4. Снапшот в Cursor: нажми "Take Snapshot" или запусти `scripts/agent_snapshot.sh`.

### Настройки снапшота
- Включаем: `public/**`, `src/**`, `docs/**`, `.github/**`, `package.json`, `README.md`
- Исключаем: `.git/**`, `node_modules/**`, `tests/**`, `package-lock.json`

### Коммиты
- Префиксы: `feat|fix|chore|refactor|docs|ci`
- Дробные атомарные коммиты, осмысленные сообщения


