/**
 * Health check endpoint for monitoring API availability and environment configuration.
 * @module api/health
 */

import { corsMiddleware } from './lib/cors.js';

/**
 * Vercel serverless function handler for health checks.
 * Returns API status and validates environment variable configuration.
 *
 * HTTP Method: GET only
 *
 * Response format:
 * {
 *   status: 'ok',
 *   message: 'Vercel serverless API is running',
 *   timestamp: '2024-01-01T12:00:00.000Z',
 *   environment: {
 *     hasDiscordClientId: boolean,
 *     hasDiscordClientSecret: boolean,
 *     hasDiscordRedirectUri: boolean,
 *     hasMongoDbUri: boolean,
 *     hasBotToken: boolean,
 *     nodeEnv: string
 *   }
 * }
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {string} req.method - HTTP method
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends JSON response with status 200 or 405
 *
 * @example
 * // Request: GET /api/health
 * // Response: 200 OK
 * // {
 * //   "status": "ok",
 * //   "message": "Vercel serverless API is running",
 * //   "timestamp": "2024-01-01T12:00:00.000Z",
 * //   "environment": { ... }
 * // }
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug environment variables (remove in production)
  const envStatus = {
    hasDiscordClientId: !!process.env.DISCORD_CLIENT_ID,
    hasDiscordClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
    hasDiscordRedirectUri: !!process.env.DISCORD_REDIRECT_URI,
    hasMongoDbUri: !!process.env.MONGODB_URI,
    hasBotToken: !!process.env.BOT_TOKEN,
    nodeEnv: process.env.NODE_ENV
  };

  return res.status(200).json({
    status: 'ok',
    message: 'Vercel serverless API is running',
    timestamp: new Date().toISOString(),
    environment: envStatus
  });
}

export default corsMiddleware(handler);
