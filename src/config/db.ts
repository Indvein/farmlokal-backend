import { createPool } from 'mysql2/promise';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

console.log("Attempting to connect to Redis URL:", process.env.REDIS_URL || "Localhost (Fallback)");

export const db = createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'farmlokal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
});

redisClient.connect()
    .then(() => console.log("Connected to Redis Cloud successfully!"))
    .catch(err => console.error(" Redis Connection Failed:", err.message));