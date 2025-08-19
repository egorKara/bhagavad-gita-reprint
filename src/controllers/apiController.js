/**
 * Контроллер для API endpoint'ов
 */

/**
 * Получение статуса сервера
 * @param {express.Request} req - Объект запроса
 * @param {express.Response} res - Объект ответа
 */
function getStatus(req, res) {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({ 
        status: 'OK', 
        message: 'Сервер работает корректно',
        timestamp: new Date().toISOString(),
        performance: {
            uptime: `${Math.floor(uptime / 60)} minutes`,
            memoryUsage: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
            }
        }
    });
}

module.exports = {
    getStatus
};
