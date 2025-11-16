<template>
  <main class="min-h-screen bg-gray-900 text-white">
    <Hero />
    <AboutBot />
    <Features />
    <Documentation />
    <Footer />
  </main>
</template>

<script setup>
/**
 * Home component - Landing page container
 * Composes all main sections of the public-facing website
 */
import Hero from './Hero.vue'
import AboutBot from './AboutBot.vue'
import Features from './Features.vue'
import Documentation from './Documentation.vue'
import Footer from './Footer.vue'

// Components are automatically registered with script setup
</script>
