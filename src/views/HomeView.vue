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
import Hero from '../components/home/Hero.vue'
import AboutBot from '../components/home/AboutBot.vue'
import Features from '../components/home/Features.vue'
import Documentation from '../components/home/Documentation.vue'
import Footer from '../components/home/Footer.vue'

// Components are automatically registered with script setup
</script>
