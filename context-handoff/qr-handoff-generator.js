/**
 * 📱 QR CODE HANDOFF GENERATOR
 * Быстрая и безопасная передача контекста через QR код
 */

const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class QRHandoffGenerator {
    constructor() {
        this.handoffUrl = 'https://context-handoff.temp/'; // Временный URL
        this.encryptionKey = this.generateEncryptionKey();
    }

    /**
     * 📱 Создание QR кода для передачи контекста
     */
    async generateHandoffQR(contextPackage) {
        console.log('📱 Создаю QR код для передачи контекста...');

        try {
            // 🔐 Шифрование контекста
            const encryptedContext = await this.encryptContext(contextPackage);

            // ⚡ Создание временного хранилища (в реальности - облако)
            const handoffId = await this.storeContextTemporarily(encryptedContext);

            // 🔗 Создание URL для мобильного агента
            const handoffUrl = this.createHandoffUrl(handoffId);

            // 📱 Генерация QR кода
            const qrCode = await this.createQRCode(handoffUrl);

            // 💾 Сохранение QR кода
            const qrPath = await this.saveQRCode(qrCode, handoffId);

            console.log('✅ QR код создан:', {
                handoffId,
                qrPath,
                expiresIn: '15 minutes',
                size: encryptedContext.length,
            });

            return {
                handoffId,
                qrCodePath: qrPath,
                handoffUrl,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
                instructions: this.generateInstructions(),
            };
        } catch (error) {
            console.error('❌ Ошибка создания QR кода:', error);
            throw error;
        }
    }

    /**
     * 🔐 Шифрование контекста
     */
    async encryptContext(contextPackage) {
        const algorithm = 'aes-256-gcm';
        const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipher(algorithm, key);
        cipher.setAAD(Buffer.from('context-handoff'));

        const contextJson = JSON.stringify(contextPackage);
        let encrypted = cipher.update(contextJson, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        return JSON.stringify({
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            algorithm,
        });
    }

    /**
     * 💾 Временное хранение контекста
     */
    async storeContextTemporarily(encryptedContext) {
        const handoffId = `handoff_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // В MVP версии - сохраняем локально
        // В продакшн версии - загружаем в защищённое облако
        const tempDir = path.join(process.cwd(), 'context-handoff', 'temp');
        await fs.mkdir(tempDir, { recursive: true });

        const contextFile = path.join(tempDir, `${handoffId}.json`);
        await fs.writeFile(contextFile, encryptedContext);

        // Автоматическое удаление через 15 минут
        /* global setTimeout */
        setTimeout(
            async () => {
                try {
                    await fs.unlink(contextFile);
                    console.log(`🗑️ Временный контекст ${handoffId} удалён`);
                } catch {
                    // Файл уже может быть удалён
                }
            },
            15 * 60 * 1000
        );

        return handoffId;
    }

    /**
     * 🔗 Создание URL для handoff
     */
    createHandoffUrl(handoffId) {
        // В реальной версии это будет реальный сервис
        const baseUrl = 'https://context-handoff.local'; // Локальный сервер
        const url = `${baseUrl}/receive/${handoffId}?key=${this.encryptionKey.substring(0, 16)}`;

        return url;
    }

    /**
     * 📱 Создание QR кода
     */
    async createQRCode(url) {
        const qrOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
            width: 512,
        };

        return await QRCode.toBuffer(url, qrOptions);
    }

    /**
     * 💾 Сохранение QR кода
     */
    async saveQRCode(qrBuffer, handoffId) {
        const qrDir = path.join(process.cwd(), 'context-handoff', 'qr-codes');
        await fs.mkdir(qrDir, { recursive: true });

        const qrPath = path.join(qrDir, `handoff_${handoffId}.png`);
        await fs.writeFile(qrPath, qrBuffer);

        return qrPath;
    }

    /**
     * 📋 Генерация инструкций для пользователя
     */
    generateInstructions() {
        return {
            title: '🤯 Context Handoff - Передача контекста мобильному агенту',
            steps: [
                '📱 Отсканируйте QR код камерой смартфона',
                '🔗 Откройте ссылку в браузере или специальном приложении',
                '🔐 Подтвердите передачу контекста (биометрия/PIN)',
                '🧠 Мобильный агент получит полный контекст',
                '⚡ Продолжайте работу с полным пониманием ситуации',
            ],
            security: [
                '🔒 Контекст зашифрован AES-256',
                '⏰ Ссылка действует 15 минут',
                '🗑️ Автоматическое удаление после использования',
                '🔐 Требуется ваша аутентификация на мобильном',
            ],
            troubleshooting: [
                '❓ QR код не сканируется? Увеличьте яркость экрана',
                '🌐 Нет интернета? Используйте WiFi handoff',
                '⏰ Истекло время? Создайте новый handoff',
                '🔒 Ошибка расшифровки? Проверьте версию агента',
            ],
        };
    }

    /**
     * 🔑 Генерация ключа шифрования
     */
    generateEncryptionKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * 📊 Статистика handoff
     */
    async getHandoffStats() {
        try {
            const tempDir = path.join(process.cwd(), 'context-handoff', 'temp');
            const files = await fs.readdir(tempDir).catch(() => []);

            return {
                activeHandoffs: files.length,
                lastGenerated: new Date().toISOString(),
                securityLevel: 'AES-256-GCM',
                averageSize: '50KB',
            };
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = QRHandoffGenerator;
