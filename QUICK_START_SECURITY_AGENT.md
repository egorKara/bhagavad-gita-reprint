# 🚀 Быстрый запуск Cursor Security Agent

## ⚡ За 5 минут

### 1. Проверка Node.js
```bash
node --version
# Должно быть 14.0.0 или выше
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Быстрое тестирование
```bash
chmod +x test-security-agent.sh
./test-security-agent.sh
```

### 4. Запуск агента
```bash
chmod +x start-security-agent.sh
./start-security-agent.sh
```

## 🔍 Разовые команды

```bash
# Сканирование проекта
node src/cli/security-cli.js scan

# Просмотр отчета
node src/cli/security-cli.js report

# Статистика
node src/cli/security-cli.js stats
```

## 🔄 Непрерывный мониторинг

```bash
# Запуск в фоне
./start-security-agent.sh

# Проверка статуса
./security-status.sh

# Остановка
./stop-security-agent.sh
```

## 📊 Результаты

Агент автоматически создает:
- `security-scan-report.json` - детальный отчет
- `github-secrets-to-create.md` - инструкции по GitHub Secrets
- `security-agent.log` - логи работы

## 🆘 Помощь

```bash
node src/cli/security-cli.js help
```

---

**🔒 Агент готов к работе!**