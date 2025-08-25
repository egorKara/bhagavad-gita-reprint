#!/bin/bash

# Скрипт для подготовки изображений слайдера
# Автоматически устанавливает зависимости и запускает обработку

set -e  # Остановка при ошибке

echo "🚀 Начинаю подготовку изображений для слайдера..."

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 не найден. Установите Python 3.8+"
    exit 1
fi

# Проверяем версию Python
PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Требуется Python 3.8+, текущая версия: $PYTHON_VERSION"
    exit 1
fi

echo "✅ Python версия: $PYTHON_VERSION"

# Переходим в директорию скриптов
cd "$(dirname "$0")"

# Создаем виртуальное окружение если его нет
if [ ! -d "venv" ]; then
    echo "📦 Создаю виртуальное окружение..."
    python3 -m venv venv
fi

# Активируем виртуальное окружение
echo "🔧 Активирую виртуальное окружение..."
source venv/bin/activate

# Обновляем pip
echo "⬆️ Обновляю pip..."
pip install --upgrade pip

# Устанавливаем зависимости
echo "📚 Устанавливаю зависимости..."
pip install -r requirements.txt

# Запускаем обработку изображений
echo "🖼️ Запускаю обработку изображений..."
python3 prepare_slider_images.py

# Проверяем результат
if [ $? -eq 0 ]; then
    echo "✅ Обработка изображений завершена успешно!"
    echo "📁 Обработанные изображения сохранены в: public/assets/images/slider/"
    echo "📖 Документация создана в: public/assets/images/slider/README.md"
else
    echo "❌ Ошибка при обработке изображений"
    exit 1
fi

# Деактивируем виртуальное окружение
deactivate

echo "🎉 Готово! Изображения для слайдера подготовлены."