import './assets/main.css'
import { createApp } from 'vue'
import { Analytics } from '@vercel/analytics/vue'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(Analytics)

app.mount('#app')
