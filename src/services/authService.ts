import axios from 'axios';
import { redisClient } from '../config/db'; 

let localToken: string | null = null;
let localTokenExpiry: number = 0;

let fetchPromise: Promise<string> | null = null;

export const getAccessToken = async (): Promise<string> => {
    const currentTime = Date.now();

    if (localToken && currentTime < localTokenExpiry) {
        return localToken;
    }

   
    if (fetchPromise) {
        return fetchPromise;
    }

    fetchPromise = (async () => {
        try {
            console.log("Fetching new OAuth token from provider...");

         
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const fakeToken = "access_token_" + Math.random().toString(36).substring(7);
            const expiresInSeconds = 3600; 

            localToken = fakeToken;
            localTokenExpiry = Date.now() + (expiresInSeconds * 1000);

            if (redisClient) {
                try {
                    await redisClient.set('oauth_token', fakeToken, 'EX', expiresInSeconds);
                } catch (err) {
                    console.warn("Redis cache failed, using memory instead.");
                }
            }

            console.log("Token cached:", fakeToken);
            return fakeToken;

        } catch (error) {
            console.error("Failed to fetch token", error);
            throw error;
        } finally {
            fetchPromise = null; 
        }
    })();

    return fetchPromise;
};