// SEO оптимизация и улучшение метаданных

// Функция для динамического обновления метаданных
function updateMetaTags() {
    // Обновляем заголовок страницы при скролле
    const originalTitle = document.title;
    let isScrolled = false;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100 && !isScrolled) {
            document.title = '📚 ' + originalTitle;
            isScrolled = true;
        } else if (window.scrollY <= 100 && isScrolled) {
            document.title = originalTitle;
            isScrolled = false;
        }
    }, { passive: true });
    
    // Обновляем meta description в зависимости от контента
    const updateDescription = () => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const text = mainContent.textContent.substring(0, 160).trim();
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', text + '...');
            }
        }
    };
    
    // Обновляем описание при изменении языка
    const observer = new MutationObserver(updateDescription);
    observer.observe(document.body, { childList: true, subtree: true });
}

// Функция для улучшения структурированных данных
function addStructuredData() {
    // Добавляем JSON-LD разметку для книги
    const bookData = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": "Бхагавад-Гита как она есть",
        "alternateName": "Bhagavad-Gita As It Is",
        "author": {
            "@type": "Person",
            "name": "A.C. Bhaktivedanta Swami Prabhupada",
            "birthDate": "1896",
            "deathDate": "1977"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Macmillan Publishing Co., Inc."
        },
        "datePublished": "1972",
        "isbn": "72-79319",
        "bookFormat": "Hardcover",
        "numberOfPages": "800",
        "description": "Точное воспроизведение оригинального издания 1972 года с полным текстом, комментариями и 44 оригинальными иллюстрациями",
        "genre": "Religious Text",
        "inLanguage": ["en", "ru"],
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "RUB",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Bhagavad-Gita 1972 Reprint"
            }
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(bookData);
    document.head.appendChild(script);
    
    // Добавляем разметку для организации
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bhagavad-Gita 1972 Reprint",
        "url": "https://gita-1972-reprint.ru",
        "logo": "https://gita-1972-reprint.ru/assets/images/logo.png",
        "description": "Лицензированный репринт оригинального издания Бхагавад-Гиты 1972 года",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RU"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "info@gita-1972-reprint.ru"
        }
    };
    
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.textContent = JSON.stringify(organizationData);
    document.head.appendChild(orgScript);
}

// Функция для улучшения Open Graph метаданных
function improveOpenGraph() {
    // Динамически обновляем Open Graph метаданные
    const updateOGMeta = () => {
        const currentLang = document.documentElement.lang || 'ru';
        const isEnglish = currentLang === 'en';
        
        // Обновляем заголовок
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', isEnglish ? 
                'Bhagavad-Gita As It Is — Original 1972 Edition | Licensed Reprint' :
                'Бхагавад-Гита как она есть — Оригинальное издание 1972 года | Лицензированный репринт'
            );
        }
        
        // Обновляем описание
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', isEnglish ?
                'Exact reproduction of the original 1972 Bhagavad-Gita edition from Macmillan Publishing. Complete text with commentaries and illustrations.' :
                'Точное воспроизведение оригинального издания Бхагавад-Гиты 1972 года от Macmillan Publishing. Полный текст с комментариями и иллюстрациями.'
            );
        }
        
        // Обновляем локаль
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (!ogLocale) {
            const localeMeta = document.createElement('meta');
            localeMeta.setAttribute('property', 'og:locale');
            localeMeta.setAttribute('content', isEnglish ? 'en_US' : 'ru_RU');
            document.head.appendChild(localeMeta);
        } else {
            ogLocale.setAttribute('content', isEnglish ? 'en_US' : 'ru_RU');
        }
    };
    
    // Обновляем при загрузке страницы
    updateOGMeta();
    
    // Обновляем при смене языка
    document.addEventListener('languageChanged', updateOGMeta);
}

// Функция для улучшения Twitter Card метаданных
function improveTwitterCards() {
    // Добавляем Twitter Card метаданные
    const twitterMeta = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@gita1972reprint' },
        { name: 'twitter:creator', content: '@gita1972reprint' },
        { name: 'twitter:title', content: document.title },
        { name: 'twitter:description', content: document.querySelector('meta[name="description"]')?.getAttribute('content') || '' },
        { name: 'twitter:image', content: 'https://gita-1972-reprint.ru/assets/images/share-cover-1972-1200x630.jpg' },
        { name: 'twitter:image:alt', content: 'Обложка Бхагавад-Гиты 1972 года' }
    ];
    
    twitterMeta.forEach(meta => {
        if (!document.querySelector(`meta[name="${meta.name}"]`)) {
            const metaElement = document.createElement('meta');
            metaElement.setAttribute('name', meta.name);
            metaElement.setAttribute('content', meta.content);
            document.head.appendChild(metaElement);
        }
    });
}

// Функция для улучшения доступности и семантики
function improveAccessibility() {
    // Добавляем ARIA-атрибуты для лучшей доступности
    const addARIA = () => {
        // Добавляем role для основных секций
        const main = document.querySelector('main');
        if (main) main.setAttribute('role', 'main');
        
        const header = document.querySelector('header');
        if (header) header.setAttribute('role', 'banner');
        
        const footer = document.querySelector('footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
        
        const nav = document.querySelector('nav');
        if (nav) nav.setAttribute('role', 'navigation');
        
        // Добавляем aria-label для кнопок
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
        
        // Добавляем aria-label для ссылок
        const links = document.querySelectorAll('a:not([aria-label])');
        links.forEach(link => {
            if (link.textContent.trim() && !link.querySelector('img')) {
                link.setAttribute('aria-label', link.textContent.trim());
            }
        });
        
        // Добавляем aria-label для изображений
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (img.src.includes('logo')) {
                img.setAttribute('alt', 'Логотип Бхагавад-Гита 1972');
            } else if (img.src.includes('cover')) {
                img.setAttribute('alt', 'Обложка Бхагавад-Гиты 1972 года');
            } else if (img.src.includes('author')) {
                img.setAttribute('alt', 'А.Ч. Бхактиведанта Свами Прабхупада');
            }
        });
    };
    
    addARIA();
    
    // Обновляем ARIA при смене языка
    document.addEventListener('languageChanged', addARIA);
}

// Функция для улучшения производительности и Core Web Vitals
function improveCoreWebVitals() {
    // Отслеживаем LCP (Largest Contentful Paint)
    let lcpElement = null;
    let lcpValue = 0;
    
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.identifier === 'largest-contentful-paint') {
                lcpValue = entry.startTime;
                console.log('📊 LCP:', lcpValue, 'ms');
            }
        });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Отслеживаем FID (First Input Delay)
    let firstInputTime = 0;
    
    const inputObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.entryType === 'first-input') {
                firstInputTime = entry.processingStart - entry.startTime;
                console.log('📊 FID:', firstInputTime, 'ms');
            }
        });
    });
    
    inputObserver.observe({ entryTypes: ['first-input'] });
    
    // Отслеживаем CLS (Cumulative Layout Shift)
    let clsValue = 0;
    
    const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.hadRecentInput) return;
            
            clsValue += entry.value;
            console.log('📊 CLS:', clsValue);
        });
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
    // Отправляем метрики в Google Analytics (если настроен)
    const sendMetrics = () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'core_web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'Metrics',
                value: Math.round(lcpValue),
                custom_parameter_1: Math.round(firstInputTime),
                custom_parameter_2: Math.round(clsValue * 1000)
            });
        }
    };
    
    // Отправляем метрики через 5 секунд после загрузки
    setTimeout(sendMetrics, 5000);
}

// Функция для улучшения поисковой оптимизации
function improveSearchOptimization() {
    // Добавляем breadcrumbs для лучшей навигации
    const addBreadcrumbs = () => {
        const breadcrumbs = document.createElement('nav');
        breadcrumbs.setAttribute('aria-label', 'Хлебные крошки');
        breadcrumbs.setAttribute('role', 'navigation');
        breadcrumbs.className = 'breadcrumbs';
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': 'Главная',
            'about.html': 'О книге',
            'author.html': 'Об авторе',
            'contacts.html': 'Купить'
        };
        
        const breadcrumbHTML = `
            <ol>
                <li><a href="index.html">Главная</a></li>
                ${currentPage !== 'index.html' ? `<li>${pageNames[currentPage] || 'Страница'}</li>` : ''}
            </ol>
        `;
        
        breadcrumbs.innerHTML = breadcrumbHTML;
        
        // Вставляем breadcrumbs после header
        const header = document.querySelector('header');
        if (header && !document.querySelector('.breadcrumbs')) {
            header.parentNode.insertBefore(breadcrumbs, header.nextSibling);
        }
    };
    
    addBreadcrumbs();
    
    // Добавляем микроразметку для breadcrumbs
    const addBreadcrumbSchema = () => {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Главная",
                    "item": "https://gita-1972-reprint.ru/"
                }
            ]
        };
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': 'Главная',
            'about.html': 'О книге',
            'author.html': 'Об авторе',
            'contacts.html': 'Купить'
        };
        
        if (currentPage !== 'index.html' && pageNames[currentPage]) {
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": pageNames[currentPage],
                "item": `https://gita-1972-reprint.ru/${currentPage}`
            });
        }
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    };
    
    addBreadcrumbSchema();
}

// Основная функция инициализации SEO
function initSEO() {
    console.log('🚀 Инициализация SEO оптимизации...');
    
    // Инициализируем все SEO функции
    updateMetaTags();
    addStructuredData();
    improveOpenGraph();
    improveTwitterCards();
    improveAccessibility();
    improveCoreWebVitals();
    improveSearchOptimization();
    
    console.log('✅ SEO оптимизация завершена');
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEO);
} else {
    initSEO();
}

// Экспортируем функции для использования в других скриптах
window.SEO = {
    updateMetaTags,
    addStructuredData,
    improveOpenGraph,
    improveTwitterCards,
    improveAccessibility,
    improveCoreWebVitals,
    improveSearchOptimization,
    initSEO
};
