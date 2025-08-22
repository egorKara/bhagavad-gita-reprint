/**
 * Контроллер для API endpoint'ов
 * Теперь использует сервисный слой для бизнес-логики
 */

const systemService = require('../../services/systemService');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * Получение статуса сервера
 */
const getStatus = (req, res) => {
    const status = systemService.getStatus();
    res.json(status);
};

/**
 * Получение системной информации
 */
const getSystemInfo = asyncHandler(async (req, res) => {
    const systemInfo = await systemService.getSystemInfo();
    res.json(systemInfo);
});

/**
 * Получение статуса безопасности
 */
const getSecurityStatus = asyncHandler(async (req, res) => {
    const securityStatus = await systemService.getSecurityStatus();
    res.json(securityStatus);
});

/**
 * Получение статистики Nginx
 */
const getNginxStats = asyncHandler(async (req, res) => {
    const nginxStats = await systemService.getNginxStats();
    res.json(nginxStats);
});

module.exports = {
    getStatus,
    getSystemInfo,
    getSecurityStatus,
    getNginxStats
};


