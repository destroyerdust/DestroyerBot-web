<template>
  <section class="py-20 px-4 bg-gray-800">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-4xl font-bold mb-12 text-center text-purple-400">Key Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-700 p-6 rounded-lg text-center">
          <h3 class="text-xl font-semibold mb-4">Utility Commands</h3>
          <p>Ping, user info, server stats, and other essential bot functions.</p>
        </div>
        <div class="bg-gray-700 p-6 rounded-lg text-center">
          <h3 class="text-xl font-semibold mb-4">Gaming Integration</h3>
          <p>WoW Raider IO stats, Pokemon TCG card lookups, and gaming data.</p>
        </div>
        <div class="bg-gray-700 p-6 rounded-lg text-center">
          <h3 class="text-xl font-semibold mb-4">Global Commands</h3>
          <p>Weather forecasts, and moderation tools accessible from any server.</p>
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
