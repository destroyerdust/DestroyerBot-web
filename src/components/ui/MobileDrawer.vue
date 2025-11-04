<template>
  <!-- Drawer overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
    @click="closeDrawer"
  ></div>

  <!-- Drawer content -->
  <div
    class="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md border-r border-purple-500/20 z-50 transform transition-transform duration-300 ease-in-out md:hidden"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Drawer header -->
    <div class="flex items-center justify-between p-4 border-b border-purple-500/20">
      <h2 class="text-xl font-bold text-white">Navigation</h2>
      <button
        @click="closeDrawer"
        class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Close navigation menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation items -->
    <nav class="flex-1 px-4 py-6">
      <div class="space-y-2">
        <!-- Dashboard Overview -->
        <button
          @click="navigateToSection('overview')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
          :class="{ 'bg-purple-500/20 text-white': activeSection === 'overview' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0" />
          </svg>
          <span class="font-medium">Dashboard</span>
        </button>

        <!-- Server Management -->
        <button
          @click="navigateToSection('servers')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
          :class="{ 'bg-purple-500/20 text-white': activeSection === 'servers' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="font-medium">Servers</span>
        </button>

        <!-- Settings -->
        <button
          @click="navigateToSection('settings')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
          :class="{ 'bg-purple-500/20 text-white': activeSection === 'settings' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="font-medium">Settings</span>
        </button>

        <!-- Analytics/Stats -->
        <button
          @click="navigateToSection('analytics')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
          :class="{ 'bg-purple-500/20 text-white': activeSection === 'analytics' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="font-medium">Analytics</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="border-t border-purple-500/20 my-6"></div>

      <!-- Quick Actions -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
          Quick Actions
        </h3>

        <button
          @click="handleQuickAction('invite')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="font-medium">Add Bot to Server</span>
        </button>

        <button
          @click="handleQuickAction('docs')"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="font-medium">Documentation</span>
        </button>
      </div>
    </nav>

    <!-- Drawer footer -->
    <div class="border-t border-purple-500/20 p-4">
      <div class="flex items-center gap-3">
        <img
          :src="userAvatar"
          :alt="user?.username || 'User'"
          class="w-10 h-10 rounded-full border-2 border-purple-500"
        />
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium truncate">{{ user?.username }}</p>
          <p class="text-gray-400 text-sm">{{ user?.email || 'No email' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  activeSection: {
    type: String,
    default: 'overview'
  }
})

// Emits
const emit = defineEmits(['close', 'navigate', 'quick-action'])

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
const closeDrawer = () => {
  emit('close')
}

const navigateToSection = (section) => {
  emit('navigate', section)
  closeDrawer()
}

const handleQuickAction = (action) => {
  emit('quick-action', action)
  closeDrawer()
}
</script>

<style scoped>
/* Custom scrollbar for drawer */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}
</style>
