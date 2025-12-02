<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Navbar -->
    <nav class="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <button @click="goBack" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 class="text-2xl font-bold text-white">Guild Settings</h1>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="logout"
              aria-label="Logout from guild settings"
              class="relative overflow-hidden group px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span class="relative z-10">Logout</span>
              <!-- Shimmer effect on hover -->
              <div
                class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
        ></div>
        <p class="text-white mt-4">Loading guild settings...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div class="text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">{{ error }}</h2>
        <button
          @click="goBack"
          class="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>

    <!-- Guild Settings Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Guild Header -->
      <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8">
        <div class="flex items-center gap-6">
          <div
            class="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden shrink-0"
          >
            <img
              v-if="guildIcon"
              :src="guildIcon"
              :alt="guild.name"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-4xl font-bold text-purple-400">
              {{ guild.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-white mb-2">{{ guild.name }}</h2>
            <p class="text-gray-400">Guild ID: {{ guildId }}</p>
            <div class="flex gap-2 mt-2">
              <span
                v-if="guild.owner"
                class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full"
              >
                Owner
              </span>
              <span v-else class="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                Manager
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bot Settings Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Prefix Settings -->
        <SettingCard
          title="Command Prefix"
          description="Set a custom prefix for bot commands in this server"
          icon-color="purple"
        >
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </template>

          <div class="flex gap-2">
            <input
              v-model="settings.prefix"
              type="text"
              placeholder="!"
              class="flex-1 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              maxlength="5"
            />
            <button
              @click="saveSettings"
              class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </SettingCard>

        <!-- Welcome Messages -->
        <SettingCard title="Welcome Messages" icon-color="blue">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </template>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Enable welcome messages</span>
              <ToggleSwitch
                v-model="settings.welcome.enabled"
                variant="purple"
                aria-label="Enable welcome messages"
              />
            </div>

            <ChannelSelector
              v-model="settings.welcome.channelId"
              :channels="channels"
              label="Welcome Channel"
              :disabled="!settings.welcome.enabled"
              focus-border-color="blue"
            />

            <textarea
              v-model="settings.welcome.message"
              :disabled="!settings.welcome.enabled"
              placeholder="Welcome {user} to {server}!"
              class="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              rows="3"
            ></textarea>
          </div>

          <template #actions>
            <button
              @click="saveSettings"
              :disabled="!settings.welcome.enabled"
              class="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Welcome Settings
            </button>
          </template>
        </SettingCard>

        <!-- Auto-Moderation -->
        <SettingCard title="Auto-Moderation" icon-color="red">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </template>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Filter profanity</span>
              <ToggleSwitch
                v-model="settings.filterProfanity"
                variant="red"
                aria-label="Toggle profanity filter"
              />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Anti-spam</span>
              <ToggleSwitch
                v-model="settings.antiSpam"
                variant="red"
                aria-label="Toggle anti-spam"
              />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Link filtering</span>
              <ToggleSwitch
                v-model="settings.linkFilter"
                variant="red"
                aria-label="Toggle link filter"
              />
            </div>
          </div>

          <template #actions>
            <button
              @click="saveSettings"
              class="w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Save Moderation Settings
            </button>
          </template>
        </SettingCard>

        <!-- Logging -->
        <SettingCard title="Logging" icon-color="green">
          <template #icon>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </template>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Enable logging</span>
              <ToggleSwitch
                v-model="settings.logs.enabled"
                variant="green"
                aria-label="Enable logging"
              />
            </div>

            <ChannelSelector
              v-model="settings.logs.channelId"
              :channels="channels"
              label="Log Channel"
              :disabled="!settings.logs.enabled"
              :warning="channelWarning"
              focus-border-color="green"
            />

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log message creates</span>
              <ToggleSwitch
                v-model="settings.logs.messageCreate"
                :disabled="!settings.logs.enabled"
                variant="green"
                aria-label="Log message creates"
              />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log message deletes</span>
              <ToggleSwitch
                v-model="settings.logs.messageDelete"
                :disabled="!settings.logs.enabled"
                variant="green"
                aria-label="Log message deletes"
              />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log member joins/leaves</span>
              <ToggleSwitch
                v-model="settings.logMembers"
                :disabled="true"
                variant="green"
                aria-label="Log member joins/leaves (coming soon)"
              />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log moderation actions</span>
              <ToggleSwitch
                v-model="settings.logModeration"
                :disabled="true"
                variant="green"
                aria-label="Log moderation actions (coming soon)"
              />
            </div>
          </div>

          <template #actions>
            <button
              @click="saveSettings"
              class="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Save Logging Settings
            </button>
          </template>
        </SettingCard>
      </div>

      <!-- Save All Button -->
      <div class="mt-8 flex justify-center">
        <button
          @click="saveSettings"
          class="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Save All Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * GuildSettings component
 * Comprehensive guild configuration interface for DestroyerBot
 * Manages welcome messages, logging, and other per-guild settings
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useNotification } from '@/composables/useNotification.js'
import ToggleSwitch from '@/components/ui/ToggleSwitch.vue'
import ChannelSelector from '@/components/ui/ChannelSelector.vue'
import SettingCard from '@/components/ui/SettingCard.vue'

const route = useRoute()
const router = useRouter()

// Use auth composable for logout
const { logout } = useAuth()

// Use notification composable
const { showNotification } = useNotification()

// Guild state
const guildId = route.params.id
const guild = ref({})
const loading = ref(true)
const error = ref(null)

/**
 * Guild settings object structure
 * @typedef {Object} GuildSettings
 * @property {string} prefix - Command prefix for this guild (e.g., '!')
 * @property {boolean} welcomeEnabled - @deprecated Use welcome.enabled instead
 * @property {string} welcomeMessage - @deprecated Use welcome.message instead
 * @property {Object} welcome - Welcome message configuration
 * @property {boolean} welcome.enabled - Whether welcome messages are enabled
 * @property {string|null} welcome.channelId - Discord channel ID for welcome messages
 * @property {string} welcome.message - Welcome message template (supports {user} and {server} placeholders)
 * @property {boolean} filterProfanity - Enable automatic profanity filtering
 * @property {boolean} antiSpam - Enable anti-spam protection
 * @property {boolean} linkFilter - Enable link filtering
 * @property {boolean} logDeletes - @deprecated Use logs.messageDelete instead
 * @property {boolean} logMembers - Whether to log member joins/leaves (not yet implemented)
 * @property {boolean} logModeration - Whether to log moderation actions (not yet implemented)
 * @property {Object} logs - Logging configuration
 * @property {boolean} logs.enabled - Whether logging is enabled
 * @property {string|null} logs.channelId - Discord channel ID for logs
 * @property {boolean} logs.messageCreate - Whether to log message creation events
 * @property {boolean} logs.messageDelete - Whether to log message deletion events
 */

// Guild settings state
const settings = ref({
  prefix: '!',
  welcomeEnabled: false,
  welcomeMessage: '',
  welcome: {
    enabled: false,
    channelId: null,
    message: 'Welcome to the server!',
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
    messageDelete: true,
  },
})

// Channel selection state
const channels = ref([])
const channelWarning = ref('')

const guildIcon = computed(() => {
  if (guild.value.icon) {
    return `https://cdn.discordapp.com/icons/${guildId}/${guild.value.icon}.png?size=256`
  }
  return null
})

const fetchGuildSettings = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`/api/guilds/${guildId}`, {
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      guild.value = data.guild
      if (data.settings) {
        settings.value = { ...settings.value, ...data.settings }
      }
    } else {
      error.value = 'Failed to load guild settings'
    }
  } catch (err) {
    console.error('Error fetching guild settings:', err)
    error.value = 'An error occurred while loading guild settings'
  } finally {
    loading.value = false
  }
}

const fetchGuildChannels = async () => {
  try {
    const response = await fetch(`/api/guilds/${guildId}/channels`, {
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      channels.value = data.channels
      if (data.warning) {
        channelWarning.value = data.warning
        console.warn('Channel fetch warning:', data.warning)
      }
    } else if (response.status === 429) {
      console.warn('Rate limited by Discord API')
      channelWarning.value = 'Rate limited by Discord. Please wait a moment and refresh the page.'
    } else {
      console.error('Failed to fetch channels')
      channelWarning.value = 'Failed to fetch channels'
    }
  } catch (err) {
    console.error('Error fetching guild channels:', err)
    channelWarning.value = 'An error occurred while fetching channels'
  }
}

const saveSettings = async () => {
  try {
    const response = await fetch(`/api/guilds/${guildId}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settings.value),
    })

    if (response.ok) {
      showNotification('Settings saved successfully!', 'success')
    } else {
      showNotification('Failed to save settings', 'error')
    }
  } catch (err) {
    console.error('Error saving settings:', err)
    showNotification('An error occurred while saving settings', 'error')
  }
}

const goBack = () => {
  router.push('/dashboard')
}

onMounted(async () => {
  await fetchGuildSettings()
  await fetchGuildChannels()
})
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
