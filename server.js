import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import GuildSettings from './models/GuildSettings.js';
import GuildCache from './models/GuildCache.js';
import ChannelCache from './models/ChannelCache.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// Debug logging for Discord API calls
const logDiscordAPICall = (endpoint, method = 'GET') => {
  console.log(`🔵 Discord API Call: ${method} ${endpoint} at ${new Date().toISOString()}`);
};

const logDiscordAPIResponse = (endpoint, status, headers) => {
  const rateLimit = {
    limit: headers.get('x-ratelimit-limit'),
    remaining: headers.get('x-ratelimit-remaining'),
    reset: headers.get('x-ratelimit-reset'),
    resetAfter: headers.get('x-ratelimit-reset-after'),
    bucket: headers.get('x-ratelimit-bucket'),
  };
  
  console.log(`📊 Discord API Response: ${endpoint}`);
  console.log(`   Status: ${status}`);
  console.log(`   Rate Limit: ${rateLimit.remaining}/${rateLimit.limit} remaining`);
  if (rateLimit.reset) {
    const resetDate = new Date(parseInt(rateLimit.reset) * 1000);
    console.log(`   Resets at: ${resetDate.toISOString()} (in ${rateLimit.resetAfter}s)`);
  }
  
  if (status === 429) {
    console.error(`❌ RATE LIMITED on ${endpoint}`);
    console.error(`   Retry after: ${headers.get('retry-after')} seconds`);
  }
};

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Helper function to get user ID from session
const getUserIdFromSession = (req) => {
  try {
    const sessionToken = req.cookies?.discord_session;
    if (!sessionToken) return null;
    
    const userInfo = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    return userInfo.id;
  } catch (error) {
    console.error('Error parsing session token:', error);
    return null;
  }
};

// Helper function to get user's guilds with MongoDB caching
const getCachedUserGuilds = async (token, userId) => {
  const GUILD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  try {
    // Check MongoDB cache first
    const cached = await GuildCache.findOne({ userId });
    
    if (cached && Date.now() - new Date(cached.cachedAt).getTime() < GUILD_CACHE_TTL) {
      console.log(`✅ Serving guilds from MongoDB cache for user ${userId}`);
      return { guilds: cached.guilds, fromCache: true };
    }
    
    // Cache miss or expired - fetch from Discord
    logDiscordAPICall('/users/@me/guilds', 'GET');
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    logDiscordAPIResponse('/users/@me/guilds', guildsResponse.status, guildsResponse.headers);
    
    if (!guildsResponse.ok) {
      return { error: true, status: guildsResponse.status };
    }
    
    const guilds = await guildsResponse.json();
    
    // Update cache in MongoDB
    await GuildCache.findOneAndUpdate(
      { userId },
      { 
        userId, 
        guilds,
        cachedAt: new Date()
      },
      { upsert: true }
    );
    console.log(`✅ Cached guilds in MongoDB for user ${userId}`);
    
    return { guilds, fromCache: false };
  } catch (error) {
    console.error('Error in getCachedUserGuilds:', error);
    return { error: true, message: error.message };
  }
};

// Helper function to get guild channels with MongoDB caching
const getCachedGuildChannels = async (guildId, botToken) => {
  const CHANNEL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  try {
    // Check MongoDB cache first
    const cached = await ChannelCache.findOne({ guildId });
    
    if (cached && Date.now() - new Date(cached.cachedAt).getTime() < CHANNEL_CACHE_TTL) {
      console.log(`✅ Serving channels from MongoDB cache for guild ${guildId}`);
      return { channels: cached.channels, fromCache: true };
    }
    
    // Cache miss or expired - fetch from Discord
    if (!botToken) {
      console.warn('⚠️  BOT_TOKEN not configured - channel selection will be unavailable');
      return {
        channels: [],
        warning: 'Bot token not configured. Please add BOT_TOKEN to your .env.local file to enable channel selection.'
      };
    }

    logDiscordAPICall(`/guilds/${guildId}/channels`, 'GET');
    const channelsResponse = await fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });
    logDiscordAPIResponse(`/guilds/${guildId}/channels`, channelsResponse.status, channelsResponse.headers);

    if (!channelsResponse.ok) {
      const errorText = await channelsResponse.text();
      console.error('Failed to fetch channels:', errorText);
      console.error('Status:', channelsResponse.status);
      
      // If rate limited and we have old cache, use it
      if (channelsResponse.status === 429 && cached) {
        console.log('⚠️  Rate limited, using stale MongoDB cache');
        return {
          channels: cached.channels,
          warning: 'Using cached data due to rate limiting.'
        };
      }
      
      return {
        channels: [],
        warning: channelsResponse.status === 429 
          ? 'Rate limited by Discord. Please wait a moment and refresh the page.'
          : 'Unable to fetch channels. Please ensure the bot is in the guild and has proper permissions.'
      };
    }

    const channels = await channelsResponse.json();
    
    // Filter for text channels only (type 0 = GUILD_TEXT)
    const textChannels = channels
      .filter(channel => channel.type === 0)
      .map(channel => ({
        id: channel.id,
        name: channel.name,
        position: channel.position
      }))
      .sort((a, b) => a.position - b.position);

    // Update cache in MongoDB
    await ChannelCache.findOneAndUpdate(
      { guildId },
      { 
        guildId,
        channels: textChannels,
        cachedAt: new Date()
      },
      { upsert: true }
    );
    console.log(`✅ Cached channels in MongoDB for guild ${guildId}`);
    
    return { channels: textChannels, fromCache: false };
  } catch (error) {
    console.error('Error in getCachedGuildChannels:', error);
    return {
      channels: [],
      warning: 'An error occurred while fetching channels.'
    };
  }
};

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
    logDiscordAPICall('/oauth2/token', 'POST');
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

// Individual guild endpoint
app.get('/api/guilds/:id', async (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.discord_token;
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Fetch user's guilds with caching
    const result = await getCachedUserGuilds(token, userId);
    
    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;
    const guild = guilds.find(g => g.id === id);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or no access' });
    }

    // Check if user has MANAGE_GUILD permission
    const MANAGE_GUILD = 0x00000020;
    const permissions = parseInt(guild.permissions);
    
    if ((permissions & MANAGE_GUILD) !== MANAGE_GUILD && (permissions & 0x00000008) !== 0x00000008) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Get stored settings from database or return defaults
    let guildSettingsDoc = await GuildSettings.findOne({ guildId: id });

    if (!guildSettingsDoc) {
      // Return default settings if not found
      guildSettingsDoc = {
        prefix: '!',
        welcomeEnabled: false,
        welcomeMessage: '',
        welcome: {
          enabled: false,
          channelId: null,
          message: 'Welcome to the server!'
        },
        filterProfanity: false,
        antiSpam: false,
        linkFilter: false,
        logDeletes: false,
        logMembers: false,
        logModeration: false,
        logs: {
          enabled: false,
          channelId: null,
          messageCreate: true,
          messageDelete: true
        }
      };
    } else {
      // Migrate old data to new structure if needed
      let needsMigration = false;

      // Migrate welcome settings
      if (!guildSettingsDoc.welcome && (guildSettingsDoc.welcomeEnabled !== undefined || guildSettingsDoc.welcomeMessage !== undefined)) {
        guildSettingsDoc.welcome = {
          enabled: guildSettingsDoc.welcomeEnabled || false,
          channelId: null, // Will be set by user
          message: guildSettingsDoc.welcomeMessage || 'Welcome to the server!'
        };
        needsMigration = true;
      }

      // Migrate log settings
      if (!guildSettingsDoc.logs) {
        guildSettingsDoc.logs = {
          enabled: false,
          channelId: guildSettingsDoc.logChannelId || null,
          messageCreate: guildSettingsDoc.logDeletes || false, // Assuming logDeletes was for message events
          messageDelete: guildSettingsDoc.logDeletes || false
        };
        needsMigration = true;
      } else if (guildSettingsDoc.logs.enabled === undefined) {
        guildSettingsDoc.logs.enabled = false;
        needsMigration = true;
      }

      // Save migrated data
      if (needsMigration) {
        await guildSettingsDoc.save();
        console.log(`✅ Migrated settings for guild ${id}`);
      }
    }

    return res.status(200).json({ 
      guild: {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        owner: guild.owner
      },
      settings: guildSettingsDoc
    });
  } catch (error) {
    console.error('Error fetching guild:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch guild channels endpoint
app.get('/api/guilds/:id/channels', async (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.discord_token;
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Verify user has access to this guild with caching
    const result = await getCachedUserGuilds(token, userId);
    
    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;
    const guild = guilds.find(g => g.id === id);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or no access' });
    }

    // Fetch channels with MongoDB caching
    const botToken = process.env.BOT_TOKEN;
    const channelResult = await getCachedGuildChannels(id, botToken);

    return res.status(200).json({
      channels: channelResult.channels,
      ...(channelResult.warning && { warning: channelResult.warning })
    });
  } catch (error) {
    console.error('Error fetching guild channels:', error);
    return res.status(200).json({ 
      channels: [],
      warning: 'An error occurred while fetching channels.'
    });
  }
});

// Save guild settings endpoint
app.post('/api/guilds/:id/settings', async (req, res) => {
  const { id } = req.params;
  const token = req.cookies?.discord_token;
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Verify user has access to this guild with caching
    const result = await getCachedUserGuilds(token, userId);
    
    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;
    const guild = guilds.find(g => g.id === id);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or no access' });
    }

    // Check permissions
    const MANAGE_GUILD = 0x00000020;
    const permissions = parseInt(guild.permissions);
    
    if ((permissions & MANAGE_GUILD) !== MANAGE_GUILD && (permissions & 0x00000008) !== 0x00000008) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Save settings to database (upsert: create if doesn't exist, update if exists)
    const updatedSettings = await GuildSettings.findOneAndUpdate(
      { guildId: id },
      { 
        guildId: id,
        ...req.body 
      },
      { 
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error saving guild settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Guilds endpoint
app.get('/api/guilds', async (req, res) => {
  // Get access token from cookie
  const token = req.cookies?.discord_token;
  const userId = getUserIdFromSession(req);

  if (!token || !userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Fetch user's guilds with caching
    const result = await getCachedUserGuilds(token, userId);
    
    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;

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
