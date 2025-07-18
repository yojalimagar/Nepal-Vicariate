import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = await mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nepal_vicariate',
}).getConnection();

console.log('Connected to MySQL database.');