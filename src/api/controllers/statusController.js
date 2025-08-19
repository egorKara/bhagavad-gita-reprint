/**
 * Контроллер для API endpoint'ов
 */

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

module.exports = {
    getStatus
};


