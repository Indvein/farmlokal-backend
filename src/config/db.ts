import Redis from 'ioredis';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

console.log("Attempting to connect to Redis URL:", process.env.REDIS_URL || "Localhost (Fallback)");


export const pool = mysql.createPool({
    uri: process.env.MYSQL_URL, 
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_CA,
    },
  });

export default pool;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1
});

redisClient.connect()
    .then(() => console.log("Connected to Redis Cloud successfully!"))
    .catch(err => console.error(" Redis Connection Failed:", err.message));