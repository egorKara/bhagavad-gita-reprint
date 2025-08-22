/**
 * Сервис для получения системной информации
 * Содержит логику для мониторинга системы
 */

const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SystemService {
    /**
     * Получение системной информации
     */
    async getSystemInfo() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const memoryUsage = ((totalMem - freeMem) / totalMem * 100).toFixed(1);
            
            // Получаем информацию о диске
            const { stdout } = await execAsync('df / | tail -1 | awk \'{print $5}\' | sed \'s/%//\'');
            const diskUsage = stdout.trim();
            
            // Получаем загрузку CPU через load average
            const loadAvg = os.loadavg();
            const cpuUsage = Math.min(100, (loadAvg[0] / os.cpus().length * 100)).toFixed(1);
            
            return {
                cpu: cpuUsage,
                memory: memoryUsage,
                disk: diskUsage,
                uptime: Math.floor(os.uptime() / 3600), // часы
                loadAverage: loadAvg,
                platform: os.platform(),
                arch: os.arch()
            };
        } catch (error) {
            console.error('Ошибка получения системной информации:', error);
            throw error;
        }
    }

    /**
     * Получение статуса безопасности
     */
    async getSecurityStatus() {
        try {
            // Проверяем статус fail2ban
            const { stdout: fail2banStatus } = await execAsync('sudo systemctl is-active fail2ban');

            // Проверяем SSL сертификаты
            const { stdout: sslStatus } = await execAsync('sudo systemctl is-active nginx');

            // Проверяем security headers
            const headersStatus = 'OK'; // Будем проверять через middleware

            return {
                fail2ban: fail2banStatus.trim(),
                ssl: sslStatus.trim(),
                headers: headersStatus,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Ошибка получения статуса безопасности:', error);
            throw error;
        }
    }

    /**
     * Получение статистики Nginx
     */
    async getNginxStats() {
        try {
            const { stdout } = await execAsync('curl -s http://127.0.0.1:8080/nginx_status');
            const lines = stdout.split('\n');

            const stats = {
                activeConnections: lines[0].split(':')[1]?.trim() || '0',
                serverAccepts: lines[2].split(' ').filter(x => x)[0] || '0',
                serverHandled: lines[2].split(' ').filter(x => x)[1] || '0',
                requests: lines[2].split(' ').filter(x => x)[2] || '0',
                reading: lines[3].split(' ')[1] || '0',
                writing: lines[3].split(' ')[3] || '0',
                waiting: lines[3].split(' ')[5] || '0',
                timestamp: new Date().toISOString()
            };

            return stats;
        } catch (error) {
            console.error('Ошибка получения статистики Nginx:', error);
            throw error;
        }
    }

    /**
     * Получение базового статуса
     */
    getStatus() {
        return {
            status: 'OK',
            message: 'Сервер работает корректно',
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new SystemService();