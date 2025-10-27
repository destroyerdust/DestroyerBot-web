<template>
  <section class="py-20 px-4 bg-gray-900 relative overflow-hidden">
    <!-- Background decoration -->
    <div
      class="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"
    ></div>

    <div class="max-w-5xl mx-auto relative z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2
          class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          About DestroyerBot
        </h2>
        <div
          class="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"
        ></div>
      </div>

      <!-- Content Grid -->
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Left side - Description -->
        <div class="space-y-6">
          <p class="text-lg leading-relaxed text-gray-300">
            DestroyerBot is a personal Discord bot built with
            <span class="text-purple-400 font-semibold">Discord.js v14</span>, featuring utility
            commands, gaming stats integration, weather updates, and basic moderation tools.
          </p>

          <p class="text-lg leading-relaxed text-gray-300">
            It includes global commands like weather forecasting and Pokemon card information,
            making it a versatile bot for any Discord server.
          </p>

          <!-- Feature highlights -->
          <div class="space-y-3 mt-8">
            <div class="flex items-start gap-3 group">
              <div
                class="mt-1 w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors duration-300"
              >
                <svg
                  class="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-semibold mb-1">Built with Modern Tech</h4>
                <p class="text-gray-400 text-sm">
                  Powered by Discord.js v14 for optimal performance
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 group">
              <div
                class="mt-1 w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors duration-300"
              >
                <svg
                  class="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-semibold mb-1">Multi-Server Support</h4>
                <p class="text-gray-400 text-sm">
                  Works seamlessly across multiple Discord servers
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 group">
              <div
                class="mt-1 w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/30 transition-colors duration-300"
              >
                <svg
                  class="w-4 h-4 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-semibold mb-1">Regular Updates</h4>
                <p class="text-gray-400 text-sm">
                  Continuously improved with new features and fixes
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Tech Stack & Stats -->
        <div class="space-y-6">
          <!-- Tech Stack Card -->
          <div
            class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg
                class="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Tech Stack
            </h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">📡</span>
                </div>
                <div>
                  <div class="text-white font-semibold">Discord.js</div>
                  <div class="text-gray-400 text-sm">v14</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">⚡</span>
                </div>
                <div>
                  <div class="text-white font-semibold">Node.js</div>
                  <div class="text-gray-400 text-sm">Runtime</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">🔌</span>
                </div>
                <div>
                  <div class="text-white font-semibold">API Integration</div>
                  <div class="text-gray-400 text-sm">Multiple Services</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div
            class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700"
          >
            <h3 class="text-xl font-bold text-white mb-4">Quick Links</h3>
            <div class="space-y-3">
              <a
                href="https://github.com/destroyerdust/DestroyerBot"
                target="_blank"
                class="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >View Source Code</span
                >
              </a>
              <a
                href="https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=347136"
                target="_blank"
                class="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors duration-300 group"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                  />
                </svg>
                <span class="group-hover:translate-x-1 transition-transform duration-300"
                  >Invite to Discord</span
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutBot',
}
</script>
