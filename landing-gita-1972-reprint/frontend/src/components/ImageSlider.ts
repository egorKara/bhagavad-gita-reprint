export interface SliderImage {
    id: number;
    src: string;
    alt: string;
    title: string;
    description: string;
    language: 'ru' | 'en';
}

export interface SliderOptions {
    autoPlay: boolean;
    autoPlayInterval: number;
    showNavigation: boolean;
    showIndicators: boolean;
    transitionDuration: number;
    loop: boolean;
}

export class ImageSlider {
    private container: HTMLElement;
    private images: SliderImage[];
    private currentIndex: number = 0;
    private options: SliderOptions;
    private autoPlayTimer: number | null = null;
    private isTransitioning: boolean = false;
    private sliderContainer?: HTMLElement;
    private imageElement?: HTMLImageElement;
    private titleElement?: HTMLElement;
    private descriptionElement?: HTMLElement;
    private navigationContainer?: HTMLElement;
    private indicatorsContainer?: HTMLElement;

    constructor(container: HTMLElement, images: SliderImage[], options: Partial<SliderOptions> = {}) {
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

    private init(): void {
        if (this.images.length === 0) return;
        this.createSliderStructure();
        this.setupEventListeners();
        this.showImage(0);
        if (this.options.autoPlay) this.startAutoPlay();
    }

    private createSliderStructure(): void {
        // Основной контейнер слайдера
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'slider-container';

        // Контейнер для изображения
        const imageContainer = document.createElement('div');
        imageContainer.className = 'slider-image-container';

        // Элемент изображения
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'slider-image';
        this.imageElement.alt = '';
        imageContainer.appendChild(this.imageElement);

        // Контейнер для текста
        const textContainer = document.createElement('div');
        textContainer.className = 'slider-text-container';

        // Заголовок
        this.titleElement = document.createElement('h3');
        this.titleElement.className = 'slider-title';
        textContainer.appendChild(this.titleElement);

        // Описание
        this.descriptionElement = document.createElement('p');
        this.descriptionElement.className = 'slider-description';
        textContainer.appendChild(this.descriptionElement);

        // Навигация
        if (this.options.showNavigation) {
            this.navigationContainer = document.createElement('div');
            this.navigationContainer.className = 'slider-navigation';

            const prevButton = document.createElement('button');
            prevButton.className = 'slider-nav-button prev';
            prevButton.innerHTML = '&#8249;';
            prevButton.addEventListener('click', () => this.previous());

            const nextButton = document.createElement('button');
            nextButton.className = 'slider-nav-button next';
            nextButton.innerHTML = '&#8250;';
            nextButton.addEventListener('click', () => this.next());

            this.navigationContainer.appendChild(prevButton);
            this.navigationContainer.appendChild(nextButton);
        }

        // Индикаторы
        if (this.options.showIndicators) {
            this.indicatorsContainer = document.createElement('div');
            this.indicatorsContainer.className = 'slider-indicators';
            this.createIndicators();
        }

        // Собираем структуру
        this.sliderContainer.appendChild(imageContainer);
        this.sliderContainer.appendChild(textContainer);
        if (this.navigationContainer) {
            this.sliderContainer.appendChild(this.navigationContainer);
        }
        if (this.indicatorsContainer) {
            this.sliderContainer.appendChild(this.indicatorsContainer);
        }

        this.container.appendChild(this.sliderContainer);
    }

    private createIndicators(): void {
        if (!this.indicatorsContainer) return;

        this.indicatorsContainer.innerHTML = '';
        for (let i = 0; i < this.images.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slider-indicator';
            indicator.addEventListener('click', () => this.showImage(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    private setupEventListeners(): void {
        // Пауза при наведении мыши
        this.sliderContainer?.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.sliderContainer?.addEventListener('mouseleave', () => {
            if (this.options.autoPlay) this.startAutoPlay();
        });

        // Свайп для мобильных устройств
        let startX = 0;
        let endX = 0;

        this.sliderContainer?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.sliderContainer?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.previous();
                }
            }
        });
    }

    private showImage(index: number): void {
        if (this.isTransitioning || index < 0 || index >= this.images.length) return;

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

    private updateIndicators(): void {
        if (!this.indicatorsContainer) return;

        const indicators = this.indicatorsContainer.querySelectorAll('.slider-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    public next(): void {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.images.length) {
            if (this.options.loop) nextIndex = 0;
            else return;
        }
        this.showImage(nextIndex);
    }

    public previous(): void {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            if (this.options.loop) prevIndex = this.images.length - 1;
            else return;
        }
        this.showImage(prevIndex);
    }

    public goTo(index: number): void {
        if (index >= 0 && index < this.images.length) {
            this.showImage(index);
        }
    }

    public changeLanguage(language: 'ru' | 'en'): void {
        const filteredImages = this.images.filter((img) => img.language === language);
        if (filteredImages.length > 0) {
            this.images = filteredImages;
            this.currentIndex = 0;
            this.createIndicators();
            this.showImage(0);
        }
    }

    public startAutoPlay(): void {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = window.setInterval(() => this.next(), this.options.autoPlayInterval);
    }

    private stopAutoPlay(): void {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    public destroy(): void {
        this.stopAutoPlay();
        if (this.sliderContainer) {
            this.sliderContainer.remove();
        }
    }
}
