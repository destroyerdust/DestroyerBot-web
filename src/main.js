import './assets/main.css'
import { createApp } from 'vue'
import Analytics from '@vercel/analytics'
import App from './App.vue'

const app = createApp(App)

app.mount('#app')

new Analytics()
