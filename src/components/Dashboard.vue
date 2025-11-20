<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Navbar -->
    <nav class="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-white">DestroyerBot Dashboard</h1>
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="logout"
              aria-label="Logout from dashboard"
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
    <div
      v-if="loading"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
      class="flex items-center justify-center h-[calc(100vh-4rem)]"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"
          aria-hidden="true"
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
      <div
        class="scroll-reveal bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8 hover:border-purple-500/40 transition-all duration-500"
      >
        <div class="flex items-center gap-6">
          <!-- Avatar with glow effect -->
          <div class="relative group">
            <img
              :src="userAvatar"
              :alt="user.username"
              class="w-24 h-24 rounded-full border-4 border-purple-500 transition-all duration-300 group-hover:border-purple-400 group-hover:scale-105"
            />
            <!-- Glow ring on hover -->
            <div
              class="absolute inset-0 rounded-full bg-purple-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"
            ></div>
          </div>

          <!-- Animated text with stagger -->
          <div class="space-y-1">
            <h2 class="text-3xl font-bold text-white animate-slide-up">
              Welcome, {{ user.username }}!
            </h2>
            <p class="text-gray-300 animate-slide-up animate-delay-100">
              {{ user.email || 'No email provided' }}
            </p>
            <p class="text-gray-400 text-sm animate-slide-up animate-delay-200">
              User ID: {{ user.id }}
            </p>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <section aria-labelledby="stats-heading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <h2 id="stats-heading" class="sr-only">Dashboard Statistics</h2>

        <div
          class="scroll-reveal bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
          role="region"
          aria-label="Server count statistic"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Servers</p>
              <p class="text-3xl font-bold text-white mt-1">{{ serverCount }}</p>
            </div>
            <!-- Icon with glow -->
            <div class="relative group">
              <div
                class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500/30"
              >
                <svg
                  class="w-6 h-6 text-purple-400 transition-colors duration-300 group-hover:text-purple-300"
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
              <!-- Glow effect on hover -->
              <div
                class="absolute inset-0 bg-purple-500 rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"
              ></div>
            </div>
          </div>
        </div>

        <div
          class="scroll-reveal animate-delay-100 bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
          role="region"
          aria-label="Commands used statistic"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Commands Used</p>
              <p class="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <!-- Icon with glow -->
            <div class="relative group">
              <div
                class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/30"
              >
                <svg
                  class="w-6 h-6 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
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
              <!-- Glow effect on hover -->
              <div
                class="absolute inset-0 bg-blue-500 rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"
              ></div>
            </div>
          </div>
        </div>

        <div
          class="scroll-reveal animate-delay-200 bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
          role="region"
          aria-label="Premium status statistic"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Premium Status</p>
              <p class="text-3xl font-bold text-white mt-1">Free</p>
            </div>
            <!-- Icon with glow -->
            <div class="relative group">
              <div
                class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-500/30"
              >
                <svg
                  class="w-6 h-6 text-yellow-400 transition-colors duration-300 group-hover:text-yellow-300"
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
              <!-- Glow effect on hover -->
              <div
                class="absolute inset-0 bg-yellow-500 rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Servers List -->
      <section
        aria-labelledby="servers-heading"
        class="scroll-reveal animate-delay-300 bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8"
      >
        <h3 id="servers-heading" class="text-xl font-bold text-white mb-4">
          Your Servers (Manage Permission)
        </h3>

        <!-- Loading Guilds - Skeleton -->
        <div
          v-if="loadingGuilds"
          role="status"
          aria-live="polite"
          aria-label="Loading your servers"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-black/30 border border-purple-500/20 rounded-lg p-4 overflow-hidden relative"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar skeleton -->
              <div class="w-16 h-16 rounded-full bg-purple-500/20 animate-pulse"></div>

              <!-- Text skeleton -->
              <div class="flex-1 space-y-3">
                <div class="h-4 bg-purple-500/20 rounded w-3/4 animate-pulse"></div>
                <div
                  class="h-3 bg-purple-500/20 rounded w-1/2 animate-pulse"
                  style="animation-delay: 150ms"
                ></div>
              </div>
            </div>

            <!-- Shimmer overlay -->
            <div
              class="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/5 to-transparent"
            ></div>
          </div>
        </div>

        <!-- No Servers - Enhanced Empty State -->
        <div v-else-if="guilds.length === 0" class="text-center py-12">
          <!-- Icon -->
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 mb-6"
          >
            <svg
              class="w-10 h-10 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          <h3 class="text-xl font-bold text-white mb-2">No Servers Found</h3>
          <p class="text-gray-400 mb-6 max-w-md mx-auto">
            You don't have any servers with Manage Server permission, or DestroyerBot hasn't been
            added to your servers yet.
          </p>

          <!-- CTA Button -->
          <!-- TODO: Replace YOUR_CLIENT_ID with actual client ID -->
          <a
            href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Add DestroyerBot to a Discord server"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Bot to Server
          </a>
        </div>

        <!-- Servers Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(guild, index) in guilds"
            :key="guild.id"
            :ref="
              el => {
                if (el && cardRefs[index]?.cardRef) {
                  cardRefs[index].cardRef.value = el
                }
              }
            "
            @mousemove="cardRefs[index]?.handleMouseMove"
            @mouseleave="cardRefs[index]?.handleMouseLeave"
            :style="cardRefs[index]?.tiltStyle.value"
            @click="navigateToGuild(guild.id)"
            @keydown.enter="navigateToGuild(guild.id)"
            @keydown.space.prevent="navigateToGuild(guild.id)"
            role="button"
            :aria-label="`Configure ${guild.name} server settings`"
            tabindex="0"
            class="relative bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 hover:bg-black/40 transition-all duration-300 cursor-pointer transform-style-3d hover:shadow-xl hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            :class="`animate-delay-${Math.min(index * 100, 500)}`"
          >
            <!-- Glare overlay effect -->
            <div
              :style="cardRefs[index]?.glareStyle.value"
              class="absolute inset-0 rounded-lg pointer-events-none"
            ></div>

            <!-- Card content -->
            <div class="relative flex items-center gap-4">
              <!-- Guild icon with status indicator -->
              <div class="relative">
                <div
                  class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden"
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

                <!-- Bot online status indicator -->
                <div
                  class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse-slow"
                  title="Bot is online"
                  aria-label="Bot is online"
                ></div>
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
      </section>

      <!-- Quick Actions -->
      <section
        class="scroll-reveal animate-delay-400 bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6"
      >
        <h3 class="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            aria-label="Add DestroyerBot to a new server"
            class="relative overflow-hidden group flex items-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <svg
              class="w-6 h-6 text-purple-400 transition-transform duration-300 group-hover:scale-110"
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
            <span class="text-white font-medium">Add Bot to Server</span>
            <!-- Shimmer overlay -->
            <div
              class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"
            ></div>
          </button>

          <button
            aria-label="View server settings"
            class="relative overflow-hidden group flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <svg
              class="w-6 h-6 text-blue-400 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-white font-medium">Server Settings</span>
            <!-- Shimmer overlay -->
            <div
              class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent"
            ></div>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useCardTilt } from '@/composables/useCardTilt.js'
import { useCountUp } from '@/composables/useCountUp.js'

const router = useRouter()

// Use auth composable for authentication logic
const {
  user,
  loading,
  discordAuthUrl,
  userAvatar,
  loadUserFromCookie,
  logout: authLogout,
} = useAuth()

const guilds = ref([])
const loadingGuilds = ref(false)

// Initialize scroll reveal for animations
useScrollReveal()

// Animated server count
const { count: serverCount } = useCountUp(0, 2000, 500)

// Card tilt refs for each guild
const cardRefs = ref([])

// Watch guilds for count animation
watch(
  () => guilds.value.length,
  newCount => {
    serverCount.value = newCount
  },
  { immediate: true }
)

// Watch guilds for card tilt initialization
watch(
  guilds,
  newGuilds => {
    cardRefs.value = newGuilds.map(() => useCardTilt(8))
  },
  { immediate: true }
)

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
  // Load user from cookie using composable
  loadUserFromCookie()

  if (user.value) {
    await fetchGuilds()
  }
})

const navigateToGuild = guildId => {
  router.push(`/guild/${guildId}`)
}

const logout = () => {
  authLogout()
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
