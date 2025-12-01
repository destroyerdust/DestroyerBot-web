/**
 * Guild settings update endpoint for saving bot configuration changes.
 * Handles POST requests to persist guild settings to MongoDB with permission verification.
 * @module api/guilds/[guildId]/settings
 */

import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds } from '../../lib/discord.js';
import { connectToDatabase } from '../../lib/db.js';
import GuildSettings from '../../../models/GuildSettings.js';

/**
 * Vercel serverless function handler for updating guild bot settings.
 * Validates user permissions, then upserts settings to MongoDB.
 *
 * HTTP Method: POST only
 *
 * Authentication: Required (via cookies)
 * - Requires discord_session cookie
 * - Requires discord_token cookie
 *
 * URL Parameters:
 * - guildId: Discord guild (server) ID from URL path
 *
 * Request Body: JSON object containing guild settings
 * - prefix: string - Command prefix (e.g., '!')
 * - welcome: object
 *   - enabled: boolean
 *   - channelId: string|null
 *   - message: string
 * - logs: object
 *   - enabled: boolean
 *   - channelId: string|null
 *   - messageCreate: boolean
 *   - messageDelete: boolean
 * - filterProfanity: boolean
 * - antiSpam: boolean
 * - linkFilter: boolean
 * - logMembers: boolean
 * - logModeration: boolean
 *
 * Permission Requirements:
 * - User must have MANAGE_GUILD (0x00000020) or ADMINISTRATOR (0x00000008) permission
 *
 * Database Operations:
 * - Connects to MongoDB
 * - Performs upsert (create if not exists, update if exists)
 * - Runs Mongoose validators on update
 * - Returns updated document
 *
 * Response format:
 * {
 *   success: true,
 *   settings: {
 *     guildId: string,
 *     prefix: string,
 *     welcome: { enabled, channelId, message },
 *     logs: { enabled, channelId, messageCreate, messageDelete },
 *     filterProfanity: boolean,
 *     antiSpam: boolean,
 *     linkFilter: boolean,
 *     logMembers: boolean,
 *     logModeration: boolean,
 *     createdAt: string,
 *     updatedAt: string
 *   }
 * }
 *
 * Error Responses:
 * - 400: Guild ID is required
 * - 401: Not authenticated
 * - 403: Insufficient permissions (user lacks MANAGE_GUILD)
 * - 404: Guild not found or user has no access
 * - 405: Method not allowed (non-POST request)
 * - 500: Internal server error or database failure
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {string} req.method - HTTP method
 * @param {Object} req.query - URL query parameters
 * @param {string} req.query.guildId - Discord guild ID
 * @param {Object} req.body - Request body containing settings to save
 * @param {Object} req.cookies - Parsed cookies
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends JSON response with updated settings or error
 *
 * @example
 * // Request: POST /api/guilds/123456789/settings
 * // Cookies: discord_session=..., discord_token=...
 * // Body: {
 * //   "prefix": "!",
 * //   "welcome": {
 * //     "enabled": true,
 * //     "channelId": "987654321",
 * //     "message": "Welcome {{user}}!"
 * //   },
 * //   "filterProfanity": true
 * // }
 * //
 * // Response: 200 OK
 * // {
 * //   "success": true,
 * //   "settings": {
 * //     "guildId": "123456789",
 * //     "prefix": "!",
 * //     "welcome": { "enabled": true, "channelId": "987654321", "message": "Welcome {{user}}!" },
 * //     "filterProfanity": true,
 * //     "createdAt": "2024-01-01T00:00:00.000Z",
 * //     "updatedAt": "2024-01-01T12:00:00.000Z"
 * //   }
 * // }
 */
async function handler(req, res) {
  if (req.method !== 'POST') {
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

    // Check permissions
    const MANAGE_GUILD = 0x00000020;
    const permissions = parseInt(guild.permissions);

    if ((permissions & MANAGE_GUILD) !== MANAGE_GUILD && (permissions & 0x00000008) !== 0x00000008) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Connect to database and save settings
    await connectToDatabase();

    // Save settings to database (upsert: create if doesn't exist, update if exists)
    const updatedSettings = await GuildSettings.findOneAndUpdate(
      { guildId },
      {
        guildId,
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

    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default corsMiddleware(handler);
