<template>
  <section class="py-20 px-4 bg-gray-900">
    <div class="max-w-6xl mx-auto">
      <h2
        class="text-5xl font-bold mb-4 text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
      >
        Complete Command Documentation
      </h2>
      <p class="text-center text-gray-400 mb-12 text-lg">
        Comprehensive guide to all DestroyerBot commands, usage, and examples
      </p>

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-2xl mx-auto">
          <!-- Search icon (left) -->
          <svg
            class="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
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

          <!-- Search input -->
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search commands... (Press / to focus)"
            aria-label="Search commands"
            class="w-full px-4 py-3 pl-12 pr-16 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />

          <!-- Keyboard shortcut hint -->
          <kbd
            class="absolute right-3 top-2.5 px-2 py-1 bg-gray-700 rounded text-xs text-gray-400 font-mono border border-gray-600"
          >
            /
          </kbd>

          <!-- Result count -->
          <div
            v-if="searchQuery"
            class="mt-2 text-sm text-gray-400 text-center"
            role="status"
            aria-live="polite"
          >
            Found {{ filteredCommands.length }} command{{
              filteredCommands.length !== 1 ? 's' : ''
            }}
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="mb-8">
        <div ref="tabsContainerRef" class="relative flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="setActiveCategory(category.id)"
            :class="[
              'relative z-10 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm group',
              activeCategory === category.id
                ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white hover:scale-105',
            ]"
          >
            <span class="flex items-center gap-1.5 sm:gap-2">
              <span
                class="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300"
                >{{ category.icon }}</span
              >
              <span class="hidden xs:inline">{{ category.name }}</span>
              <span class="inline xs:hidden">{{ category.name.split(' ')[0] }}</span>
              <span
                :class="[
                  'px-1.5 py-0.5 rounded-full text-xs font-semibold transition-colors duration-300',
                  activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-700 text-gray-500 group-hover:bg-gray-600 group-hover:text-gray-300',
                ]"
              >
                {{ getCategoryCommandCount(category.id) }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <!-- Commands Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="command in filteredCommands"
          :key="command.name"
          class="group relative bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden"
        >
          <!-- Glow effect -->
          <div
            class="absolute inset-0 bg-linear-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"
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
            <div
              v-if="command.permissions"
              class="text-xs text-red-300 bg-red-900/20 px-2 py-1 rounded"
            >
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
      <div class="scroll-reveal mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
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
      <div class="scroll-reveal mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 class="text-xl font-semibold text-white mb-4">💡 Usage Tips</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong class="text-purple-400">Slash Commands:</strong> Start with
            <code class="bg-gray-700 px-1 rounded">/</code> and select from the autocomplete menu
          </div>
          <div>
            <strong class="text-blue-400">Permissions:</strong> Some commands require specific roles
            or server ownership
          </div>
          <div>
            <strong class="text-green-400">Context:</strong> Commands work in both servers and
            direct messages (where applicable)
          </div>
          <div>
            <strong class="text-indigo-400">Help:</strong> Each command shows its own help when you
            start typing it
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { COMMAND_CATEGORIES, COMMAND_DOCUMENTATION } from '@/data/documentation.js'
import { useDebounce } from '@/composables/useDebounce.js'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

/**
 * Documentation component
 * Comprehensive command documentation with search and category filtering
 * Features debounced search for better performance and scroll animations
 */

// Initialize scroll reveal
useScrollReveal()

const searchQuery = ref('')
const searchInput = ref(null)
const activeCategory = ref('all')
const copiedCommand = ref(null)
const activeTabRef = ref(null)
const tabsContainerRef = ref(null)

const categories = COMMAND_CATEGORIES
const commands = COMMAND_DOCUMENTATION

// Set active category and update indicator position
const setActiveCategory = categoryId => {
  activeCategory.value = categoryId
}

// Debounce search for better performance
const debouncedSearch = useDebounce(searchQuery, 300)

const filteredCommands = computed(() => {
  let filtered = commands

  // Filter by category
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(cmd => cmd.category === activeCategory.value)
  }

  // Filter by search query (debounced)
  if (debouncedSearch.value.trim()) {
    const query = debouncedSearch.value.toLowerCase()
    filtered = filtered.filter(
      cmd =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalCommands = computed(() => commands.length)
const adminCommands = computed(() => commands.filter(cmd => cmd.permissions).length)

const getCategoryCommandCount = categoryId => {
  if (categoryId === 'all') return commands.length
  return commands.filter(cmd => cmd.category === categoryId).length
}

const copyCommand = async command => {
  try {
    await navigator.clipboard.writeText(`/${command}`)
    copiedCommand.value = command
    setTimeout(() => {
      copiedCommand.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Keyboard shortcut to focus search (/)
const handleKeyPress = event => {
  const target = document.activeElement
  const isInputField =
    target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  if (event.key === '/' && !isInputField) {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
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
