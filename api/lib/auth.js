// Helper function to get user ID from session
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

// Helper function to get access token from cookies
export function getAccessTokenFromCookies(req) {
  return req.cookies?.discord_token;
}

// Helper function to check if user is authenticated
export function requireAuth(req) {
  const token = getAccessTokenFromCookies(req);
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    throw new Error('Not authenticated');
  }

  return { token, userId };
}

// Helper function to set auth cookies
export function setAuthCookies(res, sessionToken, userInfo, accessToken) {
  res.setHeader('Set-Cookie', [
    `discord_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    `discord_user=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; SameSite=Lax; Max-Age=604800`,
    `discord_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  ]);
}

// Helper function to clear auth cookies
export function clearAuthCookies(res) {
  res.setHeader('Set-Cookie', [
    `discord_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    `discord_user=; Path=/; SameSite=Lax; Max-Age=0`,
    `discord_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  ]);
}
