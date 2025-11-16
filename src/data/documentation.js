/**
 * Command categories for comprehensive documentation
 * Each category includes ID, display name, and emoji icon
 */
export const COMMAND_CATEGORIES = [
  { id: 'all', name: 'All Commands', icon: '📋' },
  { id: 'utility', name: 'Utility', icon: '🛠️' },
  { id: 'moderation', name: 'Moderation', icon: '🛡️' },
  { id: 'admin', name: 'Admin', icon: '👑' },
  { id: 'games', name: 'Games', icon: '🎮' },
  { id: 'pokemon', name: 'Pokemon', icon: '🐾' },
  { id: 'weather', name: 'Weather', icon: '🌤️' },
  { id: 'hardware', name: 'Hardware', icon: '⚙️' },
]

/**
 * Complete command documentation with detailed parameters and examples
 * Each command includes name, category, description, parameters, examples, and permissions
 */
export const COMMAND_DOCUMENTATION = [
  // Utility Commands
  {
    name: 'help',
    category: 'utility',
    description: 'Display comprehensive information about all available bot commands',
    parameters: [],
    examples: ['/help'],
  },
  {
    name: 'ping',
    category: 'utility',
    description: "Check the bot's response time and latency",
    parameters: [],
    examples: ['/ping'],
  },
  {
    name: 'server-info',
    category: 'utility',
    description:
      'Display comprehensive information about this server including member count, channels, roles, and features',
    parameters: [],
    examples: ['/server-info'],
  },
  {
    name: 'user-info',
    category: 'utility',
    description: 'Display detailed information about yourself or another user',
    parameters: [
      { name: 'user', description: 'User to get info about (optional)', required: false },
    ],
    examples: ['/user-info', '/user-info @username'],
  },
  {
    name: 'avatar-info',
    category: 'utility',
    description: "Get information about a user's avatar and profile picture",
    parameters: [
      { name: 'user', description: 'User to get avatar info for (optional)', required: false },
    ],
    examples: ['/avatar-info', '/avatar-info @username'],
  },
  {
    name: 'channel-info',
    category: 'utility',
    description: 'Display information about a specific channel',
    parameters: [
      { name: 'channel', description: 'Channel to get info about (optional)', required: false },
    ],
    examples: ['/channel-info', '/channel-info #general'],
  },
  {
    name: 'role-info',
    category: 'utility',
    description: 'Get detailed information about a specific role',
    parameters: [{ name: 'role', description: 'Role to get info about', required: true }],
    examples: ['/role-info @Moderator'],
  },
  {
    name: 'role-list',
    category: 'utility',
    description: 'List all roles in the server with their permissions',
    parameters: [],
    examples: ['/role-list'],
  },
  {
    name: 'bot-stats',
    category: 'utility',
    description: 'Display bot statistics including uptime, memory usage, and server count',
    parameters: [],
    examples: ['/bot-stats'],
  },
  {
    name: 'clean',
    category: 'utility',
    description: 'Delete a specified number of messages from the current channel',
    parameters: [
      { name: 'amount', description: 'Number of messages to delete (1-100)', required: true },
    ],
    examples: ['/clean 10'],
    permissions: 'Manage Messages permission',
  },

  // Moderation Commands
  {
    name: 'kick',
    category: 'moderation',
    description: 'Remove a member from the server',
    parameters: [
      { name: 'member', description: 'Member to kick', required: true },
      { name: 'reason', description: 'Reason for kicking (optional)', required: false },
    ],
    examples: ['/kick @user', '/kick @user Spamming'],
    permissions: 'Kick Members permission',
  },
  {
    name: 'setnick',
    category: 'moderation',
    description: "Change a member's nickname in the server",
    parameters: [
      { name: 'member', description: 'Member whose nickname to change', required: true },
      { name: 'nickname', description: 'New nickname (leave empty to reset)', required: false },
    ],
    examples: ['/setnick @user CoolName', '/setnick @user'],
    permissions: 'Manage Nicknames permission',
  },

  // Admin Commands
  {
    name: 'setwelcomemessage',
    category: 'admin',
    description: 'Set the welcome message for new members joining the server',
    parameters: [
      {
        name: 'message',
        description: 'Welcome message with placeholders {user}, {username}, {guild}',
        required: true,
      },
    ],
    examples: ['/setwelcomemessage Welcome {user} to {guild}!'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'setwelcomechannel',
    category: 'admin',
    description: 'Set the channel where welcome messages will be sent',
    parameters: [{ name: 'channel', description: 'Channel for welcome messages', required: true }],
    examples: ['/setwelcomechannel #welcome'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'togglewelcome',
    category: 'admin',
    description: 'Enable or disable welcome messages for new members',
    parameters: [],
    examples: ['/togglewelcome'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'setlogchannel',
    category: 'admin',
    description: 'Set the channel where moderation logs will be sent',
    parameters: [
      { name: 'channel', description: 'Channel for logging moderation actions', required: true },
    ],
    examples: ['/setlogchannel #mod-logs'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'logsettings',
    category: 'admin',
    description: 'View current logging settings and configured channels',
    parameters: [],
    examples: ['/logsettings'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'setcommandrole',
    category: 'admin',
    description: 'Restrict a command to users with a specific role',
    parameters: [
      { name: 'command', description: 'Command to restrict', required: true },
      { name: 'role', description: 'Role required to use the command', required: true },
    ],
    examples: ['/setcommandrole kick @Moderator'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'removecommandrole',
    category: 'admin',
    description: 'Remove role restrictions from a command',
    parameters: [
      { name: 'command', description: 'Command to remove restrictions from', required: true },
    ],
    examples: ['/removecommandrole kick'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'listpermissions',
    category: 'admin',
    description: 'View all configured command permissions and role restrictions',
    parameters: [],
    examples: ['/listpermissions'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'togglecommand',
    category: 'admin',
    description: 'Enable or disable a specific command in the server',
    parameters: [{ name: 'command', description: 'Command to toggle', required: true }],
    examples: ['/togglecommand weather'],
    permissions: 'Manage Guild permission',
  },
  {
    name: 'resetpermissions',
    category: 'admin',
    description: 'Reset all command permissions to default settings',
    parameters: [],
    examples: ['/resetpermissions'],
    permissions: 'Manage Guild permission',
  },

  // Games Commands
  {
    name: 'rio',
    category: 'games',
    description: 'Get World of Warcraft character and guild information from Raider.IO',
    parameters: [
      { name: 'subcommand', description: 'character, guild, or affixes', required: true },
      {
        name: 'realm',
        description: 'Character/guild realm (for character/guild subcommands)',
        required: false,
      },
      {
        name: 'name',
        description: 'Character/guild name (for character/guild subcommands)',
        required: false,
      },
      { name: 'region', description: 'Region (us, eu, kr, tw, cn)', required: false },
    ],
    examples: [
      '/rio character realm "Area 52" name "CharacterName"',
      '/rio guild realm "Area 52" name "GuildName"',
      '/rio affixes',
    ],
  },

  // Pokemon Commands
  {
    name: 'pokemon',
    category: 'pokemon',
    description: 'Search Pokemon Trading Card Game database',
    parameters: [
      { name: 'subcommand', description: 'search or random', required: true },
      {
        name: 'query',
        description: 'Card name to search for (for search subcommand)',
        required: false,
      },
    ],
    examples: ['/pokemon search Charizard', '/pokemon random'],
  },

  // Weather Commands
  {
    name: 'weather',
    category: 'weather',
    description: 'Get current weather conditions for any location worldwide',
    parameters: [
      {
        name: 'location',
        description: 'City name (e.g., "New York" or "London, UK")',
        required: true,
      },
      {
        name: 'units',
        description: 'Temperature units (Celsius, Fahrenheit, Canadian)',
        required: false,
      },
    ],
    examples: ['/weather New York', '/weather "London, UK" units Celsius'],
  },

  // Hardware Commands
  {
    name: '3d-print-status',
    category: 'hardware',
    description: 'Check the status of 3D printers (bot owner only)',
    parameters: [],
    examples: ['/3d-print-status'],
    permissions: 'Bot Owner only',
  },
]
