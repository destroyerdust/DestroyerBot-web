/**
 * Command categories for CommandShowcase component
 * Each category has an ID, display name, and emoji icon
 */
export const COMMAND_CATEGORIES = [
  { id: 'utility', name: 'Utility', icon: '⚡' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'moderation', name: 'Administrator', icon: '👑' },
]

/**
 * Complete list of bot commands for showcase
 * Each command includes category, name, description, and example usage
 */
export const COMMAND_LIST = [
  {
    category: 'utility',
    command: '/ping',
    description:
      "Check the bot's response time and latency. Replies with 'Pong!' to confirm the bot is online and responsive.",
    example: '/ping',
  },
  {
    category: 'utility',
    command: '/user-info',
    description:
      'Display detailed information about yourself including join date, roles, and account creation date.',
    example: '/user-info',
  },
  {
    category: 'utility',
    command: '/server',
    description:
      'Display comprehensive server information including member count, channel count, server creation date, and more.',
    example: '/server',
  },
  {
    category: 'utility',
    command: '/weather <location>',
    description:
      'Get current weather conditions for any location worldwide. Supports optional temperature units (Celsius, Fahrenheit, Canadian). Uses Pirate Weather API with government data.',
    example: '/weather New York',
  },
  {
    category: 'gaming',
    command: '/rio character <name> realm <realm>',
    description:
      'Fetch detailed Raider IO World of Warcraft character information including Mythic+ scores and raid progress.',
    example: '/rio character Arthas realm Tichondrius',
  },
  {
    category: 'gaming',
    command: '/rio guild <name> realm <realm>',
    description: 'Get comprehensive Raider IO guild information and rankings for your WoW guild.',
    example: '/rio guild MyGuild realm Tichondrius',
  },
  {
    category: 'gaming',
    command: '/pokemon search <query>',
    description:
      'Search the Pokemon Trading Card Game database by card name. Shows card images, stats, types, prices, and more.',
    example: '/pokemon search Charizard',
  },
  {
    category: 'gaming',
    command: '/pokemon random',
    description:
      'Get a random Pokemon card from the TCG database. Great for discovering new cards!',
    example: '/pokemon random',
  },
  {
    category: 'moderation',
    command: '/kick <member>',
    description:
      'Select a member and kick them from the server. This is a demo command for moderation purposes.',
    example: '/kick @username',
  },
  {
    category: 'moderation',
    command: '/setcommandrole <command> <role>',
    description:
      'Assign a role to a command for permission control. Requires Manage Server permission. Part of the role-based permission system.',
    example: '/setcommandrole ping @Moderator',
  },
  {
    category: 'moderation',
    command: '/listpermissions',
    description:
      'View all configured command permissions for the server. Shows which roles can use which commands.',
    example: '/listpermissions',
  },
]
