import { corsMiddleware } from './lib/cors.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    message: 'Vercel serverless API is running',
    timestamp: new Date().toISOString()
  });
}

export default corsMiddleware(handler);
