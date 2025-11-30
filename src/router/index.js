import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

// Lazy load components for better performance
const Home = () => import('../components/Home.vue')
const Dashboard = () => import('../components/Dashboard.vue')
const GuildSettings = () => import('../components/GuildSettings.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'DestroyerBot - Discord Moderation Bot',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - DestroyerBot',
      requiresAuth: true,
    },
  },
  {
    path: '/guild/:id',
    name: 'GuildSettings',
    component: GuildSettings,
    meta: {
      title: 'Guild Settings - DestroyerBot',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard for authentication and page titles
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'DestroyerBot'

  // Check authentication for protected routes
  if (to.meta.requiresAuth) {
    const userCookie = Cookies.get('discord_user')
    if (!userCookie) {
      // Redirect to home if not authenticated
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router
