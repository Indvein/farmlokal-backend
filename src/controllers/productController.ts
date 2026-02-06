import { Request, Response } from 'express';
import { db } from '../config/db';
export const getProducts = async (req: Request, res: Response) => {
    try {
        console.log("🔍 Request received..."); 

        const { limit = 10, cursor, category, minPrice } = req.query;
        const params: any[] = [];

        let sql = 'SELECT * FROM products WHERE 1=1';

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }
        if (minPrice) {
            sql += ' AND price >= ?';
            params.push(minPrice);
        }
        if (cursor) {
            sql += ' AND id > ?';
            params.push(cursor);
        }

        sql += ' ORDER BY id ASC LIMIT ?';
        
        const limitNum = parseInt(limit as string) || 10;
        params.push(limitNum);

        const [rows]: any = await db.query(sql, params);

        console.log(`Success! Found ${rows.length} products.`);

        res.json({
            data: rows,
            pagination: {
                nextCursor: rows.length > 0 ? rows[rows.length - 1].id : null,
                limit: limitNum
            }
        });

    } catch (error) {
        console.error(" Database Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error });
    }
};