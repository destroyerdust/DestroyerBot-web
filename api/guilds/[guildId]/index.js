import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds } from '../../lib/discord.js';
import { connectToDatabase } from '../../lib/db.js';
import GuildSettings from '../../../models/GuildSettings.js';

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
        logChannelId: null,
        logs: {
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
          channelId: guildSettingsDoc.logChannelId || null,
          messageCreate: guildSettingsDoc.logDeletes || false, // Assuming logDeletes was for message events
          messageDelete: guildSettingsDoc.logDeletes || false
        };
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
