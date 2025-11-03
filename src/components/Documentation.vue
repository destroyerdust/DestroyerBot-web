<template>
  <section class="py-20 px-4 bg-gray-900">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
      >
        🤖 Complete Command Documentation
      </h2>
      <p class="text-center text-gray-400 mb-12 text-lg">
        Comprehensive guide to all DestroyerBot commands, usage, and examples
      </p>

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-md mx-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search commands..."
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <svg
            class="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm',
            activeCategory === category.id
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
          ]"
        >
          {{ category.icon }} {{ category.name }} ({{ getCategoryCommandCount(category.id) }})
        </button>
      </div>

      <!-- Commands Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="command in filteredCommands"
          :key="command.name"
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden"
        >
          <!-- Glow effect -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"
          ></div>

          <div class="relative p-6">
            <!-- Command header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <code class="text-lg font-mono text-green-400 font-semibold">
                  /{{ command.name }}
                </code>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                    {{ command.category }}
                  </span>
                  <span
                    v-if="command.permissions"
                    class="text-xs px-2 py-1 bg-red-900/50 text-red-300 rounded-full"
                    title="Requires special permissions"
                  >
                    🔒 Admin
                  </span>
                </div>
              </div>
              <button
                @click="copyCommand(command.name)"
                :class="[
                  'p-2 rounded-lg transition-all duration-300',
                  copiedCommand === command.name
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white',
                ]"
                :title="copiedCommand === command.name ? 'Copied!' : 'Copy command'"
              >
                <svg
                  v-if="copiedCommand !== command.name"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>

            <!-- Command description -->
            <p class="text-gray-300 text-sm leading-relaxed mb-4">
              {{ command.description }}
            </p>

            <!-- Parameters -->
            <div v-if="command.parameters && command.parameters.length > 0" class="mb-4">
              <div class="text-xs text-gray-500 mb-2">Parameters:</div>
              <div class="space-y-1">
                <div
                  v-for="param in command.parameters"
                  :key="param.name"
                  class="text-xs bg-gray-800/50 px-2 py-1 rounded flex items-center gap-2"
                >
                  <code class="text-blue-400">{{ param.name }}</code>
                  <span class="text-gray-400">{{ param.description }}</span>
                  <span v-if="param.required" class="text-red-400 text-xs">(required)</span>
                </div>
              </div>
            </div>

            <!-- Usage Examples -->
            <div v-if="command.examples && command.examples.length > 0" class="mb-4">
              <div class="text-xs text-gray-500 mb-2">Examples:</div>
              <div class="space-y-2">
                <div
                  v-for="example in command.examples"
                  :key="example"
                  class="text-xs font-mono bg-gray-800/50 px-2 py-1 rounded text-blue-400"
                >
                  {{ example }}
                </div>
              </div>
            </div>

            <!-- Permissions note -->
            <div v-if="command.permissions" class="text-xs text-red-300 bg-red-900/20 px-2 py-1 rounded">
              ⚠️ Requires: {{ command.permissions }}
            </div>
          </div>

          <!-- Animated border -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            <div class="absolute inset-0 rounded-xl border-2 border-purple-500/50"></div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-purple-400 mb-2">{{ totalCommands }}</div>
          <div class="text-sm text-gray-400">Total Commands</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-blue-400 mb-2">{{ categories.length }}</div>
          <div class="text-sm text-gray-400">Categories</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-indigo-400 mb-2">{{ adminCommands }}</div>
          <div class="text-sm text-gray-400">Admin Commands</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-purple-400 mb-2">24/7</div>
          <div class="text-sm text-gray-400">Availability</div>
        </div>
      </div>

      <!-- Usage Tips -->
      <div class="mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-white mb-4">💡 Usage Tips</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong class="text-purple-400">Slash Commands:</strong> Start with <code class="bg-gray-700 px-1 rounded">/</code> and select from the autocomplete menu
          </div>
          <div>
            <strong class="text-blue-400">Permissions:</strong> Some commands require specific roles or server ownership
          </div>
          <div>
            <strong class="text-green-400">Context:</strong> Commands work in both servers and direct messages (where applicable)
          </div>
          <div>
            <strong class="text-indigo-400">Help:</strong> Each command shows its own help when you start typing it
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Documentation',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      copiedCommand: null,
      categories: [
        { id: 'all', name: 'All Commands', icon: '📋' },
        { id: 'utility', name: 'Utility', icon: '🛠️' },
        { id: 'moderation', name: 'Moderation', icon: '🛡️' },
        { id: 'admin', name: 'Admin', icon: '👑' },
        { id: 'games', name: 'Games', icon: '🎮' },
        { id: 'pokemon', name: 'Pokemon', icon: '🐾' },
        { id: 'weather', name: 'Weather', icon: '🌤️' },
        { id: 'hardware', name: 'Hardware', icon: '⚙️' },
      ],
      commands: [
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
          description: 'Check the bot\'s response time and latency',
          parameters: [],
          examples: ['/ping'],
        },
        {
          name: 'server-info',
          category: 'utility',
          description: 'Display comprehensive information about this server including member count, channels, roles, and features',
          parameters: [],
          examples: ['/server-info'],
        },
        {
          name: 'user-info',
          category: 'utility',
          description: 'Display detailed information about yourself or another user',
          parameters: [
            { name: 'user', description: 'User to get info about (optional)', required: false }
          ],
          examples: ['/user-info', '/user-info @username'],
        },
        {
          name: 'avatar-info',
          category: 'utility',
          description: 'Get information about a user\'s avatar and profile picture',
          parameters: [
            { name: 'user', description: 'User to get avatar info for (optional)', required: false }
          ],
          examples: ['/avatar-info', '/avatar-info @username'],
        },
        {
          name: 'channel-info',
          category: 'utility',
          description: 'Display information about a specific channel',
          parameters: [
            { name: 'channel', description: 'Channel to get info about (optional)', required: false }
          ],
          examples: ['/channel-info', '/channel-info #general'],
        },
        {
          name: 'role-info',
          category: 'utility',
          description: 'Get detailed information about a specific role',
          parameters: [
            { name: 'role', description: 'Role to get info about', required: true }
          ],
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
            { name: 'amount', description: 'Number of messages to delete (1-100)', required: true }
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
            { name: 'reason', description: 'Reason for kicking (optional)', required: false }
          ],
          examples: ['/kick @user', '/kick @user Spamming'],
          permissions: 'Kick Members permission',
        },
        {
          name: 'setnick',
          category: 'moderation',
          description: 'Change a member\'s nickname in the server',
          parameters: [
            { name: 'member', description: 'Member whose nickname to change', required: true },
            { name: 'nickname', description: 'New nickname (leave empty to reset)', required: false }
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
            { name: 'message', description: 'Welcome message with placeholders {user}, {username}, {guild}', required: true }
          ],
          examples: ['/setwelcomemessage Welcome {user} to {guild}!'],
          permissions: 'Manage Guild permission',
        },
        {
          name: 'setwelcomechannel',
          category: 'admin',
          description: 'Set the channel where welcome messages will be sent',
          parameters: [
            { name: 'channel', description: 'Channel for welcome messages', required: true }
          ],
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
            { name: 'channel', description: 'Channel for logging moderation actions', required: true }
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
            { name: 'role', description: 'Role required to use the command', required: true }
          ],
          examples: ['/setcommandrole kick @Moderator'],
          permissions: 'Manage Guild permission',
        },
        {
          name: 'removecommandrole',
          category: 'admin',
          description: 'Remove role restrictions from a command',
          parameters: [
            { name: 'command', description: 'Command to remove restrictions from', required: true }
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
          parameters: [
            { name: 'command', description: 'Command to toggle', required: true }
          ],
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
            { name: 'realm', description: 'Character/guild realm (for character/guild subcommands)', required: false },
            { name: 'name', description: 'Character/guild name (for character/guild subcommands)', required: false },
            { name: 'region', description: 'Region (us, eu, kr, tw, cn)', required: false }
          ],
          examples: [
            '/rio character realm "Area 52" name "CharacterName"',
            '/rio guild realm "Area 52" name "GuildName"',
            '/rio affixes'
          ],
        },

        // Pokemon Commands
        {
          name: 'pokemon',
          category: 'pokemon',
          description: 'Search Pokemon Trading Card Game database',
          parameters: [
            { name: 'subcommand', description: 'search or random', required: true },
            { name: 'query', description: 'Card name to search for (for search subcommand)', required: false }
          ],
          examples: ['/pokemon search Charizard', '/pokemon random'],
        },

        // Weather Commands
        {
          name: 'weather',
          category: 'weather',
          description: 'Get current weather conditions for any location worldwide',
          parameters: [
            { name: 'location', description: 'City name (e.g., "New York" or "London, UK")', required: true },
            { name: 'units', description: 'Temperature units (Celsius, Fahrenheit, Canadian)', required: false }
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
      ],
    }
  },
  computed: {
    filteredCommands() {
      let filtered = this.commands

      // Filter by category
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(cmd => cmd.category === this.activeCategory)
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(cmd =>
          cmd.name.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.category.toLowerCase().includes(query)
        )
      }

      return filtered
    },
    totalCommands() {
      return this.commands.length
    },
    adminCommands() {
      return this.commands.filter(cmd => cmd.permissions).length
    },
  },
  methods: {
    getCategoryCommandCount(categoryId) {
      if (categoryId === 'all') return this.commands.length
      return this.commands.filter(cmd => cmd.category === categoryId).length
    },
    async copyCommand(command) {
      try {
        await navigator.clipboard.writeText(`/${command}`)
        this.copiedCommand = command
        setTimeout(() => {
          this.copiedCommand = null
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    },
  },
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
