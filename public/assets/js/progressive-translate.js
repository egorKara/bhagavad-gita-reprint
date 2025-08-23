(function() {
    const API_BASE = '/api/translate';
    const SELECTED_LANG_KEY = 'selectedLanguage';
    const PREWARM_KEY_PREFIX = 'prewarm:';

    function getCurrentLang() {
        return (document.documentElement.getAttribute('lang') || localStorage.getItem(SELECTED_LANG_KEY) || 'ru').toLowerCase();
    }

    function getBaseLang() {
        return (window.TranslationConfig && window.TranslationConfig.baseLang) ? window.TranslationConfig.baseLang : 'en';
    }

    function allowTranslateToBase() {
        return !!(window.TranslationConfig && window.TranslationConfig.allowTranslateToBase);
    }

    function getSourceLangForTarget(target) {
        // Heuristic: if page target is en, assume source ru, and vice versa
        return target === 'en' ? 'ru' : 'en';
    }

    function isCyrillic(text) {
        return /[\u0400-\u04FF]/.test(text); // Cyrillic block
    }

    function isLatin(text) {
        return /[A-Za-z]/.test(text);
    }

    function shouldTranslateText(text, targetLang) {
        if (!text) return false;
        const clean = text.trim();
        if (!clean) return false;
        // Avoid translating numbers, icons, or pure punctuation
        if (/^[\p{P}\p{S}\s0-9]+$/u.test(clean)) return false;
        const base = getBaseLang();
        if (targetLang === base && !allowTranslateToBase()) {
            return false;
        }
        // Heuristics by target
        if (targetLang === 'en') {
            // English is the base; we do not translate into English
            return false;
        } else if (targetLang === 'ru') {
            return isLatin(clean);
        }
        return true;
    }

    async function applyImmediateResults(groups, results) {
        const map = new Map(results.map(r => [r.text, r.translation]));
        for (const [text, targets] of groups.entries()) {
            const tr = map.get(text);
            if (tr) {
                targets.forEach(unit => {
                    if (unit.apply && window.TranslationAnimation && window.TranslationAnimation.dustSwap && unit.node) {
                        try { window.TranslationAnimation.dustSwap(unit, tr); } catch(_) { unit.apply(tr); }
                    } else {
                        unit.apply(tr);
                    }
                });
            }
        }
    }

    async function pollJobAndApply(jobId, groups, intervalMs = 1200, timeoutMs = 60000) {
        const start = Date.now();
        let lastDone = 0;
        while (Date.now() - start < timeoutMs) {
            try {
                const status = await getJSON(`${API_BASE}/status/${jobId}`);
                const doneItems = status.items.filter(it => it.status === 'done' && it.translation);
                if (doneItems.length > lastDone) {
                    await applyImmediateResults(groups, doneItems.map(it => ({ text: it.text, translation: it.translation })));
                    lastDone = doneItems.length;
                }
                if (status.status === 'completed') break;
            } catch (_) {}
            await new Promise(r => setTimeout(r, intervalMs));
        }
    }

    async function progressiveTranslateCurrentPage(targetLang) {
        const base = getBaseLang();
        const sourceLang = getSourceLangForTarget(targetLang);
        if (targetLang === base && !allowTranslateToBase()) {
            return;
        }
        // Pass 1: visible content
        const { unique: visItems, groups: visGroups } = collectTextUnits(document, targetLang, true);
        if (visItems.length > 0) {
            const payload = { sourceLang, targetLang, items: visItems.map(u => ({ text: u.text, url: location.pathname })) };
            try {
                const out = await postJSON(`${API_BASE}/batch`, payload);
                if (Array.isArray(out.results) && out.results.length) {
                    await applyImmediateResults(visGroups, out.results);
                }
                if (out.jobId) {
                    // Poll but do not block
                    pollJobAndApply(out.jobId, visGroups).catch(() => {});
                }
            } catch (e) {
                console.warn('Visible translate failed:', e);
            }
        }
        // Pass 2: rest of page (non-visible)
        const { unique: restItems, groups: restGroups } = collectTextUnits(document, targetLang, false);
        const filteredRest = restItems.filter(it => !visGroups.has(it.text));
        if (filteredRest.length > 0) {
            const payload2 = { sourceLang, targetLang, items: filteredRest.map(u => ({ text: u.text, url: location.pathname })) };
            try {
                const out2 = await postJSON(`${API_BASE}/batch`, payload2);
                if (Array.isArray(out2.results) && out2.results.length) {
                    await applyImmediateResults(restGroups, out2.results);
                }
                if (out2.jobId) pollJobAndApply(out2.jobId, restGroups).catch(() => {});
            } catch (e) {
                console.warn('Background page translate failed:', e);
            }
        }
        // Pass 3: site-wide prewarm (once per target per session)
        const prewarmKey = PREWARM_KEY_PREFIX + targetLang;
        if (!localStorage.getItem(prewarmKey)) {
            localStorage.setItem(prewarmKey, String(Date.now()));
            postJSON(`${API_BASE}/prewarm`, {}).catch(() => {});
        }
    }

    function observeNewContent(targetLang) {
        const sourceLang = getSourceLangForTarget(targetLang);
        const observer = new MutationObserver((mutations) => {
            const batch = [];
            mutations.forEach(m => {
                m.addedNodes && m.addedNodes.forEach(node => {
                    if (!(node instanceof HTMLElement)) return;
                    const { unique } = collectTextUnits(node, targetLang, false);
                    unique.forEach(u => batch.push(u.text));
                });
            });
            const uniq = Array.from(new Set(batch));
            if (uniq.length) {
                const items = uniq.map(t => ({ text: t, url: location.pathname }));
                postJSON(`${API_BASE}/batch`, { sourceLang, targetLang, items }).catch(() => {});
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function injectFeedbackUI() {
        if (document.querySelector('.translation-feedback-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'translation-feedback-btn';
        btn.textContent = '⚑';
        btn.title = 'Сообщить об ошибке перевода';
        // Применяем CSS переменные и унифицированный стиль
        btn.className = 'translation-feedback-btn control-btn control-btn--feedback';
        Object.assign(btn.style, {
            position: 'fixed', 
            top: '20px', 
            right: '160px', 
            zIndex: '9998',
            width: '56px', 
            height: '56px', 
            borderRadius: '50%',
            background: 'var(--color-accent)', 
            color: 'var(--color-text)',
            border: '2px solid var(--color-primary)', 
            cursor: 'pointer',
            boxShadow: 'var(--shadow)', 
            fontSize: '18px',
            fontWeight: '600',
            transition: 'var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'inherit'
        });
        btn.addEventListener('click', openFeedbackModal);
        document.body.appendChild(btn);
    }

    function openFeedbackModal() {
        const sel = window.getSelection();
        const selectedText = sel && sel.toString ? sel.toString().trim() : '';
        const overlay = document.createElement('div');
        overlay.className = 'translation-feedback-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.4)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: '#fff', padding: '16px', borderRadius: '8px', width: 'min(520px, 92vw)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', fontFamily: 'sans-serif'
        });
        modal.innerHTML = (
            '<h3 style="margin:0 0 8px 0;">Сообщить об ошибке перевода</h3>'+
            '<label style="display:block;margin:8px 0 4px;">Исходный текст</label>'+
            `<textarea id="fb-src" style="width:100%;height:60px;">${selectedText}</textarea>`+
            '<label style="display:block;margin:8px 0 4px;">Правильный перевод</label>'+
            '<textarea id="fb-corr" style="width:100%;height:60px;"></textarea>'+
            '<label style="display:block;margin:8px 0 4px;">Комментарий</label>'+
            '<input id="fb-reason" style="width:100%;" placeholder="например: термин переведен неверно">'+
            '<div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">'+
            '<button id="fb-cancel">Отмена</button>'+
            '<button id="fb-send" style="background:#8B4513;color:#fff;border:none;padding:6px 12px;border-radius:4px;">Отправить</button>'+
            '</div>'
        );
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        modal.querySelector('#fb-cancel').onclick = () => overlay.remove();
        modal.querySelector('#fb-send').onclick = async () => {
            const text = modal.querySelector('#fb-src').value.trim();
            const corrected = modal.querySelector('#fb-corr').value.trim();
            const reason = modal.querySelector('#fb-reason').value.trim();
            const targetLang = getCurrentLang();
            const sourceLang = getSourceLangForTarget(targetLang);
            if (!text) return overlay.remove();
            try {
                await postJSON(`${API_BASE}/feedback`, { sourceLang, targetLang, text, corrected, reason, url: location.pathname });
            } catch (_) {}
            overlay.remove();
        };
    }

    function runOrchestrator() {
        const targetLang = getCurrentLang();
        progressiveTranslateCurrentPage(targetLang).catch(() => {});
        observeNewContent(targetLang);
        injectFeedbackUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOrchestrator);
    } else {
        runOrchestrator();
    }

    document.addEventListener('languageChanged', runOrchestrator);
})();