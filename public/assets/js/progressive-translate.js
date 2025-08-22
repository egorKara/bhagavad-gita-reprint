(function() {
    const API_BASE = '/api/translate';
    const SELECTED_LANG_KEY = 'selectedLanguage';
    const PREWARM_KEY_PREFIX = 'prewarm:';

    function getCurrentLang() {
        return (document.documentElement.getAttribute('lang') || localStorage.getItem(SELECTED_LANG_KEY) || 'ru').toLowerCase();
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
        // Heuristics by target
        if (targetLang === 'en') {
            // English is the base; we do not translate into English
            return false;
        } else if (targetLang === 'ru') {
            return isLatin(clean);
        }
        return true;
    }

    function collectTextUnits(root, targetLang, visibleOnly) {
        const items = [];
        const elements = root.querySelectorAll('*');
        const viewport = root === document ? { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight } : null;
        function isInViewport(el) {
            const r = el.getBoundingClientRect();
            return r.bottom >= 0 && r.right >= 0 && r.top <= (window.innerHeight || 0) && r.left <= (window.innerWidth || 0);
        }
        elements.forEach(el => {
            if (['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) return;
            // Respect notranslate/locks
            if (el.matches('[translate="no"], .notranslate, [data-i18n-lock]')) return;
            if (visibleOnly && !isInViewport(el)) return;
            // Text nodes
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue;
                    if (shouldTranslateText(text, targetLang)) {
                        items.push({ text: text.trim(), apply: (t) => node.nodeValue = t });
                    }
                }
            });
            // Attributes
            const attrs = ['alt','title','placeholder','aria-label','value'];
            attrs.forEach(attr => {
                const v = el.getAttribute && el.getAttribute(attr);
                if (v && shouldTranslateText(v, targetLang)) {
                    items.push({ text: v.trim(), apply: (t) => el.setAttribute(attr, t) });
                }
            });
        });
        // De-duplicate by text
        const seen = new Map();
        const unique = [];
        for (const it of items) {
            if (!seen.has(it.text)) {
                seen.set(it.text, [it]);
                unique.push(it);
            } else {
                seen.get(it.text).push(it);
            }
        }
        return { unique, groups: seen };
    }

    async function postJSON(url, body) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async function getJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }

    async function applyImmediateResults(groups, results) {
        const map = new Map(results.map(r => [r.text, r.translation]));
        for (const [text, targets] of groups.entries()) {
            const tr = map.get(text);
            if (tr) {
                targets.forEach(unit => unit.apply(tr));
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
        const sourceLang = getSourceLangForTarget(targetLang);
        if (targetLang === 'en') {
            // No translation needed when target is base English
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
        Object.assign(btn.style, {
            position: 'fixed', right: '80px', top: '20px', zIndex: 10000,
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#fff', border: '2px solid #8B4513', cursor: 'pointer'
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