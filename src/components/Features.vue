<template>
  <section class="py-20 px-4 bg-gray-900 relative overflow-hidden">
    <!-- Background decoration -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"
    ></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <h2
        class="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
      >
        Key Features
      </h2>
      <p class="text-center text-gray-400 mb-16 text-lg">
        Powerful tools to manage and enhance your Discord server
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature Card 1 -->
        <div
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
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
            Ping, user info, server stats, and other essential bot functions to keep your server
            running smoothly.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors duration-300"
          ></div>
        </div>

        <!-- Feature Card 2 -->
        <div
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
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
            WoW Raider IO stats, Pokemon TCG card lookups, and gaming data to enhance your community
            experience.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-300"
          ></div>
        </div>

        <!-- Feature Card 3 -->
        <div
          class="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
        >
          <!-- Icon container -->
          <div class="mb-6 relative">
            <div
              class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
            Global Commands
          </h3>
          <p class="text-gray-400 leading-relaxed">
            Weather forecasts and moderation tools accessible from any server, providing universal
            functionality.
          </p>

          <!-- Decorative corner -->
          <div
            class="absolute top-4 right-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-300"
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

<script>
export default {
  name: 'Features',
}
</script>

<style scoped>
/* Additional hover effects can be added here if needed */
</style>
