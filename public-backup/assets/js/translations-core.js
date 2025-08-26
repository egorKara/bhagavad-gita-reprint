// Основные переводы для сайта Бхагавад-Гита (оптимизированная версия)
const translations = {
    ru: {
        // Навигация
        nav: {
            home: 'Главная',
            about: 'О книге',
            author: 'Автор',
            buy: 'Купить'
        },

        // Главная страница
        home: {
            title: 'Бхагавад-Гита как она есть',
            subtitle: 'Оригинальное издание 1972 года от Macmillan Publishing',
            description: 'Точное воспроизведение легендарного издания с полным текстом, комментариями А.Ч. Бхактиведанты Свами Прабхупады и оригинальными иллюстрациями',
            features: {
                fullText: 'Полный текст с комментариями',
                illustrations: '44 оригинальные иллюстрации',
                license: 'Официальная лицензия BBT'
            },
            priceLabel: 'Цена:',
            price: 'Уточняйте',
            priceNote: 'Доставка по России',
            orderButton: 'Заказать книгу',
            learnMore: 'Узнать больше'
        },

        // О книге
        about: {
            title: 'О книге',
            subtitle: 'Оригинальное издание 1972 года от Macmillan Publishing',
            description: 'Это точный репринт оригинального издания 1972 года, одобренный Bhaktivedanta Book Trust.',
            features: [
                'Оригинальный санскритский текст в деванагари',
                'Римская транслитерация для произношения',
                'Английские эквиваленты каждого слова',
                'Полный перевод на английский язык',
                'Подробные комментарии А.Ч. Бхактиведанты Свами Прабхупады',
                '44 оригинальные цветные иллюстрации'
            ]
        },

        // Автор
        author: {
            title: 'Автор',
            subtitle: 'А.Ч. Бхактиведанта Свами Прабхупада',
            description: 'Основатель Международного общества сознания Кришны (ISKCON)',
            achievements: [
                'Перевел и прокомментировал более 60 томов ведической литературы',
                'Основал более 100 храмов по всему миру',
                'Получил признание академического сообщества'
            ]
        },

        // Форма заказа
        order: {
            title: 'Заказать книгу',
            form: {
                firstName: 'Имя',
                lastName: 'Фамилия',
                email: 'Email',
                phone: 'Телефон',
                postalCode: 'Почтовый индекс',
                city: 'Город',
                street: 'Улица',
                house: 'Дом',
                apartment: 'Квартира',
                quantity: 'Количество',
                deliveryMethod: 'Способ доставки',
                submit: 'Отправить заказ'
            },
            validation: {
                required: 'Это поле обязательно для заполнения',
                invalidEmail: 'Неверный формат email',
                invalidPhone: 'Неверный формат телефона'
            }
        }
    },

    en: {
        // Navigation
        nav: {
            home: 'Home',
            about: 'About',
            author: 'Author',
            buy: 'Buy'
        },

        // Home page
        home: {
            title: 'Bhagavad-Gita As It Is',
            subtitle: 'Original 1972 Edition from Macmillan Publishing',
            description: 'Exact reproduction of the legendary edition with full text, commentaries by A.C. Bhaktivedanta Swami Prabhupada and original illustrations',
            features: {
                fullText: 'Full text with commentaries',
                illustrations: '44 original illustrations',
                license: 'Official BBT license'
            },
            priceLabel: 'Price:',
            price: 'Contact us',
            priceNote: 'Delivery across Russia',
            orderButton: 'Order Book',
            learnMore: 'Learn More'
        }
    }
};

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
} else if (typeof window !== 'undefined') {
    window.translations = translations;
}
