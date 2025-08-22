const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const queue = require('../../services/translationQueue');

function extractTextsFromHtml(html) {
    const $ = cheerio.load(html);
    const texts = new Set();
    $('body *').each((_, el) => {
        const node = $(el);
        if (['script', 'style', 'noscript'].includes(el.tagName)) return;
        const text = node
            .contents()
            .filter(function () {
                return this.type === 'text';
            })
            .text()
            .trim();
        if (text && text.length > 0) {
            // Split by newlines to reduce length
            text.split('\n')
                .map((t) => t.trim())
                .filter(Boolean)
                .forEach((t) => texts.add(t));
        }
        // Attributes that may need translation
        const attrs = ['alt', 'title', 'placeholder', 'aria-label', 'value'];
        attrs.forEach((attr) => {
            const val = node.attr(attr);
            if (val && val.trim()) texts.add(val.trim());
        });
    });
    return Array.from(texts);
}

exports.batchTranslate = async (req, res) => {
    const { sourceLang, targetLang, items } = req.body || {};
    if (!Array.isArray(items) || !sourceLang || !targetLang) {
        return res.status(400).json({ error: 'sourceLang, targetLang and items[] are required' });
    }
    try {
        const result = await queue.batchTranslate(items, sourceLang, targetLang);
        return res.json(result);
    } catch (err) {
        console.error('batchTranslate error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
};

exports.jobStatus = async (req, res) => {
    const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ error: 'jobId required' });
    const job = queue.getJob(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    return res.json(job);
};

exports.submitFeedback = async (req, res) => {
    const { sourceLang, targetLang, text, corrected, url, selector, reason } = req.body || {};
    if (!text || !targetLang || !sourceLang)
        return res.status(400).json({ error: 'sourceLang, targetLang, text required' });
    try {
        const id = queue.submitFeedback({
            sourceLang,
            targetLang,
            text,
            corrected,
            url,
            selector,
            reason,
        });
        return res.json({ id, ok: true });
    } catch (err) {
        console.error('submitFeedback error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
};

exports.prewarmSite = async (_req, res) => {
    try {
        const publicDir = path.join(__dirname, '..', '..', '..', 'public');
        const files = fs.readdirSync(publicDir).filter((f) => f.endsWith('.html'));
        const items = [];
        for (const file of files) {
            const full = path.join(publicDir, file);
            const html = fs.readFileSync(full, 'utf-8');
            const texts = extractTextsFromHtml(html);
            texts.forEach((t) => items.push({ text: t, url: `/${file}` }));
        }
        const ruToEn = await queue.batchTranslate(items, 'ru', 'en');
        return res.json({ queued: ruToEn.queuedCount, jobId: ruToEn.jobId });
    } catch (err) {
        console.error('prewarmSite error:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
};
