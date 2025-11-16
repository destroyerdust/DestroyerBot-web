import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for animated counter effect
 * @param {number} end - The target number to count to
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * @param {number} delay - Delay before starting animation in milliseconds (default: 0)
 * @returns {Object} - Object containing the current count value
 */
export function useCountUp(end, duration = 2000, delay = 0) {
  const count = ref(0)
  let animationFrame = null
  let startTime = null
  let timeoutId = null

  const animate = currentTime => {
    if (!startTime) startTime = currentTime
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)

    // Easing function (easeOutCubic)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    count.value = Math.floor(easeOut * end)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      count.value = end
    }
  }

  onMounted(() => {
    timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, delay)
  })

  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return { count }
}
