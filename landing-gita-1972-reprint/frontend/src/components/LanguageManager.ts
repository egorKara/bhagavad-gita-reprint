export type SupportedLanguage = 'ru' | 'en';

export interface Translation {
    [key: string]: {
        ru: string;
        en: string;
    };
}

export class LanguageManager {
    private currentLanguage: SupportedLanguage;
    private translations: Translation;
    private languageChangeCallbacks: Array<(language: SupportedLanguage) => void> = [];

    constructor(translations: Translation, defaultLanguage: SupportedLanguage = 'ru') {
        this.translations = translations;
        this.currentLanguage = this.getStoredLanguage() || defaultLanguage;
        this.applyLanguage(this.currentLanguage);
    }

    private getStoredLanguage(): SupportedLanguage | null {
        try {
            const stored = localStorage.getItem('gita-landing-language');
            return stored === 'ru' || stored === 'en' ? stored : null;
        } catch {
            return null;
        }
    }

    private storeLanguage(language: SupportedLanguage): void {
        try {
            localStorage.setItem('gita-landing-language', language);
        } catch (error) {
            console.warn('Не удалось сохранить язык в localStorage:', error);
        }
    }

    public getCurrentLanguage(): SupportedLanguage {
        return this.currentLanguage;
    }

    public changeLanguage(language: SupportedLanguage): void {
        if (language === this.currentLanguage) return;
        this.currentLanguage = language;
        this.storeLanguage(language);
        this.applyLanguage(language);
        this.notifyLanguageChange(language);
    }

    public toggleLanguage(): void {
        const nextLanguage: SupportedLanguage = this.currentLanguage === 'ru' ? 'en' : 'ru';
        this.changeLanguage(nextLanguage);
    }

    private applyLanguage(language: SupportedLanguage): void {
        document.documentElement.lang = language;
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (key && this.translations[key]) {
                element.textContent = this.translations[key][language];
            }
        });
    }

    public translate(key: string): string {
        if (this.translations[key]) {
            return this.translations[key][this.currentLanguage];
        }
        return key;
    }

    public onLanguageChange(callback: (language: SupportedLanguage) => void): void {
        this.languageChangeCallbacks.push(callback);
    }

    private notifyLanguageChange(language: SupportedLanguage): void {
        this.languageChangeCallbacks.forEach(callback => {
            try {
                callback(language);
            } catch (error) {
                console.error('Ошибка в callback изменения языка:', error);
            }
        });
    }

    public createLanguageToggleButton(container: HTMLElement): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = 'language-toggle-button';
        button.setAttribute('data-translate', 'language_switch');
        button.textContent = this.translate('language_switch');
        button.addEventListener('click', () => this.toggleLanguage());
        container.appendChild(button);
        return button;
    }
}
