<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div v-if="notification.show" :class="containerClass">
      <div :class="toastClass">
        <!-- Icon -->
        <div class="shrink-0">
          <component :is="iconComponent" class="w-6 h-6 text-white" />
        </div>

        <!-- Message -->
        <div class="flex-1">
          <p class="text-white font-medium">{{ notification.message }}</p>
        </div>

        <!-- Close button -->
        <button
          @click="hideNotification"
          class="shrink-0 text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
          aria-label="Close notification"
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
    </div>
  </transition>
</template>

<script setup>
/**
 * NotificationToast component
 * Global notification display with transitions
 *
 * @example
 * <NotificationToast />
 *
 * // In your component:
 * const { showNotification } = useNotification()
 * showNotification('Success!', 'success')
 */
import { computed, h } from 'vue'
import { useNotification } from '@/composables/useNotification.js'

/**
 * Component props
 * @typedef {Object} Props
 * @property {'top-right'|'top-center'|'top-left'|'bottom-right'|'bottom-center'|'bottom-left'} [position='top-right'] - Toast position
 */
const props = defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: value =>
      [
        'top-right',
        'top-center',
        'top-left',
        'bottom-right',
        'bottom-center',
        'bottom-left',
      ].includes(value),
  },
})

const { notification, hideNotification } = useNotification()

/**
 * Compute container position classes
 */
const containerClass = computed(() => {
  const base = 'fixed z-50 max-w-sm w-full'
  const positions = {
    'top-right': 'top-20 right-4',
    'top-center': 'top-20 left-1/2 -translate-x-1/2',
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
  }
  return `${base} ${positions[props.position] || positions['top-right']}`
})

/**
 * Compute toast background and border classes based on type
 */
const toastClass = computed(() => {
  const base = 'rounded-lg shadow-lg p-4 flex items-start gap-3'
  const types = {
    success: 'bg-green-600 border border-green-500',
    error: 'bg-red-600 border border-red-500',
    info: 'bg-blue-600 border border-blue-500',
    warning: 'bg-yellow-600 border border-yellow-500',
  }
  return `${base} ${types[notification.value.type] || types.success}`
})

/**
 * Compute icon component based on notification type
 */
const iconComponent = computed(() => {
  const icons = {
    success: h(
      'svg',
      {
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ]
    ),
    error: h(
      'svg',
      {
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ]
    ),
    info: h(
      'svg',
      {
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        }),
      ]
    ),
    warning: h(
      'svg',
      {
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
        }),
      ]
    ),
  }
  return icons[notification.value.type] || icons.success
})
</script>
