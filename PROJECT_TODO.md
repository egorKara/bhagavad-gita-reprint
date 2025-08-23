## Project Tasks (Unified List)

Single source of truth for tasks managed by agents across all devices (Desktop/Mobile). Update, commit and push changes. 

**Language Policy:** English primary, Russian secondary. All code, comments, and commit messages in English.

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

### Готово (отмечайте галочками)
- [x] Добавлен переключатель цветовых схем и fallback
- [x] Удалены глобальные 3D-трансформации, исправлены конфликты наложения
- [x] Отключено переопределение темы ОС при ручном выборе


