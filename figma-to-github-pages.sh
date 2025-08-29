#!/bin/bash

# 🎨 Figma to GitHub Pages Automation
# Автоматический экспорт из Figma в GitHub Pages

echo "🎨 FIGMA TO GITHUB PAGES AUTOMATION"
echo "==================================="
echo ""

# Загружаем переменные окружения
source ~/.config/secrets/env-setup.sh

if [ -z "$FIGMA_ACCESS_TOKEN" ]; then
    echo "❌ Figma token not found!"
    echo "💡 Run: source ~/.config/secrets/env-setup.sh"
    exit 1
fi

echo "✅ Figma token loaded"
echo ""

# Функция экспорта из Figma
export_from_figma() {
    local file_key="$1"
    local output_file="$2"
    
    echo "🎨 Exporting from Figma file: $file_key"
    echo "📁 Output: $output_file"
    
    # Используем наш Figma интеграционный скрипт
    node figma-cursor-integration.cjs export "$file_key" "$output_file"
}

# Функция обновления GitHub Pages
update_github_pages() {
    echo ""
    echo "🚀 UPDATING GITHUB PAGES..."
    echo "==========================="
    
    # Добавляем изменения
    git add docs/
    
    # Создаём коммит
    git commit -m "feat: обновлён Landing Page из Figma дизайна

🎨 Изменения:
- Экспорт CSS из Figma
- Обновлённые стили и компоненты
- Улучшенная адаптивность

🔗 Figma → GitHub Pages автоматизация"
    
    # Пушим на GitHub
    git push origin main
    
    echo ""
    echo "✅ GitHub Pages обновлён!"
    echo "🔗 Проверяйте: www.gita-1972-reprint.ru"
}

# Основная функция
main() {
    echo "💡 ИСПОЛЬЗОВАНИЕ:"
    echo "=================="
    echo ""
    echo "1️⃣ Экспорт из Figma:"
    echo "   ./figma-to-github-pages.sh export FIGMA_FILE_KEY"
    echo ""
    echo "2️⃣ Обновление GitHub Pages:"
    echo "   ./figma-to-github-pages.sh update"
    echo ""
    echo "3️⃣ Полный цикл:"
    echo "   ./figma-to-github-pages.sh full FIGMA_FILE_KEY"
    echo ""
    
    case "$1" in
        "export")
            if [ -z "$2" ]; then
                echo "❌ Укажите Figma file key"
                echo "💡 Пример: ./figma-to-github-pages.sh export abc123def456"
                exit 1
            fi
            export_from_figma "$2" "docs/figma-styles.css"
            ;;
        "update")
            update_github_pages
            ;;
        "full")
            if [ -z "$2" ]; then
                echo "❌ Укажите Figma file key"
                exit 1
            fi
            export_from_figma "$2" "docs/figma-styles.css"
            update_github_pages
            ;;
        *)
            echo "🎯 Готов к автоматизации Figma → GitHub Pages!"
            ;;
    esac
}

main "$@"
