<template>
  <div class="space-y-2">
    <!-- Label -->
    <label v-if="label" class="block text-gray-300 text-sm">{{ label }}</label>

    <!-- Warning Message -->
    <div v-if="warning" class="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <div class="flex items-start gap-2">
        <svg
          class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5"
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
        <p class="text-yellow-200 text-xs">{{ warning }}</p>
      </div>
    </div>

    <!-- Input Container -->
    <div class="relative">
      <div class="flex gap-2">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="showDropdown = true"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="selectHighlighted"
          @keydown.esc="closeDropdown"
          type="text"
          :placeholder="placeholder"
          :disabled="disabled || channels.length === 0"
          :aria-expanded="showDropdown"
          :aria-controls="dropdownId"
          role="combobox"
          :class="[
            'flex-1 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white placeholder-gray-500',
            'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
            focusBorderClass,
          ]"
        />

        <!-- Clear Button -->
        <button
          v-if="selectedChannel"
          @click="clearSelection"
          class="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          title="Clear selection"
          type="button"
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
        v-if="showDropdown && filteredChannels.length > 0"
        :id="dropdownId"
        role="listbox"
        class="absolute z-10 w-full mt-1 bg-gray-800 border border-purple-500/30 rounded-lg shadow-lg max-h-48 overflow-y-auto"
      >
        <button
          v-for="(channel, index) in filteredChannels"
          :key="channel.id"
          @mousedown.prevent="selectChannel(channel)"
          @mouseenter="highlightedIndex = index"
          :class="[
            'w-full px-4 py-2 text-left text-white transition-colors flex items-center gap-2',
            highlightedIndex === index ? 'bg-purple-600/30' : 'hover:bg-purple-600/20',
          ]"
          role="option"
          :aria-selected="channel.id === modelValue"
          type="button"
        >
          <span class="text-gray-400">#</span>
          <span>{{ channel.name }}</span>
        </button>
      </div>
    </div>

    <!-- Selected Channel Display -->
    <p class="text-gray-500 text-xs">
      {{ selectedChannel ? `Selected: #${selectedChannel.name}` : 'No channel selected' }}
    </p>
  </div>
</template>

<script setup>
/**
 * ChannelSelector component
 * Searchable dropdown for Discord channel selection
 *
 * @example
 * <ChannelSelector
 *   v-model="settings.logs.channelId"
 *   :channels="channels"
 *   label="Log Channel"
 *   warning="Rate limited by Discord"
 *   focus-border-color="green"
 * />
 */
import { ref, computed, watch } from 'vue'
import { DROPDOWN_TIMING } from '@/utils/animations.js'

/**
 * Component props
 * @typedef {Object} Channel
 * @property {string} id - Channel ID
 * @property {string} name - Channel name
 *
 * @typedef {Object} Props
 * @property {string|null} modelValue - Selected channel ID
 * @property {Channel[]} channels - Available channels
 * @property {boolean} [disabled=false] - Disabled state
 * @property {string} [label] - Label text
 * @property {string} [placeholder='Select a channel...'] - Input placeholder
 * @property {string} [warning] - Warning message
 * @property {'purple'|'blue'|'green'|'red'} [focusBorderColor='purple'] - Focus border color
 */
const props = defineProps({
  modelValue: {
    type: [String, null],
    default: null,
  },
  channels: {
    type: Array,
    required: true,
    validator: value => value.every(ch => ch.id && ch.name),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: 'Select a channel...',
  },
  warning: {
    type: String,
    default: undefined,
  },
  focusBorderColor: {
    type: String,
    default: 'purple',
    validator: value => ['purple', 'blue', 'green', 'red'].includes(value),
  },
})

const emit = defineEmits(['update:modelValue'])

// Component state
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(0)
const dropdownId = `channel-dropdown-${Math.random().toString(36).substr(2, 9)}`

/**
 * Compute focus border color class
 */
const focusBorderClass = computed(() => {
  const colors = {
    purple: 'focus:border-purple-500',
    blue: 'focus:border-blue-500',
    green: 'focus:border-green-500',
    red: 'focus:border-red-500',
  }
  return colors[props.focusBorderColor] || colors.purple
})

/**
 * Get selected channel object
 */
const selectedChannel = computed(() => {
  if (!props.modelValue) return null
  return props.channels.find(ch => ch.id === props.modelValue)
})

/**
 * Filter channels based on search query
 */
const filteredChannels = computed(() => {
  if (!searchQuery.value) return props.channels
  return props.channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

/**
 * Handle input focus
 */
const handleFocus = () => {
  showDropdown.value = true
  highlightedIndex.value = 0
}

/**
 * Handle input blur with delay for click handling
 */
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, DROPDOWN_TIMING.CLOSE_DELAY)
}

/**
 * Close dropdown
 */
const closeDropdown = () => {
  showDropdown.value = false
}

/**
 * Navigate down in dropdown
 */
const navigateDown = () => {
  if (highlightedIndex.value < filteredChannels.value.length - 1) {
    highlightedIndex.value++
  }
}

/**
 * Navigate up in dropdown
 */
const navigateUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

/**
 * Select highlighted channel
 */
const selectHighlighted = () => {
  if (filteredChannels.value[highlightedIndex.value]) {
    selectChannel(filteredChannels.value[highlightedIndex.value])
  }
}

/**
 * Select a channel
 * @param {Channel} channel - Channel to select
 */
const selectChannel = channel => {
  emit('update:modelValue', channel.id)
  searchQuery.value = channel.name
  showDropdown.value = false
}

/**
 * Clear channel selection
 */
const clearSelection = () => {
  emit('update:modelValue', null)
  searchQuery.value = ''
}

/**
 * Initialize search query with selected channel name
 */
const initializeSearchQuery = () => {
  if (selectedChannel.value) {
    searchQuery.value = selectedChannel.value.name
  }
}

// Initialize on mount
initializeSearchQuery()

// Watch for external changes to modelValue and channels
watch([() => props.modelValue, () => props.channels], () => {
  initializeSearchQuery()
})
</script>
