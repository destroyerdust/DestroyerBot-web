import './assets/main.css'
import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
inject()

app.mount('#app')
