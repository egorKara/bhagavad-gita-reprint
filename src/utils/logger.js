const util = require('util');
const { logLevel } = require('../config');

const levels = ['error', 'warn', 'info', 'debug'];
const levelIndex = Math.max(0, levels.indexOf((logLevel || 'info').toLowerCase()));

function formatMessage(level, message, meta) {
    const base = {
        level,
        message: String(message),
        timestamp: new Date().toISOString(),
        ...meta,
    };
    return JSON.stringify(base);
}

function toMeta(args) {
    if (!args || args.length === 0) return undefined;
    if (args.length === 1 && typeof args[0] === 'object') return args[0];
    return { details: args.map(a => (typeof a === 'string' ? a : util.inspect(a))) };
}

const logger = {
    info(message, ...args) {
        if (levelIndex >= levels.indexOf('info')) {
            process.stdout.write(`${formatMessage('info', message, toMeta(args))}\n`);
        }
    },
    warn(message, ...args) {
        if (levelIndex >= levels.indexOf('warn')) {
            process.stdout.write(`${formatMessage('warn', message, toMeta(args))}\n`);
        }
    },
    error(message, ...args) {
        if (levelIndex >= levels.indexOf('error')) {
            process.stderr.write(`${formatMessage('error', message, toMeta(args))}\n`);
        }
    },
    debug(message, ...args) {
        if (levelIndex >= levels.indexOf('debug')) {
            process.stdout.write(`${formatMessage('debug', message, toMeta(args))}\n`);
        }
    },
    request(req) {
        return {
            info(message, meta = {}) {
                logger.info(message, { ...meta, requestId: req.id });
            },
            warn(message, meta = {}) {
                logger.warn(message, { ...meta, requestId: req.id });
            },
            error(message, meta = {}) {
                logger.error(message, { ...meta, requestId: req.id });
            },
            debug(message, meta = {}) {
                logger.debug(message, { ...meta, requestId: req.id });
            },
        };
    },
};

module.exports = logger;
