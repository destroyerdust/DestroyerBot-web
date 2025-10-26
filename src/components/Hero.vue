<template>
  <section class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div class="text-center max-w-4xl mx-auto px-4">
      <h1 class="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        DestroyerBot
      </h1>
      <p class="text-xl mb-8 text-gray-300">
        The ultimate Discord moderation bot to keep your server safe and organized.
      </p>
      <button @click="inviteBot" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300">
        Invite DestroyerBot
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  methods: {
    inviteBot() {
      window.open('https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=347136', '_blank')
    },
  },
}
</script>
