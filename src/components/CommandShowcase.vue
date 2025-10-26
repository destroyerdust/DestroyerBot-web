<template>
  <section class="py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold mb-12 text-center text-purple-400">Command Examples</h2>
      <div class="bg-gray-800 p-6 rounded-lg">
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-blue-400 mb-4">Utility Commands</h3>
          <div class="mb-4">
            <code class="text-green-400">/ping</code>
            <p class="text-gray-300 mt-2">Replies with Pong!</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/user-info</code>
            <p class="text-gray-300 mt-2">Displays information about yourself.</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/server</code>
            <p class="text-gray-300 mt-2">Displays comprehensive server information.</p>
          </div>
        </div>
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-blue-400 mb-4">Gaming Commands</h3>
          <div class="mb-4">
            <code class="text-green-400">/rio character realm</code>
            <p class="text-gray-300 mt-2">Raider IO World of Warcraft character information.</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/rio guild realm</code>
            <p class="text-gray-300 mt-2">Raider IO guild information.</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/pokemon search query</code>
            <p class="text-gray-300 mt-2">Search Pokemon TCG cards by name.</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/pokemon random</code>
            <p class="text-gray-300 mt-2">Get a random Pokemon card.</p>
          </div>
        </div>
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-blue-400 mb-4">Global Commands</h3>
          <div class="mb-4">
            <code class="text-green-400">/weather location</code>
            <p class="text-gray-300 mt-2">Get current weather for a location (e.g., "New York").</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/3d-print-status</code>
            <p class="text-gray-300 mt-2">Check 3D print status.</p>
          </div>
          <div class="mb-4">
            <code class="text-green-400">/kick member</code>
            <p class="text-gray-300 mt-2">Kick a member from the server.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CommandShowcase',
}
</script>
