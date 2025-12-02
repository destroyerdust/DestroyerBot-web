import { ref, watch, onMounted } from 'vue'
import { DEBOUNCE_DELAY } from '@/utils/animations.js'

/**
 * Debounces a reactive value
 * Useful for search inputs to avoid excessive API calls or expensive computations
 *
 * @param {Ref} value - The reactive ref to debounce
 * @param {number} delay - Delay in milliseconds (default: DEBOUNCE_DELAY.DEFAULT)
 * @returns {Ref} Debounced ref that updates after the delay
 *
 * @example
 * const searchQuery = ref('')
 * const debouncedSearch = useDebounce(searchQuery, 500)
 *
 * watch(debouncedSearch, (newValue) => {
 *   // This will only fire 500ms after user stops typing
 *   fetchResults(newValue)
 * })
 */
export function useDebounce(value, delay = DEBOUNCE_DELAY.DEFAULT) {
  const debouncedValue = ref(value.value)
  let timeout = null

  watch(value, newValue => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  onMounted(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  return debouncedValue
}
