<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <Hero />
    <AboutBot />
    <Features />
    <Documentation />
    <Footer />
  </div>
</template>

<script>
import Hero from './Hero.vue'
import AboutBot from './AboutBot.vue'
import Features from './Features.vue'
import Documentation from './Documentation.vue'
import Footer from './Footer.vue'

export default {
  name: 'Home',
  components: {
    Hero,
    AboutBot,
    Features,
    Documentation,
    Footer,
  },
}
</script>
