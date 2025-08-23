const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const translatorProvider = require('./translatorProvider');
const logger = require('../utils/logger');

const { dataDir } = require('../config');
const DATA_DIR = dataDir;
const CACHE_FILE = path.join(DATA_DIR, 'translation-cache.json');
const JOBS_FILE = path.join(DATA_DIR, 'translation-jobs.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'translation-feedback.json');

function ensureDataFiles() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(CACHE_FILE)) fs.writeFileSync(CACHE_FILE, JSON.stringify({}), 'utf-8');
    if (!fs.existsSync(JOBS_FILE)) fs.writeFileSync(JOBS_FILE, JSON.stringify({}), 'utf-8');
    if (!fs.existsSync(FEEDBACK_FILE)) fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([]), 'utf-8');
}

function readJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
        return file === FEEDBACK_FILE ? [] : {};
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function textHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

class TranslationQueue {
    constructor() {
        ensureDataFiles();
        this.cache = readJSON(CACHE_FILE); // structure: { `${src}|${tgt}|${hash}`: { translation, userEdited, meta } }
        this.jobs = readJSON(JOBS_FILE); // structure: { jobId: { status, total, done, createdAt, items: [] } }
        this.feedback = readJSON(FEEDBACK_FILE);
        this.queue = [];
        this.processing = false;
        this.concurrency = 1;
    }

    getCacheKey(text, sourceLang, targetLang) {
        return `${sourceLang}|${targetLang}|${textHash(text)}`;
    }

    getCached(text, sourceLang, targetLang) {
        const key = this.getCacheKey(text, sourceLang, targetLang);
        const entry = this.cache[key];
        if (entry && entry.translation) {
            return {
                translation: entry.translation,
                fromCache: true,
                userEdited: !!entry.userEdited,
            };
        }
        return null;
    }

    setCache(text, sourceLang, targetLang, translation, meta = {}) {
        const key = this.getCacheKey(text, sourceLang, targetLang);
        this.cache[key] = { translation, userEdited: !!meta.userEdited, meta: { ...meta, text } };
        writeJSON(CACHE_FILE, this.cache);
    }

    createJob(pendingItems) {
        const jobId = crypto.randomUUID();
        this.jobs[jobId] = {
            status: 'queued',
            total: pendingItems.length,
            done: 0,
            createdAt: new Date().toISOString(),
            items: pendingItems.map((it) => ({ ...it, status: 'queued' })),
        };
        writeJSON(JOBS_FILE, this.jobs);
        return jobId;
    }

    getJob(jobId) {
        return this.jobs[jobId] || null;
    }

    async enqueue(items, sourceLang, targetLang, jobId = null) {
        const jid = jobId || this.createJob(items);
        items.forEach((it, idx) => {
            this.queue.push({
                jobId: jid,
                index: idx,
                text: it.text,
                context: it.context || null,
                url: it.url || null,
                sourceLang,
                targetLang,
            });
        });
        this.processNext();
        return jid;
    }

    async processNext() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            const job = this.jobs[task.jobId];
            if (!job) continue;

            try {
                const cached = this.getCached(task.text, task.sourceLang, task.targetLang);
                let translation = cached ? cached.translation : null;
                if (!translation) {
                    translation = await translatorProvider.translateText(
                        task.text,
                        task.sourceLang,
                        task.targetLang,
                        { url: task.url, context: task.context }
                    );
                }
                if (translation) {
                    this.setCache(task.text, task.sourceLang, task.targetLang, translation, {
                        userEdited: false,
                        url: task.url,
                        context: task.context,
                    });
                }
                job.items[task.index].status = 'done';
                job.items[task.index].translation = translation || null;
                job.done += 1;
                job.status = job.done >= job.total ? 'completed' : 'processing';
            } catch (err) {
                logger.error('Translation task failed', { error: String(err), text: task.text });
                job.items[task.index].status = 'error';
                job.items[task.index].error = String(err);
                job.status = 'processing';
            }
            writeJSON(JOBS_FILE, this.jobs);
        }

        this.processing = false;
    }

    async batchTranslate(requestItems, sourceLang, targetLang) {
        const immediateResults = [];
        const pending = [];

        for (const item of requestItems) {
            const text = (item.text || '').trim();
            if (!text) continue;
            const cached = this.getCached(text, sourceLang, targetLang);
            if (cached) {
                immediateResults.push({ text, translation: cached.translation, fromCache: true });
            } else {
                pending.push({ text, context: item.context || null, url: item.url || null });
            }
        }

        let jobId = null;
        if (pending.length > 0) {
            jobId = await this.enqueue(pending, sourceLang, targetLang);
        }

        return { jobId, results: immediateResults, queuedCount: pending.length };
    }

    submitFeedback({ sourceLang, targetLang, text, corrected, url, selector, reason }) {
        const record = {
            id: crypto.randomUUID(),
            sourceLang,
            targetLang,
            text,
            corrected,
            url: url || null,
            selector: selector || null,
            reason: reason || null,
            createdAt: new Date().toISOString(),
        };
        this.feedback.push(record);
        writeJSON(FEEDBACK_FILE, this.feedback);

        if (corrected && corrected.trim().length > 0) {
            this.setCache(text, sourceLang, targetLang, corrected, {
                userEdited: true,
                url,
                selector,
            });
        }
        logger.info('Translation feedback received', { id: record.id, url: record.url });
        return record.id;
    }
}

module.exports = new TranslationQueue();
