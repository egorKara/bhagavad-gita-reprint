#!/usr/bin/env node

/**
 * 🤯 CONTEXT HANDOFF SYSTEM - Main Entry Point
 * Революционная система передачи полного контекста AI агента мобильному устройству
 *
 * Использование:
 * node context-handoff/index.js handoff
 * node context-handoff/index.js info
 * node context-handoff/index.js demo
 */

const HandoffCommand = require('./handoff-command');
const path = require('path');
const fs = require('fs').promises;

class ContextHandoffSystem {
    constructor() {
        this.handoffCommand = new HandoffCommand();
        this.version = '1.0.0-MVP';
        this.startTime = new Date();
    }

    /**
     * 🚀 Главная точка входа
     */
    async run() {
        const command = process.argv[2] || 'help';

        console.log(`🤯 CONTEXT HANDOFF SYSTEM v${this.version}`);
        console.log('==========================================');
        console.log('');

        try {
            switch (command.toLowerCase()) {
                case 'handoff':
                    return await this.executeHandoff();

                case 'info':
                    return await this.showInfo();

                case 'demo':
                    return await this.runDemo();

                case 'cleanup':
                    return await this.cleanup();

                case 'help':
                default:
                    return this.showHelp();
            }
        } catch (error) {
            console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 🤯 Выполнение handoff
     */
    async executeHandoff() {
        console.log('🎯 ЗАПУСК ПОЛНОЙ ПЕРЕДАЧИ КОНТЕКСТА');
        console.log('===================================');
        console.log('');

        const result = await this.handoffCommand.executeHandoff();

        if (result.success) {
            console.log('');
            console.log('🎉 HANDOFF УСПЕШНО СОЗДАН!');
            console.log('==========================');
            console.log('');
            console.log('📊 СТАТИСТИКА:');
            console.log(`   📋 TODO задач: ${result.stats.todosCount}`);
            console.log(`   🧠 Память агента: ${result.stats.memoryItems} элементов`);
            console.log(
                `   📦 Размер контекста: ${Math.round(result.stats.contextSize / 1024)} KB`
            );
            console.log('');
            console.log('📱 СЛЕДУЮЩИЕ ШАГИ:');
            console.log('   1. Отсканируйте QR код на смартфоне');
            console.log('   2. Подтвердите получение контекста');
            console.log('   3. Продолжайте работу с мобильным агентом!');
            console.log('');
            console.log(`📷 QR код сохранён: ${result.qrCodePath}`);
            console.log(`⏰ Истекает в: ${result.expiresAt.toLocaleString()}`);
            console.log('');
            console.log('🔐 БЕЗОПАСНОСТЬ: AES-256 шифрование, автоудаление');

            await this.openQRCode(result.qrCodePath);
        } else {
            console.log('❌ ОШИБКА HANDOFF:', result.error);
        }

        return result;
    }

    /**
     * 📊 Показать информацию о системе
     */
    async showInfo() {
        console.log('📊 ИНФОРМАЦИЯ О СИСТЕМЕ');
        console.log('=======================');
        console.log('');

        const info = await this.handoffCommand.getHandoffInfo();

        console.log('🖥️ СИСТЕМА:');
        console.log(`   Версия: ${info.system.version}`);
        console.log(`   Статус: ${info.system.status}`);
        console.log(`   Возможности: ${info.system.capabilities.join(', ')}`);
        console.log('');

        if (info.stats) {
            console.log('📈 СТАТИСТИКА:');
            console.log(`   Активные handoff: ${info.stats.activeHandoffs}`);
            console.log(`   Последний: ${info.stats.lastGenerated}`);
            console.log(`   Безопасность: ${info.stats.securityLevel}`);
            console.log('');
        }

        if (info.recent && info.recent.length > 0) {
            console.log('📜 НЕДАВНИЕ HANDOFF:');
            info.recent.forEach((handoff, i) => {
                const date = new Date(handoff.date).toLocaleString();
                const status = handoff.success ? '✅' : '❌';
                console.log(`   ${i + 1}. ${status} ${handoff.id} (${date})`);
            });
            console.log('');
        }

        return info;
    }

    /**
     * 🎯 Демонстрация системы
     */
    async runDemo() {
        console.log('🎯 ДЕМОНСТРАЦИЯ CONTEXT HANDOFF');
        console.log('===============================');
        console.log('');

        const demo = await this.handoffCommand.demoHandoff();

        console.log('💡 КАК ЭТО РАБОТАЕТ:');
        console.log('');
        console.log('   📱 Вы: /handoff');
        console.log('   🤖 AI: 📦 Создаю пакет контекста...');
        console.log('         📱 QR код готов!');
        console.log('');
        console.log('   📱 Вы: *сканируете QR на смартфоне*');
        console.log('   🤖 Mobile Agent: ✅ Контекст получен!');
        console.log('                    🧠 Помню всё что было');
        console.log('                    📋 Готов продолжить работу');
        console.log('');
        console.log('   📱 Вы: продолжай диагностику сервера');
        console.log('   🤖 Mobile Agent: 🔍 Анализирую SSH проблемы...');
        console.log('                    💡 Нашёл решение!');
        console.log('');
        console.log('🚀 ЗАПУСТИТЬ РЕАЛЬНЫЙ HANDOFF:');
        console.log('   node context-handoff/index.js handoff');
        console.log('');

        return demo;
    }

    /**
     * 🧹 Очистка старых файлов
     */
    async cleanup() {
        console.log('🧹 ОЧИСТКА СТАРЫХ HANDOFF');
        console.log('=========================');
        console.log('');

        const result = await this.handoffCommand.cleanupOldHandoffs();

        if (result.error) {
            console.log('❌ Ошибка очистки:', result.error);
        } else {
            console.log('✅', result.message);
        }
        console.log('');

        return result;
    }

    /**
     * 📖 Показать справку
     */
    showHelp() {
        console.log('📖 СПРАВКА ПО CONTEXT HANDOFF SYSTEM');
        console.log('=====================================');
        console.log('');
        console.log('🎯 КОМАНДЫ:');
        console.log('   handoff   - 🤯 Создать handoff для передачи контекста');
        console.log('   info      - 📊 Показать информацию о системе');
        console.log('   demo      - 🎯 Демонстрация как работает система');
        console.log('   cleanup   - 🧹 Очистить старые handoff файлы');
        console.log('   help      - 📖 Показать эту справку');
        console.log('');
        console.log('🤯 РЕВОЛЮЦИОННАЯ ИДЕЯ:');
        console.log('   Полная передача контекста AI агента на мобильное устройство');
        console.log('   Никакой потери информации, непрерывность работы');
        console.log('');
        console.log('🚀 БЫСТРЫЙ СТАРТ:');
        console.log('   1. node context-handoff/index.js handoff');
        console.log('   2. Сканируйте QR код на смартфоне');
        console.log('   3. Продолжайте работу с мобильным агентом!');
        console.log('');
        console.log('🔐 БЕЗОПАСНОСТЬ:');
        console.log('   - AES-256-GCM шифрование');
        console.log('   - Временные ссылки (15 минут)');
        console.log('   - Автоматическое удаление');
        console.log('   - Аутентификация на мобильном');
        console.log('');

        return {
            help: true,
            version: this.version,
            commands: ['handoff', 'info', 'demo', 'cleanup', 'help'],
        };
    }

    /**
     * 📷 Попытка открыть QR код
     */
    async openQRCode(qrPath) {
        try {
            const os = require('os');
            const { exec } = require('child_process');

            let command;
            switch (os.platform()) {
                case 'darwin': // macOS
                    command = `open "${qrPath}"`;
                    break;
                case 'win32': // Windows
                    command = `start "${qrPath}"`;
                    break;
                case 'linux': // Linux
                    command = `xdg-open "${qrPath}"`;
                    break;
                default:
                    console.log(`📷 QR код: ${qrPath}`);
                    return;
            }

            exec(command, error => {
                if (error) {
                    console.log(`📷 QR код сохранён: ${qrPath}`);
                } else {
                    console.log('📷 QR код открыт в программе просмотра');
                }
            });
        } catch (error) {
            console.log(`📷 QR код: ${qrPath}`);
        }
    }

    /**
     * 📊 Статистика запуска
     */
    getStartupStats() {
        return {
            version: this.version,
            startTime: this.startTime.toISOString(),
            platform: process.platform,
            nodeVersion: process.version,
            workingDir: process.cwd(),
        };
    }
}

// 🚀 Запуск если вызван напрямую
if (require.main === module) {
    const system = new ContextHandoffSystem();
    system
        .run()
        .then(result => {
            if (result && !result.success && result.error) {
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 КРИТИЧЕСКАЯ ОШИБКА СИСТЕМЫ:', error);
            process.exit(1);
        });
}

module.exports = ContextHandoffSystem;
