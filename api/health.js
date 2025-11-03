import { corsMiddleware } from './lib/cors.js';

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
