import express from 'express';
import productRoutes from './routes/productRoutes';
import { getAccessToken } from './services/authService'; 
import { fetchOrderDetails } from './services/externalApiService'; 
import { handleWebhook } from './controllers/webhookController';
import dotenv from "dotenv";
dotenv.config()


const app = express();

app.use(express.json());

app.get('/test-auth', async (req, res) => {
    const token = await getAccessToken();
    res.json({ token: token, message: "Refresh the page fast! The token should stay the same (Cached)." });
});

app.get('/test-retry', async (req, res) => {
    try {
        const data = await fetchOrderDetails('1');
        res.json({ success: true, data });
    } catch (error: any) {
        res.status(502).json({ error: error.message });
    }
});
app.post('/api/webhook', handleWebhook);
app.use('/api', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on :${process.env.MYSQL_URL}`);
});