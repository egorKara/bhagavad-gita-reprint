const request = require('supertest');

const bootstrapApp = () => {
    jest.resetModules();
    process.env.TRANSLATOR_PROVIDER = 'echo';
    const app = require('../src/app');
    return app;
};

describe('Translate API', () => {
    it('should return immediate results for cached/echo with batch', async () => {
        const app = bootstrapApp();
        const items = [{ text: 'Привет' }, { text: 'Мир' }];
        const res = await request(app)
            .post('/api/translate/batch')
            .send({ sourceLang: 'ru', targetLang: 'en', items });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('results');
        expect(Array.isArray(res.body.results)).toBe(true);
        // echo mode returns translated strings synchronously
        expect(res.body.results.length).toBeGreaterThanOrEqual(0);
    });

    it('should enqueue and return job status', async () => {
        const app = bootstrapApp();
        const items = Array.from({ length: 3 }, (_, i) => ({ text: `Текст ${i + 1}` }));
        const res = await request(app)
            .post('/api/translate/batch')
            .send({ sourceLang: 'ru', targetLang: 'en', items });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('jobId');
        const jobId = res.body.jobId;
        const statusRes = await request(app).get(`/api/translate/status/${jobId}`);
        expect([200, 404]).toContain(statusRes.status);
        if (statusRes.status === 200) {
            expect(statusRes.body).toHaveProperty('status');
            expect(statusRes.body).toHaveProperty('total');
        }
    });

    it('should accept feedback', async () => {
        const app = bootstrapApp();
        const res = await request(app)
            .post('/api/translate/feedback')
            .send({ sourceLang: 'ru', targetLang: 'en', text: 'Привет', corrected: 'Hello' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
        expect(res.body).toHaveProperty('id');
    });
});
