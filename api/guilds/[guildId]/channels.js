/**
 * Guild channels endpoint for fetching text channels in a Discord server.
 * Uses bot token to fetch channels and MongoDB caching to reduce API calls.
 * @module api/guilds/[guildId]/channels
 */

import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds, getCachedGuildChannels } from '../../lib/discord.js';

/**
 * Vercel serverless function handler for retrieving guild text channels.
 * Verifies user has access to the guild, then fetches and caches channel list.
 *
 * HTTP Method: GET only
 *
 * Authentication: Required (via cookies)
 * - Requires discord_session cookie
 * - Requires discord_token cookie
 *
 * URL Parameters:
 * - guildId: Discord guild (server) ID from URL path
 *
 * Environment Variables:
 * - BOT_TOKEN: Discord bot token (required for fetching channels)
 *
 * Access Control:
 * - User must be a member of the guild
 * - Guild list is fetched to verify membership
 *
 * Caching:
 * - Implements 5-minute MongoDB cache for channel lists
 * - Falls back to stale cache if rate limited
 *
 * Channel Filtering:
 * - Returns only text channels (type 0)
 * - Sorted by position property
 *
 * Response format:
 * {
 *   channels: [
 *     {
 *       id: string,
 *       name: string,
 *       position: number
 *     }
 *   ],
 *   warning?: string  // Present if using fallback or bot token missing
 * }
 *
 * Error Responses:
 * - 400: Guild ID is required
 * - 401: Not authenticated
 * - 404: Guild not found or user has no access
 * - 405: Method not allowed (non-GET request)
 * - 500: Discord API failure (returns empty array with warning)
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {string} req.method - HTTP method
 * @param {Object} req.query - URL query parameters
 * @param {string} req.query.guildId - Discord guild ID
 * @param {Object} req.cookies - Parsed cookies
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends JSON response with channels array or error
 *
 * @example
 * // Request: GET /api/guilds/123456789/channels
 * // Cookies: discord_session=..., discord_token=...
 * // Response: 200 OK
 * // {
 * //   "channels": [
 * //     {
 * //       "id": "987654321",
 * //       "name": "general",
 * //       "position": 0
 * //     },
 * //     {
 * //       "id": "987654322",
 * //       "name": "announcements",
 * //       "position": 1
 * //     }
 * //   ]
 * // }
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guildId } = req.query;

  if (!guildId) {
    return res.status(400).json({ error: 'Guild ID is required' });
  }

  try {
    // Check authentication
    const { token, userId } = requireAuth(req);

    // Verify user has access to this guild with caching
    const result = await getCachedUserGuilds(token, userId);

    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;
    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or no access' });
    }

    // Fetch channels with MongoDB caching
    const botToken = process.env.BOT_TOKEN;
    const channelResult = await getCachedGuildChannels(guildId, botToken);

    return res.status(200).json({
      channels: channelResult.channels,
      ...(channelResult.warning && { warning: channelResult.warning })
    });
  } catch (error) {
    console.error('Error fetching guild channels:', error);

    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(200).json({
      channels: [],
      warning: 'An error occurred while fetching channels.'
    });
  }
}

export default corsMiddleware(handler);
