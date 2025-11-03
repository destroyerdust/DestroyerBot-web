import { corsMiddleware } from '../../lib/cors.js';
import { requireAuth } from '../../lib/auth.js';
import { getCachedUserGuilds, getCachedGuildChannels } from '../../lib/discord.js';

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
