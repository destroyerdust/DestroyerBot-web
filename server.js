import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// Support both dev (5173) and preview (4173) modes
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173'  // Vite preview server
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Discord OAuth callback endpoint
app.get('/api/auth/discord', async (req, res) => {
  const { code, state } = req.query;

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
        scope: 'identify email guilds',
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

    // Store access token for API calls (in production, encrypt this)
    const accessToken = tokenData.access_token;
    
    // Create a simple session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(JSON.stringify(userInfo)).toString('base64');

    // Set cookie with session data
    res.cookie('discord_session', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 604800000, // 7 days
    });

    res.cookie('discord_user', encodeURIComponent(JSON.stringify(userInfo)), {
      sameSite: 'lax',
      maxAge: 604800000, // 7 days
    });

    res.cookie('discord_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 604800000, // 7 days
    });

    // Redirect to dashboard - use state parameter (contains origin) or fallback to referer
    let redirectUrl = 'http://localhost:5173'; // default
    
    if (state && ALLOWED_ORIGINS.includes(decodeURIComponent(state))) {
      redirectUrl = decodeURIComponent(state);
    } else {
      const referer = req.get('referer');
      const origin = referer ? referer.match(/^https?:\/\/[^\/]+/)?.[0] : null;
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        redirectUrl = origin;
      }
    }
    
    res.redirect(`${redirectUrl}/dashboard`);
  } catch (error) {
    console.error('Discord OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Guilds endpoint
app.get('/api/guilds', async (req, res) => {
  // Get access token from cookie
  const token = req.cookies?.discord_token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Fetch user's guilds from Discord API
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!guildsResponse.ok) {
      console.error('Failed to fetch guilds:', await guildsResponse.text());
      return res.status(guildsResponse.status).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = await guildsResponse.json();

    // Filter guilds where user has MANAGE_GUILD permission (0x00000020 = 32)
    // The permissions field is a string representation of a bitfield
    const MANAGE_GUILD = 0x00000020;
    
    const manageableGuilds = guilds.filter(guild => {
      const permissions = parseInt(guild.permissions);
      // Check if user has MANAGE_GUILD permission or ADMINISTRATOR permission (0x00000008)
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD || (permissions & 0x00000008) === 0x00000008;
    });

    // Return guilds with relevant information
    const formattedGuilds = manageableGuilds.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      owner: guild.owner,
      permissions: guild.permissions,
    }));

    return res.status(200).json({ guilds: formattedGuilds });
  } catch (error) {
    console.error('Error fetching guilds:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.get('/api/auth/logout', (req, res) => {
  // Clear cookies
  res.clearCookie('discord_session', { path: '/' });
  res.clearCookie('discord_user', { path: '/' });
  res.clearCookie('discord_token', { path: '/' });
  
  // Redirect to home - use referer or default to dev port
  const origin = req.get('origin') || req.get('referer')?.match(/^https?:\/\/[^\/]+/)?.[0] || 'http://localhost:5173';
  res.redirect(`${origin}/`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Auth server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Auth server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend can run on:`);
  console.log(`   - Dev mode:     http://localhost:5173 (npm run dev)`);
  console.log(`   - Preview mode: http://localhost:4173 (npm run preview)`);
  console.log(`🔐 Discord OAuth redirect: ${process.env.DISCORD_REDIRECT_URI}`);
});
