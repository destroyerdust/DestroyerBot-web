/**
 * Discord API interaction utilities with MongoDB caching support.
 * Provides helper functions for fetching guild and channel data with rate limit logging.
 * @module api/lib/discord
 */

import { connectToDatabase } from './db.js';
import GuildCache from '../../models/GuildCache.js';
import ChannelCache from '../../models/ChannelCache.js';

/**
 * Logs Discord API call information for debugging and monitoring.
 * Includes the endpoint, HTTP method, and timestamp.
 *
 * @param {string} endpoint - The Discord API endpoint being called (e.g., '/users/@me/guilds')
 * @param {string} [method='GET'] - The HTTP method (GET, POST, etc.)
 * @returns {void}
 *
 * @example
 * logDiscordAPICall('/guilds/123456/channels', 'GET');
 */
export function logDiscordAPICall(endpoint, method = 'GET') {
  console.log(`🔵 Discord API Call: ${method} ${endpoint} at ${new Date().toISOString()}`);
}

/**
 * Logs Discord API response information including rate limit details.
 * Helps monitor API usage and identify potential rate limiting issues.
 *
 * @param {string} endpoint - The Discord API endpoint that was called
 * @param {number} status - HTTP response status code
 * @param {Headers} headers - Response headers object containing rate limit information
 * @returns {void}
 *
 * @example
 * const response = await fetch('https://discord.com/api/users/@me');
 * logDiscordAPIResponse('/users/@me', response.status, response.headers);
 */
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

/**
 * Fetches user's Discord guilds with MongoDB caching to reduce API calls.
 * Implements a 5-minute cache TTL (Time To Live).
 *
 * @async
 * @param {string} token - Discord OAuth access token (Bearer token)
 * @param {string} userId - Discord user ID for cache lookup
 * @returns {Promise<Object>} Result object containing guilds array and cache status
 * @returns {Array<Object>} returns.guilds - Array of guild objects from Discord API
 * @returns {boolean} [returns.fromCache] - Whether data was served from cache
 * @returns {boolean} [returns.error] - Whether an error occurred
 * @returns {number} [returns.status] - HTTP status code if error occurred
 * @returns {string} [returns.message] - Error message if applicable
 *
 * @example
 * const result = await getCachedUserGuilds(token, userId);
 * if (result.error) {
 *   return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
 * }
 * const guilds = result.guilds;
 */
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

/**
 * Fetches guild channels with MongoDB caching and fallback handling.
 * Implements a 5-minute cache TTL. Falls back to stale cache if rate limited.
 * Filters and returns only text channels (type 0).
 *
 * @async
 * @param {string} guildId - Discord guild (server) ID
 * @param {string} botToken - Discord bot token for API authentication (without 'Bot' prefix)
 * @returns {Promise<Object>} Result object containing channels and optional warnings
 * @returns {Array<Object>} returns.channels - Array of text channel objects {id, name, position}
 * @returns {boolean} [returns.fromCache] - Whether data was served from cache
 * @returns {string} [returns.warning] - Warning message if bot token missing or rate limited
 *
 * @example
 * const result = await getCachedGuildChannels(guildId, process.env.BOT_TOKEN);
 * if (result.warning) {
 *   console.warn(result.warning);
 * }
 * return res.json({ channels: result.channels });
 */
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
