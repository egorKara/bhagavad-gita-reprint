const request = require('supertest');

describe('Metrics endpoint', () => {
    it('should return 503 when METRICS_TOKEN is not set', async () => {
        jest.resetModules();
        delete process.env.METRICS_TOKEN;
        const app = require('../src/app');
        const res = await request(app).get('/metrics');
        expect(res.status).toBe(503);
    });
});
