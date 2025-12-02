<template>
  <button
    :aria-pressed="modelValue"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
    :class="[
      'relative w-12 h-6 rounded-full transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    type="button"
  >
    <span
      :class="[
        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
        modelValue ? 'left-7' : 'left-1',
      ]"
    ></span>
  </button>
</template>

<script setup>
/**
 * ToggleSwitch component
 * Reusable accessible toggle switch with v-model support
 *
 * @example
 * <ToggleSwitch
 *   v-model="enabled"
 *   variant="purple"
 *   aria-label="Enable feature"
 * />
 */
import { computed } from 'vue'

/**
 * Component props
 * @typedef {Object} Props
 * @property {boolean} modelValue - Current toggle state (v-model)
 * @property {boolean} [disabled=false] - Whether toggle is disabled
 * @property {'purple'|'red'|'green'|'gray'} [variant='purple'] - Color variant
 * @property {string} [ariaLabel] - Accessibility label for screen readers
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'purple',
    validator: value => ['purple', 'red', 'green', 'gray'].includes(value),
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
})

/**
 * Component events
 */
const emit = defineEmits(['update:modelValue'])

/**
 * Compute variant-specific classes
 */
const variantClasses = computed(() => {
  if (!props.modelValue) {
    return 'bg-gray-600 focus:ring-gray-500'
  }

  const variants = {
    purple: 'bg-purple-600 focus:ring-purple-500',
    red: 'bg-red-600 focus:ring-red-500',
    green: 'bg-green-600 focus:ring-green-500',
    gray: 'bg-gray-600 focus:ring-gray-500',
  }

  return variants[props.variant] || variants.purple
})

/**
 * Toggle the switch state
 */
const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
