export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(400).json({ error: 'Failed to exchange code for token' });
    }

    // Get user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

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

    // Create a simple session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(JSON.stringify(userInfo)).toString('base64');

    // Set cookie with session data
    res.setHeader('Set-Cookie', [
      `discord_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
      `discord_user=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; SameSite=Lax; Max-Age=604800`
    ]);

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
