<template>
  <div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
    <!-- Header -->
    <div class="mb-4">
      <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <!-- Icon Slot -->
        <span :class="iconColorClass">
          <slot name="icon">
            <!-- Default icon if none provided -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </slot>
        </span>
        {{ title }}
      </h3>

      <!-- Description -->
      <p v-if="description" class="text-gray-400 text-sm">{{ description }}</p>
    </div>

    <!-- Content Slot -->
    <div>
      <slot></slot>
    </div>

    <!-- Actions Slot -->
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * SettingCard component
 * Reusable card wrapper for settings sections
 *
 * @example
 * <SettingCard
 *   title="Auto-Moderation"
 *   description="Configure automatic moderation rules"
 *   icon-color="red"
 * >
 *   <template #icon>
 *     <svg>...</svg>
 *   </template>
 *
 *   <!-- Content -->
 *   <div>Settings content here</div>
 *
 *   <template #actions>
 *     <button>Save Settings</button>
 *   </template>
 * </SettingCard>
 */
import { computed } from 'vue'

/**
 * Component props
 * @typedef {Object} Props
 * @property {string} title - Card title
 * @property {string} [description] - Optional description
 * @property {'purple'|'blue'|'red'|'green'|'yellow'} [iconColor='purple'] - Icon color
 */
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: undefined,
  },
  iconColor: {
    type: String,
    default: 'purple',
    validator: value => ['purple', 'blue', 'red', 'green', 'yellow'].includes(value),
  },
})

/**
 * Compute icon color class
 */
const iconColorClass = computed(() => {
  const colors = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  }
  return colors[props.iconColor] || colors.purple
})
</script>
