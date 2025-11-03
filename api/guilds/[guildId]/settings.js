import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds } from '../../lib/discord.js';
import { connectToDatabase } from '../../lib/db.js';
import GuildSettings from '../../../models/GuildSettings.js';

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
