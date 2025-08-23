const { adminToken } = require('../config');

function requireAdminAuth(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    if (adminToken && authHeader === `Bearer ${adminToken}`) {
        return next();
    }
    return res.status(401).json({ success: false, error: 'Unauthorized' });
}

module.exports = { requireAdminAuth };
