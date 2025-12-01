/**
 * Guild details and settings endpoint for retrieving server configuration.
 * Fetches guild information with permission verification and returns stored settings from MongoDB.
 * Includes automatic migration of legacy settings formats.
 * @module api/guilds/[guildId]/index
 */

import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds } from '../../lib/discord.js';
import { connectToDatabase } from '../../lib/db.js';
import GuildSettings from '../../../models/GuildSettings.js';

/**
 * Vercel serverless function handler for retrieving guild details and bot settings.
 * Verifies user permissions and returns current settings or defaults if not configured.
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
 * Permission Requirements:
 * - User must have MANAGE_GUILD (0x00000020) or ADMINISTRATOR (0x00000008) permission
 *
 * Database Operations:
 * - Connects to MongoDB to fetch GuildSettings document
 * - Returns default settings if guild has no stored configuration
 * - Automatically migrates legacy settings format to new structure
 *
 * Settings Migration:
 * - Converts old welcomeEnabled/welcomeMessage to welcome object
 * - Migrates logDeletes to logs object structure
 * - Saves migrated data automatically
 *
 * Response format:
 * {
 *   guild: {
 *     id: string,
 *     name: string,
 *     icon: string|null,
 *     owner: boolean
 *   },
 *   settings: {
 *     prefix: string,
 *     welcome: {
 *       enabled: boolean,
 *       channelId: string|null,
 *       message: string
 *     },
 *     logs: {
 *       enabled: boolean,
 *       channelId: string|null,
 *       messageCreate: boolean,
 *       messageDelete: boolean
 *     },
 *     filterProfanity: boolean,
 *     antiSpam: boolean,
 *     linkFilter: boolean,
 *     logMembers: boolean,
 *     logModeration: boolean
 *   }
 * }
 *
 * Error Responses:
 * - 400: Guild ID is required
 * - 401: Not authenticated
 * - 403: Insufficient permissions (user lacks MANAGE_GUILD)
 * - 404: Guild not found or user has no access
 * - 405: Method not allowed (non-GET request)
 * - 500: Internal server error or database failure
 *
 * @async
 * @param {Object} req - Vercel serverless request object
 * @param {string} req.method - HTTP method
 * @param {Object} req.query - URL query parameters
 * @param {string} req.query.guildId - Discord guild ID
 * @param {Object} req.cookies - Parsed cookies
 * @param {Object} res - Vercel serverless response object
 * @returns {Promise<void>} Sends JSON response with guild and settings or error
 *
 * @example
 * // Request: GET /api/guilds/123456789
 * // Cookies: discord_session=..., discord_token=...
 * // Response: 200 OK
 * // {
 * //   "guild": {
 * //     "id": "123456789",
 * //     "name": "My Server",
 * //     "icon": "abc123hash",
 * //     "owner": true
 * //   },
 * //   "settings": {
 * //     "prefix": "!",
 * //     "welcome": { "enabled": true, "channelId": "987654321", "message": "Welcome!" },
 * //     "logs": { "enabled": false, "channelId": null, "messageCreate": true, "messageDelete": true },
 * //     "filterProfanity": false,
 * //     "antiSpam": false,
 * //     "linkFilter": false,
 * //     "logMembers": false,
 * //     "logModeration": false
 * //   }
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

    // Fetch user's guilds with caching
    const result = await getCachedUserGuilds(token, userId);

    if (result.error) {
      return res.status(result.status || 500).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = result.guilds;
    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or no access' });
    }

    // Check if user has MANAGE_GUILD permission
    const MANAGE_GUILD = 0x00000020;
    const permissions = parseInt(guild.permissions);

    if ((permissions & MANAGE_GUILD) !== MANAGE_GUILD && (permissions & 0x00000008) !== 0x00000008) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Connect to database and get stored settings
    await connectToDatabase();
    let guildSettingsDoc = await GuildSettings.findOne({ guildId });

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
        console.log(`✅ Migrated settings for guild ${guildId}`);
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

    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default corsMiddleware(handler);
