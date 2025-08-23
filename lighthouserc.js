module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:8002/'],
            startServerCommand: 'npm run serve',
            startServerReadyPattern: 'Сервер запущен на порту 8002',
            numberOfRuns: 3
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'categories:performance': ['warn', { minScore: 0.8 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['warn', { minScore: 0.8 }],
                'categories:seo': ['warn', { minScore: 0.8 }]
            }
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};
