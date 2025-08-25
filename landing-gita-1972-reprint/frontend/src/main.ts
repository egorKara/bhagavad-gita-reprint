import { ImageSlider, type SliderImage } from './components/ImageSlider';
import { LanguageManager, type Translation } from './components/LanguageManager';

class GitaLandingApp {
    private languageManager: LanguageManager;
    private imageSlider?: ImageSlider;
    private translations: Translation;

    constructor() {
        this.translations = this.initializeTranslations();
        this.languageManager = new LanguageManager(this.translations, 'ru');
        this.init();
    }

    private init(): void {
        this.setupLanguageToggle();
        this.setupImageSlider();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
    }

    private initializeTranslations(): Translation {
        return {
            language_switch: {
                ru: 'EN',
                en: 'RU'
            },
            hero_title: {
                ru: 'Бхагавад-гита как она есть',
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
            author_title: {
                ru: 'Об авторе',
                en: 'About the Author'
            },
            author_name: {
                ru: 'Шрила Прабхупада',
                en: 'Srila Prabhupada'
            },
            author_description: {
                ru: 'Основатель-ачарья Международного общества сознания Кришны (ИСККОН). Автор более 80 томов переводов и комментариев к ведическим текстам.',
                en: 'Founder-Acharya of the International Society for Krishna Consciousness (ISKCON). Author of more than 80 volumes of translations and commentaries on Vedic texts.'
            },
            reviews_title: {
                ru: 'Отзывы читателей',
                en: 'Reader Reviews'
            },
            review_1: {
                ru: '"Потрясающий перевод! Каждый стих раскрывает глубокий смысл."',
                en: '"Amazing translation! Every verse reveals deep meaning."'
            },
            review_author_1: {
                ru: 'Михаил К.',
                en: 'Mikhail K.'
            },
            review_2: {
                ru: '"Лучшее издание Бхагавад-гиты на русском языке."',
                en: '"The best edition of Bhagavad-gita in Russian."'
            },
            review_author_2: {
                ru: 'Анна С.',
                en: 'Anna S.'
            }
        };
    }

    private setupLanguageToggle(): void {
        const container = document.getElementById('language-switch-container');
        if (container) {
            this.languageManager.createLanguageToggleButton(container);
        }
    }

    private setupImageSlider(): void {
        const sliderContainer = document.getElementById('hero-slider');
        if (!sliderContainer) return;

        const images: SliderImage[] = [
            {
                id: 1,
                src: 'src/images/book-covers/cover.jpg',
                alt: 'Лицевая сторона суперобложки книги',
                title: 'Bhagavad-gita As It Is',
                description: 'Классическое издание 1972 года с комментариями Шрилы Прабхупады',
                language: 'ru'
            },
            {
                id: 2,
                src: 'src/images/book-covers/flap1.jpg',
                alt: 'Клапан 1 суперобложки',
                title: 'Bhagavad-gita As It Is',
                description: 'Детали издания и информация об авторе',
                language: 'ru'
            },
            {
                id: 3,
                src: 'src/images/book-covers/flap2.jpg',
                alt: 'Клапан 2 суперобложки',
                title: 'Bhagavad-gita As It Is',
                description: 'Содержание и структура книги',
                language: 'ru'
            },
            {
                id: 4,
                src: 'src/images/book-covers/back.jpg',
                alt: 'Задняя сторона суперобложки',
                title: 'Bhagavad-gita As It Is',
                description: 'Аннотация и отзывы о книге',
                language: 'ru'
            }
        ];

        this.imageSlider = new ImageSlider(sliderContainer, images, {
            autoPlay: true,
            autoPlayInterval: 6000,
            showNavigation: true,
            showIndicators: true,
            transitionDuration: 400,
            loop: true
        });

        this.languageManager.onLanguageChange((language) => {
            if (this.imageSlider) {
                this.imageSlider.changeLanguage(language);
            }
        });
    }

    private setupSmoothScrolling(): void {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach((link) => {
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

    private setupIntersectionObserver(): void {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Наблюдаем за секциями
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
            observer.observe(section);
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new GitaLandingApp();
});
