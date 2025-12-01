/**
 * Discord OAuth 2.0 callback handler for user authentication.
 * Exchanges authorization code for access token and creates user session.
 * @module api/auth/discord
 */

import dotenv from 'dotenv';
import { corsMiddleware } from '../lib/cors.js';
import { setAuthCookies } from '../lib/auth.js';
import { logDiscordAPICall, logDiscordAPIResponse } from '../lib/discord.js';

// Load environment variables for serverless functions
dotenv.config({ path: '.env.local' });

/**
 * Vercel serverless function handler for Discord OAuth callback.
 * Completes the OAuth flow by exchanging authorization code for access token,
 * fetching user information, and creating an authenticated session.
 *
 * HTTP Method: GET
 *
 * Required Query Parameters:
 * @param {string} req.query.code - Discord OAuth authorization code
 * @param {string} [req.query.state] - Optional state parameter containing origin URL
 *
 * Required Environment Variables:
 * - DISCORD_CLIENT_ID: Discord application client ID
 * - DISCORD_CLIENT_SECRET: Discord application client secret
 * - DISCORD_REDIRECT_URI: OAuth redirect URI (must match Discord app settings)
 *
 * OAuth Flow Steps:
 * 1. Validates authorization code and environment variables
 * 2. Exchanges code for Discord access token (POST /oauth2/token)
 * 3. Fetches user information using access token (GET /users/@me)
 * 4. Creates session cookies with user data and access token
 * 5. Redirects to /dashboard on the frontend
 *
 * Side effects:
 * - Creates discord_session cookie (HTTP-only, base64-encoded user info)
 * - Creates discord_user cookie (client-accessible, URL-encoded JSON)
 * - Creates discord_token cookie (HTTP-only, Discord access token)
 * - All cookies expire after 7 days
 *
 * Error Responses:
 * - 400: Missing authorization code or token exchange failed
 * - 500: Server configuration error (missing environment variables)
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.code - Discord OAuth authorization code
 * @param {string} [req.query.state] - Origin URL for post-login redirect
 * @param {Object} req.headers - Request headers
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends 302 redirect to dashboard or JSON error response
 *
 * @example
 * // Discord redirects user to:
 * // GET /api/auth/discord?code=ABC123&state=http%3A%2F%2Flocalhost%3A3000
 * //
 * // Handler exchanges code for token, creates session, redirects to:
 * // 302 Redirect to http://localhost:3000/dashboard
 * //
 * // Cookies set:
 * // discord_session=eyJpZCI6IjEyMzQ1Ni... (HTTP-only)
 * // discord_user=%7B%22id%22%3A%22123456%22%2C...
 * // discord_token=abc123token... (HTTP-only)
 */
async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Validate required environment variables
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Discord OAuth environment variables:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri
    });
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Debug logging
    console.log('🔍 Discord OAuth Debug Info:');
    console.log('  Request Headers:', {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer
    });
    console.log('  Query Params:', {
      code: code?.substring(0, 10) + '...',
      state
    });
    console.log('  Environment:', {
      clientId,
      redirectUri,
      hasSecret: !!clientSecret
    });

    // Exchange code for access token
    logDiscordAPICall('/oauth2/token', 'POST');

    const tokenParams = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      scope: 'identify email guilds',
    };

    console.log('📤 Token Request:');
    console.log('  redirect_uri:', redirectUri);

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenParams),
    });
    logDiscordAPIResponse('/oauth2/token', tokenResponse.status, tokenResponse.headers);

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('❌ Token Exchange Failed!');
      console.error('  Status:', tokenResponse.status);
      console.error('  Response:', JSON.stringify(tokenData, null, 2));
      console.error('  Sent redirect_uri:', redirectUri);
      console.error('  💡 Add this URL to Discord OAuth2 Redirects!');
      return res.status(400).json({
        error: 'Failed to exchange code for token',
        details: tokenData,
        sentRedirectUri: redirectUri
      });
    }

    console.log('✅ Token exchange successful!');

    // Get user information
    logDiscordAPICall('/users/@me', 'GET');
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    logDiscordAPIResponse('/users/@me', userResponse.status, userResponse.headers);

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Failed to fetch user data:', userData);
      return res.status(400).json({ error: 'Failed to fetch user data' });
    }

    // Store user data in session/cookie
    const userInfo = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      email: userData.email,
    };

    // Store access token for API calls (encrypted in production)
    const accessToken = tokenData.access_token;

    // Create a simple session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(JSON.stringify(userInfo)).toString('base64');

    // Set cookie with session data using shared utility
    setAuthCookies(res, sessionToken, userInfo, accessToken);

    // Redirect to dashboard - use state parameter (contains origin from frontend)
    let redirectUrl = 'http://localhost:3000'; // default fallback

    // Use state parameter which contains window.location.origin from frontend
    if (state) {
      const decodedState = decodeURIComponent(state);
      // Basic validation: must be http/https URL
      if (decodedState.startsWith('http://') || decodedState.startsWith('https://')) {
        redirectUrl = decodedState;
      }
    } else {
      // Fallback to referer if state not provided
      const referer = req.headers.referer;
      if (referer) {
        const origin = referer.match(/^https?:\/\/[^\/]+/)?.[0];
        if (origin) {
          redirectUrl = origin;
        }
      }
    }

    res.redirect(`${redirectUrl}/dashboard`);
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default corsMiddleware(handler);
