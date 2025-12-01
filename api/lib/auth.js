/**
 * Authentication utility functions for Discord OAuth session management.
 * Handles session token parsing, cookie management, and authentication verification.
 * @module api/lib/auth
 */

/**
 * Extracts and parses user ID from the Discord session cookie.
 * The session token is a base64-encoded JSON string containing user information.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} [req.cookies] - Parsed cookies object
 * @param {string} [req.cookies.discord_session] - Base64-encoded session token
 * @returns {string|null} The user's Discord ID, or null if parsing fails or cookie is missing
 *
 * @example
 * const userId = getUserIdFromSession(req);
 * if (!userId) {
 *   return res.status(401).json({ error: 'Not authenticated' });
 * }
 */
export function getUserIdFromSession(req) {
  try {
    const sessionToken = req.cookies?.discord_session;
    if (!sessionToken) return null;

    const userInfo = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    return userInfo.id;
  } catch (error) {
    console.error('Error parsing session token:', error);
    return null;
  }
}

/**
 * Retrieves the Discord OAuth access token from HTTP-only cookies.
 * This token is used for making authenticated requests to the Discord API.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} [req.cookies] - Parsed cookies object
 * @param {string} [req.cookies.discord_token] - Discord OAuth access token
 * @returns {string|undefined} The Discord access token, or undefined if not present
 *
 * @example
 * const token = getAccessTokenFromCookies(req);
 * if (token) {
 *   // Make Discord API request with token
 * }
 */
export function getAccessTokenFromCookies(req) {
  return req.cookies?.discord_token;
}

/**
 * Validates user authentication and extracts credentials from request cookies.
 * This is a convenience function that combines getUserIdFromSession and getAccessTokenFromCookies.
 *
 * @param {Object} req - The HTTP request object
 * @param {Object} [req.cookies] - Parsed cookies object
 * @returns {{token: string, userId: string}} Object containing the access token and user ID
 * @throws {Error} Throws "Not authenticated" if either token or userId is missing
 *
 * @example
 * try {
 *   const { token, userId } = requireAuth(req);
 *   // User is authenticated, proceed with operation
 * } catch (error) {
 *   return res.status(401).json({ error: error.message });
 * }
 */
export function requireAuth(req) {
  const token = getAccessTokenFromCookies(req);
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    throw new Error('Not authenticated');
  }

  return { token, userId };
}

/**
 * Sets all authentication cookies for a logged-in user.
 * Creates three cookies:
 * - discord_session: HTTP-only cookie with base64-encoded user info for server-side validation
 * - discord_user: Client-accessible cookie with user information for frontend
 * - discord_token: HTTP-only cookie with Discord OAuth access token
 *
 * All cookies have a 7-day expiration and use SameSite=Lax for CSRF protection.
 *
 * @param {Object} res - The HTTP response object
 * @param {string} sessionToken - Base64-encoded user information for session validation
 * @param {Object} userInfo - User information object to be stored in client-accessible cookie
 * @param {string} userInfo.id - Discord user ID
 * @param {string} userInfo.username - Discord username
 * @param {string} [userInfo.discriminator] - Discord discriminator (legacy)
 * @param {string} [userInfo.avatar] - Discord avatar hash
 * @param {string} [userInfo.email] - User's email address
 * @param {string} accessToken - Discord OAuth access token for API requests
 * @returns {void}
 *
 * @example
 * const sessionToken = Buffer.from(JSON.stringify(userInfo)).toString('base64');
 * setAuthCookies(res, sessionToken, userInfo, accessToken);
 */
export function setAuthCookies(res, sessionToken, userInfo, accessToken) {
  res.setHeader('Set-Cookie', [
    `discord_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    `discord_user=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; SameSite=Lax; Max-Age=604800`,
    `discord_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  ]);
}

/**
 * Clears all authentication cookies, effectively logging out the user.
 * Sets Max-Age=0 to immediately expire all auth-related cookies.
 *
 * @param {Object} res - The HTTP response object
 * @returns {void}
 *
 * @example
 * // In logout handler
 * clearAuthCookies(res);
 * res.redirect('/');
 */
export function clearAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    `discord_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `discord_user=; Path=/; SameSite=Lax; Max-Age=0`,
    `discord_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  ]);
}
