/**
 * Интерфейс для изображения слайдера
 */
export interface SliderImage {
    id: number;
    src: string;
    alt: string;
    title: string;
    description: string;
    language: 'ru' | 'en';
}
/**
 * Настройки слайдера
 */
export interface SliderOptions {
    autoPlay: boolean;
    autoPlayInterval: number;
    showNavigation: boolean;
    showIndicators: boolean;
    transitionDuration: number;
    loop: boolean;
}
/**
 * Основной класс слайдера изображений
 */
export declare class ImageSlider {
    private container;
    private images;
    private currentIndex;
    private options;
    private autoPlayTimer;
    private isTransitioning;
    private sliderContainer?;
    private imageElement?;
    private titleElement?;
    private descriptionElement?;
    private navigationContainer?;
    private indicatorsContainer?;
    constructor(container: HTMLElement, images: SliderImage[], options?: Partial<SliderOptions>);
    /**
     * Инициализация слайдера
     */
    private init;
    /**
     * Создание структуры DOM слайдера
     */
    private createSliderStructure;
    /**
     * Создание навигационных кнопок
     */
    private createNavigation;
    /**
     * Создание кнопки навигации
     */
    private createNavigationButton;
    /**
     * Создание индикаторов
     */
    private createIndicators;
    /**
     * Настройка обработчиков событий
     */
    private setupEventListeners;
    /**
     * Показать изображение по индексу
     */
    private showImage;
    /**
     * Обновление индикаторов
     */
    private updateIndicators;
    /**
     * Следующее изображение
     */
    next(): void;
    /**
     * Предыдущее изображение
     */
    previous(): void;
    /**
     * Перейти к конкретному изображению
     */
    goToImage(index: number): void;
    /**
     * Запуск автопрокрутки
     */
    private startAutoPlay;
    /**
     * Остановка автопрокрутки
     */
    private stopAutoPlay;
    /**
     * Обновление изображений
     */
    updateImages(newImages: SliderImage[]): void;
    /**
     * Изменение языка
     */
    changeLanguage(language: 'ru' | 'en'): void;
    /**
     * Уничтожение слайдера
     */
    destroy(): void;
}
//# sourceMappingURL=ImageSlider.d.ts.map