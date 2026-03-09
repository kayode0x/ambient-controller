export const DEV_MODE =
	(process.env.NODE_ENV || "development") === "development";

export const logger = {
	log: (...args: unknown[]) => {
		if (DEV_MODE) {
			console.log(...args);
		}
	},
	info: (...args: unknown[]) => {
		if (DEV_MODE) {
			console.info(...args);
		}
	},
	warn: (...args: unknown[]) => {
		if (DEV_MODE) {
			console.warn(...args);
		}
	},
	error: (...args: unknown[]) => {
		if (DEV_MODE) {
			console.error(...args);
		}
	},
	debug: (...args: unknown[]) => {
		if (DEV_MODE) {
			console.debug(...args);
		}
	},
};
