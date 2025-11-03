import { corsMiddleware } from '../lib/cors.js';
import { requireAuth } from '../lib/auth.js';
import { getCachedUserGuilds } from '../lib/discord.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default corsMiddleware(handler);
