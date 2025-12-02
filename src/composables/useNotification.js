import { ref } from 'vue'

/**
 * @typedef {Object} Notification
 * @property {boolean} show - Whether notification is visible
 * @property {string} message - Notification message
 * @property {'success'|'error'|'info'|'warning'} type - Notification type
 */

/**
 * Global notification state
 * Shared across all component instances
 */
const notification = ref({
  show: false,
  message: '',
  type: 'success',
})

let timeoutId = null

/**
 * Composable for global notification management
 * Provides methods to show/hide notifications with auto-dismiss
 *
 * @returns {Object} Notification state and methods
 *
 * @example
 * const { showNotification, hideNotification, notification } = useNotification()
 *
 * // Show success notification
 * showNotification('Settings saved!', 'success')
 *
 * // Show error notification with custom duration
 * showNotification('Failed to save', 'error', 5000)
 */
export function useNotification() {
  /**
   * Show a notification
   * @param {string} message - Message to display
   * @param {'success'|'error'|'info'|'warning'} [type='success'] - Notification type
   * @param {number} [duration=3000] - Auto-hide duration in milliseconds (0 = no auto-hide)
   */
  const showNotification = (message, type = 'success', duration = 3000) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    notification.value.message = message
    notification.value.type = type
    notification.value.show = true

    // Auto-hide after duration
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        hideNotification()
      }, duration)
    }
  }

  /**
   * Hide the current notification
   */
  const hideNotification = () => {
    notification.value.show = false
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  /**
   * Convenience methods for specific notification types
   */
  const success = (message, duration) => showNotification(message, 'success', duration)
  const error = (message, duration) => showNotification(message, 'error', duration)
  const info = (message, duration) => showNotification(message, 'info', duration)
  const warning = (message, duration) => showNotification(message, 'warning', duration)

  return {
    notification,
    showNotification,
    hideNotification,
    success,
    error,
    info,
    warning,
  }
}
