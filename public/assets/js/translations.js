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
            subtitle: "Оригинальное издание 1972 года от Macmillan Publishing",
            description: "Точное воспроизведение легендарного издания с полным текстом, комментариями А.Ч. Бхактиведанты Свами Прабхупады и 44 оригинальными иллюстрациями",
            features: {
                fullText: "Полный текст с комментариями",
                illustrations: "44 оригинальные иллюстрации",
                license: "Официальная лицензия BBT"
            },
            price: "1500 ₽",
            priceNote: "Доставка по России",
            orderButton: "Заказать книгу",
            learnMore: "Узнать больше"
        },
        
        // О книге
        about: {
            title: "О книге",
            subtitle: "Оригинальное издание 1972 года от Macmillan Publishing",
            history: "История создания",
            description: "Это точный репринт оригинального издания 1972 года, одобренный Bhaktivedanta Book Trust. Книга представляет собой полную версию с оригинальным текстом, который был сокращен при первом издании.",
            whatIncludes: "Что включает полное издание:",
            features: [
                "Оригинальный санскритский текст в деванагари",
                "Римская транслитерация для произношения",
                "Английские эквиваленты каждого слова",
                "Полный перевод на английский язык",
                "Подробные комментарии А.Ч. Бхактиведанты Свами Прабхупады",
                "44 оригинальные цветные иллюстрации",
                "Полные индексы и перекрестные ссылки",
                "Глоссарий и руководство по произношению санскрита"
            ],
            academicRecognition: "Академическое признание",
            academicQuote: "Принося нам новое и живое толкование текста, уже известного многим, А.Ч. Бхактиведанта Свами Прабхупада увеличил наше понимание во много раз.",
            academicCite: "— Профессор Эдвард К. Димок, младший",
            academicDepartment: "Кафедра языков и цивилизации Южной Азии",
            academicUniversity: "Университет Чикаго",
            backCover: "Задняя обложка с полным описанием издания",
            publicationDetails: "Детали издания",
            publisherInfo: "Издательская информация",
            originalPublisher: "Оригинальный издатель: Macmillan Publishing Co., Inc.",
            firstEdition: "Год первого издания: 1972",
            editionType: "Тип издания: Твердый переплет",
            license: "Лицензия: Bhaktivedanta Book Trust",
            isbn: "ISBN: 72-79319 (Library of Congress)",
            designFeatures: "Особенности оформления",
            illustrations: "Иллюстрации: 44 оригинальные цветные картины",
            artists: "Художники: Американские преданные",
            style: "Стиль: Традиционное индийское искусство",
            printQuality: "Качество печати: Высокое, как в оригинале 1972 года",
            bookStructure: "Структура книги",
            preface: "Предисловие и Введение",
            chapters: "18 глав с полным текстом",
            commentaries: "Комментарии к каждому стиху",
            appendices: "Приложения и справочные материалы",
            fullContents: "Полное содержание",
            mainChapters: "Основные главы",
            additionalMaterials: "Дополнительные материалы",
            chapters1to9: "Основные главы (1-9)",
            chapters10to18: "Основные главы (10-18)",
            chapter1: "Глава 1: Наблюдение армий на поле битвы Курукшетра",
            chapter2: "Глава 2: Содержание Гиты вкратце",
            chapter3: "Глава 3: Карма-йога",
            chapter4: "Глава 4: Трансцендентальное знание",
            chapter5: "Глава 5: Карма-йога — деятельность в сознании Кришны",
            chapter6: "Глава 6: Санкхья-йога",
            chapter7: "Глава 7: Знание Абсолюта",
            chapter8: "Глава 8: Достижение Высшего",
            chapter9: "Глава 9: Самое сокровенное знание",
            chapter10: "Глава 10: Великолепие Абсолюта",
            chapter11: "Глава 11: Вселенская форма",
            chapter12: "Глава 12: Преданное служение",
            chapter13: "Глава 13: Природа, наслаждающийся и сознание",
            chapter14: "Глава 14: Три гуны материальной природы",
            chapter15: "Глава 15: Йога Верховной Личности",
            chapter16: "Глава 16: Божественная и демоническая природы",
            chapter17: "Глава 17: Разделы веры",
            chapter18: "Глава 18: Заключение — Совершенство отречения",
            prefaceIntro: "Предисловие и Введение",
            originalIllustrations: "44 оригинальные иллюстрации",
            illustrationIndex: "Индекс иллюстраций",
            references: "Справочники и Глоссарий",
            sanskritGuide: "Руководство по произношению санскрита",
            whyThisEdition: "Почему именно это издание?",
            authenticity: "Аутентичность и полнота",
            authenticityDesc: "Это издание представляет собой полную версию оригинальной рукописи, которая была сокращена при первом издании 1972 года. Теперь читатели получают доступ ко всем материалам, которые автор изначально планировал включить в книгу.",
            philosophicalAccuracy: "Философская точность",
            philosophicalDesc: "Комментарии А.Ч. Бхактиведанты Свами Прабхупады основаны на аутентичной ведической традиции и передаются через парампару (ученическую преемственность). Это гарантирует точность философских интерпретаций.",
            historicalValue: "Историческая ценность",
            historicalDesc: "Издание 1972 года стало культовым для западного мира, представив ведическую мудрость в доступной форме. Этот репринт сохраняет историческую значимость оригинального издания.",
            titlePage: "Титульная страница с полной информацией об издании"
        },
        
        // Об авторе
        author: {
            title: "Об авторе",
            subtitle: "А.Ч. Бхактиведанта Свами Прабхупада",
            name: "А.Ч. Бхактиведанта Свами Прабхупада (1896-1977)",
            description: "Основатель Международного общества сознания Кришны (ISKCON) и автор более 80 книг по ведической философии. Его перевод и комментарии к Бхагавад-Гите считаются наиболее аутентичными и полными, основанными на парампаре (ученической преемственности) от самого Господа Кришны.",
            keyAchievements: "Ключевые достижения:",
            achievements: [
                "Перевел и прокомментировал основные ведические тексты",
                "Основал более 100 храмов по всему миру",
                "Получил официальное разрешение на издание от Bhaktivedanta Book Trust",
                "Представил ведическую мудрость западному миру",
                "Приплыл в Америку в возрасте 69 лет для выполнения миссии",
                "Создал издательство Bhaktivedanta Book Trust"
            ],
            earlyLife: "Ранние годы и образование",
            childhood: "Детство и юность",
            childhoodDesc: "Абхай Чаран Де родился 1 сентября 1896 года в Калькутте, Индия, в семье торговца тканями. С детства он проявлял глубокий интерес к духовности и ведической культуре. В возрасте 22 лет он встретил своего духовного учителя Шрилу Бхактисиддханту Сарасвати Тхакура.",
            meetingGuru: "Встреча с духовным учителем",
            meetingGuruDesc: "В 1922 году Шрила Бхактисиддханта Сарасвати Тхакура дал ему наставление: \"Если у тебя есть деньги, напечатай книги\". Это стало поворотным моментом в жизни Абхая Чарана, определившим его будущую миссию по распространению ведического знания.",
            renunciation: "Принятие отречения",
            renunciationDesc: "В 1959 году Абхай Чаран принял отречение (санньясу) и получил имя А.Ч. Бхактиведанта Свами Прабхупада. С этого момента он полностью посвятил себя написанию книг и подготовке к миссии на Западе.",
            foreword: "Предисловие к изданию 1972 года",
            missionWest: "Миссия на Западе",
            journeyAmerica: "Путешествие в Америку",
            journeyAmericaDesc: "В 1965 году, в возрасте 69 лет, Шрила Прабхупада отправился в Америку на грузовом корабле \"Джаладута\" с миссией распространить ведическое знание на Западе. У него было всего 40 рупий и несколько экземпляров его переводов.",
            foundingIskcon: "Основание ISKCON",
            foundingIskconDesc: "13 июля 1966 года в Нью-Йорке Шрила Прабхупада официально основал Международное общество сознания Кришны (ISKCON). Это общество стало центром распространения ведической культуры и философии по всему миру.",
            publishing: "Издательская деятельность",
            publishingDesc: "В 1972 году Шрила Прабхупада основал Bhaktivedanta Book Trust (BBT) для издания и распространения ведической литературы. Первой книгой, изданной BBT, стала \"Бхагавад-Гита как она есть\" от Macmillan Publishing.",
            preface: "Предисловие с описанием миссии",
            literaryHeritage: "Литературное наследие",
            mainWorks: "Основные труды",
            mainWorksDesc: "За 12 лет активной деятельности на Западе Шрила Прабхупада написал, перевел и прокомментировал более 80 книг по ведической философии, включая:",
            basicTexts: "Основные тексты",
            philosophicalWorks: "Философские труды",
            translationFeatures: "Особенности переводов",
            translationFeaturesDesc: "Все переводы Шрилы Прабхупады характеризуются:",
            authenticity: "Аутентичностью — основаны на парампаре",
            completeness: "Полнотой — включают оригинальный текст, транслитерацию и перевод",
            commentaries: "Комментариями — подробные объяснения каждого стиха",
            practicality: "Практичностью — применимы в современной жизни",
            introduction: "Введение с философией автора",
            philosophy: "Философия и учения",
            mainPrinciples: "Основные принципы",
            mainPrinciplesDesc: "Философия Шрилы Прабхупады основана на Бхагавад-Гите и других ведических текстах. Ключевые принципы включают:",
            krishnaConsciousness: "Сознание Кришны",
            krishnaConsciousnessDesc: "Высшая цель человеческой жизни — развитие любовных отношений с Верховной Личностью Бога",
            bhaktiYoga: "Бхакти-йога",
            bhaktiYogaDesc: "Путь преданного служения как наиболее эффективный метод духовного развития",
            vedicKnowledge: "Ведическое знание",
            vedicKnowledgeDesc: "Изучение священных текстов для понимания природы души и материального мира",
            universality: "Универсальность",
            universalityDesc: "Ведическая мудрость предназначена для всех людей, независимо от происхождения",
            westernInfluence: "Влияние на западную культуру",
            westernInfluenceDesc: "Благодаря трудам Шрилы Прабхупады ведическая философия стала доступна миллионам людей на Западе. Его книги переведены на более чем 80 языков и используются в университетах по всему миру.",
            legacy: "Наследие",
            modernInfluence: "Влияние на современный мир",
            modernInfluenceDesc: "Сегодня ISKCON насчитывает более 600 храмов, 100 сельскохозяйственных общин и 50 школ по всему миру. Книги Шрилы Прабхупады продолжают вдохновлять людей на духовный путь.",
            academicRecognition: "Признание академическим сообществом",
            academicRecognitionDesc: "Работы Шрилы Прабхупады получили признание ведущих ученых и университетов, включая Гарвард, Оксфорд и Сорбонну. Его переводы считаются стандартом в изучении ведической литературы.",
            continuingMission: "Продолжение миссии",
            continuingMissionDesc: "После ухода Шрилы Прабхупады в 1977 году его ученики продолжают его миссию по распространению ведического знания. Bhaktivedanta Book Trust продолжает издавать его книги на многих языках.",
            studyWorks: "Изучите труды великого учителя",
            studyWorksDesc: "Погрузитесь в глубокую мудрость Бхагавад-Гиты с комментариями А.Ч. Бхактиведанты Свами Прабхупады"
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
            sendButton: "Отправить заказ",
            // Добавлено для корректного перевода страницы заказа
            availability: "В наличии",
            contactDetails: "Ваши контактные данные",
            personalData: "Личные данные",
            deliveryAddress: "Адрес доставки",
            orderDetails: "Детали заказа",
            formDescription: "Заполните форму ниже для оформления заказа. Все поля обязательны для заполнения.",
            sending: "Отправка..."
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
        },
        
        // Переводы для страницы контактов/заказа
        contacts: {
            ru: {
                // Заголовки
                "Заказать книгу": "Заказать книгу",
                "Бхагавад-Гита как она есть — Оригинальное издание 1972 года": "Бхагавад-Гита как она есть — Оригинальное издание 1972 года",
                "Контактная информация": "Контактная информация",
                "Ваши контактные данные": "Ваши контактные данные",
                "Сводка заказа": "Сводка заказа",
                
                // Контактная информация
                "Телефон": "Телефон",
                "Email": "Email",
                "Адрес": "Адрес",
                "Россия, Москва": "Россия, Москва",
                
                // Форма заказа
                "Заполните форму ниже для оформления заказа. Все поля обязательны для заполнения.": "Заполните форму ниже для оформления заказа. Все поля обязательны для заполнения.",
                "Имя *": "Имя *",
                "Фамилия *": "Фамилия *",
                "Email *": "Email *",
                "Телефон *": "Телефон *",
                "Адрес доставки *": "Адрес доставки *",
                "Количество книг *": "Количество книг *",
                "Дополнительная информация": "Дополнительная информация",
                "Выберите количество": "Выберите количество",
                "1 книга": "1 книга",
                "2 книги": "2 книги",
                "3 книги": "3 книги",
                "4 книги": "4 книги",
                "5 книг": "5 книг",
                "Больше 5": "Больше 5",
                "Укажите полный адрес доставки": "Укажите полный адрес доставки",
                "Индекс, город, улица, дом, квартира": "Индекс, город, улица, дом, квартира",
                "Укажите любую дополнительную информацию по заказу": "Укажите любую дополнительную информацию по заказу",
                "Я согласен с условиями заказа и политикой конфиденциальности *": "Я согласен с условиями заказа и политикой конфиденциальности *",
                "условиями заказа": "условиями заказа",
                "политикой конфиденциальности": "политикой конфиденциальности",
                "Отправить заказ": "Отправить заказ",
                "Отправка...": "Отправка...",
                
                // Сводка заказа
                "Книга:": "Книга:",
                "Бхагавад-Гита как она есть (1972)": "Бхагавад-Гита как она есть (1972)",
                "Цена за единицу:": "Цена за единицу:",
                "Доставка:": "Доставка:",
                "Итого:": "Итого:",
                "Доставка по России": "Доставка по России",
                "В наличии": "В наличии",
                
                // Сообщения об ошибках
                "Это поле обязательно для заполнения": "Это поле обязательно для заполнения",
                "Имя должно содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы": "Имя должно содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы",
                "Фамилия должна содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы": "Фамилия должна содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы",
                "Введите корректный email адрес": "Введите корректный email адрес",
                "Введите номер телефона в формате: +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX": "Введите номер телефона в формате: +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX",
                "Адрес должен содержать от 10 до 200 символов": "Адрес должен содержать от 10 до 200 символов",
                "Выберите количество книг": "Выберите количество книг",
                "Необходимо согласие с условиями заказа": "Необходимо согласие с условиями заказа",
                "Пожалуйста, исправьте ошибки в форме": "Пожалуйста, исправьте ошибки в форме",
                "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.": "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.",
                "Произошла ошибка при отправке заказа. Попробуйте еще раз.": "Произошла ошибка при отправке заказа. Попробуйте еще раз.",
                
                // Breadcrumbs
                "Заказать книгу": "Заказать книгу"
            },
            en: {
                // Headers
                "Заказать книгу": "Order Book",
                "Бхагавад-Гита как она есть — Оригинальное издание 1972 года": "Bhagavad-Gita As It Is — Original 1972 Edition",
                "Контактная информация": "Contact Information",
                "Ваши контактные данные": "Your Contact Details",
                "Сводка заказа": "Order Summary",
                
                // Contact Information
                "Телефон": "Phone",
                "Email": "Email",
                "Адрес": "Address",
                "Россия, Москва": "Russia, Moscow",
                
                // Order Form
                "Заполните форму ниже для оформления заказа. Все поля обязательны для заполнения.": "Fill out the form below to place your order. All fields are required.",
                "Имя *": "First Name *",
                "Фамилия *": "Last Name *",
                "Email *": "Email *",
                "Телефон *": "Phone *",
                "Адрес доставки *": "Delivery Address *",
                "Количество книг *": "Quantity *",
                "Дополнительная информация": "Additional Information",
                "Выберите количество": "Select quantity",
                "1 книга": "1 book",
                "2 книги": "2 books",
                "3 книги": "3 books",
                "4 книги": "4 books",
                "5 книг": "5 books",
                "Больше 5": "More than 5",
                "Укажите полный адрес доставки": "Enter full delivery address",
                "Индекс, город, улица, дом, квартира": "Postal code, city, street, house, apartment",
                "Укажите любую дополнительную информацию по заказу": "Enter any additional information about your order",
                "Я согласен с условиями заказа и политикой конфиденциальности *": "I agree to the order terms and privacy policy *",
                "условиями заказа": "order terms",
                "политикой конфиденциальности": "privacy policy",
                "Отправить заказ": "Submit Order",
                "Отправка...": "Sending...",
                
                // Order Summary
                "Книга:": "Book:",
                "Бхагавад-Гита как она есть (1972)": "Bhagavad-Gita As It Is (1972)",
                "Цена за единицу:": "Price per unit:",
                "Доставка:": "Delivery:",
                "Итого:": "Total:",
                "Доставка по России": "Delivery across Russia",
                "В наличии": "In Stock",
                
                // Error Messages
                "Это поле обязательно для заполнения": "This field is required",
                "Имя должно содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы": "Name must contain 2-50 characters, only letters, spaces, hyphens and apostrophes",
                "Фамилия должна содержать от 2 до 50 символов, только буквы, пробелы, дефисы и апострофы": "Last name must contain 2-50 characters, only letters, spaces, hyphens and apostrophes",
                "Введите корректный email адрес": "Enter a valid email address",
                "Введите номер телефона в формате: +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX": "Enter phone number in format: +7 (XXX) XXX-XX-XX or 8 XXX XXX-XX-XX",
                "Адрес должен содержать от 10 до 200 символов": "Address must contain 10-200 characters",
                "Выберите количество книг": "Select quantity of books",
                "Необходимо согласие с условиями заказа": "Agreement to order terms is required",
                "Пожалуйста, исправьте ошибки в форме": "Please fix the errors in the form",
                "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.": "Order successfully sent! We will contact you soon.",
                "Произошла ошибка при отправке заказа. Попробуйте еще раз.": "An error occurred while sending the order. Please try again.",
                
                // Breadcrumbs
                "Заказать книгу": "Order Book"
            }
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
            subtitle: "Original 1972 Edition from Macmillan Publishing",
            description: "Exact reproduction of the legendary 1972 edition with complete text, commentaries by A.C. Bhaktivedanta Swami Prabhupada and 44 original illustrations",
            features: {
                fullText: "Complete text with commentaries",
                illustrations: "44 original illustrations",
                license: "Official BBT license"
            },
            price: "1500 RUB",
            priceNote: "Delivery across Russia",
            orderButton: "Order Book",
            learnMore: "Learn More"
        },
        
        // About the book
        about: {
            title: "About the Book",
            subtitle: "Original 1972 Edition from Macmillan Publishing",
            history: "History of Creation",
            description: "This is an exact reprint of the original 1972 edition, approved by Bhaktivedanta Book Trust. The book represents the complete version with the original text that was shortened in the first edition.",
            whatIncludes: "What the complete edition includes:",
            features: [
                "Original Sanskrit text in Devanagari",
                "Roman transliteration for pronunciation",
                "English equivalents for each word",
                "Complete English translation",
                "Detailed commentaries by A.C. Bhaktivedanta Swami Prabhupada",
                "44 original color illustrations",
                "Complete indexes and cross-references",
                "Glossary and Sanskrit pronunciation guide"
            ],
            academicRecognition: "Academic Recognition",
            academicQuote: "By bringing us a new and living interpretation of a text already known to many, A.C. Bhaktivedanta Swami Prabhupada has increased our understanding manyfold.",
            academicCite: "— Professor Edward C. Dimock, Jr.",
            academicDepartment: "Department of South Asian Languages and Civilization",
            academicUniversity: "University of Chicago",
            backCover: "Back cover with complete edition description",
            publicationDetails: "Publication Details",
            publisherInfo: "Publisher Information",
            originalPublisher: "Original Publisher: Macmillan Publishing Co., Inc.",
            firstEdition: "First Edition Year: 1972",
            editionType: "Edition Type: Hardcover",
            license: "License: Bhaktivedanta Book Trust",
            isbn: "ISBN: 72-79319 (Library of Congress)",
            designFeatures: "Design Features",
            illustrations: "Illustrations: 44 original color paintings",
            artists: "Artists: American devotees",
            style: "Style: Traditional Indian art",
            printQuality: "Print Quality: High, as in the original 1972 edition",
            bookStructure: "Book Structure",
            preface: "Preface and Introduction",
            chapters: "18 chapters with complete text",
            commentaries: "Commentaries for each verse",
            appendices: "Appendices and reference materials",
            fullContents: "Complete Contents",
            mainChapters: "Main Chapters",
            additionalMaterials: "Additional Materials",
            chapters1to9: "Main Chapters (1-9)",
            chapters10to18: "Main Chapters (10-18)",
            chapter1: "Chapter 1: Observing the Armies on the Battlefield of Kurukṣetra",
            chapter2: "Chapter 2: Contents of the Gītā Summarized",
            chapter3: "Chapter 3: Karma-yoga",
            chapter4: "Chapter 4: Transcendental Knowledge",
            chapter5: "Chapter 5: Karma-yoga — Action in Kṛṣṇa Consciousness",
            chapter6: "Chapter 6: Sāṅkhya-yoga",
            chapter7: "Chapter 7: Knowledge of the Absolute",
            chapter8: "Chapter 8: Attaining the Supreme",
            chapter9: "Chapter 9: The Most Confidential Knowledge",
            chapter10: "Chapter 10: The Opulence of the Absolute",
            chapter11: "Chapter 11: The Universal Form",
            chapter12: "Chapter 12: Devotional Service",
            chapter13: "Chapter 13: Nature, the Enjoyer, and Consciousness",
            chapter14: "Chapter 14: The Three Modes of Material Nature",
            chapter15: "Chapter 15: The Yoga of the Supreme Person",
            chapter16: "Chapter 16: The Divine and Demoniac Natures",
            chapter17: "Chapter 17: The Divisions of Faith",
            chapter18: "Chapter 18: Conclusion — The Perfection of Renunciation",
            prefaceIntro: "Preface and Introduction",
            originalIllustrations: "44 Original Illustrations",
            illustrationIndex: "Illustration Index",
            references: "References and Glossary",
            sanskritGuide: "Sanskrit Pronunciation Guide",
            whyThisEdition: "Why This Edition?",
            authenticity: "Authenticity and Completeness",
            authenticityDesc: "This edition represents the complete version of the original manuscript that was shortened in the first 1972 edition. Now readers have access to all materials that the author originally planned to include in the book.",
            philosophicalAccuracy: "Philosophical Accuracy",
            philosophicalDesc: "A.C. Bhaktivedanta Swami Prabhupada's commentaries are based on authentic Vedic tradition and transmitted through paramparā (disciple succession). This guarantees the accuracy of philosophical interpretations.",
            historicalValue: "Historical Value",
            historicalDesc: "The 1972 edition became cult for the Western world, presenting Vedic wisdom in an accessible form. This reprint preserves the historical significance of the original edition.",
            titlePage: "Title page with complete publication information"
        },
        
        // About the author
        author: {
            title: "About the Author",
            subtitle: "A.C. Bhaktivedanta Swami Prabhupada",
            name: "A.C. Bhaktivedanta Swami Prabhupada (1896-1977)",
            description: "Founder of the International Society for Krishna Consciousness (ISKCON) and author of more than 80 books on Vedic philosophy. His translation and commentaries on the Bhagavad-Gita are considered the most authentic and complete, based on paramparā (disciple succession) from Lord Krishna Himself.",
            keyAchievements: "Key Achievements:",
            achievements: [
                "Translated and commented on major Vedic texts",
                "Founded more than 100 temples worldwide",
                "Received official permission for publication from Bhaktivedanta Book Trust",
                "Presented Vedic wisdom to the Western world",
                "Sailed to America at age 69 to fulfill his mission",
                "Created Bhaktivedanta Book Trust publishing house"
            ],
            earlyLife: "Early Years and Education",
            childhood: "Childhood and Youth",
            childhoodDesc: "Abhay Charan De was born on September 1, 1896, in Calcutta, India, to a cloth merchant family. From childhood, he showed deep interest in spirituality and Vedic culture. At the age of 22, he met his spiritual master Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura.",
            meetingGuru: "Meeting the Spiritual Master",
            meetingGuruDesc: "In 1922, Śrīla Bhaktisiddhānta Sarasvatī Ṭhākura gave him the instruction: \"If you have money, print books.\" This became a turning point in Abhay Charan's life, determining his future mission to spread Vedic knowledge.",
            renunciation: "Accepting Renunciation",
            renunciationDesc: "In 1959, Abhay Charan accepted renunciation (sannyāsa) and received the name A.C. Bhaktivedanta Swami Prabhupada. From that moment, he completely dedicated himself to writing books and preparing for his mission to the West.",
            foreword: "Foreword to the 1972 edition",
            missionWest: "Mission to the West",
            journeyAmerica: "Journey to America",
            journeyAmericaDesc: "In 1965, at the age of 69, Śrīla Prabhupada set out for America on the cargo ship \"Jaladuta\" with the mission to spread Vedic knowledge in the West. He had only 40 rupees and several copies of his translations.",
            foundingIskcon: "Founding ISKCON",
            foundingIskconDesc: "On July 13, 1966, in New York, Śrīla Prabhupada officially founded the International Society for Krishna Consciousness (ISKCON). This society became the center for spreading Vedic culture and philosophy throughout the world.",
            publishing: "Publishing Activity",
            publishingDesc: "In 1972, Śrīla Prabhupada founded Bhaktivedanta Book Trust (BBT) for publishing and distributing Vedic literature. The first book published by BBT was \"Bhagavad-Gita As It Is\" from Macmillan Publishing.",
            preface: "Preface describing the mission",
            literaryHeritage: "Literary Heritage",
            mainWorks: "Main Works",
            mainWorksDesc: "Over 12 years of active work in the West, Śrīla Prabhupada wrote, translated, and commented on more than 80 books on Vedic philosophy, including:",
            basicTexts: "Basic Texts",
            philosophicalWorks: "Philosophical Works",
            translationFeatures: "Translation Features",
            translationFeaturesDesc: "All of Śrīla Prabhupada's translations are characterized by:",
            authenticity: "Authenticity — based on paramparā",
            completeness: "Completeness — including original text, transliteration, and translation",
            commentaries: "Commentaries — detailed explanations of each verse",
            practicality: "Practicality — applicable in modern life",
            introduction: "Introduction with author's philosophy",
            philosophy: "Philosophy and Teachings",
            mainPrinciples: "Main Principles",
            mainPrinciplesDesc: "Śrīla Prabhupada's philosophy is based on the Bhagavad-Gita and other Vedic texts. Key principles include:",
            krishnaConsciousness: "Krishna Consciousness",
            krishnaConsciousnessDesc: "The highest goal of human life is to develop loving relationships with the Supreme Personality of Godhead",
            bhaktiYoga: "Bhakti-yoga",
            bhaktiYogaDesc: "The path of devotional service as the most effective method of spiritual development",
            vedicKnowledge: "Vedic Knowledge",
            vedicKnowledgeDesc: "Study of sacred texts to understand the nature of the soul and material world",
            universality: "Universality",
            universalityDesc: "Vedic wisdom is intended for all people, regardless of origin",
            westernInfluence: "Influence on Western Culture",
            westernInfluenceDesc: "Thanks to Śrīla Prabhupada's works, Vedic philosophy became accessible to millions of people in the West. His books have been translated into more than 80 languages and are used in universities around the world.",
            legacy: "Legacy",
            modernInfluence: "Influence on the Modern World",
            modernInfluenceDesc: "Today, ISKCON has more than 600 temples, 100 agricultural communities, and 50 schools worldwide. Śrīla Prabhupada's books continue to inspire people on the spiritual path.",
            academicRecognition: "Academic Recognition",
            academicRecognitionDesc: "Śrīla Prabhupada's works have received recognition from leading scholars and universities, including Harvard, Oxford, and the Sorbonne. His translations are considered the standard in the study of Vedic literature.",
            continuingMission: "Continuing the Mission",
            continuingMissionDesc: "After Śrīla Prabhupada's departure in 1977, his disciples continue his mission to spread Vedic knowledge. Bhaktivedanta Book Trust continues to publish his books in many languages.",
            studyWorks: "Study the Works of the Great Teacher",
            studyWorksDesc: "Immerse yourself in the deep wisdom of the Bhagavad-Gita with commentaries by A.C. Bhaktivedanta Swami Prabhupada"
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
            sendButton: "Send Order",
            // Added keys to support Contacts page translations
            availability: "In Stock",
            contactDetails: "Your Contact Details",
            personalData: "Personal Details",
            deliveryAddress: "Delivery Address",
            orderDetails: "Order Details",
            formDescription: "Fill out the form below to place your order. All fields are required.",
            sending: "Sending..."
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
        const fallbackLang = 'ru';
        const newLang = (lang && this.translations[lang]) ? lang : fallbackLang;
        this.currentLang = newLang;

        // Обновляем атрибут lang у корневого html
        if (document && document.documentElement) {
            document.documentElement.setAttribute('lang', newLang);
        }

        // Сохраняем выбор языка
        try {
            localStorage.setItem('selectedLanguage', newLang);
        } catch (e) {}

        this.translatePage();

        // Сообщаем остальным системам о смене языка
        try {
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
        } catch (e) {}
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
        
        // Обновляем meta description в зависимости от страницы
        this.updateMetaDescription();
        
        // Обновляем навигацию
        this.updateNavigation();
        
        // Проставляем параметр lang во все внутренние ссылки
        this.updateLinksWithLang();
        
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
        if (!metaDescription) return;
        
        const pageType = this.detectPageType();
        const key = `${pageType}.description`;
        const description = this.getTranslation(key, this.getTranslation('home.description'));
        if (description) {
            metaDescription.setAttribute('content', description);
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
        
        // Определяем тип страницы
        const pageType = this.detectPageType();
        console.log(`📄 Тип страницы: ${pageType}`);
        
        // Вызываем специфичные для страницы функции обновления
        switch (pageType) {
            case 'home':
                this.updateHomePage(main);
                break;
            case 'about':
                this.updateAboutPage(main);
                break;
            case 'author':
                this.updateAuthorPage(main);
                break;
            case 'contacts':
                this.updateContactsPage(main);
                break;
            case 'order-status':
                this.updateOrderStatusPage(main);
                break;
            case 'thanks':
                this.updateThanksPage(main);
                break;
        }
        
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
    
    // Обновляет главную страницу
    updateHomePage(main) {
        console.log('🏠 Обновляем главную страницу...');
        
        // Обновляем заголовок
        const title = main.querySelector('.hero-title');
        if (title) {
            title.textContent = this.getTranslation('home.title');
            console.log(`✅ Заголовок обновлен: "${this.getTranslation('home.title')}"`);
        }
        
        // Обновляем подзаголовок
        const subtitle = main.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.textContent = this.getTranslation('home.subtitle');
            console.log(`✅ Подзаголовок обновлен: "${this.getTranslation('home.subtitle')}"`);
        }
        
        // Обновляем описание
        const description = main.querySelector('.hero-description');
        if (description) {
            description.textContent = this.getTranslation('home.description');
            console.log(`✅ Описание обновлено: "${this.getTranslation('home.description')}"`);
        }
        
        // Обновляем кнопки
        const orderButton = main.querySelector('.cta-button.primary');
        if (orderButton) {
            orderButton.textContent = this.getTranslation('home.orderButton');
            console.log(`✅ Кнопка заказа обновлена: "${this.getTranslation('home.orderButton')}"`);
        }
        
        const learnMoreButton = main.querySelector('.cta-button.secondary');
        if (learnMoreButton) {
            learnMoreButton.textContent = this.getTranslation('home.learnMore');
            console.log(`✅ Кнопка "Узнать больше" обновлена: "${this.getTranslation('home.learnMore')}"`);
        }
        
        // Обновляем цену
        const price = main.querySelector('.price');
        if (price) {
            price.textContent = this.getTranslation('home.price');
            console.log(`✅ Цена обновлена: "${this.getTranslation('home.price')}"`);
        }
        
        const priceNote = main.querySelector('.price-note');
        if (priceNote) {
            priceNote.textContent = this.getTranslation('home.priceNote');
            console.log(`✅ Примечание о цене обновлено: "${this.getTranslation('home.priceNote')}"`);
        }
        
        // Обновляем особенности
        const features = main.querySelectorAll('.feature span:last-child');
        if (features.length >= 3) {
            features[0].textContent = this.getTranslation('home.features.fullText');
            features[1].textContent = this.getTranslation('home.features.illustrations');
            features[2].textContent = this.getTranslation('home.features.license');
            console.log(`✅ Особенности обновлены`);
        }
        
        console.log('✅ Главная страница обновлена');
    }
    
    // Обновляет страницу "О книге"
    updateAboutPage(main) {
        console.log('📚 Обновляем страницу "О книге"...');
        
        // Обновляем заголовки секций
        const sectionTitles = main.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            if (title.textContent.includes('О книге')) {
                title.textContent = this.getTranslation('about.title');
            } else if (title.textContent.includes('История создания')) {
                title.textContent = this.getTranslation('about.history');
            } else if (title.textContent.includes('Детали издания')) {
                title.textContent = this.getTranslation('about.publicationDetails');
            } else if (title.textContent.includes('Полное содержание')) {
                title.textContent = this.getTranslation('about.fullContents');
            } else if (title.textContent.includes('Почему именно это издание')) {
                title.textContent = this.getTranslation('about.whyThisEdition');
            }
        });
        
        // Обновляем подзаголовок
        const subtitle = main.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.textContent = this.getTranslation('about.subtitle');
        }
        
        // Обновляем описание
        const description = main.querySelector('.about-description');
        if (description) {
            description.innerHTML = description.innerHTML.replace(
                /Это <strong>точный репринт оригинального издания 1972 года<\/strong>/,
                `Это <strong>${this.getTranslation('about.description').split('Это ')[1].split(' ')[0]} точный репринт оригинального издания 1972 года</strong>`
            );
        }
        
        // Обновляем заголовок "Что включает полное издание"
        const whatIncludes = main.querySelector('.book-details h3');
        if (whatIncludes) {
            whatIncludes.textContent = this.getTranslation('about.whatIncludes');
        }
        
        // Обновляем список особенностей
        const featuresList = main.querySelectorAll('.features-list li');
        if (featuresList.length >= 8) {
            featuresList.forEach((item, index) => {
                if (index < 8) {
                    item.innerHTML = `✅ <strong>${this.getTranslation(`about.features.${index}`)}</strong>`;
                }
            });
        }
        
        // Обновляем академическое признание
        const academicTitle = main.querySelector('.academic-endorsement h3');
        if (academicTitle) {
            academicTitle.textContent = this.getTranslation('about.academicRecognition');
        }
        
        const academicQuote = main.querySelector('.academic-endorsement blockquote p');
        if (academicQuote) {
            academicQuote.textContent = this.getTranslation('about.academicQuote');
        }
        
        const academicCite = main.querySelector('.academic-endorsement cite');
        if (academicCite) {
            academicCite.innerHTML = `${this.getTranslation('about.academicCite')}<br>${this.getTranslation('about.academicDepartment')}<br>${this.getTranslation('about.academicUniversity')}`;
        }
        
        console.log('✅ Страница "О книге" обновлена');
    }
    
    // Обновляет страницу "Об авторе"
    updateAuthorPage(main) {
        console.log('👤 Обновляем страницу "Об авторе"...');
        
        // Обновляем заголовки секций
        const sectionTitles = main.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            if (title.textContent.includes('Об авторе')) {
                title.textContent = this.getTranslation('author.title');
            } else if (title.textContent.includes('Ранние годы и образование')) {
                title.textContent = this.getTranslation('author.earlyLife');
            } else if (title.textContent.includes('Миссия на Западе')) {
                title.textContent = this.getTranslation('author.missionWest');
            } else if (title.textContent.includes('Литературное наследие')) {
                title.textContent = this.getTranslation('author.literaryHeritage');
            } else if (title.textContent.includes('Философия и учения')) {
                title.textContent = this.getTranslation('author.philosophy');
            } else if (title.textContent.includes('Наследие')) {
                title.textContent = this.getTranslation('author.legacy');
            }
        });
        
        // Обновляем подзаголовок
        const subtitle = main.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.textContent = this.getTranslation('author.subtitle');
        }
        
        // Обновляем имя автора
        const authorName = main.querySelector('.author-text h2');
        if (authorName) {
            authorName.textContent = this.getTranslation('author.name');
        }
        
        // Обновляем описание автора
        const authorDescription = main.querySelector('.author-description');
        if (authorDescription) {
            authorDescription.textContent = this.getTranslation('author.description');
        }
        
        // Обновляем заголовок достижений
        const achievementsTitle = main.querySelector('.author-achievements h3');
        if (achievementsTitle) {
            achievementsTitle.textContent = this.getTranslation('author.keyAchievements');
        }
        
        // Обновляем список достижений
        const achievementsList = main.querySelectorAll('.achievements-list li');
        if (achievementsList.length >= 6) {
            achievementsList.forEach((item, index) => {
                if (index < 6) {
                    item.innerHTML = item.innerHTML.replace(/^[🎯🌍📖🎓🚢📚]\s*/, '');
                    item.innerHTML = `${item.innerHTML.split(' ')[0]} <strong>${this.getTranslation(`author.achievements.${index}`)}</strong>`;
                }
            });
        }
        
        console.log('✅ Страница "Об авторе" обновлена');
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
        
        // Ключевые слова для главной страницы
        map['оригинальное издание'] = 'home.subtitle';
        map['макмиллан'] = 'home.subtitle';
        map['полный текст'] = 'home.features.fullText';
        map['иллюстрации'] = 'home.features.illustrations';
        map['лицензия'] = 'home.features.license';
        map['доставка'] = 'home.priceNote';
        
        // Ключевые слова для страницы "О книге"
        map['история создания'] = 'about.history';
        map['детали издания'] = 'about.publicationDetails';
        map['полное содержание'] = 'about.fullContents';
        map['почему именно это издание'] = 'about.whyThisEdition';
        map['академическое признание'] = 'about.academicRecognition';
        map['санскритский текст'] = 'about.features.0';
        map['транслитерация'] = 'about.features.1';
        map['английские эквиваленты'] = 'about.features.2';
        map['перевод'] = 'about.features.3';
        map['комментарии'] = 'about.features.4';
        map['цветные иллюстрации'] = 'about.features.5';
        map['индексы'] = 'about.features.6';
        map['глоссарий'] = 'about.features.7';
        
        // Ключевые слова для страницы "Об авторе"
        map['ранние годы'] = 'author.earlyLife';
        map['миссия на западе'] = 'author.missionWest';
        map['литературное наследие'] = 'author.literaryHeritage';
        map['философия и учения'] = 'author.philosophy';
        map['наследие'] = 'author.legacy';
        map['детство и юность'] = 'author.childhood';
        map['встреча с духовным учителем'] = 'author.meetingGuru';
        map['принятие отречения'] = 'author.renunciation';
        map['путешествие в америку'] = 'author.journeyAmerica';
        map['основание iskcon'] = 'author.foundingIskcon';
        map['издательская деятельность'] = 'author.publishing';
        map['основные труды'] = 'author.mainWorks';
        map['особенности переводов'] = 'author.translationFeatures';
        map['основные принципы'] = 'author.mainPrinciples';
        map['сознание кришны'] = 'author.krishnaConsciousness';
        map['бхакти-йога'] = 'author.bhaktiYoga';
        map['ведическое знание'] = 'author.vedicKnowledge';
        map['универсальность'] = 'author.universality';
        map['влияние на западную культуру'] = 'author.westernInfluence';
        map['влияние на современный мир'] = 'author.modernInfluence';
        map['признание академическим сообществом'] = 'author.academicRecognition';
        map['продолжение миссии'] = 'author.continuingMission';
        
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
            switchBtn.setAttribute('aria-label', this.currentLang === 'ru' ? 'Switch to English' : 'Переключить на русский');

            // Убираем inline-обработчик и навешиваем актуальный
            try { switchBtn.removeAttribute('onclick'); } catch (e) {}
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
        // Пытаемся получить язык из URL ?lang=xx
        const urlLang = this.getLangFromUrl();
        
        // Получаем сохраненный язык из localStorage или из атрибута html
        const savedLang = urlLang || localStorage.getItem('selectedLanguage') || (document.documentElement.getAttribute('lang') || 'ru');
        
        this.setLanguage(savedLang);
    }

    // Вспомогательное: получить язык из параметра URL
    getLangFromUrl() {
        try {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang');
            if (lang && this.translations[lang]) return lang;
        } catch (e) {}
        return null;
    }

    // Вспомогательное: проставить текущий язык во все внутренние ссылки
    updateLinksWithLang() {
        const currentLang = this.currentLang;
        const anchors = document.querySelectorAll('a[href]');
        anchors.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('sms:') || href.startsWith('#')) return;
            try {
                const url = new URL(href, window.location.origin);
                url.searchParams.set('lang', currentLang);
                link.setAttribute('href', url.pathname + url.search + url.hash);
            } catch (e) {
                // Простая обработка относительных ссылок
                if (href.includes('.html') || href === '/' || href === 'index.html') {
                    if (href.includes('?')) {
                        const [path, query] = href.split('?');
                        const params = new URLSearchParams(query);
                        params.set('lang', currentLang);
                        link.setAttribute('href', path + '?' + params.toString());
                    } else {
                        link.setAttribute('href', href + '?lang=' + currentLang);
                    }
                }
            }
        });
    }

    // Специфичное обновление страницы "Купить/Заказать" (contacts.html)
    updateContactsPage(main) {
        // Hero блок
        const title = main.querySelector('.order-title');
        if (title) title.textContent = this.getTranslation('contacts.title', title.textContent);
        
        const subtitle = main.querySelector('.order-subtitle');
        if (subtitle) subtitle.textContent = this.getTranslation('about.subtitle', subtitle.textContent);
        
        const price = main.querySelector('.price');
        if (price) price.textContent = this.getTranslation('home.price', price.textContent);
        
        const delivery = main.querySelector('.delivery');
        if (delivery) delivery.textContent = this.getTranslation('home.priceNote', delivery.textContent);
        
        const availability = main.querySelector('.availability');
        if (availability) availability.textContent = this.getTranslation('contacts.availability', availability.textContent);
        
        // Breadcrumbs
        const bcHome = document.querySelector('.breadcrumbs a[href="index.html"]');
        if (bcHome) bcHome.textContent = this.getTranslation('nav.home', bcHome.textContent);
        const bcCurrent = document.querySelector('.breadcrumbs span:last-child');
        if (bcCurrent) bcCurrent.textContent = this.getTranslation('contacts.title', bcCurrent.textContent);
        
        // Заголовки секций формы
        const contactHeader = main.querySelector('.order-form-section h2');
        if (contactHeader) contactHeader.textContent = this.getTranslation('contacts.contactDetails', contactHeader.textContent);
        const formDesc = main.querySelector('.order-form-section .form-description');
        if (formDesc) formDesc.textContent = this.getTranslation('contacts.formDescription', formDesc.textContent);
        
        const sectionTitles = main.querySelectorAll('.order-form-section .form-section-title');
        if (sectionTitles[0]) sectionTitles[0].textContent = this.getTranslation('contacts.personalData', sectionTitles[0].textContent);
        if (sectionTitles[1]) sectionTitles[1].textContent = this.getTranslation('contacts.deliveryAddress', sectionTitles[1].textContent);
        if (sectionTitles[2]) sectionTitles[2].textContent = this.getTranslation('contacts.orderDetails', sectionTitles[2].textContent);
        
        // Кнопки формы
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            const btnText = submitBtn.querySelector('.button-text');
            const btnLoading = submitBtn.querySelector('.button-loading');
            if (btnText) btnText.textContent = this.getTranslation('contacts.sendButton', btnText.textContent);
            if (btnLoading) btnLoading.textContent = this.getTranslation('contacts.sending', btnLoading.textContent);
        }
        
        // Селектор количества
        const quantitySelect = main.querySelector('#quantity');
        if (quantitySelect) {
            quantitySelect.querySelectorAll('option').forEach(opt => {
                if (opt.value === '') {
                    opt.textContent = this.currentLang === 'ru' ? 'Выберите количество' : 'Select quantity';
                } else if (opt.value === 'more') {
                    opt.textContent = this.currentLang === 'ru' ? 'Больше 5' : 'More than 5';
                } else {
                    const num = parseInt(opt.value, 10);
                    if (!isNaN(num)) {
                        const word = this.currentLang === 'ru' ? (num === 1 ? 'книга' : 'книги') : (num === 1 ? 'book' : 'books');
                        const priceSuffix = this.currentLang === 'ru' ? ` - ${num * 1500} ₽` : ` - ${num * 1500} RUB`;
                        opt.textContent = `${num} ${word}${priceSuffix}`;
                    }
                }
            });
        }
        
        // Способ доставки
        const deliveryMethod = main.querySelector('#deliveryMethod');
        if (deliveryMethod) {
            deliveryMethod.querySelectorAll('option').forEach(opt => {
                if (opt.value === '') {
                    opt.textContent = this.currentLang === 'ru' ? 'Выберите способ доставки' : 'Select delivery method';
                }
                if (opt.value === 'post') opt.textContent = this.currentLang === 'ru' ? 'Почта России - 300 ₽' : 'Russian Post - 300 RUB';
                if (opt.value === 'courier') opt.textContent = this.currentLang === 'ru' ? 'Курьерская доставка - 500 ₽' : 'Courier delivery - 500 RUB';
                if (opt.value === 'pickup') opt.textContent = this.currentLang === 'ru' ? 'Самовывоз - 0 ₽' : 'Pickup - 0 RUB';
            });
        }
        
        // Сводка заказа
        const orderSummaryHeader = main.querySelector('.order-summary h3');
        if (orderSummaryHeader) orderSummaryHeader.textContent = this.getTranslation('contacts.orderSummary', orderSummaryHeader.textContent);
    }

    // Специфичное обновление страницы статуса заказа
    updateOrderStatusPage(main) {
        const title = main.querySelector('.section-title');
        if (title) title.textContent = this.getTranslation('orderStatus.title', title.textContent);
        const p = main.querySelector('p');
        if (p) p.textContent = this.getTranslation('orderStatus.description', p.textContent);
        const label = main.querySelector('label[for="orderNumber"]');
        if (label) label.textContent = this.getTranslation('orderStatus.orderNumber', label.textContent) + ':';
        const input = main.querySelector('#orderNumber');
        if (input) input.setAttribute('placeholder', this.currentLang === 'ru' ? 'Введите номер заказа' : 'Enter your order number');
        const btn = main.querySelector('button[type="submit"]');
        if (btn) btn.textContent = this.getTranslation('orderStatus.checkButton', btn.textContent);
    }

    // Специфичное обновление страницы благодарности
    updateThanksPage(main) {
        const title = main.querySelector('.section-title');
        if (title) title.textContent = this.getTranslation('thanks.title', title.textContent);
        const msg = main.querySelector('.thanks-message');
        if (msg) msg.textContent = this.getTranslation('thanks.description', msg.textContent);
        const backBtn = main.querySelector('.cta-button.primary');
        if (backBtn) backBtn.textContent = this.getTranslation('thanks.backToHome', backBtn.textContent);
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
