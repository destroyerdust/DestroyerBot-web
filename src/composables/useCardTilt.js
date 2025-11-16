import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for 3D card tilt effect on mouse move
 * @param {number} maxTilt - Maximum tilt angle in degrees (default: 10)
 * @returns {Object} - Object containing card ref, tilt style, and event handlers
 */
export function useCardTilt(maxTilt = 10) {
  const cardRef = ref(null)
  const tiltX = ref(0)
  const tiltY = ref(0)
  const glareX = ref(50)
  const glareY = ref(50)

  const tiltStyle = ref({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  })

  const glareStyle = ref({
    background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
  })

  const handleMouseMove = event => {
    if (!cardRef.value) return

    const card = cardRef.value
    const rect = card.getBoundingClientRect()
    const cardWidth = rect.width
    const cardHeight = rect.height

    // Calculate mouse position relative to card center
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // Calculate center offsets
    const centerX = mouseX - cardWidth / 2
    const centerY = mouseY - cardHeight / 2

    // Calculate tilt angles
    const rotateY = (centerX / cardWidth) * maxTilt * 2
    const rotateX = -(centerY / cardHeight) * maxTilt * 2

    tiltX.value = rotateX
    tiltY.value = rotateY

    // Calculate glare position
    glareX.value = (mouseX / cardWidth) * 100
    glareY.value = (mouseY / cardHeight) * 100

    tiltStyle.value = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    }

    glareStyle.value = {
      background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
    }
  }

  const handleMouseLeave = () => {
    tiltStyle.value = {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    }
    glareStyle.value = {
      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 50%)',
    }
  }

  return {
    cardRef,
    tiltStyle,
    glareStyle,
    handleMouseMove,
    handleMouseLeave,
  }
}
