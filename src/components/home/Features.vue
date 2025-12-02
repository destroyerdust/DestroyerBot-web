<template>
  <section class="py-20 px-4 bg-gray-900 relative overflow-hidden">
    <!-- Background decoration -->
    <div
      class="absolute inset-0 bg-linear-to-b from-transparent via-purple-900/5 to-transparent"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <h2
        class="text-5xl font-bold mb-4 text-center bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
      >
        Key Features
      </h2>
      <p class="text-center text-gray-400 mb-16 text-lg">
        Powerful tools to manage and enhance your Discord server
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature Card 1 -->
        <div
          :ref="card1.cardRef"
          @mousemove="card1.handleMouseMove"
          @mouseleave="card1.handleMouseLeave"
          :style="card1.tiltStyle.value"
          :class="{ 'scroll-reveal revealed animate-slide-up': cardsRevealed }"
          class="group relative bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform-style-3d"
        >
          <!-- Glare effect -->
          <div
            :style="card1.glareStyle.value"
            class="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          ></div>
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-purple-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></div>
          </div>

          <h3
            class="text-2xl font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300"
          >
            Utility Commands
          </h3>
          <p class="text-gray-400 leading-relaxed">
            Essential commands including /ping for response checks, /user-info to display your
            details, and /server for comprehensive server statistics.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors duration-300"
          ></div>
        </div>

        <!-- Feature Card 2 -->
        <div
          :ref="card2.cardRef"
          @mousemove="card2.handleMouseMove"
          @mouseleave="card2.handleMouseLeave"
          :style="card2.tiltStyle.value"
          :class="{ 'scroll-reveal revealed animate-slide-up animate-delay-100': cardsRevealed }"
          class="group relative bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 transform-style-3d"
        >
          <!-- Glare effect -->
          <div
            :style="card2.glareStyle.value"
            class="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          ></div>
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></div>
          </div>

          <h3
            class="text-2xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300"
          >
            Gaming Integration
          </h3>
          <p class="text-gray-400 leading-relaxed">
            Retrieve World of Warcraft character and guild Raider IO stats with /rio command. Search
            Pokemon TCG cards or get random cards with /pokemon command.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-300"
          ></div>
        </div>

        <!-- Feature Card 3 -->
        <div
          :ref="card3.cardRef"
          @mousemove="card3.handleMouseMove"
          @mouseleave="card3.handleMouseLeave"
          :style="card3.tiltStyle.value"
          :class="{ 'scroll-reveal revealed animate-slide-up animate-delay-200': cardsRevealed }"
          class="group relative bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 transform-style-3d"
        >
          <!-- Glare effect -->
          <div
            :style="card3.glareStyle.value"
            class="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          ></div>
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-indigo-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></div>
          </div>

          <h3
            class="text-2xl font-semibold mb-4 text-white group-hover:text-indigo-300 transition-colors duration-300"
          >
            Administrator Tools
          </h3>
          <p class="text-gray-400 leading-relaxed">
            Comprehensive role-based permission system for commands. Set roles with commands like
            /setcommandrole, manage logging channels, and moderate effectively.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-300"
          ></div>
        </div>

        <!-- Feature Card 4 -->
        <div
          :ref="card4.cardRef"
          @mousemove="card4.handleMouseMove"
          @mouseleave="card4.handleMouseLeave"
          :style="card4.tiltStyle.value"
          :class="{ 'scroll-reveal revealed animate-slide-up animate-delay-300': cardsRevealed }"
          class="group relative bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 transform-style-3d"
        >
          <!-- Glare effect -->
          <div
            :style="card4.glareStyle.value"
            class="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          ></div>
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <!-- Glow effect -->
            <div
              class="absolute inset-0 bg-emerald-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
            ></div>
          </div>

          <h3
            class="text-2xl font-semibold mb-4 text-white group-hover:text-emerald-300 transition-colors duration-300"
          >
            Message Logging
          </h3>
          <p class="text-gray-400 leading-relaxed">
            Automated logging system tracking message creations and deletions with detailed embeds.
            Integrates with audit logs for effective moderation.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-300"
          ></div>
        </div>
      </div>

      <!-- Additional features badges -->
      <div class="mt-16 flex flex-wrap justify-center gap-4">
        <div
          class="px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 text-gray-300 text-sm font-medium hover:border-purple-500 hover:text-purple-300 transition-all duration-300"
        >
          🚀 Fast Response Time
        </div>
        <div
          class="px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 text-gray-300 text-sm font-medium hover:border-blue-500 hover:text-blue-300 transition-all duration-300"
        >
          🔒 Secure & Reliable
        </div>
        <div
          class="px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 text-gray-300 text-sm font-medium hover:border-indigo-500 hover:text-indigo-300 transition-all duration-300"
        >
          ⚡ Regular Updates
        </div>
        <div
          class="px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700 text-gray-300 text-sm font-medium hover:border-purple-500 hover:text-purple-300 transition-all duration-300"
        >
          💬 Active Support
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCardTilt } from '@/composables/useCardTilt.js'

/**
 * Features component
 * Showcases key features of DestroyerBot including utility commands,
 * gaming integration, administrator tools, and message logging with 3D tilt effects
 */

// 3D tilt effects for each card
const card1 = useCardTilt(8)
const card2 = useCardTilt(8)
const card3 = useCardTilt(8)
const card4 = useCardTilt(8)

// Staggered reveal animation
const cardsRevealed = ref(false)

onMounted(() => {
  // Trigger staggered entrance animation
  setTimeout(() => {
    cardsRevealed.value = true
  }, 100)
})
</script>
