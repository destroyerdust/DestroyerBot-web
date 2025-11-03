import { corsMiddleware } from '../lib/cors.js';
import { clearAuthCookies } from '../lib/auth.js';

async function handler(req, res) {
  // Clear cookies using shared utility
  clearAuthCookies(res);

  // Redirect to home - use origin header, referer, or default
  let redirectUrl = 'http://localhost:3000'; // default fallback

  // Try origin header first
  if (req.headers.origin) {
    redirectUrl = req.headers.origin;
  } else if (req.headers.referer) {
    // Extract origin from referer
    const origin = req.headers.referer.match(/^https?:\/\/[^\/]+/)?.[0];
    if (origin) {
      redirectUrl = origin;
    }
  }

  res.redirect(`${redirectUrl}/`);
}

export default corsMiddleware(handler);
