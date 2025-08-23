const fetch = global.fetch || require('node-fetch');
const logger = require('../utils/logger');
const { translator } = require('../config');

class TranslatorProvider {
    constructor() {
        this.provider = translator.provider;
        this.apiKey = translator.apiKey;
        this.endpoint = translator.endpoint;
    }

    async translateText(text, sourceLang, targetLang, context = null) {
        if (!text || text.trim().length === 0) return null;
        if (sourceLang === targetLang) return text;

        try {
            switch ((this.provider || 'none').toLowerCase()) {
                case 'none':
                case 'offline':
                    return null;
                case 'echo':
                    return `[${targetLang}] ${text}`;
                case 'deepl':
                    return await this.translateWithDeepL(text, sourceLang, targetLang);
                case 'google':
                    return await this.translateWithGoogle(text, sourceLang, targetLang);
                case 'yandex':
                    return await this.translateWithYandex(text, sourceLang, targetLang);
                case 'custom':
                    return await this.translateWithCustomEndpoint(
                        text,
                        sourceLang,
                        targetLang,
                        context
                    );
                default:
                    return null;
            }
        } catch (err) {
            logger.error('Translator provider error', { error: String(err) });
            return null;
        }
    }

    async translateWithDeepL(text, sourceLang, targetLang) {
        if (!this.apiKey) return null;
        const res = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                Authorization: `DeepL-Auth-Key ${this.apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                text,
                target_lang: targetLang.toUpperCase(),
                source_lang: sourceLang.toUpperCase(),
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.translations?.[0]?.text || null;
    }

    async translateWithGoogle(text, sourceLang, targetLang) {
        if (!this.apiKey) return null;
        const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: [text],
                source: sourceLang,
                target: targetLang,
                format: 'text',
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data?.translations?.[0]?.translatedText || null;
    }

    async translateWithYandex(text, sourceLang, targetLang) {
        if (!this.apiKey) return null;
        const res = await fetch('https://translate.api.cloud.yandex.net/translate/v2/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${this.apiKey}`,
            },
            body: JSON.stringify({
                sourceLanguageCode: sourceLang,
                targetLanguageCode: targetLang,
                texts: [text],
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.translations?.[0]?.text || null;
    }

    async translateWithCustomEndpoint(text, sourceLang, targetLang, context) {
        if (!this.endpoint) return null;
        const res = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
            },
            body: JSON.stringify({ text, sourceLang, targetLang, context }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.translation || null;
    }
}

module.exports = new TranslatorProvider();
