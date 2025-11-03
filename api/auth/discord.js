import dotenv from 'dotenv';
import { corsMiddleware } from '../lib/cors.js';
import { setAuthCookies } from '../lib/auth.js';
import { logDiscordAPICall, logDiscordAPIResponse } from '../lib/discord.js';

// Load environment variables for serverless functions
dotenv.config({ path: '.env.local' });

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
    // Exchange code for access token
    logDiscordAPICall('/oauth2/token', 'POST');
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        scope: 'identify email guilds',
      }),
    });
    logDiscordAPIResponse('/oauth2/token', tokenResponse.status, tokenResponse.headers);

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Failed to exchange code for token' });
    }

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
