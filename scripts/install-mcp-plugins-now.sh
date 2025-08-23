#!/usr/bin/env bash
# Немедленная установка MCP плагинов для Cursor

set -euo pipefail

echo "🔧 УСТАНОВКА MCP ПЛАГИНОВ - ВЫПОЛНЕНИЕ СЕЙЧАС"
echo "=============================================="

# Приоритетные плагины для установки
PLUGINS=(
    "GitHub Integration Enhanced"
    "Performance Auditor" 
    "i18n Translation Manager"
    "SEO Assistant Pro"
    "CSS Variables Manager"
)

echo "📦 Плагины к установке:"
for plugin in "${PLUGINS[@]}"; do
    echo "   • $plugin"
done
echo ""

# Метод 1: Cursor CLI (если доступен)
if command -v cursor >/dev/null 2>&1; then
    echo "✅ Cursor CLI обнаружен - пытаемся автоматическую установку..."
    
    # GitHub Integration Enhanced
    echo "📦 Устанавливаем GitHub Integration Enhanced..."
    if cursor --install-plugin github-integration-enhanced --yes 2>/dev/null; then
        echo "✅ GitHub Integration Enhanced установлен"
    else
        echo "⚠️  GitHub Integration Enhanced - требует ручная установка"
    fi
    
    # Performance Auditor
    echo "📦 Устанавливаем Performance Auditor..."
    if cursor --install-plugin performance-auditor --yes 2>/dev/null; then
        echo "✅ Performance Auditor установлен"
    else
        echo "⚠️  Performance Auditor - требует ручная установка"
    fi
    
    # i18n Translation Manager
    echo "📦 Устанавливаем i18n Translation Manager..."
    if cursor --install-plugin i18n-translation-manager --yes 2>/dev/null; then
        echo "✅ i18n Translation Manager установлен"
    else
        echo "⚠️  i18n Translation Manager - требует ручная установка"
    fi
    
    # SEO Assistant Pro
    echo "📦 Устанавливаем SEO Assistant Pro..."
    if cursor --install-plugin seo-assistant-pro --yes 2>/dev/null; then
        echo "✅ SEO Assistant Pro установлен"
    else
        echo "⚠️  SEO Assistant Pro - требует ручная установка"
    fi
    
    # CSS Variables Manager
    echo "📦 Устанавливаем CSS Variables Manager..."
    if cursor --install-plugin css-variables-manager --yes 2>/dev/null; then
        echo "✅ CSS Variables Manager установлен"
    else
        echo "⚠️  CSS Variables Manager - требует ручная установка"
    fi
    
else
    echo "❌ Cursor CLI недоступен"
fi

echo ""
echo "🔧 МЕТОД 2: Ручная установка через Cursor IDE"
echo "============================================="

cat << 'EOF'

📋 ПОШАГОВАЯ ИНСТРУКЦИЯ ПО УСТАНОВКЕ:

1. Откройте Cursor IDE
2. Нажмите Ctrl/Cmd + Shift + P (Command Palette)
3. Введите: "Extensions: Install Extensions"
4. В поиске введите названия плагинов:

   🔗 GitHub Integration Enhanced
   ├─ Поиск: "GitHub Integration Enhanced"
   ├─ Издатель: GitHub или Cursor Official
   └─ Установка: Кнопка "Install"

   ⚡ Performance Auditor  
   ├─ Поиск: "Performance Auditor"
   ├─ Издатель: Cursor Team
   └─ Установка: Кнопка "Install"

   🌍 i18n Translation Manager
   ├─ Поиск: "i18n Translation Manager" 
   ├─ Издатель: Translation Tools
   └─ Установка: Кнопка "Install"

   🔍 SEO Assistant Pro
   ├─ Поиск: "SEO Assistant Pro"
   ├─ Издатель: SEO Tools
   └─ Установка: Кнопка "Install" + OAuth

   🎨 CSS Variables Manager
   ├─ Поиск: "CSS Variables Manager"
   ├─ Издатель: Style Tools  
   └─ Установка: Кнопка "Install"

5. После установки перезапустите Cursor IDE
6. Проверьте установку: View → Extensions → Installed

EOF

echo ""
echo "⚙️ КОНФИГУРАЦИЯ ПОСЛЕ УСТАНОВКИ"
echo "==============================="

# Создать файлы конфигурации для плагинов
mkdir -p .cursor/plugin-configs

# GitHub Integration
cat > .cursor/plugin-configs/github-integration.json << 'JSON'
{
  "github_integration": {
    "repository": "bhagavad-gita-reprint",
    "default_branch": "main",
    "auto_pr_analysis": true,
    "issue_tracking": true,
    "workflow_integration": true,
    "language_primary": "ru",
    "language_secondary": "en"
  }
}
JSON

# Performance Auditor
cat > .cursor/plugin-configs/performance-auditor.json << 'JSON'
{
  "performance_auditor": {
    "targets": {
      "lcp": "< 2.5s",
      "fid": "< 100ms",
      "cls": "< 0.1"
    },
    "check_frequency": "weekly",
    "report_format": "markdown",
    "integration": "github_actions"
  }
}
JSON

# i18n Translation Manager
cat > .cursor/plugin-configs/i18n-manager.json << 'JSON'
{
  "i18n_manager": {
    "primary_language": "ru",
    "secondary_languages": ["en"],
    "translation_files": [
      "public/assets/js/translations.js"
    ],
    "validation_rules": {
      "require_all_keys": true,
      "check_formatting": true,
      "validate_html_entities": true
    },
    "auto_translate": false,
    "consistency_check": true
  }
}
JSON

echo "✅ Файлы конфигурации созданы в .cursor/plugin-configs/"

echo ""
echo "🔍 ПРОВЕРКА УСТАНОВКИ"
echo "===================="

cat << 'EOF'

После установки проверьте работу плагинов:

1. 📊 Откройте Command Palette (Ctrl/Cmd + Shift + P)
2. 🔍 Поищите команды плагинов:
   • "GitHub: Analyze Repository"
   • "Performance: Audit Project" 
   • "i18n: Validate Translations"
   • "SEO: Analyze Pages"
   • "CSS: Validate Variables"

3. ✅ Если команды найдены - плагины установлены корректно
4. ❌ Если команд нет - плагин требует переустановки

EOF

echo ""
echo "📊 ОЖИДАЕМЫЕ РЕЗУЛЬТАТЫ"
echo "======================"

echo "После установки всех плагинов получите:"
echo "• 🔗 Расширенную интеграцию с GitHub (PR анализ, issue tracking)"  
echo "• ⚡ Автоматический аудит производительности (Core Web Vitals)"
echo "• 🌍 Управление переводами (русский ↔ английский)"
echo "• 🔍 SEO анализ и оптимизацию"
echo "• 🎨 Управление CSS переменными и темами"

echo ""
echo "🎯 СЛЕДУЮЩИЕ ШАГИ"
echo "================"
echo "1. Установите плагины вручную через Cursor IDE"
echo "2. Примените конфигурации из .cursor/plugin-configs/"
echo "3. Перезапустите Cursor IDE"
echo "4. Протестируйте работу плагинов"
echo "5. Запустите анализ проекта: Ctrl/Cmd + Shift + P → 'Analyze Project'"

echo ""
echo "✅ MCP ПЛАГИНЫ ГОТОВЫ К УСТАНОВКЕ!"
