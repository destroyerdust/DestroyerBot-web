<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Mobile Navigation -->
    <MobileNavbar
      :user="user"
      :is-drawer-open="isDrawerOpen"
      @toggle-drawer="toggleDrawer"
      @logout="logout"
    />

    <!-- Mobile Drawer -->
    <MobileDrawer
      :is-open="isDrawerOpen"
      :user="user"
      :active-section="activeSection"
      @close="closeDrawer"
      @navigate="navigateToSection"
      @quick-action="handleQuickAction"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
        ></div>
        <p class="text-white mt-4">Loading...</p>
      </div>
    </div>

    <!-- Not Authenticated -->
    <div v-else-if="!user" class="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Not Authenticated</h2>
        <p class="text-gray-300 mb-6">Please login with Discord to access the dashboard</p>
        <a
          :href="discordAuthUrl"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
            />
          </svg>
          Login with Discord
        </a>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- User Profile Card -->
      <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8">
        <div class="flex items-center gap-6">
          <img
            :src="userAvatar"
            :alt="user.username"
            class="w-24 h-24 rounded-full border-4 border-purple-500"
          />
          <div>
            <h2 class="text-3xl font-bold text-white mb-2">Welcome, {{ user.username }}!</h2>
            <p class="text-gray-300">{{ user.email || 'No email provided' }}</p>
            <p class="text-gray-400 text-sm mt-1">User ID: {{ user.id }}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Servers</p>
              <p class="text-3xl font-bold text-white mt-1">{{ guilds.length }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Commands Used</p>
              <p class="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
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
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Premium Status</p>
              <p class="text-3xl font-bold text-white mt-1">Free</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Servers List -->
      <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-4">Your Servers (Manage Permission)</h3>

        <!-- Loading Guilds -->
        <div v-if="loadingGuilds" class="flex justify-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"
          ></div>
        </div>

        <!-- No Servers -->
        <div v-else-if="guilds.length === 0" class="text-center py-8">
          <p class="text-gray-400">No servers found with Manage Server permission</p>
        </div>

        <!-- Servers Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="guild in guilds"
            :key="guild.id"
            @click="navigateToGuild(guild.id)"
            class="bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden"
              >
                <img
                  v-if="getGuildIcon(guild)"
                  :src="getGuildIcon(guild)"
                  :alt="guild.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-2xl font-bold text-purple-400">
                  {{ guild.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-semibold truncate">{{ guild.name }}</h4>
                <p class="text-gray-400 text-sm">
                  <span v-if="guild.owner" class="text-yellow-400">Owner</span>
                  <span v-else>Manager</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="handleQuickAction('invite')"
            class="w-full flex items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors text-white font-medium"
          >
            <svg
              class="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Bot to Server
          </button>

          <button
            @click="handleQuickAction('docs')"
            class="w-full flex items-center gap-3 p-4 bg-transparent hover:bg-white/10 border border-transparent rounded-lg transition-colors text-gray-400 hover:text-white font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Documentation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import MobileNavbar from './ui/MobileNavbar.vue'
import MobileDrawer from './ui/MobileDrawer.vue'

const router = useRouter()

const user = ref(null)
const loading = ref(true)
const guilds = ref([])
const loadingGuilds = ref(false)

// Mobile navigation state
const isDrawerOpen = ref(false)
const activeSection = ref('overview')

const discordAuthUrl = computed(() => {
  const clientId = '773000914319048736'
  const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/discord`)
  const scope = encodeURIComponent('identify email guilds')
  const state = encodeURIComponent(window.location.origin)
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`
})

const userAvatar = computed(() => {
  if (!user.value) return ''
  if (user.value.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png?size=256`
  }
  // Default Discord avatar
  const discriminator = user.value.discriminator || '0'
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`
})

const fetchGuilds = async () => {
  loadingGuilds.value = true
  try {
    const response = await fetch('/api/guilds', {
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      guilds.value = data.guilds || []
    } else {
      console.error('Failed to fetch guilds:', await response.text())
    }
  } catch (error) {
    console.error('Error fetching guilds:', error)
  } finally {
    loadingGuilds.value = false
  }
}

const getGuildIcon = guild => {
  if (guild.icon) {
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
  }
  return null
}

onMounted(async () => {
  // Check for user cookie
  const userCookie = Cookies.get('discord_user')
  if (userCookie) {
    try {
      user.value = JSON.parse(decodeURIComponent(userCookie))
      await fetchGuilds()
    } catch (e) {
      console.error('Failed to parse user cookie:', e)
    }
  }
  loading.value = false
})

const navigateToGuild = guildId => {
  router.push(`/guild/${guildId}`)
}

const logout = () => {
  window.location.href = '/api/auth/logout'
}

// Mobile navigation methods
const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

const navigateToSection = section => {
  activeSection.value = section
  // Handle navigation logic here
  console.log('Navigate to section:', section)
}

const handleQuickAction = action => {
  console.log('Quick action:', action)
  // Handle quick actions like opening invite URLs, documentation, etc.
  if (action === 'invite') {
    // Open Discord OAuth invite URL
    window.open(
      'https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=202198145',
      '_blank'
    )
  } else if (action === 'docs') {
    // Open documentation
    window.open('https://github.com/destroyerdust/DestroyerBot-web', '_blank')
  }
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
