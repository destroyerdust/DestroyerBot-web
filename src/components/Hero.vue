<template>
  <section
    class="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
      ></div>
      <div
        class="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
      ></div>
    </div>

    <!-- Content with glassmorphism -->
    <div class="relative text-center max-w-4xl mx-auto px-4 z-10">
      <!-- Glassmorphism card -->
      <div
        class="backdrop-blur-lg bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-[1.02]"
      >
        <h1
          class="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent"
        >
          DestroyerBot
        </h1>
        <p class="text-2xl mb-10 text-gray-200 leading-relaxed">
          The ultimate Discord moderation bot to keep your server safe and organized.
        </p>

        <!-- Button group -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            :href="discordAuthUrl"
            class="relative px-8 py-4 bg-[#5865F2] text-white rounded-xl font-semibold transition-all duration-300 hover:bg-[#4752C4] hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                />
              </svg>
              Login with Discord
            </span>
          </a>

          <a
            href="https://github.com/destroyerdust/DestroyerBot"
            target="_blank"
            class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105 border border-white/20 hover:border-white/40"
          >
            View Documentation
          </a>
        </div>

        <!-- Stats section -->
        <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-300 mb-1">24/7</div>
            <div class="text-sm text-gray-300">Online</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-300 mb-1">10+</div>
            <div class="text-sm text-gray-300">Commands</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-indigo-300 mb-1">Fast</div>
            <div class="text-sm text-gray-300">Response</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="mt-12 animate-bounce">
        <svg
          class="w-6 h-6 mx-auto text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Hero',
  setup() {
    const discordAuthUrl = computed(() => {
      const clientId = '773000914319048736'
      const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/discord')
      const scope = encodeURIComponent('identify email')
      const state = encodeURIComponent(window.location.origin)
      return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`
    })

    return {
      discordAuthUrl,
    }
  },
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
