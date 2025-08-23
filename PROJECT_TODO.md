## Project Tasks (Unified List)

Single source of truth for tasks managed by agents across all devices (Desktop/Mobile). Update, commit and push changes. 

**Language Policy:** Russian primary, English secondary. All code, comments, and commit messages in Russian.

### Активные задачи

- [ ] Заменить заглушку `author.jpg` на валидный `author.svg` и обновить ссылки
- [ ] Добавить реальные фотографии (обложка, развороты, автор) и оптимизировать веса
- [ ] Подключить Telegram/WhatsApp/SMS-интеграцию на сервере (webhook/уведомления)
- [ ] Финализировать мониторинг: `/metrics`, `/nginx_status`, Fail2ban, systemd проверки
- [ ] Улучшить SEO: sitemap.xml, robots.txt, JSON-LD (книга/организация/хлебные крошки)

### Интернационализация

- [ ] Проверить перевод всех страниц, включая формы и ошибки валидации
- [ ] Расширить словарь переводов и покрыть новые разделы

### UI/UX

- [ ] Проверить корректность переключателя цветовых схем на мобильных
- [ ] Сверить шрифты и оформление заголовков с оригинальным изданием

### Бэкенд/Безопасность

- [ ] Проверить CORS (GitHub Pages + домен) и заголовки безопасности (Helmet + Nginx)
- [ ] Доработать rate limiting и X-Request-Id логирование

### Технический долг (рефакторинг)

- [x] Введён модуль логирования (`src/utils/logger.js`), заменены `console.*`
- [x] Исправлено логирование `morgan`: добавлен `:id` токен и вывод `req.id`
- [x] Унифицирована директория данных через `config.dataDir`
- [x] Вынесен общий middleware `requireAdminAuth` (`src/middleware/auth.js`)
- [x] Исправлен `parseInt` с явной `radix=10` в подсчёте статистики
- [x] Прогнан ESLint, устранены предупреждения; тесты проходят
- [x] Критические исправления безопасности: RegExp, FormData, AbortController
- [x] CSS структура: унифицированы основные классы на kebab-case
- [x] HTML структура: index.html полностью обновлён
- [ ] Системный рефакторинг CSS (166+ проблем no-descending-specificity)
- [ ] Исправление Generic Object Injection Sink в admin-orders.js
- [ ] Настройка Lighthouse CI для производительности
- [ ] Оптимизация размера бандла (translations.js: 96K)

### Готово (отмечайте галочками)

- [x] Добавлен переключатель цветовых схем и fallback
- [x] Удалены глобальные 3D-трансформации, исправлены конфликты наложения
- [x] Отключено переопределение темы ОС при ручном выборе

### Ежедневные проверки (23.08.2025)

- [x] Безопасность: npm audit (4 уязвимости низкой критичности)
- [x] Безопасность: ESLint Security (114 проблем)
- [x] Структура: CSS Stylelint (166+ проблем)
- [x] Структура: HTML HTMLHint (137+ проблем)
- [x] Качество: Prettier форматирование
- [x] Производительность: Анализ размера бандла
- [x] Мониторинг: Проверка метрик
- [ ] Критично: Generic Object Injection Sink
- [ ] Важно: Системный рефакторинг CSS
- [ ] Средне: Настройка Lighthouse CI
