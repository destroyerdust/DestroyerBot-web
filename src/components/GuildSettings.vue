<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
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
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
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
            class="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center overflow-hidden flex-shrink-0"
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
        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              class="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Command Prefix
          </h3>
          <p class="text-gray-400 text-sm mb-4">
            Set a custom prefix for bot commands in this server
          </p>
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
        </div>

        <!-- Welcome Messages -->
        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              class="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Welcome Messages
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Enable welcome messages</span>
              <button
                @click="settings.welcomeEnabled = !settings.welcomeEnabled"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.welcomeEnabled ? 'bg-purple-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.welcomeEnabled ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <textarea
              v-model="settings.welcomeMessage"
              :disabled="!settings.welcomeEnabled"
              placeholder="Welcome {user} to {server}!"
              class="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              rows="3"
            ></textarea>
            <button
              @click="saveSettings"
              :disabled="!settings.welcomeEnabled"
              class="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Welcome Message
            </button>
          </div>
        </div>

        <!-- Auto-Moderation -->
        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Auto-Moderation
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Filter profanity</span>
              <button
                @click="settings.filterProfanity = !settings.filterProfanity"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.filterProfanity ? 'bg-red-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.filterProfanity ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Anti-spam</span>
              <button
                @click="settings.antiSpam = !settings.antiSpam"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.antiSpam ? 'bg-red-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.antiSpam ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Link filtering</span>
              <button
                @click="settings.linkFilter = !settings.linkFilter"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.linkFilter ? 'bg-red-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.linkFilter ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <button
              @click="saveSettings"
              class="w-full px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mt-4"
            >
              Save Moderation Settings
            </button>
          </div>
        </div>

        <!-- Logging -->
        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              class="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Logging
          </h3>
          <div class="space-y-3">
            <!-- Log Channel Selector -->
            <div>
              <label class="block text-gray-300 text-sm mb-2">Log Channel</label>

              <!-- Warning Message -->
              <div
                v-if="channelWarning"
                class="mb-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
              >
                <div class="flex items-start gap-2">
                  <svg
                    class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p class="text-yellow-200 text-xs">{{ channelWarning }}</p>
                </div>
              </div>

              <div class="relative">
                <div class="flex gap-2">
                  <input
                    v-model="channelSearch"
                    @focus="handleChannelInputFocus"
                    @blur="handleChannelInputBlur"
                    @input="showChannelDropdown = true"
                    type="text"
                    placeholder="Select a channel..."
                    :disabled="channels.length === 0"
                    class="flex-1 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    v-if="selectedChannel"
                    @click="clearChannel"
                    class="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                    title="Clear selection"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Dropdown -->
                <div
                  v-if="showChannelDropdown && filteredChannels.length > 0"
                  class="absolute z-10 w-full mt-1 bg-gray-800 border border-purple-500/30 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  <button
                    v-for="channel in filteredChannels"
                    :key="channel.id"
                    @mousedown.prevent="selectChannel(channel)"
                    class="w-full px-4 py-2 text-left text-white hover:bg-purple-600/20 transition-colors flex items-center gap-2"
                  >
                    <span class="text-gray-400">#</span>
                    <span>{{ channel.name }}</span>
                  </button>
                </div>
              </div>
              <p class="text-gray-500 text-xs mt-1">
                {{ selectedChannel ? `Selected: #${selectedChannel.name}` : 'No channel selected' }}
              </p>
            </div>

            <!-- Logging Options -->
            <div class="flex items-center justify-between pt-2">
              <span class="text-gray-300">Log message deletes</span>
              <button
                @click="settings.logDeletes = !settings.logDeletes"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.logDeletes ? 'bg-green-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.logDeletes ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log member joins/leaves</span>
              <button
                @click="settings.logMembers = !settings.logMembers"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.logMembers ? 'bg-green-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.logMembers ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Log moderation actions</span>
              <button
                @click="settings.logModeration = !settings.logModeration"
                :class="[
                  'relative w-12 h-6 rounded-full transition-colors',
                  settings.logModeration ? 'bg-green-600' : 'bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                    settings.logModeration ? 'left-7' : 'left-1',
                  ]"
                ></span>
              </button>
            </div>

            <button
              @click="saveSettings"
              class="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mt-4"
            >
              Save Logging Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Save All Button -->
      <div class="mt-8 flex justify-center">
        <button
          @click="saveSettings"
          class="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Save All Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const guildId = route.params.id
const guild = ref({})
const loading = ref(true)
const error = ref(null)

const settings = ref({
  prefix: '!',
  welcomeEnabled: false,
  welcomeMessage: '',
  filterProfanity: false,
  antiSpam: false,
  linkFilter: false,
  logDeletes: false,
  logMembers: false,
  logModeration: false,
  logChannelId: null,
})

const channels = ref([])
const channelSearch = ref('')
const showChannelDropdown = ref(false)
const channelWarning = ref('')

const guildIcon = computed(() => {
  if (guild.value.icon) {
    return `https://cdn.discordapp.com/icons/${guildId}/${guild.value.icon}.png?size=256`
  }
  return null
})

const selectedChannel = computed(() => {
  if (!settings.value.logChannelId) return null
  return channels.value.find(ch => ch.id === settings.value.logChannelId)
})

const filteredChannels = computed(() => {
  if (!channelSearch.value) return channels.value
  return channels.value.filter(channel =>
    channel.name.toLowerCase().includes(channelSearch.value.toLowerCase())
  )
})

const fetchGuildSettings = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(`http://localhost:3000/api/guilds/${guildId}`, {
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
    const response = await fetch(`http://localhost:3000/api/guilds/${guildId}/channels`, {
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

const selectChannel = channel => {
  settings.value.logChannelId = channel.id
  channelSearch.value = channel.name
  showChannelDropdown.value = false
}

const clearChannel = () => {
  settings.value.logChannelId = null
  channelSearch.value = ''
}

const handleChannelInputFocus = () => {
  showChannelDropdown.value = true
}

const handleChannelInputBlur = () => {
  // Delay to allow click on dropdown
  setTimeout(() => {
    showChannelDropdown.value = false
  }, 200)
}

const saveSettings = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/guilds/${guildId}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settings.value),
    })

    if (response.ok) {
      // Show success message (you can add a toast notification here)
      alert('Settings saved successfully!')
    } else {
      alert('Failed to save settings')
    }
  } catch (err) {
    console.error('Error saving settings:', err)
    alert('An error occurred while saving settings')
  }
}

const goBack = () => {
  router.push('/dashboard')
}

const logout = () => {
  window.location.href = 'http://localhost:3000/api/auth/logout'
}

onMounted(async () => {
  await fetchGuildSettings()
  await fetchGuildChannels()

  // Initialize channel search with selected channel name
  if (settings.value.logChannelId && channels.value.length > 0) {
    const channel = channels.value.find(ch => ch.id === settings.value.logChannelId)
    if (channel) {
      channelSearch.value = channel.name
    }
  }
})
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
