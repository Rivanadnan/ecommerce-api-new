"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_TOKEN_SECRET = exports.STRIPE_SECRET_KEY = exports.DB_PORT = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = void 0;
const getEnv = (key, defaultValue = "") => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
exports.DB_HOST = getEnv('DB_HOST');
exports.DB_USER = getEnv('DB_USER');
exports.DB_PASSWORD = getEnv('DB_PASSWORD');
exports.DB_NAME = getEnv('DB_NAME');
exports.DB_PORT = parseInt(getEnv('DB_PORT', '3306'), 10);
exports.STRIPE_SECRET_KEY = getEnv('STRIPE_SECRET_KEY');
exports.ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET');
