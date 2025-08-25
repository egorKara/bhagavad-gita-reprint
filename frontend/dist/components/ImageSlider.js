/**
 * Основной класс слайдера изображений
 */
export class ImageSlider {
    constructor(container, images, options = {}) {
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        this.isTransitioning = false;
        this.container = container;
        this.images = images;
        this.options = {
            autoPlay: true,
            autoPlayInterval: 5000,
            showNavigation: true,
            showIndicators: true,
            transitionDuration: 300,
            loop: true,
            ...options
        };
        this.init();
    }
    /**
     * Инициализация слайдера
     */
    init() {
        if (this.images.length === 0) {
            console.warn('ImageSlider: Нет изображений для отображения');
            return;
        }
        this.createSliderStructure();
        this.setupEventListeners();
        this.showImage(0);
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }
    /**
     * Создание структуры DOM слайдера
     */
    createSliderStructure() {
        // Основной контейнер слайдера
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'slider-container';
        this.sliderContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
        `;
        // Контейнер для изображения
        const imageContainer = document.createElement('div');
        imageContainer.className = 'slider-image-container';
        imageContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 70%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        `;
        // Элемент изображения
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'slider-image';
        this.imageElement.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 4px;
            transition: transform 0.3s ease;
        `;
        imageContainer.appendChild(this.imageElement);
        this.sliderContainer.appendChild(imageContainer);
        // Контейнер для текста
        const textContainer = document.createElement('div');
        textContainer.className = 'slider-text-container';
        textContainer.style.cssText = `
            padding: 20px;
            text-align: center;
            background: white;
            height: 30%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        `;
        // Заголовок
        this.titleElement = document.createElement('h3');
        this.titleElement.className = 'slider-title';
        this.titleElement.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: #2c3e50;
        `;
        // Описание
        this.descriptionElement = document.createElement('p');
        this.descriptionElement.className = 'slider-description';
        this.descriptionElement.style.cssText = `
            margin: 0;
            font-size: 1rem;
            color: #7f8c8d;
            line-height: 1.5;
        `;
        textContainer.appendChild(this.titleElement);
        textContainer.appendChild(this.descriptionElement);
        this.sliderContainer.appendChild(textContainer);
        // Навигация
        if (this.options.showNavigation) {
            this.createNavigation();
        }
        // Индикаторы
        if (this.options.showIndicators) {
            this.createIndicators();
        }
        this.container.appendChild(this.sliderContainer);
    }
    /**
     * Создание навигационных кнопок
     */
    createNavigation() {
        this.navigationContainer = document.createElement('div');
        this.navigationContainer.className = 'slider-navigation';
        this.navigationContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            pointer-events: none;
        `;
        // Кнопка "Назад"
        const prevButton = this.createNavigationButton('‹', 'slider-prev');
        prevButton.addEventListener('click', () => this.previous());
        // Кнопка "Вперед"
        const nextButton = this.createNavigationButton('›', 'slider-next');
        nextButton.addEventListener('click', () => this.next());
        this.navigationContainer.appendChild(prevButton);
        this.navigationContainer.appendChild(nextButton);
        this.sliderContainer.appendChild(this.navigationContainer);
    }
    /**
     * Создание кнопки навигации
     */
    createNavigationButton(text, className) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.style.cssText = `
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: rgb(255 255 255 / 95%);
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
        `;
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgb(255 255 255 / 100%)';
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgb(255 255 255 / 95%)';
            button.style.transform = 'scale(1)';
        });
        return button;
    }
    /**
     * Создание индикаторов
     */
    createIndicators() {
        this.indicatorsContainer = document.createElement('div');
        this.indicatorsContainer.className = 'slider-indicators';
        this.indicatorsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        `;
        this.images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border: none;
                border-radius: 50%;
                background: rgb(255 255 255 / 50%);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            indicator.addEventListener('click', () => this.goToImage(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        this.sliderContainer.appendChild(this.indicatorsContainer);
    }
    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Остановка автопрокрутки при наведении
        this.sliderContainer.addEventListener('mouseenter', () => {
            if (this.options.autoPlay) {
                this.stopAutoPlay();
            }
        });
        // Возобновление автопрокрутки при уходе мыши
        this.sliderContainer.addEventListener('mouseleave', () => {
            if (this.options.autoPlay) {
                this.startAutoPlay();
            }
        });
        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previous();
            }
            else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }
    /**
     * Показать изображение по индексу
     */
    showImage(index) {
        if (this.isTransitioning || index < 0 || index >= this.images.length) {
            return;
        }
        this.isTransitioning = true;
        const image = this.images[index];
        // Проверяем, что изображение существует
        if (!image) {
            this.isTransitioning = false;
            return;
        }
        // Анимация перехода
        if (this.imageElement) {
            this.imageElement.style.transform = 'scale(0.95)';
            this.imageElement.style.opacity = '0.8';
        }
        setTimeout(() => {
            if (this.imageElement && image) {
                this.imageElement.src = image.src;
                this.imageElement.alt = image.alt;
                this.imageElement.style.transform = 'scale(1)';
                this.imageElement.style.opacity = '1';
            }
            if (this.titleElement && image) {
                this.titleElement.textContent = image.title;
            }
            if (this.descriptionElement && image) {
                this.descriptionElement.textContent = image.description;
            }
            this.currentIndex = index;
            this.updateIndicators();
            this.isTransitioning = false;
        }, this.options.transitionDuration);
    }
    /**
     * Обновление индикаторов
     */
    updateIndicators() {
        if (!this.indicatorsContainer)
            return;
        const indicators = this.indicatorsContainer.children;
        for (let i = 0; i < indicators.length; i++) {
            const indicator = indicators[i];
            if (i === this.currentIndex) {
                indicator.style.background = 'rgb(255 255 255 / 100%)';
                indicator.style.transform = 'scale(1.2)';
            }
            else {
                indicator.style.background = 'rgb(255 255 255 / 50%)';
                indicator.style.transform = 'scale(1)';
            }
        }
    }
    /**
     * Следующее изображение
     */
    next() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.images.length) {
            if (this.options.loop) {
                nextIndex = 0;
            }
            else {
                return;
            }
        }
        this.showImage(nextIndex);
    }
    /**
     * Предыдущее изображение
     */
    previous() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            if (this.options.loop) {
                prevIndex = this.images.length - 1;
            }
            else {
                return;
            }
        }
        this.showImage(prevIndex);
    }
    /**
     * Перейти к конкретному изображению
     */
    goToImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.showImage(index);
        }
    }
    /**
     * Запуск автопрокрутки
     */
    startAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
        this.autoPlayTimer = window.setInterval(() => {
            this.next();
        }, this.options.autoPlayInterval);
    }
    /**
     * Остановка автопрокрутки
     */
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    /**
     * Обновление изображений
     */
    updateImages(newImages) {
        this.images = newImages;
        this.currentIndex = 0;
        if (this.indicatorsContainer) {
            this.indicatorsContainer.innerHTML = '';
            this.createIndicators();
        }
        this.showImage(0);
    }
    /**
     * Изменение языка
     */
    changeLanguage(language) {
        const filteredImages = this.images.filter((img) => img.language === language);
        if (filteredImages.length > 0) {
            this.updateImages(filteredImages);
        }
    }
    /**
     * Уничтожение слайдера
     */
    destroy() {
        this.stopAutoPlay();
        if (this.sliderContainer) {
            this.sliderContainer.remove();
        }
    }
}
//# sourceMappingURL=ImageSlider.js.map