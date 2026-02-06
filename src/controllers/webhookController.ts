import { Request, Response } from 'express';

const processedEvents = new Set<string>();

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const { event_id, status, data } = req.body;

        console.log(`Webhook received: ${event_id}`);

        if (processedEvents.has(event_id)) {
            console.log(`Duplicate event ${event_id} detected. Skipping.`);
            res.status(200).json({ message: "Already processed" });
            return; 
        }

        processedEvents.add(event_id);
        console.log(`Event ${event_id} processed successfully: ${status}`);

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Internal Error" });
    }
};