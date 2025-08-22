/**
 * Контроллер для API endpoint'ов
 */

const os = require('os');

/**
 * Получение статуса сервера
 * @param {express.Request} req - Объект запроса
 * @param {express.Response} res - Объект ответа
 */
function getStatus(req, res) {
    res.json({
        status: 'OK',
        message: 'Сервер работает корректно',
        timestamp: new Date().toISOString()
    });
}

/**
 * Получение системной информации
 * @param {express.Request} req - Объект запроса
 * @param {express.Response} res - Объект ответа
 */
async function getSystemInfo(req, res) {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const memoryUsage = ((totalMem - freeMem) / totalMem * 100).toFixed(1);
        const loadAvg = os.loadavg();
        const cpuUsage = Math.min(100, (loadAvg[0] / os.cpus().length * 100)).toFixed(1);

        res.json({
            cpu: cpuUsage,
            memory: memoryUsage,
            disk: null,
            uptime: Math.floor(os.uptime() / 3600),
            loadAverage: loadAvg,
            platform: os.platform(),
            arch: os.arch()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Ошибка получения системной информации',
            details: error.message
        });
    }
}

/**
 * Получение статуса безопасности
 * @param {express.Request} req - Объект запроса
 * @param {express.Response} res - Объект ответа
 */
async function getSecurityStatus(req, res) {
    try {
        res.json({
            fail2ban: 'unavailable',
            ssl: 'unavailable',
            headers: 'OK',
            note: 'System-level checks moved to infrastructure monitoring (Prometheus/Grafana).',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Ошибка получения статуса безопасности',
            details: error.message
        });
    }
}

/**
 * Получение статистики Nginx
 * @param {express.Request} req - Объект запроса
 * @param {express.Response} res - Объект ответа
 */
async function getNginxStats(req, res) {
    try {
        return res.status(501).json({
            error: 'Not Implemented',
            details: 'Use Nginx stub_status via Prometheus exporter.'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Ошибка получения статистики Nginx',
            details: error.message
        });
    }
}

module.exports = {
    getStatus,
    getSystemInfo,
    getSecurityStatus,
    getNginxStats
};


