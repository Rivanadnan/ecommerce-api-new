"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
// src/config/db.ts
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = promise_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.DB_SSL_CERT?.replace(/\\n/g, '\n'),
    },
});
const connectDB = async () => {
    try {
        const connection = await exports.db.getConnection();
        console.log("✅ Database connected");
        connection.release();
    }
    catch (err) {
        console.error("❌ Database connection failed:", err);
    }
};
exports.connectDB = connectDB;
