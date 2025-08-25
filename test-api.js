#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки API GitaLanding
 */

const API_BASE = 'http://localhost:5246';

async function testAPI() {
    console.log('🧪 Тестирование API GitaLanding...\n');

    try {
        // Тест 1: Проверка здоровья
        console.log('1️⃣ Тест health endpoint...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health endpoint работает:', healthData);
        } else {
            console.log('❌ Health endpoint не отвечает');
        }

        // Тест 2: Swagger UI
        console.log('\n2️⃣ Тест Swagger UI...');
        const swaggerResponse = await fetch(`${API_BASE}/swagger`);
        if (swaggerResponse.ok) {
            console.log('✅ Swagger UI доступен');
        } else {
            console.log('❌ Swagger UI недоступен');
        }

        // Тест 3: Books endpoint
        console.log('\n3️⃣ Тест Books endpoint...');
        const booksResponse = await fetch(`${API_BASE}/api/books`);
        if (booksResponse.ok) {
            const booksData = await booksResponse.json();
            console.log('✅ Books endpoint работает:', booksData);
        } else {
            console.log('❌ Books endpoint не отвечает');
        }

        // Тест 4: Authors endpoint
        console.log('\n4️⃣ Тест Authors endpoint...');
        const authorsResponse = await fetch(`${API_BASE}/api/authors`);
        if (authorsResponse.ok) {
            const authorsData = await authorsResponse.json();
            console.log('✅ Authors endpoint работает:', authorsData);
        } else {
            console.log('❌ Authors endpoint не отвечает');
        }

        // Тест 5: Main book
        console.log('\n5️⃣ Тест Main book...');
        const mainBookResponse = await fetch(`${API_BASE}/api/books/main`);
        if (mainBookResponse.ok) {
            const mainBookData = await mainBookResponse.json();
            console.log('✅ Main book endpoint работает:', mainBookData);
        } else {
            console.log('❌ Main book endpoint не отвечает');
        }

    } catch (error) {
        console.error('❌ Ошибка тестирования:', error.message);
    }
}

// Запуск тестов
testAPI();
