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
          <button
            disabled
            class="relative px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold cursor-not-allowed opacity-60"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Coming Soon
            </span>
          </button>

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
export default {
  name: 'Hero',
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
