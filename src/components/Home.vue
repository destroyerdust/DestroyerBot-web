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
import Hero from './Hero.vue'
import AboutBot from './AboutBot.vue'
import Features from './Features.vue'
import CommandShowcase from './CommandShowcase.vue'
import Footer from './Footer.vue'

export default {
  name: 'Home',
  components: {
    Hero,
    AboutBot,
    Features,
    CommandShowcase,
    Footer,
  },
}
</script>
