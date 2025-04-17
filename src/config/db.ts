import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // 🔐 LÖSNINGEN!
    ca: process.env.DB_CA?.replace(/\\n/g, '\n'),
  },
});

export const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};
