/**
 * Animation and timing constants for DestroyerBot Web
 * Centralizes all animation durations, delays, and timing values
 * to maintain consistency and avoid magic numbers throughout the codebase.
 */

/**
 * General animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  /** Very fast animations (e.g., button press feedback) */
  INSTANT: 100,
  /** Quick animations (e.g., hover effects, color transitions) */
  FAST: 200,
  /** Standard animation duration (e.g., dropdowns, modals) */
  NORMAL: 300,
  /** Slower animations (e.g., page transitions) */
  SLOW: 500,
  /** Long animations (e.g., shimmer effects, background animations) */
  LONG: 1000,
  /** Counter and scroll animations */
  COUNTER: 2000,
}

/**
 * Animation delays for staggered effects
 * Used with .animate-delay-* CSS classes
 */
export const ANIMATION_DELAY = {
  /** No delay */
  NONE: 0,
  /** First item in sequence */
  SHORT: 100,
  /** Second item in sequence */
  MEDIUM: 200,
  /** Third item in sequence */
  LONG: 300,
  /** Fourth item in sequence */
  EXTRA_LONG: 400,
  /** Fifth item in sequence */
  MAX: 500,
}

/**
 * Notification display durations
 */
export const NOTIFICATION_DURATION = {
  /** Quick notifications (2 seconds) */
  SHORT: 2000,
  /** Standard notifications (3 seconds) */
  DEFAULT: 3000,
  /** Important notifications (5 seconds) */
  LONG: 5000,
  /** Persistent notifications (no auto-hide) */
  PERSISTENT: 0,
}

/**
 * Debounce delays for user input
 */
export const DEBOUNCE_DELAY = {
  /** Fast response (e.g., search as you type) */
  FAST: 150,
  /** Standard debounce (e.g., form validation) */
  DEFAULT: 300,
  /** Slower debounce (e.g., API calls) */
  SLOW: 500,
}

/**
 * Dropdown and modal timing
 */
export const DROPDOWN_TIMING = {
  /** Delay before closing dropdown on blur (allows for click handling) */
  CLOSE_DELAY: 200,
  /** Opening animation duration */
  OPEN: 200,
  /** Closing animation duration */
  CLOSE: 150,
}

/**
 * Scroll reveal animation settings
 */
export const SCROLL_REVEAL = {
  /** Intersection threshold (0-1) for triggering reveal */
  THRESHOLD: 0.1,
  /** Root margin for viewport offset */
  ROOT_MARGIN: '0px 0px -100px 0px',
  /** Animation duration in CSS */
  DURATION: 600,
}

/**
 * Copy feedback timing
 * Duration for "Copied!" feedback message
 */
export const COPY_FEEDBACK_DURATION = 2000

/**
 * Card reveal and entrance animations
 */
export const ENTRANCE_ANIMATION = {
  /** Initial delay before starting animations */
  INITIAL_DELAY: 100,
  /** Delay between each card in a staggered sequence */
  STAGGER_DELAY: 100,
}

/**
 * Transition duration presets for CSS
 * Can be used with Tailwind's duration-* classes or inline styles
 */
export const CSS_TRANSITION_DURATION = {
  /** 100ms */
  100: '100ms',
  /** 200ms */
  200: '200ms',
  /** 300ms */
  300: '300ms',
  /** 500ms */
  500: '500ms',
  /** 1000ms */
  1000: '1000ms',
}

/**
 * Easing functions for animations
 */
export const EASING = {
  /** Standard ease (default for most animations) */
  DEFAULT: 'ease',
  /** Ease in (slow start) */
  IN: 'ease-in',
  /** Ease out (slow end) */
  OUT: 'ease-out',
  /** Ease in-out (slow start and end) */
  IN_OUT: 'ease-in-out',
  /** Linear (constant speed) */
  LINEAR: 'linear',
  /** Custom cubic-bezier for smooth animations */
  SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/**
 * Helper function to get animation delay class name
 * @param {number} index - Index of the element in a sequence
 * @param {number} delayIncrement - Delay increment per item (default: 100ms)
 * @param {number} maxDelay - Maximum delay (default: 500ms)
 * @returns {string} CSS class name for animation delay
 *
 * @example
 * getAnimationDelayClass(0) // returns 'animate-delay-0'
 * getAnimationDelayClass(2) // returns 'animate-delay-200'
 * getAnimationDelayClass(10) // returns 'animate-delay-500' (capped at max)
 */
export function getAnimationDelayClass(index, delayIncrement = 100, maxDelay = 500) {
  const delay = Math.min(index * delayIncrement, maxDelay)
  return `animate-delay-${delay}`
}

/**
 * Helper function to create a staggered animation delay
 * @param {number} index - Index of the element
 * @param {number} baseDelay - Base delay before stagger starts (default: 0ms)
 * @param {number} stagger - Stagger amount per item (default: 100ms)
 * @returns {number} Delay in milliseconds
 *
 * @example
 * getStaggerDelay(0) // returns 0
 * getStaggerDelay(2) // returns 200
 * getStaggerDelay(2, 100, 50) // returns 200 (100 base + 2*50)
 */
export function getStaggerDelay(index, baseDelay = 0, stagger = 100) {
  return baseDelay + index * stagger
}
