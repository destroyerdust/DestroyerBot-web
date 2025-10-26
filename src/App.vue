<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <Hero />
    <AboutBot />
    <Features />
    <CommandShowcase />
    <Footer />
  </div>
</template>

<script>
import Hero from './components/Hero.vue'
import AboutBot from './components/AboutBot.vue'
import Features from './components/Features.vue'
import CommandShowcase from './components/CommandShowcase.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Hero,
    AboutBot,
    Features,
    CommandShowcase,
    Footer,
  },
}
</script>
