// Интерактивные функции для улучшения UX

// Функция для анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с классом scroll-animate
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Функция для плавного скролла к секциям
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Функция для анимации счетчиков
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 секунды
        const step = target / (duration / 16); // 60 FPS
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Функция для ленивой загрузки изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Функция для улучшения доступности
function improveAccessibility() {
    // Добавляем focus-visible для лучшей навигации с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Добавляем ARIA-атрибуты для интерактивных элементов
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
}

// Функция для оптимизации производительности
function optimizePerformance() {
    // Дебаунс для обработчиков событий
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Оптимизируем обработчики скролла
    const handleScroll = debounce(() => {
        // Логика для скролла
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Функция для улучшения мобильного опыта
function improveMobileExperience() {
    // Добавляем поддержку жестов для мобильных устройств
    let startY = 0;
    let startX = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const diffY = startY - endY;
        const diffX = startX - endX;
        
        // Определяем направление свайпа
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
            if (diffY > 0) {
                // Свайп вверх
                console.log('Свайп вверх');
            } else {
                // Свайп вниз
                console.log('Свайп вниз');
            }
        }
    }, { passive: true });
}

// Функция для анимации загрузки страницы
function initPageLoadAnimation() {
    // Добавляем класс для анимации загрузки
    document.body.classList.add('page-load');
    
    // Убираем класс после загрузки
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('page-load');
        }, 1000);
    });
}

// Функция для улучшения SEO и метаданных
function improveSEO() {
    // Динамически обновляем заголовок страницы при скролле
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
}

// Функция для аналитики и отслеживания
function initAnalytics() {
    // Отслеживаем взаимодействия пользователей
    const trackEvent = (eventName, data = {}) => {
        console.log('📊 Событие:', eventName, data);
        // Здесь можно добавить отправку в Google Analytics или другую систему
    };
    
    // Отслеживаем клики по кнопкам
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('button_click', {
                button_text: button.textContent.trim(),
                button_type: button.classList.contains('primary') ? 'primary' : 'secondary'
            });
        });
    });
    
    // Отслеживаем переключения языка
    document.querySelectorAll('.language-switch').forEach(switchBtn => {
        switchBtn.addEventListener('click', () => {
            trackEvent('language_switch', {
                current_language: document.documentElement.lang
            });
        });
    });
    
    // Отслеживаем время на странице
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        trackEvent('page_exit', {
            time_spent: Math.round(timeSpent / 1000)
        });
    });
}

// Функция для улучшения доступности клавиатуры
function improveKeyboardAccessibility() {
    // Добавляем поддержку Enter и Space для кнопок
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target;
            if (target.classList.contains('cta-button') || target.classList.contains('nav-link')) {
                e.preventDefault();
                target.click();
            }
        }
    });
    
    // Улучшаем навигацию по Tab
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Основная функция инициализации
function initInteractiveFeatures() {
    console.log('🚀 Инициализация интерактивных функций...');
    
    // Инициализируем все функции
    initScrollAnimations();
    initSmoothScroll();
    initLazyLoading();
    improveAccessibility();
    optimizePerformance();
    improveMobileExperience();
    initPageLoadAnimation();
    improveSEO();
    initAnalytics();
    improveKeyboardAccessibility();
    
    console.log('✅ Интерактивные функции инициализированы');
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInteractiveFeatures);
} else {
    initInteractiveFeatures();
}

// Экспортируем функции для использования в других скриптах
window.InteractiveFeatures = {
    initScrollAnimations,
    initSmoothScroll,
    animateCounters,
    initLazyLoading,
    improveAccessibility,
    optimizePerformance,
    improveMobileExperience,
    initPageLoadAnimation,
    improveSEO,
    initAnalytics,
    improveKeyboardAccessibility
};
