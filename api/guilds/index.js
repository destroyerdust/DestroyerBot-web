export default async function handler(req, res) {
  // Get access token from cookie
  const token = req.cookies?.discord_token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Fetch user's guilds from Discord API
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!guildsResponse.ok) {
      console.error('Failed to fetch guilds:', await guildsResponse.text());
      return res.status(guildsResponse.status).json({ error: 'Failed to fetch guilds' });
    }

    const guilds = await guildsResponse.json();

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
}
