<template>
  <nav class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Mobile menu button -->
        <button
          @click="toggleDrawer"
          class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
          :aria-expanded="isDrawerOpen"
          aria-label="Toggle navigation menu"
        >
          <svg
            class="h-6 w-6 transition-transform duration-200"
            :class="{ 'rotate-90': isDrawerOpen }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!isDrawerOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Logo/Brand -->
        <div class="flex items-center">
          <h1 class="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            DestroyerBot Dashboard
          </h1>
        </div>

        <!-- Desktop navigation and user menu -->
        <div class="hidden md:flex items-center gap-4">
          <!-- User menu dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="User menu"
            >
              <img
                :src="userAvatar"
                :alt="user?.username || 'User'"
                class="w-8 h-8 rounded-full border-2 border-purple-500"
              />
              <span class="text-white font-medium hidden lg:block">
                {{ user?.username }}
              </span>
              <svg
                class="w-4 h-4 text-gray-400 transition-transform"
                :class="{ 'rotate-180': isUserMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- User dropdown menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-72 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl z-50"
            >
              <div class="p-4 border-b border-purple-500/20">
                <div class="flex items-center gap-3">
                  <img
                    :src="userAvatar"
                    :alt="user?.username || 'User'"
                    class="w-10 h-10 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <p class="text-white font-medium">{{ user?.username }}</p>
                    <p class="text-gray-400 text-sm">{{ user?.email || 'No email' }}</p>
                  </div>
                </div>
              </div>
              <div class="py-2">
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile user menu button -->
        <div class="md:hidden relative" ref="mobileUserMenuRef">
          <button
            @click="toggleUserMenu"
            class="flex items-center p-2 rounded-lg hover:bg-purple-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="User menu"
          >
            <img
              :src="userAvatar"
              :alt="user?.username || 'User'"
              class="w-8 h-8 rounded-full border-2 border-purple-500"
            />
          </button>

          <!-- Mobile user dropdown -->
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-64 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl z-50"
          >
            <div class="p-4 border-b border-purple-500/20">
              <div class="flex items-center gap-3">
                <img
                  :src="userAvatar"
                  :alt="user?.username || 'User'"
                  class="w-12 h-12 rounded-full border-2 border-purple-500"
                />
                <div>
                  <p class="text-white font-medium">{{ user?.username }}</p>
                  <p class="text-gray-400 text-sm">{{ user?.email || 'No email' }}</p>
                </div>
              </div>
            </div>
            <div class="py-2">
              <button
                @click="logout"
                class="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 text-base"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile backdrop for user menu -->
    <div
      v-if="isUserMenuOpen"
      @click="closeUserMenu"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
    ></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Cookies from 'js-cookie'

// Props
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  isDrawerOpen: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['toggle-drawer', 'logout'])

// Reactive state
const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)
const mobileUserMenuRef = ref(null)

// Computed
const userAvatar = computed(() => {
  if (!props.user) return ''
  if (props.user.avatar) {
    return `https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png?size=256`
  }
  // Default Discord avatar
  const discriminator = props.user.discriminator || '0'
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`
})

// Methods
const toggleDrawer = () => {
  emit('toggle-drawer')
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const logout = () => {
  closeUserMenu()
  emit('logout')
}

// Click outside handler
const handleClickOutside = event => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    if (mobileUserMenuRef.value && !mobileUserMenuRef.value.contains(event.target)) {
      closeUserMenu()
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional mobile-specific styles if needed */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.125rem; /* text-lg */
  }
}
</style>
