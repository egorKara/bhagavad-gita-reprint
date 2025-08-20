// Многоязычность для сайта Бхагавад-Гита
const translations = {
    ru: {
        // Навигация
        nav: {
            home: "Главная",
            about: "О книге",
            author: "Автор",
            buy: "Купить"
        },
        
        // Главная страница
        home: {
            title: "Бхагавад-Гита как она есть",
            subtitle: "Лицензированный репринт оригинального издания",
            price: "Цена: 1500 руб.",
            orderButton: "Заказать книгу",
            description: "Точное воспроизведение оригинального издания 1972 года. Доставка по России. Официальное разрешение Bhaktivedanta Book Trust."
        },
        
        // О книге
        about: {
            title: "О книге",
            description: "Это точный репринт оригинального издания 1972 года, одобренный Bhaktivedanta Book Trust. Книга сохраняет:",
            features: [
                "Формат и дизайн оригинала",
                "Комментарии А.Ч. Бхактиведанты Свами Прабхупады",
                "Качество печати 1972 года"
            ]
        },
        
        // Об авторе
        author: {
            title: "Об авторе",
            description: "А.Ч. Бхактиведанта Свами Прабхупада (1896-1977) - основатель Международного общества сознания Кришны (ISKCON) и автор более 80 книг по ведической философии.",
            achievements: [
                "Перевел и прокомментировал основные ведические тексты",
                "Основал более 100 храмов по всему миру",
                "Получил официальное разрешение на издание от Bhaktivedanta Book Trust"
            ]
        },
        
        // Контакты
        contacts: {
            title: "Купить книгу",
            description: "Для заказа книги свяжитесь с нами:",
            phone: "Телефон: +7 (XXX) XXX-XX-XX",
            email: "Email: info@gita-1972-reprint.ru",
            address: "Адрес: Россия, Москва",
            orderForm: "Форма заказа",
            name: "Имя",
            email: "Email",
            phone: "Телефон",
            message: "Сообщение",
            sendButton: "Отправить заказ"
        },
        
        // Статус заказа
        orderStatus: {
            title: "Статус заказа",
            description: "Введите номер заказа для проверки статуса:",
            orderNumber: "Номер заказа",
            checkButton: "Проверить статус",
            notFound: "Заказ не найден"
        },
        
        // Благодарность
        thanks: {
            title: "Спасибо за заказ!",
            description: "Ваш заказ принят. Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.",
            backToHome: "Вернуться на главную"
        },
        
        // Общие элементы
        common: {
            languageSwitch: "EN",
            logoAlt: "Логотип",
            coverAlt: "Обложка 1972 года"
        }
    },
    
    en: {
        // Navigation
        nav: {
            home: "Home",
            about: "About",
            author: "Author",
            buy: "Buy"
        },
        
        // Home page
        home: {
            title: "Bhagavad-Gita As It Is",
            subtitle: "Licensed reprint of the original 1972 edition",
            price: "Price: 1500 RUB",
            orderButton: "Order Book",
            description: "Exact reproduction of the original 1972 edition. Delivery across Russia. Official permission from Bhaktivedanta Book Trust."
        },
        
        // About the book
        about: {
            title: "About the Book",
            description: "This is an exact reprint of the original 1972 edition, approved by Bhaktivedanta Book Trust. The book preserves:",
            features: [
                "Original format and design",
                "Commentaries by A.C. Bhaktivedanta Swami Prabhupada",
                "1972 printing quality"
            ]
        },
        
        // About the author
        author: {
            title: "About the Author",
            description: "A.C. Bhaktivedanta Swami Prabhupada (1896-1977) is the founder of the International Society for Krishna Consciousness (ISKCON) and the author of more than 80 books on Vedic philosophy.",
            achievements: [
                "Translated and commented on major Vedic texts",
                "Founded more than 100 temples worldwide",
                "Received official permission for publication from Bhaktivedanta Book Trust"
            ]
        },
        
        // Contacts
        contacts: {
            title: "Buy the Book",
            description: "To order the book, contact us:",
            phone: "Phone: +7 (XXX) XXX-XX-XX",
            email: "Email: info@gita-1972-reprint.ru",
            address: "Address: Russia, Moscow",
            orderForm: "Order Form",
            name: "Name",
            email: "Email",
            phone: "Phone",
            message: "Message",
            sendButton: "Send Order"
        },
        
        // Order status
        orderStatus: {
            title: "Order Status",
            description: "Enter your order number to check the status:",
            orderNumber: "Order Number",
            checkButton: "Check Status",
            notFound: "Order not found"
        },
        
        // Thank you
        thanks: {
            title: "Thank you for your order!",
            description: "Your order has been received. We will contact you shortly to confirm delivery details.",
            backToHome: "Back to Home"
        },
        
        // Common elements
        common: {
            languageSwitch: "RU",
            logoAlt: "Logo",
            coverAlt: "1972 Edition Cover"
        }
    }
};

// Универсальная система перевода
class UniversalTranslator {
    constructor() {
        this.currentLang = 'ru';
        this.translations = translations;
    }
    
    // Устанавливает язык
    setLanguage(lang) {
        this.currentLang = lang;
        this.translatePage();
    }
    
    // Получает перевод по ключу
    getTranslation(key, fallback = '') {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return fallback;
            }
        }
        
        return value;
    }
    
    // Универсальный перевод страницы
    translatePage() {
        console.log(`🌍 Переводим страницу на язык: ${this.currentLang}`);
        
        // Обновляем заголовок страницы
        this.updatePageTitle();
        
        // Обновляем meta description
        this.updateMetaDescription();
        
        // Обновляем навигацию
        this.updateNavigation();
        
        // Универсальный перевод основного контента
        this.translateMainContent();
        
        // Обновляем alt атрибуты изображений
        this.updateImageAlt();
        
        // Обновляем переключатель языка
        this.updateLanguageSwitch();
        
        console.log('✅ Перевод страницы завершен');
    }
    
    // Обновляет заголовок страницы
    updatePageTitle() {
        const title = document.querySelector('title');
        if (!title) return;
        
        const pageType = this.detectPageType();
        let newTitle = '';
        
        switch (pageType) {
            case 'home':
                newTitle = this.currentLang === 'ru' ? 
                    'Бхагавад-Гита 1972 — Лицензированный репринт' : 
                    'Bhagavad-Gita 1972 — Licensed Reprint';
                break;
            case 'about':
                newTitle = this.currentLang === 'ru' ? 
                    'О книге — Бхагавад-Гита 1972' : 
                    'About the Book — Bhagavad-Gita 1972';
                break;
            case 'author':
                newTitle = this.currentLang === 'ru' ? 
                    'Об авторе — Бхагавад-Гита 1972' : 
                    'About the Author — Bhagavad-Gita 1972';
                break;
            case 'contacts':
                newTitle = this.currentLang === 'ru' ? 
                    'Купить книгу — Бхагавад-Гита 1972' : 
                    'Buy the Book — Bhagavad-Gita 1972';
                break;
            case 'order-status':
                newTitle = this.currentLang === 'ru' ? 
                    'Статус заказа — Бхагавад-Гита 1972' : 
                    'Order Status — Bhagavad-Gita 1972';
                break;
            case 'thanks':
                newTitle = this.currentLang === 'ru' ? 
                    'Спасибо — Бхагавад-Гита 1972' : 
                    'Thank You — Bhagavad-Gita 1972';
                break;
            default:
                newTitle = this.currentLang === 'ru' ? 
                    'Бхагавад-Гита 1972' : 
                    'Bhagavad-Gita 1972';
        }
        
        title.textContent = newTitle;
    }
    
    // Определяет тип страницы
    detectPageType() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/') return 'home';
        if (path.includes('about.html')) return 'about';
        if (path.includes('author.html')) return 'author';
        if (path.includes('contacts.html')) return 'contacts';
        if (path.includes('order-status.html')) return 'order-status';
        if (path.includes('thanks.html')) return 'thanks';
        if (path.includes('test-i18n.html')) return 'test';
        if (path.includes('demo-i18n.html')) return 'demo';
        return 'unknown';
    }
    
    // Обновляет meta description
    updateMetaDescription() {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.getTranslation('home.description');
        }
    }
    
    // Обновляет навигацию
    updateNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach((link, index) => {
            if (index === 0) link.textContent = this.getTranslation('nav.home');
            else if (index === 1) link.textContent = this.getTranslation('nav.about');
            else if (index === 2) link.textContent = this.getTranslation('nav.author');
            else if (index === 3) link.textContent = this.getTranslation('nav.buy');
        });
    }
    
    // Универсальный перевод основного контента
    translateMainContent() {
        const main = document.querySelector('main');
        if (!main) return;
        
        // Переводим заголовки
        this.translateHeadings(main);
        
        // Переводим параграфы
        this.translateParagraphs(main);
        
        // Переводим списки
        this.translateLists(main);
        
        // Переводим кнопки
        this.translateButtons(main);
        
        // Переводим формы
        this.translateForms(main);
        
        // Переводим ссылки
        this.translateLinks(main);
        
        // Переводим div элементы (для дополнительного контента)
        this.translateDivs(main);
    }
    
    // Переводит заголовки
    translateHeadings(main) {
        const headings = main.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const text = heading.textContent.trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                heading.textContent = translation;
                console.log(`📝 Заголовок переведен: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит параграфы
    translateParagraphs(main) {
        const paragraphs = main.querySelectorAll('p');
        paragraphs.forEach(p => {
            const text = p.textContent.trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                p.textContent = translation;
                console.log(`📝 Параграф переведен: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит списки
    translateLists(main) {
        const listItems = main.querySelectorAll('li');
        listItems.forEach(li => {
            const text = li.textContent.trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                li.textContent = translation;
                console.log(`📝 Элемент списка переведен: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит кнопки
    translateButtons(main) {
        const buttons = main.querySelectorAll('button:not(.language-switch)');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                button.textContent = translation;
                console.log(`📝 Кнопка переведена: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит формы
    translateForms(main) {
        const labels = main.querySelectorAll('label');
        labels.forEach(label => {
            const text = label.textContent.replace(':', '').trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                label.textContent = translation + ':';
                console.log(`📝 Метка формы переведена: "${text}" → "${translation}"`);
            }
        });
        
        const placeholders = main.querySelectorAll('input[placeholder], textarea[placeholder]');
        placeholders.forEach(input => {
            const text = input.placeholder;
            const translation = this.findTranslationForText(text);
            if (translation) {
                input.placeholder = translation;
                console.log(`📝 Placeholder переведен: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит ссылки
    translateLinks(main) {
        const links = main.querySelectorAll('a');
        links.forEach(link => {
            const text = link.textContent.trim();
            const translation = this.findTranslationForText(text);
            if (translation) {
                link.textContent = translation;
                console.log(`📝 Ссылка переведена: "${text}" → "${translation}"`);
            }
        });
    }
    
    // Переводит div элементы (для дополнительного контента)
    translateDivs(main) {
        const divs = main.querySelectorAll('div');
        divs.forEach(div => {
            // Переводим только div с текстовым содержимым (без дочерних элементов)
            if (div.children.length === 0 && div.textContent.trim()) {
                const text = div.textContent.trim();
                const translation = this.findTranslationForText(text);
                if (translation) {
                    div.textContent = translation;
                    console.log(`📝 Div переведен: "${text}" → "${translation}"`);
                }
            }
        });
    }
    
    // Находит перевод для текста
    findTranslationForText(text) {
        // Создаем карту соответствий русский текст -> ключ перевода
        const textMap = this.createTextMap();
        
        // Ищем точное совпадение
        if (textMap[text]) {
            return this.getTranslation(textMap[text]);
        }
        
        // Ищем частичное совпадение (для более гибкого поиска)
        for (const [russianText, translationKey] of Object.entries(textMap)) {
            if (russianText.includes(text) || text.includes(russianText)) {
                return this.getTranslation(translationKey);
            }
        }
        
        // Ищем по ключевым словам (для более умного поиска)
        const keywordMap = this.createKeywordMap();
        for (const [keyword, translationKey] of Object.entries(keywordMap)) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                return this.getTranslation(translationKey);
            }
        }
        
        return null;
    }
    
    // Создает карту соответствий русский текст -> ключ перевода
    createTextMap() {
        const map = {};
        
        // Навигация
        map['Главная'] = 'nav.home';
        map['О книге'] = 'nav.about';
        map['Автор'] = 'nav.author';
        map['Купить'] = 'nav.buy';
        
        // Главная страница
        map['Бхагавад-Гита как она есть'] = 'home.title';
        map['Лицензированный репринт оригинального издания'] = 'home.subtitle';
        map['Цена: 1500 руб.'] = 'home.price';
        map['Заказать книгу'] = 'home.orderButton';
        
        // О книге
        map['О книге'] = 'about.title';
        map['Это точный репринт оригинального издания 1972 года, одобренный Bhaktivedanta Book Trust. Книга сохраняет:'] = 'about.description';
        map['Формат и дизайн оригинала'] = 'about.features.0';
        map['Комментарии А.Ч. Бхактиведанты Свами Прабхупады'] = 'about.features.1';
        map['Качество печати 1972 года'] = 'about.features.2';
        
        // Об авторе
        map['Об авторе'] = 'author.title';
        map['А.Ч. Бхактиведанта Свами Прабхупада (1896-1977) - основатель Международного общества сознания Кришны (ISKCON) и автор более 80 книг по ведической философии.'] = 'author.description';
        map['Перевел и прокомментировал основные ведические тексты'] = 'author.achievements.0';
        map['Основал более 100 храмов по всему миру'] = 'author.achievements.1';
        map['Получил официальное разрешение на издание от Bhaktivedanta Book Trust'] = 'author.achievements.2';
        
        // Контакты
        map['Купить книгу'] = 'contacts.title';
        map['Для заказа книги свяжитесь с нами:'] = 'contacts.description';
        map['Телефон: +7 (XXX) XXX-XX-XX'] = 'contacts.phone';
        map['Email: info@gita-1972-reprint.ru'] = 'contacts.email';
        map['Адрес: Россия, Москва'] = 'contacts.address';
        map['Форма заказа'] = 'contacts.orderForm';
        map['Имя'] = 'contacts.name';
        map['Телефон'] = 'contacts.phone';
        map['Сообщение'] = 'contacts.message';
        map['Отправить заказ'] = 'contacts.sendButton';
        
        // Статус заказа
        map['Статус заказа'] = 'orderStatus.title';
        map['Введите номер заказа для проверки статуса:'] = 'orderStatus.description';
        map['Номер заказа'] = 'orderStatus.orderNumber';
        map['Проверить статус'] = 'orderStatus.checkButton';
        
        // Благодарность
        map['Спасибо за заказ!'] = 'thanks.title';
        map['Ваш заказ принят. Мы свяжемся с вами в ближайшее время для подтверждения деталей доставки.'] = 'thanks.description';
        map['Вернуться на главную'] = 'thanks.backToHome';
        
        return map;
    }
    
    // Создает карту ключевых слов для умного поиска
    createKeywordMap() {
        const map = {};
        
        // Ключевые слова для навигации
        map['главная'] = 'nav.home';
        map['книге'] = 'nav.about';
        map['автор'] = 'nav.author';
        map['купить'] = 'nav.buy';
        
        // Ключевые слова для заголовков
        map['авторе'] = 'author.title';
        map['книгу'] = 'contacts.title';
        map['заказа'] = 'orderStatus.title';
        map['спасибо'] = 'thanks.title';
        
        // Ключевые слова для форм
        map['имя'] = 'contacts.name';
        map['телефон'] = 'contacts.phone';
        map['сообщение'] = 'contacts.message';
        map['отправить'] = 'contacts.sendButton';
        map['форма'] = 'contacts.orderForm';
        
        // Ключевые слова для кнопок
        map['заказать'] = 'home.orderButton';
        map['проверить'] = 'orderStatus.checkButton';
        
        return map;
    }
    
    // Обновляет alt атрибуты изображений
    updateImageAlt() {
        const logo = document.querySelector('.logo');
        if (logo) logo.alt = this.getTranslation('common.logoAlt');
        
        const cover = document.querySelector('.book-cover');
        if (cover) cover.alt = this.getTranslation('common.coverAlt');
    }
    
    // Обновляет переключатель языка
    updateLanguageSwitch() {
        const switchBtn = document.querySelector('.language-switch');
        if (switchBtn) {
            switchBtn.textContent = this.currentLang === 'ru' ? 'EN' : 'RU';
            switchBtn.onclick = () => this.switchLanguage();
            
            // Добавляем анимацию при смене языка
            switchBtn.classList.add('changing');
            setTimeout(() => {
                switchBtn.classList.remove('changing');
            }, 300);
        }
    }
    
    // Переключает язык
    switchLanguage() {
        const newLang = this.currentLang === 'ru' ? 'en' : 'ru';
        this.setLanguage(newLang);
        
        // Сохраняем в localStorage
        localStorage.setItem('selectedLanguage', newLang);
        
        console.log(`🔄 Язык переключен на: ${newLang}`);
    }
    
    // Инициализирует перевод
    init() {
        // Получаем сохраненный язык
        const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
        this.setLanguage(savedLang);
    }
}

// Создаем глобальный экземпляр переводчика
const translator = new UniversalTranslator();

// Функция для переключения языка (для обратной совместимости)
function switchLanguage(lang) {
    translator.setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
}

// Функция для инициализации языка при загрузке страницы
function initializeLanguage() {
    translator.init();
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeLanguage);
