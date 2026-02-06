import axios from 'axios';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchOrderDetails = async (orderId: string) => {
    const MAX_RETRIES = 3;
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
        try {
            attempt++;
            console.log(`📡 Attempt ${attempt} to fetch order ${orderId}...`);

            
            const shouldFail = Math.random() < 0.7; 
            
            if (shouldFail) {
                throw new Error("Simulated Network Error (Flaky API)");
            }

            const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${orderId}`);
            
            console.log("API Success!");
            return response.data;

        } catch (error: any) {
            console.warn(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt < MAX_RETRIES) {
                const delay = 1000 * Math.pow(2, attempt - 1); 
                console.log(`Waiting ${delay}ms before retrying...`);
                await wait(delay);
            } else {
                console.error("All retries failed.");
                throw new Error("External API is down after multiple attempts.");
            }
        }
    }
};