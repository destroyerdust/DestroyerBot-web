<template>
  <section class="py-20 px-4 bg-gray-900">
    <div class="max-w-5xl mx-auto">
      <h2
        class="text-5xl font-bold mb-4 text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
      >
        Command Examples
      </h2>
      <p class="text-center text-gray-400 mb-12 text-lg">
        Explore our comprehensive command library
      </p>

      <!-- Tab Navigation -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="activeTab = category.id"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
            activeTab === category.id
              ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
          ]"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>

      <!-- Command Cards Container -->
      <div class="relative">
        <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="command in filteredCommands"
            :key="command.command"
            class="group relative bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden"
          >
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-linear-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300"
            ></div>

            <div class="relative p-6">
              <!-- Command header -->
              <div class="flex items-start justify-between mb-3">
                <code class="text-lg font-mono text-green-400 font-semibold">
                  {{ command.command }}
                </code>
                <button
                  @click="copyCommand(command.command)"
                  :class="[
                    'p-2 rounded-lg transition-all duration-300',
                    copiedCommand === command.command
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white',
                  ]"
                  :title="copiedCommand === command.command ? 'Copied!' : 'Copy command'"
                >
                  <svg
                    v-if="copiedCommand !== command.command"
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
              <p class="text-gray-300 text-sm leading-relaxed">
                {{ command.description }}
              </p>

              <!-- Example badge (if available) -->
              <div v-if="command.example" class="mt-4 pt-4 border-t border-gray-700">
                <div class="text-xs text-gray-500 mb-2">Example:</div>
                <code class="text-xs font-mono text-blue-400 bg-gray-800/50 px-2 py-1 rounded">
                  {{ command.example }}
                </code>
              </div>
            </div>

            <!-- Animated border -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <div class="absolute inset-0 rounded-xl border-2 border-purple-500/50"></div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Quick stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-purple-400 mb-2">10+</div>
          <div class="text-sm text-gray-400">Total Commands</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-blue-400 mb-2">3</div>
          <div class="text-sm text-gray-400">Categories</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-indigo-400 mb-2">Fast</div>
          <div class="text-sm text-gray-400">Response Time</div>
        </div>
        <div class="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div class="text-3xl font-bold text-purple-400 mb-2">24/7</div>
          <div class="text-sm text-gray-400">Availability</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { COMMAND_CATEGORIES, COMMAND_LIST } from '@/data/commands.js'

/**
 * CommandShowcase component
 * Displays interactive command examples with category filtering
 * Includes copy-to-clipboard functionality
 */

const activeTab = ref('utility')
const copiedCommand = ref(null)
const categories = COMMAND_CATEGORIES
const commands = COMMAND_LIST

const filteredCommands = computed(() => {
  return commands.filter(cmd => cmd.category === activeTab.value)
})

const copyCommand = async command => {
  try {
    await navigator.clipboard.writeText(command)
    copiedCommand.value = command
    setTimeout(() => {
      copiedCommand.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>
