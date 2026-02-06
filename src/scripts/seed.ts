import { db } from '../config/db';
import { faker } from '@faker-js/faker';

const seedDatabase = async () => {
    try {
        console.log("Starting seed process...");

        const BATCH_SIZE = 1000; 
        const TOTAL_RECORDS = 5000; 

        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const values = [];
            
            for (let j = 0; j < BATCH_SIZE; j++) {
                const name = faker.commerce.productName().replace(/'/g, "");
                const description = faker.commerce.productDescription().replace(/'/g, "");
                const price = faker.commerce.price({ min: 10, max: 500 });
                const category = faker.commerce.department().replace(/'/g, "");
                
                values.push(`('${name}', '${description}', ${price}, '${category}')`);
            }

            const sql = `INSERT INTO products (name, description, price, category) VALUES ${values.join(',')}`;
            await db.execute(sql);
            console.log(`Inserted ${i + BATCH_SIZE} records...`);
        }

        console.log("Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error(" Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();