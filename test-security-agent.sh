#!/bin/bash

# Скрипт для быстрого тестирования Cursor Security Agent

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Тестирование Cursor Security Agent${NC}"
echo "=================================="

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js не установлен${NC}"
    echo "Установите Node.js для продолжения"
    exit 1
fi

echo -e "${GREEN}✅ Node.js найден: $(node --version)${NC}"

# Проверка файлов агента
if [ ! -f "src/services/security-agent.js" ]; then
    echo -e "${RED}❌ Файл security-agent.js не найден${NC}"
    exit 1
fi

if [ ! -f "src/cli/security-cli.js" ]; then
    echo -e "${RED}❌ Файл security-cli.js не найден${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Все необходимые файлы найдены${NC}"

# Установка зависимостей
echo -e "${BLUE}📦 Устанавливаю зависимости...${NC}"
npm install

# Тест 1: Разовое сканирование
echo -e "${BLUE}🔍 Тест 1: Разовое сканирование${NC}"
if node src/cli/security-cli.js scan --path . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Разовое сканирование работает${NC}"
else
    echo -e "${RED}❌ Разовое сканирование не работает${NC}"
fi

# Тест 2: Просмотр справки
echo -e "${BLUE}📖 Тест 2: Просмотр справки${NC}"
if node src/cli/security-cli.js help > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Справка работает${NC}"
else
    echo -e "${RED}❌ Справка не работает${NC}"
fi

# Тест 3: Просмотр статистики
echo -e "${BLUE}📊 Тест 3: Просмотр статистики${NC}"
if node src/cli/security-cli.js stats > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Статистика работает${NC}"
else
    echo -e "${RED}❌ Статистика не работает${NC}"
fi

# Тест 4: Проверка отчета
echo -e "${BLUE}📋 Тест 4: Проверка отчета${NC}"
if [ -f "security-scan-report.json" ]; then
    echo -e "${GREEN}✅ Отчет безопасности создан${NC}"
    echo "   Найдено файлов: $(jq '.totalFiles' security-scan-report.json 2>/dev/null || echo 'N/A')"
else
    echo -e "${YELLOW}⚠️  Отчет безопасности не найден (возможно, секреты не обнаружены)${NC}"
fi

# Тест 5: Проверка GitHub Secrets инструкций
echo -e "${BLUE}🔐 Тест 5: Проверка GitHub Secrets инструкций${NC}"
if [ -f "github-secrets-to-create.md" ]; then
    echo -e "${GREEN}✅ Инструкции по GitHub Secrets созданы${NC}"
else
    echo -e "${YELLOW}⚠️  Инструкции по GitHub Secrets не созданы (возможно, секреты не обнаружены)${NC}"
fi

# Тест 6: Проверка логов
echo -e "${BLUE}📝 Тест 6: Проверка логов${NC}"
if [ -f "security-agent.log" ]; then
    echo -e "${GREEN}✅ Лог файл создан${NC}"
    echo "   Размер лога: $(du -h security-agent.log | cut -f1)"
else
    echo -e "${YELLOW}⚠️  Лог файл не найден${NC}"
fi

# Тест 7: Запуск тестов Jest (если установлен)
echo -e "${BLUE}🧪 Тест 7: Запуск Jest тестов${NC}"
if command -v jest &> /dev/null || npx jest --version > /dev/null 2>&1; then
    echo "Запускаю Jest тесты..."
    if npx jest tests/security-agent.test.js --silent; then
        echo -e "${GREEN}✅ Jest тесты прошли успешно${NC}"
    else
        echo -e "${RED}❌ Jest тесты не прошли${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Jest не установлен, пропускаю тесты${NC}"
fi

# Тест 8: Проверка производительности
echo -e "${BLUE}⚡ Тест 8: Проверка производительности${NC}"
echo "Сканирование текущей директории..."
START_TIME=$(date +%s.%N)
node src/cli/security-cli.js scan --path . > /dev/null 2>&1
END_TIME=$(date +%s.%N)
SCAN_TIME=$(echo "$END_TIME - $START_TIME" | bc -l 2>/dev/null || echo "N/A")

if [ "$SCAN_TIME" != "N/A" ]; then
    echo -e "${GREEN}✅ Сканирование завершено за ${SCAN_TIME} секунд${NC}"
else
    echo -e "${GREEN}✅ Сканирование завершено${NC}"
fi

# Финальный отчет
echo ""
echo -e "${BLUE}📊 ФИНАЛЬНЫЙ ОТЧЕТ${NC}"
echo "=================="

# Подсчет найденных секретов
if [ -f "security-scan-report.json" ]; then
    CRITICAL=$(jq '.criticalFindings' security-scan-report.json 2>/dev/null || echo "0")
    HIGH=$(jq '.highFindings' security-scan-report.json 2>/dev/null || echo "0")
    MEDIUM=$(jq '.mediumFindings' security-scan-report.json 2>/dev/null || echo "0")
    LOW=$(jq '.lowFindings' security-scan-report.json 2>/dev/null || echo "0")
    
    echo -e "🚨 Критические: ${CRITICAL}"
    echo -e "⚠️  Высокие: ${HIGH}"
    echo -e "🔶 Средние: ${MEDIUM}"
    echo -e "🔵 Низкие: ${LOW}"
    
    TOTAL=$((CRITICAL + HIGH + MEDIUM + LOW))
    if [ $TOTAL -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Обнаружены потенциальные секреты!${NC}"
        echo "Проверьте файл github-secrets-to-create.md для инструкций"
    else
        echo ""
        echo -e "${GREEN}✅ Секреты не обнаружены${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Отчет безопасности не найден${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Тестирование завершено!${NC}"
echo ""
echo "📋 Следующие шаги:"
echo "1. Проверьте отчеты безопасности"
echo "2. Если найдены секреты, следуйте инструкциям в github-secrets-to-create.md"
echo "3. Запустите агент в фоновом режиме: ./start-security-agent.sh"
echo "4. Для мониторинга: ./security-status.sh"
echo ""
echo "🔒 Безопасность вашего кода - наш приоритет!"