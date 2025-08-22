const request = require('supertest');
const app = require('../src/app');

describe('API', () => {
    it('healthz should return ok', async () => {
        const res = await request(app).get('/healthz');
        expect(res.status).toBe(200);
        expect(res.text).toBe('ok');
    });

    it('/api/status/status should return JSON', async () => {
        const res = await request(app).get('/api/status/status');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('timestamp');
    });
});


