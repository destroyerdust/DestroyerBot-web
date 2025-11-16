import { ref, computed, onMounted } from 'vue'
import Cookies from 'js-cookie'

/**
 * Composable for Discord authentication management
 * Handles user session, Discord OAuth URL generation, and avatar computation
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  const user = ref(null)
  const loading = ref(true)

  /**
   * Discord Client ID from environment variable or fallback
   */
  const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '773000914319048736'

  /**
   * Generates Discord OAuth authorization URL
   * @returns {string} Full Discord OAuth URL with proper parameters
   */
  const discordAuthUrl = computed(() => {
    // SSR-safe check for window
    if (typeof window === 'undefined') return '#'

    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: `${window.location.origin}/api/auth/discord`,
      response_type: 'code',
      scope: 'identify email guilds',
      state: window.location.origin,
    })

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`
  })

  /**
   * Computes user avatar URL from Discord CDN
   * Falls back to default Discord avatar if user has no custom avatar
   * @returns {string} Avatar URL
   */
  const userAvatar = computed(() => {
    if (!user.value) return ''

    if (user.value.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png?size=256`
    }

    // Default Discord avatar based on discriminator
    const discriminator = user.value.discriminator || '0'
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`
  })

  /**
   * Loads user from cookie on mount
   */
  const loadUserFromCookie = () => {
    const userCookie = Cookies.get('discord_user')
    if (userCookie) {
      try {
        user.value = JSON.parse(decodeURIComponent(userCookie))
      } catch (e) {
        console.error('Failed to parse user cookie:', e)
        user.value = null
      }
    }
    loading.value = false
  }

  /**
   * Logs out user by redirecting to logout endpoint
   */
  const logout = () => {
    window.location.href = '/api/auth/logout'
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is logged in
   */
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    loading,
    discordAuthUrl,
    userAvatar,
    isAuthenticated,
    loadUserFromCookie,
    logout,
  }
}
