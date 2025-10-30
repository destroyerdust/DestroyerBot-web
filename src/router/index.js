import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Dashboard from '../components/Dashboard.vue'
import GuildSettings from '../components/GuildSettings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/guild/:id',
    name: 'GuildSettings',
    component: GuildSettings,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
