/**
 * Менеджер языков для приложения
 */
export class LanguageManager {
    constructor(translations, defaultLanguage = 'ru') {
        this.languageChangeCallbacks = [];
        this.translations = translations;
        this.currentLanguage = this.getStoredLanguage() || defaultLanguage;
        this.applyLanguage(this.currentLanguage);
    }
    /**
     * Получить сохраненный язык из localStorage
     */
    getStoredLanguage() {
        try {
            const stored = localStorage.getItem('gita-landing-language');
            return stored === 'ru' || stored === 'en' ? stored : null;
        }
        catch {
            return null;
        }
    }
    /**
     * Сохранить язык в localStorage
     */
    storeLanguage(language) {
        try {
            localStorage.setItem('gita-landing-language', language);
        }
        catch (error) {
            console.warn('Не удалось сохранить язык в localStorage:', error);
        }
    }
    /**
     * Получить текущий язык
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    /**
     * Изменить язык
     */
    changeLanguage(language) {
        if (language === this.currentLanguage) {
            return;
        }
        this.currentLanguage = language;
        this.storeLanguage(language);
        this.applyLanguage(language);
        this.notifyLanguageChange(language);
    }
    /**
     * Переключить на следующий язык
     */
    toggleLanguage() {
        const nextLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
        this.changeLanguage(nextLanguage);
    }
    /**
     * Применить язык к DOM
     */
    applyLanguage(language) {
        // Обновляем атрибут lang у html элемента
        document.documentElement.lang = language;
        // Обновляем все элементы с data-translate атрибутом
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (key && this.translations[key]) {
                element.textContent = this.translations[key][language];
            }
        });
        // Обновляем все элементы с data-translate-placeholder атрибутом
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (key && this.translations[key] && element instanceof HTMLInputElement) {
                element.placeholder = this.translations[key][language];
            }
        });
        // Обновляем title страницы
        const titleKey = 'page_title';
        if (this.translations[titleKey]) {
            document.title = this.translations[titleKey][language];
        }
    }
    /**
     * Получить перевод по ключу
     */
    translate(key) {
        if (this.translations[key]) {
            return this.translations[key][this.currentLanguage];
        }
        console.warn(`Перевод не найден для ключа: ${key}`);
        return key;
    }
    /**
     * Получить перевод для конкретного языка
     */
    translateForLanguage(key, language) {
        if (this.translations[key]) {
            return this.translations[key][language];
        }
        return key;
    }
    /**
     * Подписаться на изменение языка
     */
    onLanguageChange(callback) {
        this.languageChangeCallbacks.push(callback);
    }
    /**
     * Отписаться от изменения языка
     */
    offLanguageChange(callback) {
        const index = this.languageChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.languageChangeCallbacks.splice(index, 1);
        }
    }
    /**
     * Уведомить о изменении языка
     */
    notifyLanguageChange(language) {
        this.languageChangeCallbacks.forEach(callback => {
            try {
                callback(language);
            }
            catch (error) {
                console.error('Ошибка в callback изменения языка:', error);
            }
        });
    }
    /**
     * Создать кнопку переключения языка
     */
    createLanguageToggleButton(container) {
        const button = document.createElement('button');
        button.className = 'language-toggle-button';
        button.setAttribute('data-translate', 'language_switch');
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            padding: 10px 15px;
            border: 2px solid #3498db;
            border-radius: 25px;
            background: white;
            color: #3498db;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
        `;
        button.addEventListener('mouseenter', () => {
            button.style.background = '#3498db';
            button.style.color = 'white';
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = 'white';
            button.style.color = '#3498db';
            button.style.transform = 'scale(1)';
        });
        button.addEventListener('click', () => {
            this.toggleLanguage();
        });
        // Устанавливаем начальный текст
        button.textContent = this.translate('language_switch');
        container.appendChild(button);
        return button;
    }
    /**
     * Обновить переводы
     */
    updateTranslations(newTranslations) {
        this.translations = { ...this.translations, ...newTranslations };
        this.applyLanguage(this.currentLanguage);
    }
    /**
     * Получить все доступные переводы
     */
    getTranslations() {
        return { ...this.translations };
    }
    /**
     * Проверить поддержку языка
     */
    isLanguageSupported(language) {
        return language === 'ru' || language === 'en';
    }
    /**
     * Получить список поддерживаемых языков
     */
    getSupportedLanguages() {
        return ['ru', 'en'];
    }
}
//# sourceMappingURL=LanguageManager.js.map