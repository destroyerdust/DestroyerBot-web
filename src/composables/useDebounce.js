import { ref, watch, onMounted } from 'vue'

/**
 * Debounces a reactive value
 * Useful for search inputs to avoid excessive API calls or expensive computations
 *
 * @param {Ref} value - The reactive ref to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
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
export function useDebounce(value, delay = 300) {
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
