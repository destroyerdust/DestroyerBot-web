import { onMounted, onUnmounted } from 'vue'

/**
 * Composable for scroll-based reveal animations using Intersection Observer
 * @param {string} selector - CSS selector for elements to observe (default: '.scroll-reveal')
 * @param {Object} options - Intersection Observer options
 * @returns {void}
 */
export function useScrollReveal(selector = '.scroll-reveal', options = {}) {
  let observer = null
  let mutationObserver = null

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    ...options,
  }

  const handleIntersect = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        // Optionally stop observing after reveal
        if (defaultOptions.once !== false) {
          observer.unobserve(entry.target)
        }
      } else if (defaultOptions.once === false) {
        entry.target.classList.remove('revealed')
      }
    })
  }

  const observeElements = () => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      // Only observe if not already being observed
      if (!el.classList.contains('revealed') && !el.dataset.observing) {
        el.dataset.observing = 'true'
        observer.observe(el)
      }
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(handleIntersect, defaultOptions)

    // Initial observation
    observeElements()

    // Watch for new elements being added to the DOM
    mutationObserver = new MutationObserver(() => {
      observeElements()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
    }
  })
}
