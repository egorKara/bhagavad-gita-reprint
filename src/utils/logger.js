const util = require('util');

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
	return { details: args.map((a) => (typeof a === 'string' ? a : util.inspect(a))) };
}

const logger = {
	info(message, ...args) {
		process.stdout.write(formatMessage('info', message, toMeta(args)) + '\n');
	},
	warn(message, ...args) {
		process.stdout.write(formatMessage('warn', message, toMeta(args)) + '\n');
	},
	error(message, ...args) {
		process.stderr.write(formatMessage('error', message, toMeta(args)) + '\n');
	},
	debug(message, ...args) {
		if (process.env.DEBUG) {
			process.stdout.write(formatMessage('debug', message, toMeta(args)) + '\n');
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