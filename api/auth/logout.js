import { corsMiddleware } from '../lib/cors.js';
import { clearAuthCookies } from '../lib/auth.js';

async function handler(req, res) {
  // Clear cookies using shared utility
  clearAuthCookies(res);

  // Redirect to home - use referer or default to dev port
  const origin = req.headers.origin || req.headers.referer?.match(/^https?:\/\/[^\/]+/)?.[0] || 'http://localhost:5173';
  res.redirect(`${origin}/`);
}

export default corsMiddleware(handler);
