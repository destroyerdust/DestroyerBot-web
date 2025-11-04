<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    class="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
    :class="[
      variantClasses,
      sizeClasses,
      fullWidth ? 'w-full' : '',
      loading ? 'cursor-wait' : 'cursor-pointer'
    ]"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Loading spinner -->
    <div v-if="loading" class="w-5 h-5">
      <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Icon (if provided) -->
    <component
      v-else-if="icon"
      :is="icon"
      class="w-5 h-5 flex-shrink-0"
      :class="{ 'order-last': iconPosition === 'right' }"
    />

    <!-- Button content -->
    <span v-if="$slots.default || text" class="truncate">
      <slot>{{ text }}</slot>
    </span>
  </component>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  ariaLabel: {
    type: String,
    default: null
  },
  ariaDescribedBy: {
    type: String,
    default: null
  },
  pressDelay: {
    type: Number,
    default: 150 // ms
  }
})

// Emits
const emit = defineEmits(['click', 'press', 'release'])

// Reactive state
const isPressed = ref(false)
const pressTimeout = ref(null)

// Computed
const variantClasses = computed(() => {
  const base = 'border'

  switch (props.variant) {
    case 'primary':
      return `${base} bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 focus:ring-purple-500`
    case 'secondary':
      return `${base} bg-transparent border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 focus:ring-purple-500`
    case 'danger':
      return `${base} bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 focus:ring-red-500`
    case 'ghost':
      return 'bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/10 focus:ring-gray-500'
    default:
      return `${base} bg-purple-600 border-purple-600 text-white hover:bg-purple-700 hover:border-purple-700 focus:ring-purple-500`
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-2 min-h-[40px] text-sm'
    case 'lg':
      return 'px-6 py-4 min-h-[52px] text-lg'
    default: // md
      return 'px-4 py-3 min-h-[44px] text-base'
  }
})

// Methods
const handleClick = (event) => {
  if (props.disabled || props.loading) return

  emit('click', event)
}

const handleTouchStart = (event) => {
  if (props.disabled || props.loading) return

  isPressed.value = true
  emit('press')

  // Clear any existing timeout
  if (pressTimeout.value) {
    clearTimeout(pressTimeout.value)
  }

  // Set a timeout for long press detection
  pressTimeout.value = setTimeout(() => {
    // Handle long press if needed
    emit('long-press')
  }, props.pressDelay)
}

const handleTouchEnd = (event) => {
  if (props.disabled || props.loading) return

  isPressed.value = false
  emit('release')

  // Clear the press timeout
  if (pressTimeout.value) {
    clearTimeout(pressTimeout.value)
    pressTimeout.value = null
  }
}

// Cleanup on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (pressTimeout.value) {
    clearTimeout(pressTimeout.value)
  }
})
</script>

<style scoped>
/* Ensure touch targets meet accessibility standards */
@media (pointer: coarse) {
  button,
  a {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Active state styling */
button:active:not(:disabled),
a:active {
  transform: scale(0.98);
}

/* Focus visible for keyboard navigation */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}
</style>
