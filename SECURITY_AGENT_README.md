# 🔒 Cursor Security Agent

**Автоматический агент безопасности для отслеживания утечки секретной информации в проектах Cursor IDE**

## 🎯 Назначение

Cursor Security Agent - это background агент, который непрерывно мониторит ваш проект на предмет:
- API ключей и токенов
- Паролей и учетных данных
- SSH ключей
- Секретов баз данных
- Облачных сервисов (AWS, Google Cloud, GitHub)
- И других типов секретной информации

Агент автоматически создает инструкции по перемещению найденных секретов в GitHub Secrets.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Убедитесь что у вас установлен Node.js
node --version

# Если Node.js не установлен, установите его
# Ubuntu/Debian:
sudo apt update && sudo apt install nodejs npm

# CentOS/RHEL:
sudo yum install nodejs npm

# macOS:
brew install node
```

### 2. Запуск агента

```bash
# Сделать скрипт исполняемым
chmod +x start-security-agent.sh

# Запустить агент в фоновом режиме
./start-security-agent.sh
```

### 3. Проверка работы

```bash
# Проверить статус агента
./security-status.sh

# Посмотреть логи
tail -f security-agent.log

# Выполнить быстрое сканирование
./quick-scan.sh
```

## 📋 Доступные команды

### Основные команды CLI

```bash
# Разовое сканирование
node src/cli/security-cli.js scan

# Запуск непрерывного мониторинга
node src/cli/security-cli.js monitor

# Остановка мониторинга
node src/cli/security-cli.js stop

# Просмотр отчета
node src/cli/security-cli.js report

# Просмотр статистики
node src/cli/security-cli.js stats

# Справка
node src/cli/security-cli.js help
```

### Опции командной строки

```bash
# Сканирование с указанием пути
node src/cli/security-cli.js scan --path /path/to/project

# Мониторинг с кастомным интервалом (в минутах)
node src/cli/security-cli.js monitor --interval 10

# Сканирование с указанием глубины
node src/cli/security-cli.js scan --depth 5
```

## 🔧 Конфигурация

### Основные настройки

Файл `src/config/security-config.js` содержит все настройки агента:

```javascript
module.exports = {
  scanning: {
    interval: 5 * 60 * 1000,        // Интервал сканирования (5 минут)
    maxDepth: 3,                     // Глубина сканирования
    maxFileSize: 10 * 1024 * 1024,  // Максимальный размер файла (10MB)
  },
  
  patterns: {
    enabled: {
      apiKeys: true,                  // Поиск API ключей
      passwords: true,                // Поиск паролей
      tokens: true,                   // Поиск токенов
      sshKeys: true,                  // Поиск SSH ключей
      // ... другие паттерны
    }
  }
};
```

### Пользовательские паттерны

Добавьте свои паттерны в конфигурацию:

```javascript
patterns: {
  custom: [
    // Поиск специфичных для проекта секретов
    /myapp_secret\s*[:=]\s*['"`]?[a-zA-Z0-9]{16,}['"`]?/gi,
    /internal_api_key\s*[:=]\s*['"`]?[a-zA-Z0-9]{20,}['"`]?/gi
  ]
}
```

## 📊 Отчеты и результаты

### Автоматически создаваемые файлы

1. **`security-scan-report.json`** - Детальный отчет в JSON формате
2. **`github-secrets-to-create.md`** - Инструкции по созданию GitHub Secrets
3. **`security-agent.log`** - Лог работы агента

### Структура отчета

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "totalFiles": 3,
  "criticalFindings": 1,
  "highFindings": 2,
  "mediumFindings": 0,
  "lowFindings": 0,
  "details": [
    {
      "file": "src/config/database.js",
      "findings": [
        {
          "pattern": "password\\s*[:=]\\s*['\"`]?[^'\"`\\s]+['\"`]?",
          "matches": ["password: \"secret123\""],
          "lineNumbers": [15],
          "severity": "MEDIUM"
        }
      ]
    }
  ]
}
```

## 🔐 GitHub Secrets Integration

### Автоматическое создание инструкций

Агент автоматически создает файл `github-secrets-to-create.md` с:

1. **Списком найденных секретов**
2. **Пошаговыми инструкциями** по созданию GitHub Secrets
3. **Примерами замены** в коде
4. **Безопасными практиками** работы с секретами

### Пример инструкции

```markdown
# GitHub Secrets для создания

## Автоматически обнаруженные секреты

1. **SECRET_1** = `sk-1234567890abcdef...`
2. **SECRET_2** = `ghp_abcdef123456...`

### Инструкции по созданию:

1. Перейдите в ваш GitHub репозиторий
2. Нажмите Settings → Secrets and variables → Actions
3. Создайте новые repository secrets
4. Замените в коде секреты на переменные окружения
```

## 🚨 Типы обнаруживаемых секретов

### API ключи и токены
- OpenAI API ключи (`sk-...`)
- GitHub токены (`ghp_...`, `gho_...`)
- Slack токены (`xoxb-...`, `xoxp-...`)
- Discord токены
- Telegram бот токены
- JWT токены

### Облачные сервисы
- AWS Access Keys (`AKIA...`)
- Google Cloud API ключи (`AIza...`)
- Azure Service Principal keys
- Heroku API ключи

### Базы данных
- MongoDB connection strings
- PostgreSQL connection strings
- MySQL connection strings
- Redis connection strings

### SSH и криптографические ключи
- RSA private keys
- DSA private keys
- EC private keys
- OpenSSH private keys

## 🛡️ Безопасность

### Что агент НЕ делает

- ❌ Не отправляет секреты никуда
- ❌ Не сохраняет полные секреты в отчетах
- ❌ Не передает данные третьим лицам
- ❌ Не требует внешних подключений

### Что агент делает

- ✅ Сканирует локальные файлы
- ✅ Создает отчеты на локальном компьютере
- ✅ Генерирует инструкции по безопасности
- ✅ Работает полностью автономно

## 🔄 Непрерывный мониторинг

### Автозапуск

```bash
# Создание systemd сервиса (требует sudo)
sudo ./start-security-agent.sh

# Ручной запуск
./start-security-agent.sh
```

### Управление сервисом

```bash
# Запуск
sudo systemctl start cursor-security-agent

# Остановка
sudo systemctl stop cursor-security-agent

# Статус
sudo systemctl status cursor-security-agent

# Автозапуск
sudo systemctl enable cursor-security-agent
```

## 📱 Уведомления и мониторинг

### Логирование

```bash
# Просмотр логов в реальном времени
tail -f security-agent.log

# Поиск по логам
grep "CRITICAL" security-agent.log

# Последние 100 строк
tail -n 100 security-agent.log
```

### Статистика

```bash
# Просмотр статистики
node src/cli/security-cli.js stats

# Результат:
# 📈 СТАТИСТИКА АГЕНТА БЕЗОПАСНОСТИ
# 🔄 Статус мониторинга: Активен
# ⚡ Статус сканирования: Ожидает
# 📅 Последнее сканирование: 15.01.2024, 13:30:00
# 📊 Всего находок: 5
```

## 🚀 Производительность

### Оптимизации

- **Кэширование результатов** - избегает повторного сканирования
- **Параллельная обработка** - сканирует несколько файлов одновременно
- **Умные исключения** - пропускает ненужные директории
- **Таймауты** - защита от зависания на больших файлах

### Рекомендации

- Интервал сканирования: 5-15 минут
- Глубина сканирования: 3-5 уровней
- Максимальный размер файла: 10-50MB

## 🔧 Устранение неполадок

### Частые проблемы

#### 1. Агент не запускается

```bash
# Проверить Node.js
node --version

# Проверить права на файлы
ls -la src/services/security-agent.js

# Проверить зависимости
npm install
```

#### 2. Ошибки сканирования

```bash
# Проверить логи
cat security-agent.log

# Проверить права доступа к директориям
ls -la /path/to/scan

# Запустить с отладкой
DEBUG=* node src/cli/security-cli.js scan
```

#### 3. Высокое потребление ресурсов

```bash
# Увеличить интервал сканирования
# В src/config/security-config.js:
interval: 15 * 60 * 1000, // 15 минут

# Уменьшить глубину сканирования
maxDepth: 2,

# Ограничить размер файлов
maxFileSize: 5 * 1024 * 1024, // 5MB
```

## 📚 Примеры использования

### Сценарий 1: Разовое сканирование

```bash
# Сканирование всего проекта
node src/cli/security-cli.js scan

# Сканирование конкретной директории
node src/cli/security-cli.js scan --path ./src

# Просмотр результатов
node src/cli/security-cli.js report
```

### Сценарий 2: Непрерывный мониторинг

```bash
# Запуск мониторинга
./start-security-agent.sh

# Проверка статуса
./security-status.sh

# Остановка
./stop-security-agent.sh
```

### Сценарий 3: Интеграция с CI/CD

```bash
# В GitHub Actions
- name: Security Scan
  run: |
    node src/cli/security-cli.js scan
    if [ -f "security-scan-report.json" ]; then
      echo "Security issues found!"
      exit 1
    fi
```

## 🤝 Поддержка и развитие

### Сообщить об ошибке

1. Проверьте логи: `cat security-agent.log`
2. Создайте issue с описанием проблемы
3. Приложите конфигурацию и логи

### Внести вклад

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Создайте Pull Request

### Обновления

```bash
# Проверить обновления
git pull origin main

# Обновить зависимости
npm install

# Перезапустить агент
./stop-security-agent.sh
./start-security-agent.sh
```

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🙏 Благодарности

- Cursor IDE команде за создание отличной среды разработки
- Сообществу разработчиков за обратную связь
- Всем участникам проекта безопасности

---

**🔒 Безопасность вашего кода - наш приоритет!**

*Cursor Security Agent v1.0*