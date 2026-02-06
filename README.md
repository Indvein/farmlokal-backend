# FarmLokal Backend
This is a high-performance Node.js backend built with TypeScript for the FarmLokal hyperlocal marketplace. It manages a large product catalog, handles resilient external API integrations, and implements efficient OAuth2 token management.

# Technical Specifications
Runtime: Node.js

Language: TypeScript

Database: MySQL

Caching: Redis

Libraries: Express, Axios, ioredis, mysql2

# Features
Product Listing API
The system is designed to handle over 1,000,000 records efficiently.

Pagination: Implemented cursor-based pagination using the ID column to ensure constant time complexity regardless of dataset size.

Filtering: Supports filtering by category and minimum price.

Sorting: Default ascending order by ID to maintain consistent cursor behavior.

Database Optimization: Utilizes MySQL indexes on category, price, and created_at columns to achieve sub-200ms response times.

# External API Integration
Two types of external communication patterns are implemented:

Synchronous with Retries: Integrates with external providers using exponential backoff logic (1s, 2s, 4s) to handle transient failures.

Asynchronous Webhooks: A dedicated endpoint for receiving updates with built-in idempotency checks to prevent duplicate event processing.

# Authentication and Caching
OAuth2 Client Credentials: Implements a secure flow to fetch and refresh access tokens.

Token Caching: Access tokens are cached in Redis to minimize redundant network calls.

Concurrency Handling: Uses a singleton promise pattern to ensure that simultaneous requests do not trigger multiple token fetch operations during expiry.

# Setup and Installation
Prerequisites
Node.js v16 or higher

MySQL 8.0 or higher

Redis instance (Local or Cloud)

Environment Configuration
Create a .env file in the root directory with the following variables:

PORT=10000

DB_CA=certification

MYSQL_URL=mysqlurl

REDIS_URL=redis://url

# Installation Steps
Install dependencies: npm install

Build the project: npm run build

Seed the database: npx ts-node src/scripts/seed.ts

Start the server: npm start

API Endpoints
Products
GET /api/products

Query Parameters: limit, cursor, category, minPrice

Description: Retrieves paginated products.

Authentication Test
GET /test-auth

Description: Fetches a cached OAuth token.

External API Test
GET /test-retry

Description: Triggers the external API fetch with retry logic.

Webhook
POST /api/webhook

Payload: { event_id: string, status: string }

Description: Receives and processes status updates safely.

# Architecture and Design Decisions
Performance Strategy
The choice of cursor-based pagination over offset-based pagination was made to avoid the linear performance degradation associated with large dataset offsets in MySQL. This ensures the application scales effectively to millions of product entries.

# Reliability Strategy
External integrations utilize a fail-fast approach combined with exponential backoff. This prevents the application from blocking threads during external downtime while allowing for automatic recovery once the service is restored.

# Caching Strategy
The system follows a cache-aside pattern. It first attempts to retrieve tokens from Redis; if unavailable or expired, it refreshes the token and updates the cache. A memory fallback is implemented to maintain system availability even if the Redis connection is interrupted.
