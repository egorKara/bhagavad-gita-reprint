/**
 * 🚀 HANDOFF COMMAND - Главная команда для передачи контекста
 * Простая команда /handoff для полной передачи контекста мобильному агенту
 */

const ContextSerializer = require('./context-serializer');
const QRHandoffGenerator = require('./qr-handoff-generator');
const path = require('path');
const fs = require('fs').promises;

class HandoffCommand {
    constructor() {
        this.contextSerializer = new ContextSerializer();
        this.qrGenerator = new QRHandoffGenerator();
        this.isHandoffInProgress = false;
    }

    /**
     * 🤯 Главная команда /handoff
     */
    async executeHandoff(options = {}) {
        if (this.isHandoffInProgress) {
            return this.error('⚠️ Handoff уже выполняется. Дождитесь завершения.');
        }

        this.isHandoffInProgress = true;
        console.log('🤯 НАЧИНАЮ CONTEXT HANDOFF...');
        console.log('================================');

        try {
            // 🎯 Этап 1: Сбор всего контекста
            console.log('📦 Этап 1/4: Сериализация контекста...');
            const contextPackage = await this.contextSerializer.createContextPackage();

            // 🔐 Этап 2: Создание безопасной передачи
            console.log('🔐 Этап 2/4: Шифрование и подготовка к передаче...');
            const handoffData = await this.qrGenerator.generateHandoffQR(contextPackage);

            // 📱 Этап 3: Генерация QR кода
            console.log('📱 Этап 3/4: Создание QR кода...');
            const instructions = await this.createUserInstructions(handoffData);

            // ✅ Этап 4: Готово к передаче
            console.log('✅ Этап 4/4: Handoff готов!');

            const result = {
                success: true,
                handoffId: handoffData.handoffId,
                qrCodePath: handoffData.qrCodePath,
                expiresAt: handoffData.expiresAt,
                instructions,
                stats: {
                    contextSize: JSON.stringify(contextPackage).length,
                    todosCount: contextPackage.todos.active.length,
                    memoryItems: contextPackage.agentMemory.keyMemories.length,
                    generatedAt: new Date().toISOString(),
                },
            };

            await this.saveHandoffSummary(result);
            this.isHandoffInProgress = false;

            return result;
        } catch (error) {
            this.isHandoffInProgress = false;
            console.error('❌ Ошибка во время handoff:', error);
            return this.error(`Ошибка handoff: ${error.message}`);
        }
    }

    /**
     * 📋 Создание инструкций для пользователя
     */
    async createUserInstructions(handoffData) {
        const instructions = {
            title: '🤯 CONTEXT HANDOFF ГОТОВ!',
            subtitle: 'Передача полного контекста мобильному агенту',

            quickStart: {
                step1: '📱 Отсканируйте QR код на смартфоне',
                step2: '🔐 Подтвердите получение контекста',
                step3: '🧠 Мобильный агент готов к работе!',
                estimated: '⏱️ 30 секунд до готовности',
            },

            qrCode: {
                path: handoffData.qrCodePath,
                note: 'QR код содержит зашифрованную ссылку на контекст',
            },

            security: {
                encryption: '🔒 AES-256-GCM шифрование',
                expiration: `⏰ Истекает в ${handoffData.expiresAt.toLocaleTimeString()}`,
                autoDelete: '🗑️ Автоматическое удаление после использования',
                authentication: '🔐 Требуется ваша аутентификация',
            },

            troubleshooting: {
                qrIssues: '📱 QR не сканируется? Увеличьте яркость экрана',
                networkIssues: '🌐 Нет интернета? Проверьте WiFi соединение',
                expired: '⏰ Истекло время? Выполните /handoff заново',
                agentIssues: '🤖 Агент не отвечает? Проверьте версию мобильного агента',
            },

            whatTransferred: {
                todos: '📋 Все TODO с контекстом и прогрессом',
                chat: '💬 История чата с ключевыми решениями',
                system: '🖥️ Состояние серверов и инфраструктуры',
                memory: '🧠 Полная память AI агента',
                project: '📁 Контекст и структура проекта',
                security: '🔐 Настройки безопасности (зашифрованно)',
            },
        };

        return instructions;
    }

    /**
     * 💾 Сохранение сводки handoff
     */
    async saveHandoffSummary(result) {
        try {
            const summaryDir = path.join(process.cwd(), 'context-handoff', 'summaries');
            await fs.mkdir(summaryDir, { recursive: true });

            const summaryFile = path.join(summaryDir, `handoff_${result.handoffId}.json`);
            await fs.writeFile(summaryFile, JSON.stringify(result, null, 2));

            console.log(`📋 Сводка handoff сохранена: ${summaryFile}`);
        } catch (error) {
            console.error('⚠️ Не удалось сохранить сводку:', error);
        }
    }

    /**
     * 📊 Информация о handoff
     */
    async getHandoffInfo() {
        try {
            const stats = await this.qrGenerator.getHandoffStats();
            const recentHandoffs = await this.getRecentHandoffs();

            return {
                system: {
                    version: '1.0.0-MVP',
                    status: this.isHandoffInProgress ? 'В процессе' : 'Готов',
                    capabilities: [
                        'QR код передача',
                        'AES-256 шифрование',
                        'Автоматическое удаление',
                        'Полный контекст',
                    ],
                },
                stats,
                recent: recentHandoffs,
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * 📜 Получение недавних handoff
     */
    async getRecentHandoffs() {
        try {
            const summaryDir = path.join(process.cwd(), 'context-handoff', 'summaries');
            const files = await fs.readdir(summaryDir).catch(() => []);

            const recent = [];
            for (const file of files.slice(-5)) {
                try {
                    const content = await fs.readFile(path.join(summaryDir, file), 'utf8');
                    const handoff = JSON.parse(content);
                    recent.push({
                        id: handoff.handoffId,
                        date: handoff.stats.generatedAt,
                        success: handoff.success,
                        todosCount: handoff.stats.todosCount,
                    });
                } catch (e) {
                    // Игнорируем повреждённые файлы
                }
            }

            return recent.reverse(); // Новые сверху
        } catch (error) {
            return [];
        }
    }

    /**
     * 🧹 Очистка старых handoff
     */
    async cleanupOldHandoffs() {
        try {
            const dirs = [
                path.join(process.cwd(), 'context-handoff', 'temp'),
                path.join(process.cwd(), 'context-handoff', 'qr-codes'),
                path.join(process.cwd(), 'context-handoff', 'summaries'),
            ];

            let cleaned = 0;
            for (const dir of dirs) {
                try {
                    const files = await fs.readdir(dir);
                    for (const file of files) {
                        const filePath = path.join(dir, file);
                        const stat = await fs.stat(filePath);

                        // Удаляем файлы старше 24 часов
                        if (Date.now() - stat.mtime.getTime() > 24 * 60 * 60 * 1000) {
                            await fs.unlink(filePath);
                            cleaned++;
                        }
                    }
                } catch (e) {
                    // Директория может не существовать
                }
            }

            return { cleaned, message: `Очищено ${cleaned} старых файлов` };
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * ❌ Обработка ошибок
     */
    error(message) {
        return {
            success: false,
            error: message,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * 📱 Демонстрационный handoff
     */
    async demoHandoff() {
        console.log('🎯 ДЕМОНСТРАЦИЯ CONTEXT HANDOFF');
        console.log('===============================');
        console.log('');
        console.log('💡 Это демонстрация как работает передача контекста:');
        console.log('');
        console.log('1. 📦 Собираем весь контекст (TODO, чат, память, системы)');
        console.log('2. 🔐 Шифруем данные AES-256');
        console.log('3. 📱 Создаём QR код для передачи');
        console.log('4. ⚡ 30 секунд до готовности мобильного агента');
        console.log('');
        console.log('🚀 Запустить реальный handoff: /handoff');

        return {
            demo: true,
            message: 'Демонстрация Context Handoff системы',
            realCommand: '/handoff',
        };
    }
}

module.exports = HandoffCommand;
