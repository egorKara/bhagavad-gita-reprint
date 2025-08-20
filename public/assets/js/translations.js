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

// Функция для переключения языка
function switchLanguage(lang) {
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('selectedLanguage', lang);
    
    // Обновляем все элементы на странице
    updatePageLanguage(lang);
    
    // Обновляем переключатель языка
    updateLanguageSwitch(lang);
}

// Функция для обновления языка страницы
function updatePageLanguage(lang) {
    const t = translations[lang];
    if (!t) {
        console.error('Переводы для языка', lang, 'не найдены');
        return;
    }
    
    console.log('Обновляем язык на:', lang);
    console.log('Текущий путь:', window.location.pathname);
    
    // Обновляем заголовок страницы
    const title = document.querySelector('title');
    if (title) {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            title.textContent = `Bhagavad-Gita 1972 — ${lang === 'ru' ? 'Лицензированный репринт' : 'Licensed Reprint'}`;
        } else if (window.location.pathname.includes('about.html')) {
            title.textContent = `About the Book — Bhagavad-Gita 1972`;
        } else if (window.location.pathname.includes('author.html')) {
            title.textContent = `About the Author — Bhagavad-Gita 1972`;
        } else if (window.location.pathname.includes('contacts.html')) {
            title.textContent = `Buy the Book — Bhagavad-Gita 1972`;
        } else if (window.location.pathname.includes('order-status.html')) {
            title.textContent = `Order Status — Bhagavad-Gita 1972`;
        } else if (window.location.pathname.includes('thanks.html')) {
            title.textContent = `Thank You — Bhagavad-Gita 1972`;
        }
    }
    
    // Обновляем meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = t.home.description;
    }
    
    // Обновляем навигацию
    const navLinks = document.querySelectorAll('nav a');
    console.log('Найдено навигационных ссылок:', navLinks.length);
    navLinks.forEach((link, index) => {
        if (index === 0) link.textContent = t.nav.home;
        else if (index === 1) link.textContent = t.nav.about;
        else if (index === 2) link.textContent = t.nav.author;
        else if (index === 3) link.textContent = t.nav.buy;
    });
    
    // Обновляем основной контент в зависимости от страницы
    console.log('Определяем тип страницы...');
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        console.log('Обновляем главную страницу');
        updateHomePage(t);
    } else if (window.location.pathname.includes('about.html')) {
        console.log('Обновляем страницу "О книге"');
        updateAboutPage(t);
    } else if (window.location.pathname.includes('author.html')) {
        console.log('Обновляем страницу "Об авторе"');
        updateAuthorPage(t);
    } else if (window.location.pathname.includes('contacts.html')) {
        console.log('Обновляем страницу "Контакты"');
        updateContactsPage(t);
    } else if (window.location.pathname.includes('order-status.html')) {
        console.log('Обновляем страницу "Статус заказа"');
        updateOrderStatusPage(t);
    } else if (window.location.pathname.includes('thanks.html')) {
        console.log('Обновляем страницу "Благодарность"');
        updateThanksPage(t);
    } else if (window.location.pathname.includes('test-i18n.html')) {
        console.log('Обновляем тестовую страницу');
        updateTestPage(t);
    } else {
        console.log('Тип страницы не определен');
    }
    
    // Обновляем alt атрибуты изображений
    const logo = document.querySelector('.logo');
    if (logo) logo.alt = t.common.logoAlt;
    
    const cover = document.querySelector('.book-cover');
    if (cover) cover.alt = t.common.coverAlt;
    
    console.log('Обновление языка завершено');
}

// Функции обновления для каждой страницы
function updateHomePage(t) {
    console.log('Обновляем главную страницу...');
    const h1 = document.querySelector('main h1');
    if (h1) {
        h1.textContent = t.home.title;
        console.log('Обновлен заголовок:', t.home.title);
    } else {
        console.log('Заголовок h1 не найден');
    }
    
    const subtitle = document.querySelector('main p');
    if (subtitle) {
        subtitle.innerHTML = `${t.home.subtitle}<br>${t.home.price}`;
        console.log('Обновлен подзаголовок');
    } else {
        console.log('Подзаголовок не найден');
    }
    
    const orderButton = document.querySelector('main button');
    if (orderButton) {
        orderButton.textContent = t.home.orderButton;
        console.log('Обновлена кнопка заказа:', t.home.orderButton);
    } else {
        console.log('Кнопка заказа не найдена');
    }
}

function updateAboutPage(t) {
    console.log('Обновляем страницу "О книге"...');
    const h2 = document.querySelector('main h2');
    if (h2) {
        h2.textContent = t.about.title;
        console.log('Обновлен заголовок:', t.about.title);
    } else {
        console.log('Заголовок h2 не найден');
    }
    
    const description = document.querySelector('main p');
    if (description) {
        description.innerHTML = t.about.description;
        console.log('Обновлено описание');
    } else {
        console.log('Описание не найдено');
    }
    
    const features = document.querySelectorAll('main ul li');
    console.log('Найдено элементов списка:', features.length);
    if (features.length >= 3) {
        features[0].textContent = t.about.features[0];
        features[1].textContent = t.about.features[1];
        features[2].textContent = t.about.features[2];
        console.log('Обновлены элементы списка');
    } else {
        console.log('Недостаточно элементов списка для обновления');
    }
}

function updateAuthorPage(t) {
    console.log('Обновляем страницу "Об авторе"...');
    const h2 = document.querySelector('main h2');
    if (h2) {
        h2.textContent = t.author.title;
        console.log('Обновлен заголовок:', t.author.title);
    } else {
        console.log('Заголовок h2 не найден');
    }
    
    const description = document.querySelector('main p');
    if (description) {
        description.textContent = t.author.description;
        console.log('Обновлено описание');
    } else {
        console.log('Описание не найдено');
    }
    
    const achievements = document.querySelectorAll('main ul li');
    console.log('Найдено достижений:', achievements.length);
    if (achievements.length >= 3) {
        achievements[0].textContent = t.author.achievements[0];
        achievements[1].textContent = t.author.achievements[1];
        achievements[2].textContent = t.author.achievements[2];
        console.log('Обновлены достижения');
    } else {
        console.log('Недостаточно достижений для обновления');
    }
}

function updateContactsPage(t) {
    const h2 = document.querySelector('main h2');
    if (h2) h2.textContent = t.contacts.title;
    
    const description = document.querySelector('main p');
    if (description) description.textContent = t.contacts.description;
    
    const contactInfo = document.querySelectorAll('main p');
    if (contactInfo.length >= 4) {
        contactInfo[1].textContent = t.contacts.phone;
        contactInfo[2].textContent = t.contacts.email;
        contactInfo[3].textContent = t.contacts.address;
    }
    
    // Обновляем форму
    const formLabels = document.querySelectorAll('main label');
    if (formLabels.length >= 4) {
        formLabels[0].textContent = t.contacts.name + ':';
        formLabels[1].textContent = t.contacts.email + ':';
        formLabels[2].textContent = t.contacts.phone + ':';
        formLabels[3].textContent = t.contacts.message + ':';
    }
    
    const submitButton = document.querySelector('main button[type="submit"]');
    if (submitButton) submitButton.textContent = t.contacts.sendButton;
}

function updateOrderStatusPage(t) {
    const h2 = document.querySelector('main h2');
    if (h2) h2.textContent = t.orderStatus.title;
    
    const description = document.querySelector('main p');
    if (description) description.textContent = t.orderStatus.description;
    
    const orderNumber = document.querySelector('main input[placeholder]');
    if (orderNumber) orderNumber.placeholder = t.orderStatus.orderNumber;
    
    const checkButton = document.querySelector('main button[type="submit"]');
    if (checkButton) checkButton.textContent = t.orderStatus.checkButton;
}

function updateThanksPage(t) {
    const h2 = document.querySelector('main h2');
    if (h2) h2.textContent = t.thanks.title;
    
    const description = document.querySelector('main p');
    if (description) description.textContent = t.thanks.description;
    
    const backLink = document.querySelector('main a');
    if (backLink) backLink.textContent = t.thanks.backToHome;
}

function updateTestPage(t) {
    const h1 = document.querySelector('main h1');
    if (h1) h1.textContent = t.home.title === 'Bhagavad-Gita As It Is' ? 'Language Test' : 'Тест многоязычности';
    
    const h2Elements = document.querySelectorAll('main h2');
    if (h2Elements.length >= 2) {
        h2Elements[0].textContent = t.nav.home === 'Home' ? 'Navigation' : 'Навигация';
        h2Elements[1].textContent = t.nav.home === 'Home' ? 'Main Content' : 'Основной контент';
    }
    
    const h3 = document.querySelector('main h3');
    if (h3) h3.textContent = t.nav.home === 'Home' ? 'Language Information' : 'Информация о языках';
    
    const paragraphs = document.querySelectorAll('main p');
    if (paragraphs.length >= 3) {
        paragraphs[1].textContent = t.nav.home === 'Home' ? 'Check how the navigation menu changes when switching languages.' : 'Проверьте, как меняется навигационное меню при переключении языка.';
        paragraphs[2].textContent = t.nav.home === 'Home' ? 'This text should change when switching languages.' : 'Этот текст должен меняться при переключении языка.';
    }
    
    const priceText = document.querySelector('main p:nth-of-type(3)');
    if (priceText) priceText.textContent = t.home.price;
    
    const orderButton = document.querySelector('main button:not(.language-switch)');
    if (orderButton) orderButton.textContent = t.home.orderButton;
    
    const languageInfo = document.querySelector('.language-info ul');
    if (languageInfo) {
        const listItems = languageInfo.querySelectorAll('li');
        if (listItems.length >= 2) {
            listItems[0].innerHTML = t.nav.home === 'Home' ? '<strong>Russian (RU):</strong> Main site language' : '<strong>Русский (RU):</strong> Основной язык сайта';
            listItems[1].innerHTML = t.nav.home === 'Home' ? '<strong>English (EN):</strong> English version' : '<strong>English (EN):</strong> Английская версия';
        }
    }
    
    const note = document.querySelector('.language-info p');
    if (note) note.innerHTML = t.nav.home === 'Home' ? '<strong>Note:</strong> The selected language is saved in the browser and automatically applied on subsequent visits.' : '<strong>Примечание:</strong> Выбранный язык сохраняется в браузере и автоматически применяется при следующих посещениях.';
    
    const testSection = document.querySelector('.test-section:last-child');
    if (testSection) {
        const testH2 = testSection.querySelector('h2');
        if (testH2) testH2.textContent = t.nav.home === 'Home' ? 'Function Testing' : 'Тестирование функций';
        
        const testP = testSection.querySelector('p');
        if (testP) testP.textContent = t.nav.home === 'Home' ? 'Try:' : 'Попробуйте:';
        
        const testList = testSection.querySelector('ol');
        if (testList) {
            const listItems = testList.querySelectorAll('li');
            if (listItems.length >= 4) {
                listItems[0].textContent = t.nav.home === 'Home' ? 'Switch language to English' : 'Переключить язык на английский';
                listItems[1].textContent = t.nav.home === 'Home' ? 'Switch back to Russian' : 'Переключить обратно на русский';
                listItems[2].textContent = t.nav.home === 'Home' ? 'Refresh the page (language should be preserved)' : 'Обновить страницу (язык должен сохраниться)';
                listItems[3].textContent = t.nav.home === 'Home' ? 'Navigate to other site pages' : 'Перейти на другие страницы сайта';
            }
        }
    }
}

// Функция для обновления переключателя языка
function updateLanguageSwitch(lang) {
    const switchBtn = document.querySelector('.language-switch');
    if (switchBtn) {
        switchBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
        switchBtn.onclick = () => switchLanguage(lang === 'ru' ? 'en' : 'ru');
        
        // Добавляем анимацию при смене языка
        switchBtn.classList.add('changing');
        setTimeout(() => {
            switchBtn.classList.remove('changing');
        }, 300);
    }
}

// Функция для инициализации языка при загрузке страницы
function initializeLanguage() {
    // Получаем сохраненный язык или определяем по умолчанию
    const savedLang = localStorage.getItem('selectedLanguage') || 'ru';
    
    // Устанавливаем язык
    switchLanguage(savedLang);
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeLanguage);
