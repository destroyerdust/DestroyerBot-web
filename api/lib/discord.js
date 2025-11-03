import { connectToDatabase } from './db.js';
import GuildCache from '../../models/GuildCache.js';
import ChannelCache from '../../models/ChannelCache.js';

// Debug logging for Discord API calls
export function logDiscordAPICall(endpoint, method = 'GET') {
  console.log(`🔵 Discord API Call: ${method} ${endpoint} at ${new Date().toISOString()}`);
}

export function logDiscordAPIResponse(endpoint, status, headers) {
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
}

// Helper function to get user's guilds with MongoDB caching
export async function getCachedUserGuilds(token, userId) {
  const GUILD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  try {
    await connectToDatabase();

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
}

// Helper function to get guild channels with MongoDB caching
export async function getCachedGuildChannels(guildId, botToken) {
  const CHANNEL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  try {
    await connectToDatabase();

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
}
