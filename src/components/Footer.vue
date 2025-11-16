<template>
  <footer
    class="relative py-12 px-4 bg-gray-950 border-t border-gray-800 overflow-hidden"
    role="contentinfo"
    aria-label="Site footer"
  >
    <!-- Background decoration -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Main footer content -->
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <!-- Brand section -->
        <div class="text-center md:text-left">
          <h3
            class="text-2xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3"
          >
            DestroyerBot
          </h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            Your ultimate Discord moderation companion for a safer, organized server.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="text-center">
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <div class="space-y-2">
            <a
              href="https://github.com/destroyerdust/DestroyerBot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View DestroyerBot repository on GitHub"
              class="block text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm"
            >
              Bot Repository
            </a>
            <a
              href="https://github.com/destroyerdust/DestroyerBot-web"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View DestroyerBot website repository on GitHub"
              class="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm"
            >
              Website Repository
            </a>
            <span class="block text-gray-600 cursor-not-allowed text-sm">
              Invite Bot (Coming Soon)
            </span>
          </div>
        </div>

        <!-- Tech Stack -->
        <div class="text-center md:text-right">
          <h4 class="text-white font-semibold mb-4">Built With</h4>
          <div class="flex flex-wrap justify-center md:justify-end gap-2 text-sm">
            <span
              class="px-3 py-1 bg-gray-800/50 rounded-full text-gray-400 border border-gray-700 hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
            >
              Vue.js
            </span>
            <span
              class="px-3 py-1 bg-gray-800/50 rounded-full text-gray-400 border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
            >
              Vite
            </span>
            <span
              class="px-3 py-1 bg-gray-800/50 rounded-full text-gray-400 border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300"
            >
              Tailwind
            </span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <p class="text-gray-500 text-sm">&copy; 2025 DestroyerBot. All rights reserved.</p>

          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/destroyerdust/DestroyerBot"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300"
              aria-label="View DestroyerBot on GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
            <div
              class="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-600 cursor-not-allowed opacity-60"
              aria-label="Discord (Coming Soon)"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to top button -->
    <Transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 p-4 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Scroll to top"
      >
        <svg
          class="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </Transition>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Footer component
 * Displays footer with branding, links, tech stack, social media, and back-to-top button
 */

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
