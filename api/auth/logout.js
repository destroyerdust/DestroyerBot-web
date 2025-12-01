/**
 * Discord OAuth logout endpoint for clearing authentication cookies.
 * @module api/auth/logout
 */

import { corsMiddleware } from '../lib/cors.js';
import { clearAuthCookies } from '../lib/auth.js';

/**
 * Vercel serverless function handler for user logout.
 * Clears all authentication cookies and redirects to the home page.
 *
 * HTTP Method: GET
 *
 * Side effects:
 * - Clears discord_session cookie (HTTP-only)
 * - Clears discord_user cookie
 * - Clears discord_token cookie (HTTP-only)
 * - Redirects to origin's home page
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.origin] - Origin header for redirect URL
 * @param {string} [req.headers.referer] - Referer header as fallback for redirect URL
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends 302 redirect after clearing cookies
 *
 * @example
 * // Request: GET /api/auth/logout
 * // Response: 302 Redirect to http://localhost:3000/
 * // Cookies cleared: discord_session, discord_user, discord_token
 */
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
