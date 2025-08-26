/**
 * Поддерживаемые языки
 */
export type SupportedLanguage = 'ru' | 'en';
/**
 * Интерфейс для перевода
 */
export interface Translation {
    [key: string]: {
        ru: string;
        en: string;
    };
}
/**
 * Менеджер языков для приложения
 */
export declare class LanguageManager {
    private currentLanguage;
    private translations;
    private languageChangeCallbacks;
    constructor(translations: Translation, defaultLanguage?: SupportedLanguage);
    /**
     * Получить сохраненный язык из localStorage
     */
    private getStoredLanguage;
    /**
     * Сохранить язык в localStorage
     */
    private storeLanguage;
    /**
     * Получить текущий язык
     */
    getCurrentLanguage(): SupportedLanguage;
    /**
     * Изменить язык
     */
    changeLanguage(language: SupportedLanguage): void;
    /**
     * Переключить на следующий язык
     */
    toggleLanguage(): void;
    /**
     * Применить язык к DOM
     */
    private applyLanguage;
    /**
     * Получить перевод по ключу
     */
    translate(key: string): string;
    /**
     * Получить перевод для конкретного языка
     */
    translateForLanguage(key: string, language: SupportedLanguage): string;
    /**
     * Подписаться на изменение языка
     */
    onLanguageChange(callback: (language: SupportedLanguage) => void): void;
    /**
     * Отписаться от изменения языка
     */
    offLanguageChange(callback: (language: SupportedLanguage) => void): void;
    /**
     * Уведомить о изменении языка
     */
    private notifyLanguageChange;
    /**
     * Создать кнопку переключения языка
     */
    createLanguageToggleButton(container: HTMLElement): HTMLButtonElement;
    /**
     * Обновить переводы
     */
    updateTranslations(newTranslations: Translation): void;
    /**
     * Получить все доступные переводы
     */
    getTranslations(): Translation;
    /**
     * Проверить поддержку языка
     */
    isLanguageSupported(language: string): language is SupportedLanguage;
    /**
     * Получить список поддерживаемых языков
     */
    getSupportedLanguages(): SupportedLanguage[];
}
//# sourceMappingURL=LanguageManager.d.ts.map