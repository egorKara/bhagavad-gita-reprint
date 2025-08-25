import { ImageSlider, type SliderImage } from './components/ImageSlider';
import { LanguageManager, type Translation } from './components/LanguageManager';

/**
 * Основной класс приложения
 */
class GitaLandingApp {
    private languageManager: LanguageManager;
    private imageSlider?: ImageSlider;
    private translations: Translation;

    constructor() {
        this.translations = this.initializeTranslations();
        this.languageManager = new LanguageManager(this.translations, 'ru');
        this.init();
    }

    /**
     * Инициализация приложения
     */
    private init(): void {
        this.setupLanguageToggle();
        this.setupImageSlider();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupReviewsFromAPI();
    }

    /**
     * Инициализация переводов
     */
    private initializeTranslations(): Translation {
        return {
            // Основные элементы
            page_title: {
                ru: 'Bhagavad-gita As It Is - Бхагавад-гита как она есть',
                en: 'Bhagavad-gita As It Is - The Bhagavad Gita as it is'
            },
            language_switch: {
                ru: 'EN',
                en: 'RU'
            },
            logo: {
                ru: 'Bhagavad-gita As It Is',
                en: 'Bhagavad-gita As It Is'
            },

            // Навигация
            nav_about: {
                ru: 'Об авторе',
                en: 'About Author'
            },
            nav_buy: {
                ru: 'Купить книгу',
                en: 'Buy Book'
            },

            // Hero секция
            hero_title: {
                ru: 'Bhagavad-gita As It Is',
                en: 'Bhagavad-gita As It Is'
            },
            hero_description: {
                ru: 'Классический перевод и комментарии к Бхагавад-гите от Шрилы Прабхупады. Погрузитесь в глубины ведической мудрости через призму сознания Кришны.',
                en: 'Classical translation and commentary on the Bhagavad-gita by Srila Prabhupada. Immerse yourself in the depths of Vedic wisdom through the lens of Krishna consciousness.'
            },
            hero_cta: {
                ru: 'Купить книгу',
                en: 'Buy Book'
            },

            // Author секция
            biography_title: {
                ru: 'Биография',
                en: 'Biography'
            },
            biography_text: {
                ru: 'Абхай Чаранаравинда Бхактиведанта Свами Прабхупада (1896-1977) - выдающийся философ, духовный учитель и основатель Международного общества сознания Кришны (ISKCON). Родился в Калькутте, получил образование в Шотландском церковном колледже.',
                en: 'Abhay Charanaravinda Bhaktivedanta Swami Prabhupada (1896-1977) was an outstanding philosopher, spiritual teacher and founder of the International Society for Krishna Consciousness (ISKCON). Born in Calcutta, he received his education at the Scottish Church College.'
            },
            mission_title: {
                ru: 'Миссия Прабхупады',
                en: 'Prabhupada\'s Mission'
            },
            mission_text: {
                ru: 'Миссия Шрилы Прабхупады заключалась в распространении ведической мудрости по всему миру. Он перевел и прокомментировал более 60 томов ведической литературы, включая полную Бхагавад-гиту.',
                en: 'Srila Prabhupada\'s mission was to spread Vedic wisdom throughout the world. He translated and commented on more than 60 volumes of Vedic literature, including the complete Bhagavad-gita.'
            },
            author_cta: {
                ru: 'Узнать больше об авторе',
                en: 'Learn More About Author'
            },

            // Reviews секция
            reviews_title: {
                ru: 'Отзывы о книге',
                en: 'Book Reviews'
            },
            review_1_quote: {
                ru: '"Бхагавад-гита как она есть" - это не просто перевод, это живое учение, которое открывает сердца читателей.',
                en: '"Bhagavad-gita As It Is" is not just a translation, it is a living teaching that opens the hearts of readers.'
            },
            review_1_author: {
                ru: '- Доктор философии',
                en: '- Doctor of Philosophy'
            },
            review_2_quote: {
                ru: 'Комментарии Шрилы Прабхупады делают древнюю мудрость доступной для современного читателя.',
                en: 'Srila Prabhupada\'s commentaries make ancient wisdom accessible to the modern reader.'
            },
            review_2_author: {
                ru: '- Профессор университета',
                en: '- University Professor'
            },
            review_3_quote: {
                ru: 'Эта книга изменила мой взгляд на жизнь и помогла найти ответы на самые важные вопросы.',
                en: 'This book changed my outlook on life and helped me find answers to the most important questions.'
            },
            review_3_author: {
                ru: '- Читатель',
                en: '- Reader'
            },

            // Footer
            footer_copyright: {
                ru: '© 1972 BBT. Все права защищены.',
                en: '© 1972 BBT. All rights reserved.'
            },
            footer_email: {
                ru: 'info@gita-1972-reprint.ru',
                en: 'info@gita-1972-reprint.ru'
            },
            footer_telegram: {
                ru: 'Telegram: @gita-1972-reprint-bot',
                en: 'Telegram: @gita-1972-reprint-bot'
            }
        };
    }

    /**
     * Настройка переключателя языка
     */
    private setupLanguageToggle(): void {
        const container = document.getElementById('language-switch-container');
        if (container) {
            this.languageManager.createLanguageToggleButton(container);
        }
    }

    /**
     * Настройка слайдера изображений
     */
    private setupImageSlider(): void {
        const sliderContainer = document.getElementById('hero-slider');
        if (!sliderContainer) return;

        const images: SliderImage[] = [
            {
                id: 1,
                src: '/assets/images/book-cover.jpg',
                alt: 'Лицевая сторона суперобложки книги',
                title: 'Bhagavad-gita As It Is',
                description: 'Классическое издание 1972 года с комментариями Шрилы Прабхупады',
                language: 'ru'
            },
            {
                id: 2,
                src: '/assets/images/book-flap-1.jpg',
                alt: 'Первый клапан суперобложки',
                title: 'Первый клапан',
                description: 'Информация об авторе и издании',
                language: 'ru'
            },
            {
                id: 3,
                src: '/assets/images/book-flap-2.jpg',
                alt: 'Второй клапан суперобложки',
                title: 'Второй клапан',
                description: 'Аннотация и содержание',
                language: 'ru'
            },
            {
                id: 4,
                src: '/assets/images/book-back.jpg',
                alt: 'Задняя сторона суперобложки',
                title: 'Задняя сторона',
                description: 'Отзывы и рекомендации',
                language: 'ru'
            },
            {
                id: 5,
                src: '/assets/images/plate-15.jpg',
                alt: 'Plate 15 - Иллюстрация',
                title: 'Plate 15',
                description: 'Кришна и Арджуна на поле битвы',
                language: 'ru'
            },
            {
                id: 6,
                src: '/assets/images/plate-16.jpg',
                alt: 'Plate 16 - Иллюстрация',
                title: 'Plate 16',
                description: 'Божественная форма Кришны',
                language: 'ru'
            },
            {
                id: 7,
                src: '/assets/images/plate-17.jpg',
                alt: 'Plate 17 - Иллюстрация',
                title: 'Plate 17',
                description: 'Вселенская форма Господа',
                language: 'ru'
            },
            {
                id: 8,
                src: '/assets/images/plate-20.jpg',
                alt: 'Plate 20 - Иллюстрация',
                title: 'Plate 20',
                description: 'Духовное знание',
                language: 'ru'
            },
            {
                id: 9,
                src: '/assets/images/plate-21.jpg',
                alt: 'Plate 21 - Иллюстрация',
                title: 'Plate 21',
                description: 'Преданное служение',
                language: 'ru'
            },
            {
                id: 10,
                src: '/assets/images/plate-22.jpg',
                alt: 'Plate 22 - Иллюстрация',
                title: 'Plate 22',
                description: 'Духовная практика',
                language: 'ru'
            },
            {
                id: 11,
                src: '/assets/images/plate-23.jpg',
                alt: 'Plate 23 - Иллюстрация',
                title: 'Plate 23',
                description: 'Бхакти-йога',
                language: 'ru'
            },
            {
                id: 12,
                src: '/assets/images/plate-24.jpg',
                alt: 'Plate 24 - Иллюстрация',
                title: 'Plate 24',
                description: 'Совершенство йоги',
                language: 'ru'
            },
            {
                id: 13,
                src: '/assets/images/plate-28.jpg',
                alt: 'Plate 28 - Иллюстрация',
                title: 'Plate 28',
                description: 'Заключение',
                language: 'ru'
            }
        ];

        // Создаем слайдер
        this.imageSlider = new ImageSlider(sliderContainer, images, {
            autoPlay: true,
            autoPlayInterval: 6000,
            showNavigation: true,
            showIndicators: true,
            transitionDuration: 400,
            loop: true
        });

        // Подписываемся на изменение языка
        this.languageManager.onLanguageChange((language) => {
            if (this.imageSlider) {
                this.imageSlider.changeLanguage(language);
            }
        });
    }

    /**
     * Настройка плавной прокрутки
     */
    private setupSmoothScrolling(): void {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    /**
     * Настройка Intersection Observer для анимаций
     */
    private setupIntersectionObserver(): void {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Наблюдаем за секциями
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Загрузка отзывов из API (заглушка)
     */
    private setupReviewsFromAPI(): void {
        // В будущем здесь будет загрузка отзывов из API
        // Пока используем статические данные
        console.log('Отзывы будут загружены из API в будущем');
    }

    /**
     * Получить менеджер языков
     */
    public getLanguageManager(): LanguageManager {
        return this.languageManager;
    }

    /**
     * Получить слайдер
     */
    public getImageSlider(): ImageSlider | undefined {
        return this.imageSlider;
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new GitaLandingApp();
        console.log('GitaLanding приложение инициализировано');
        
        // Делаем приложение доступным глобально для отладки
        (window as any).gitaLandingApp = app;
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Глобальная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Необработанное отклонение промиса:', event.reason);
});
