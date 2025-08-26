#!/usr/bin/env python3
"""
Упрощенный скрипт для подготовки изображений слайдера
Без удаления фона, только базовые операции:
1. Поворот для читаемости
2. Изменение размера
3. Улучшение качества
4. Сохранение с русскими именами
"""

import os
import sys
from PIL import Image, ImageEnhance
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Конфигурация
INPUT_DIR = "public/assets/images"
OUTPUT_DIR = "public/assets/images/slider"
TARGET_SIZE = (800, 600)  # Ширина x Высота
QUALITY = 85  # Качество JPEG

# Соответствие файлов и русских названий
IMAGE_MAPPING = {
    "gita-1972-cover-complete.jpg": "Полная_обложка.jpg",
    "gita-1972-title-page-real.jpg": "Титульная_страница.jpg",
    "gita-1972-foreword-page.jpg": "Предисловие.jpg",
    "gita-1972-introduction-page.jpg": "Введение.jpg",
    "gita-1972-preface-page.jpg": "Предисловие_автора.jpg",
    "gita-1972-page-spread-main.jpg": "Разворот_с_комментариями.jpg",
    "gita-1972-text-detail.jpg": "Санскритский_текст.jpg",
    "gita-1972-chapter-page.jpg": "Начало_главы.jpg",
    "gita-1972-illustration-detail.jpg": "Детали_иллюстраций.jpg",
    "gita-1972-binding-detail.jpg": "Детали_переплета.jpg",
    "gita-1972-spine-detail.jpg": "Корешок_книги.jpg"
}

def auto_rotate_image(image):
    """Автоматически поворачивает изображение для лучшей читаемости"""
    try:
        # Попытка автоматического поворота на основе EXIF данных
        if hasattr(image, '_getexif') and image._getexif():
            exif = image._getexif()
            orientation = exif.get(274)  # 274 = Orientation tag
            
            if orientation == 3:
                image = image.rotate(180, expand=True)
            elif orientation == 6:
                image = image.rotate(270, expand=True)
            elif orientation == 8:
                image = image.rotate(90, expand=True)
                
        return image
    except Exception as e:
        logger.warning(f"Ошибка при повороте изображения: {e}")
        return image

def enhance_image(image):
    """Улучшает качество изображения"""
    try:
        # Увеличиваем контраст
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)
        
        # Увеличиваем резкость
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.1)
        
        # Увеличиваем яркость если нужно
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.05)
        
        return image
    except Exception as e:
        logger.warning(f"Ошибка при улучшении изображения: {e}")
        return image

def resize_image(image, target_size):
    """Изменяет размер изображения с сохранением пропорций"""
    try:
        # Вычисляем новые размеры с сохранением пропорций
        img_ratio = image.width / image.height
        target_ratio = target_size[0] / target_size[1]
        
        if img_ratio > target_ratio:
            # Изображение шире, подгоняем по ширине
            new_width = target_size[0]
            new_height = int(target_size[0] / img_ratio)
        else:
            # Изображение выше, подгоняем по высоте
            new_height = target_size[1]
            new_width = int(target_size[1] * img_ratio)
        
        # Изменяем размер
        resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Создаем новое изображение с белым фоном
        final_image = Image.new('RGB', target_size, (255, 255, 255))
        
        # Центрируем изображение
        x = (target_size[0] - new_width) // 2
        y = (target_size[1] - new_height) // 2
        final_image.paste(resized, (x, y))
        
        return final_image
    except Exception as e:
        logger.error(f"Ошибка при изменении размера: {e}")
        return image

def process_image(input_path, output_name):
    """Обрабатывает одно изображение"""
    try:
        logger.info(f"Обрабатываю: {input_path}")
        
        # Открываем изображение
        with Image.open(input_path) as img:
            # Конвертируем в RGB если нужно
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Автоматический поворот
            img = auto_rotate_image(img)
            
            # Улучшение качества
            img = enhance_image(img)
            
            # Изменение размера
            img = resize_image(img, TARGET_SIZE)
            
            # Сохранение
            output_path = os.path.join(OUTPUT_DIR, output_name)
            img.save(output_path, 'JPEG', quality=QUALITY, optimize=True)
            
            logger.info(f"Сохранено: {output_path}")
            return True
            
    except Exception as e:
        logger.error(f"Ошибка при обработке {input_path}: {e}")
        return False

def main():
    """Основная функция"""
    # Проверяем существование директорий
    if not os.path.exists(INPUT_DIR):
        logger.error(f"Входная директория не найдена: {INPUT_DIR}")
        sys.exit(1)
    
    # Создаем выходную директорию если её нет
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    logger.info("Начинаю обработку изображений (упрощенная версия)...")
    
    success_count = 0
    total_count = len(IMAGE_MAPPING)
    
    for input_file, output_name in IMAGE_MAPPING.items():
        input_path = os.path.join(INPUT_DIR, input_file)
        
        if os.path.exists(input_path):
            if process_image(input_path, output_name):
                success_count += 1
        else:
            logger.warning(f"Файл не найден: {input_path}")
    
    logger.info(f"Обработка завершена! Успешно: {success_count}/{total_count}")
    
    # Создаем README с инструкциями
    create_readme()
    
    return success_count == total_count

def create_readme():
    """Создает README файл с инструкциями"""
    readme_content = """# Обработанные изображения для слайдера (Упрощенная версия)

## Описание
Эти изображения были автоматически обработаны для использования в слайдере:

1. **Повернуты** для лучшей читаемости текста
2. **Улучшено качество** (контраст, резкость, яркость)
3. **Приведены к единому размеру** 800x600 пикселей
4. **Оптимизированы** для веб-использования

## Файлы
- `Полная_обложка.jpg` - Обложка книги
- `Титульная_страница.jpg` - Титульный лист
- `Предисловие.jpg` - Предисловие
- `Введение.jpg` - Введение
- `Предисловие_автора.jpg` - Предисловие автора
- `Разворот_с_комментариями.jpg` - Разворот книги
- `Санскритский_текст.jpg` - Санскритский текст
- `Начало_главы.jpg` - Начало главы
- `Детали_иллюстраций.jpg` - Иллюстрации
- `Детали_переплета.jpg` - Переплет
- `Корешок_книги.jpg` - Корешок

## Технические характеристики
- Формат: JPEG
- Размер: 800x600 пикселей
- Качество: 85%
- Оптимизация: включена
- Фон: сохранен (упрощенная обработка)

## Использование
Изображения готовы для вставки в слайдер или галерею.

## Примечание
Это упрощенная версия обработки без удаления фона.
Для полной версии с удалением фона используйте основной скрипт.
"""
    
    readme_path = os.path.join(OUTPUT_DIR, "README.md")
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    logger.info(f"Создан README: {readme_path}")

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)