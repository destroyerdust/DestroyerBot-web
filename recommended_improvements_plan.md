# Vue.js 3 Best Practices Analysis - DestroyerBot Web

## Executive Summary

The DestroyerBot web application demonstrates **good adoption of Vue 3 Composition API** with well-structured composables and modern patterns. However, there are several opportunities for improvement in areas such as TypeScript migration, state management, error handling, and component architecture refinement.

**Overall Grade: B+ (Good, with room for optimization)**

---

## 1. Component Architecture

### Current State
- **Script Setup Usage**: Excellent - All components use `<script setup>` syntax
- **Component Organization**: Good - Clear separation of concerns with Home as container
- **Composables**: Very Good - 5 well-designed composables (useAuth, useCardTilt, useCountUp, useDebounce, useScrollReveal)

### Issues Found

#### HIGH PRIORITY

**H1: Missing Route Guards for Authentication**
- **Location**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/router/index.js`
- **Issue**: Dashboard and GuildSettings routes have no authentication guards
- **Impact**: Users can access protected routes without being logged in, leading to poor UX
- **Recommendation**: Add navigation guards to redirect unauthenticated users

```javascript
// Recommended implementation
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const userCookie = Cookies.get('discord_user')

  if (requiresAuth && !userCookie) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

// Update routes with meta
{
  path: '/dashboard',
  name: 'Dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }
}
```

**H2: Large Components with Mixed Responsibilities**
- **Location**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/components/GuildSettings.vue` (868 lines)
- **Issue**: Single component handles settings, channels, notifications, and UI state
- **Impact**: Hard to maintain, test, and reuse
- **Recommendation**: Extract into smaller components:
  - `SettingCard.vue` - Reusable settings card wrapper
  - `ChannelSelector.vue` - Dropdown channel selection logic
  - `ToggleSwitch.vue` - Reusable toggle component
  - `NotificationToast.vue` - Notification system

**H3: Props and Emits Not Using TypeScript or defineProps/defineEmits**
- **Location**: Most components lack explicit prop/emit definitions
- **Issue**: No runtime validation, harder to maintain
- **Recommendation**: Add explicit prop definitions even in JavaScript

```javascript
// Current (implicit)
<script setup>
// No prop definitions
</script>

// Recommended
<script setup>
const props = defineProps({
  guildId: {
    type: String,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:settings', 'save'])
</script>
```

#### MEDIUM PRIORITY

**M1: Dashboard Component Has Complex Card Tilt Logic**
- **Location**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/components/Dashboard.vue` lines 468-486
- **Issue**: Watches guilds array to create cardRefs array, complex ref management
- **Impact**: Performance overhead, complex to understand
- **Recommendation**: Create a `GuildCard.vue` component that manages its own tilt

```javascript
// Current approach - managing array of tilt refs
const cardRefs = ref([])
watch(guilds, newGuilds => {
  cardRefs.value = newGuilds.map(() => useCardTilt(8))
}, { immediate: true })

// Recommended - extract to component
// GuildCard.vue
<script setup>
const props = defineProps(['guild'])
const { cardRef, tiltStyle, handleMouseMove, handleMouseLeave } = useCardTilt(8)
</script>
```

**M2: Inconsistent Error Handling Patterns**
- **Location**: Multiple components (Dashboard, GuildSettings)
- **Issue**: Some use try-catch with console.error, some don't handle errors at all
- **Recommendation**: Implement consistent error handling composable

```javascript
// Recommended: useErrorHandler composable
export function useErrorHandler() {
  const error = ref(null)
  const isError = computed(() => !!error.value)

  const handleError = (err, context = '') => {
    console.error(`[${context}]`, err)
    error.value = err.message || 'An error occurred'
    // Could also integrate with error tracking service
  }

  const clearError = () => {
    error.value = null
  }

  return { error, isError, handleError, clearError }
}
```

**M3: Hardcoded API URLs**
- **Location**: Dashboard.vue, GuildSettings.vue
- **Issue**: API endpoints like `/api/guilds` hardcoded in components
- **Recommendation**: Create API client composable

```javascript
// Recommended: useApi composable
export function useApi() {
  const baseURL = import.meta.env.VITE_API_URL || ''

  const get = async (endpoint, options = {}) => {
    const response = await fetch(`${baseURL}${endpoint}`, {
      credentials: 'include',
      ...options
    })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  }

  const post = async (endpoint, data, options = {}) => {
    // Similar implementation
  }

  return { get, post, put, delete: del }
}
```

**M4: Missing Component Documentation**
- **Location**: Several components
- **Issue**: Not all components have JSDoc comments explaining purpose, props, events
- **Impact**: Harder for team collaboration
- **Recommendation**: Add comprehensive JSDoc to all components

#### LOW PRIORITY

**L1: Duplicate Logout Logic**
- **Location**: Dashboard.vue and GuildSettings.vue both have logout functions
- **Issue**: Logic duplication
- **Recommendation**: Use centralized logout from useAuth composable

**L2: Magic Numbers in Animations**
- **Location**: Various components (timeouts, animation delays)
- **Issue**: Hardcoded values like `setTimeout(() => {}, 200)` scattered throughout
- **Recommendation**: Create animation constants file

```javascript
// src/constants/animations.js
export const ANIMATION_DELAYS = {
  DROPDOWN_CLOSE: 200,
  NOTIFICATION_AUTO_HIDE: 3000,
  CARD_REVEAL: 100
}
```

---

## 2. Routing Implementation

### Current State
- Simple, clean routing structure
- Uses createWebHistory correctly
- Route components directly imported (no lazy loading)

### Issues Found

#### HIGH PRIORITY

**H4: No Lazy Loading for Route Components**
- **Location**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/router/index.js`
- **Issue**: All routes eagerly loaded, increasing initial bundle size
- **Impact**: Slower initial page load
- **Recommendation**: Implement route-level code splitting

```javascript
// Current
import Dashboard from '../components/Dashboard.vue'
import GuildSettings from '../components/GuildSettings.vue'

// Recommended
const Dashboard = () => import('../components/Dashboard.vue')
const GuildSettings = () => import('../components/GuildSettings.vue')
```

**H5: Missing Route Metadata and Transitions**
- **Location**: Router configuration
- **Issue**: No meta fields, page titles, or transitions
- **Recommendation**: Add comprehensive route metadata

```javascript
{
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('../components/Dashboard.vue'),
  meta: {
    requiresAuth: true,
    title: 'Dashboard - DestroyerBot',
    description: 'Manage your Discord servers'
  }
}
```

---

## 3. State Management

### Current State
- No centralized state management (Pinia not used)
- State managed in individual components
- useAuth composable for authentication state

### Issues Found

#### HIGH PRIORITY

**H6: No Global State Management Solution**
- **Location**: Application-wide
- **Issue**: State scattered across components, auth state in composable but no store
- **Impact**: Difficult to share state, debug, or implement features like undo/redo
- **Recommendation**: Implement Pinia for authentication and guild state

```javascript
// Recommended: stores/auth.js
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userAvatar: (state) => {
      if (!state.user) return ''
      // Avatar logic
    }
  },

  actions: {
    async loadUserFromCookie() {
      const userCookie = Cookies.get('discord_user')
      if (userCookie) {
        this.user = JSON.parse(decodeURIComponent(userCookie))
      }
    },

    logout() {
      this.user = null
      window.location.href = '/api/auth/logout'
    }
  }
})
```

#### MEDIUM PRIORITY

**M5: Guild Data Not Cached**
- **Location**: Dashboard.vue fetches guilds every mount
- **Issue**: No caching, refetches on every navigation
- **Recommendation**: Use Pinia with caching strategy

```javascript
// Recommended: stores/guilds.js
export const useGuildsStore = defineStore('guilds', {
  state: () => ({
    guilds: [],
    lastFetched: null,
    cacheDuration: 5 * 60 * 1000 // 5 minutes
  }),

  actions: {
    async fetchGuilds(force = false) {
      const now = Date.now()
      if (!force && this.lastFetched && (now - this.lastFetched < this.cacheDuration)) {
        return this.guilds // Return cached data
      }

      // Fetch from API
      this.lastFetched = now
    }
  }
})
```

---

## 4. Vue 3 Best Practices

### Current State
- Excellent use of Composition API
- Proper lifecycle hook usage
- Good reactivity patterns

### Issues Found

#### MEDIUM PRIORITY

**M6: Reactive vs Ref Usage Not Optimized**
- **Location**: GuildSettings.vue uses `ref({})` for complex objects
- **Issue**: Using ref for objects can be less performant than reactive
- **Recommendation**: Use reactive() for objects, ref() for primitives

```javascript
// Current
const settings = ref({
  prefix: '!',
  welcome: { enabled: false, channelId: null },
  logs: { enabled: false, channelId: null }
})

// Recommended
const settings = reactive({
  prefix: '!',
  welcome: { enabled: false, channelId: null },
  logs: { enabled: false, channelId: null }
})

// Or use toRefs if you need destructuring
const { prefix, welcome, logs } = toRefs(settings)
```

**M7: Computed Properties Could Be Memoized Better**
- **Location**: Documentation.vue has multiple computed properties
- **Issue**: Some computed values recalculated unnecessarily
- **Recommendation**: Already well-implemented, but consider shallow reactivity for large lists

**M8: Watch Usage Could Be Optimized**
- **Location**: Dashboard.vue watches guilds for serverCount
- **Issue**: Could use watchEffect for simpler syntax
- **Recommendation**: Use watchEffect when appropriate

```javascript
// Current
watch(
  () => guilds.value.length,
  newCount => {
    serverCount.value = newCount
  },
  { immediate: true }
)

// Recommended (simpler)
watchEffect(() => {
  serverCount.value = guilds.value.length
})
```

#### LOW PRIORITY

**L3: Template Refs Could Use Typed Refs**
- **Issue**: Template refs are untyped
- **Recommendation**: When migrating to TypeScript, use typed refs

---

## 5. Performance & Optimization

### Current State
- Good use of debouncing in Documentation.vue
- Scroll reveal uses Intersection Observer (excellent)
- Some animations optimized

### Issues Found

#### HIGH PRIORITY

**H7: No Virtual Scrolling for Large Lists**
- **Location**: Dashboard guilds list, Documentation commands
- **Issue**: If user has 100+ guilds or commands, DOM will be heavy
- **Impact**: Performance degradation with large datasets
- **Recommendation**: Implement virtual scrolling for lists

```javascript
// Recommended: Use vue-virtual-scroller
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

<RecycleScroller
  :items="guilds"
  :item-size="100"
  key-field="id"
  v-slot="{ item }"
>
  <GuildCard :guild="item" />
</RecycleScroller>
```

#### MEDIUM PRIORITY

**M9: Images Not Lazy Loaded**
- **Location**: Guild icons, user avatars loaded eagerly
- **Issue**: All images load immediately, wasting bandwidth
- **Recommendation**: Add loading="lazy" attribute

```vue
<img
  :src="userAvatar"
  :alt="user.username"
  loading="lazy"
  class="w-24 h-24 rounded-full"
/>
```

**M10: No Component Memoization**
- **Location**: Feature cards, documentation cards
- **Issue**: Pure presentational components re-render unnecessarily
- **Recommendation**: Consider using v-memo for static content

```vue
<!-- For static content that rarely changes -->
<div v-memo="[guild.id, guild.name]">
  <!-- Guild card content -->
</div>
```

**M11: Scroll Reveal Creates Many Observers**
- **Location**: useScrollReveal.js
- **Issue**: Uses MutationObserver to watch for new elements
- **Impact**: Could be optimized for better performance
- **Recommendation**: Already well-implemented, but consider limiting observation scope

#### LOW PRIORITY

**L4: Animations Could Use CSS Containment**
- **Issue**: No CSS containment for animated elements
- **Recommendation**: Add `contain: layout paint` for animated cards

```css
.card-with-animation {
  contain: layout paint;
  will-change: transform;
}
```

---

## 6. Code Quality

### Current State
- Clean, readable code
- Good use of modern JavaScript
- Consistent formatting (Prettier configured)

### Issues Found

#### HIGH PRIORITY

**H8: No TypeScript Implementation**
- **Location**: Entire codebase is JavaScript
- **Issue**: Missing type safety, harder to catch bugs at compile time
- **Impact**: Runtime errors, harder refactoring, less IDE support
- **Recommendation**: Migrate to TypeScript incrementally

**Migration Strategy:**
1. Add `tsconfig.json`
2. Rename `main.js` to `main.ts`
3. Convert composables first (highest value, smallest scope)
4. Convert components one by one
5. Enable `strict: true` gradually

```json
// Recommended tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### MEDIUM PRIORITY

**M12: Missing JSDoc Comments**
- **Location**: Many functions lack documentation
- **Issue**: Harder to understand function purpose and parameters
- **Recommendation**: Add comprehensive JSDoc

```javascript
/**
 * Fetches guild settings from the API
 * @async
 * @returns {Promise<void>}
 * @throws {Error} When API request fails
 */
const fetchGuildSettings = async () => {
  // ...
}
```

**M13: No ESLint Vue-Specific Rules**
- **Location**: Project configuration
- **Issue**: Missing ESLint with Vue plugin for catching Vue-specific issues
- **Recommendation**: Add ESLint with Vue plugin

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
  ],
  rules: {
    'vue/multi-word-component-names': 'error',
    'vue/no-unused-vars': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error'
  }
}
```

**M14: Console Statements in Production Code**
- **Location**: Multiple console.error and console.warn calls
- **Issue**: Console statements in production
- **Recommendation**: Use proper logging service or remove in production

```javascript
// Recommended: Create logger utility
// src/utils/logger.js
export const logger = {
  error: (...args) => {
    if (import.meta.env.DEV) {
      console.error(...args)
    }
    // Send to error tracking service in production
    if (import.meta.env.PROD) {
      // sendToSentry(...args)
    }
  }
}
```

#### LOW PRIORITY

**L5: Inconsistent Naming Conventions**
- **Issue**: Some variables use camelCase, some use snake_case in computed names
- **Recommendation**: Enforce camelCase consistently

**L6: No Code Comments for Complex Logic**
- **Location**: Card tilt calculations, channel selection logic
- **Issue**: Complex algorithms without explanation
- **Recommendation**: Add explanatory comments

---

## 7. Accessibility

### Current State
- Good use of semantic HTML
- ARIA labels present on some elements
- Focus styles defined

### Issues Found

#### MEDIUM PRIORITY

**M15: Missing ARIA Labels on Interactive Elements**
- **Location**: Toggle switches, some buttons
- **Issue**: Screen readers may not understand purpose
- **Recommendation**: Add comprehensive ARIA attributes

```vue
<!-- Current -->
<button @click="settings.welcome.enabled = !settings.welcome.enabled">
  <!-- Toggle switch -->
</button>

<!-- Recommended -->
<button
  @click="settings.welcome.enabled = !settings.welcome.enabled"
  role="switch"
  :aria-checked="settings.welcome.enabled"
  aria-label="Enable welcome messages"
>
  <!-- Toggle switch -->
</button>
```

**M16: Keyboard Navigation Not Complete**
- **Location**: Dropdown selectors, card interactions
- **Issue**: Some interactive elements missing keyboard handlers
- **Recommendation**: Add proper keyboard event handling

```vue
<!-- Add keyboard navigation to dropdowns -->
<div
  v-for="channel in filteredChannels"
  @click="selectChannel(channel)"
  @keydown.enter="selectChannel(channel)"
  @keydown.space.prevent="selectChannel(channel)"
  tabindex="0"
  role="option"
>
```

**M17: Color Contrast Issues Possible**
- **Location**: Gray text on dark backgrounds
- **Issue**: May not meet WCAG AA standards
- **Recommendation**: Audit with accessibility tools and adjust colors

#### LOW PRIORITY

**L7: Missing Skip Navigation Link**
- **Issue**: No skip to main content link for keyboard users
- **Recommendation**: Add skip navigation

**L8: Focus Trap in Dropdowns**
- **Issue**: Dropdown focus doesn't trap within dropdown
- **Recommendation**: Implement focus trap for modals and dropdowns

---

## 8. Testing Recommendations

### Current State
- No testing infrastructure visible in codebase
- No test files found

### Recommendations

#### HIGH PRIORITY

**H9: No Unit Tests for Composables**
- **Impact**: Composables are reused but untested
- **Recommendation**: Add Vitest and test composables

```javascript
// tests/composables/useAuth.test.js
import { describe, it, expect } from 'vitest'
import { useAuth } from '@/composables/useAuth'

describe('useAuth', () => {
  it('should generate correct Discord OAuth URL', () => {
    const { discordAuthUrl } = useAuth()
    expect(discordAuthUrl.value).toContain('discord.com/api/oauth2/authorize')
    expect(discordAuthUrl.value).toContain('scope=identify%20email%20guilds')
  })

  it('should compute user avatar correctly', () => {
    // Test implementation
  })
})
```

#### MEDIUM PRIORITY

**M18: No Component Tests**
- **Recommendation**: Add component testing with @vue/test-utils

```javascript
// tests/components/Hero.test.js
import { mount } from '@vue/test-utils'
import Hero from '@/components/Hero.vue'

describe('Hero', () => {
  it('renders Discord login button', () => {
    const wrapper = mount(Hero)
    expect(wrapper.find('a').text()).toContain('Login with Discord')
  })
})
```

**M19: No E2E Tests**
- **Recommendation**: Add Cypress or Playwright for critical user flows

```javascript
// e2e/auth-flow.spec.js
describe('Authentication Flow', () => {
  it('allows user to login with Discord', () => {
    cy.visit('/')
    cy.contains('Login with Discord').click()
    // Test OAuth flow
  })
})
```

---

## Priority Implementation Roadmap

### Phase 1: Critical Fixes (Week 1-2)
1. **H1**: Add route guards for authentication
2. **H4**: Implement lazy loading for routes
3. **H6**: Set up Pinia for state management
4. **H8**: Begin TypeScript migration (start with composables)

### Phase 2: Architecture Improvements (Week 3-4)
5. **H2**: Refactor GuildSettings into smaller components
6. **M1**: Extract GuildCard component
7. **M2**: Implement useErrorHandler composable
8. **M3**: Create useApi composable

### Phase 3: Testing & Quality (Week 5-6)
9. **H9**: Set up Vitest and write composable tests
10. **M18**: Add component tests
11. **M13**: Configure ESLint with Vue rules
12. **M12**: Add JSDoc documentation

### Phase 4: Performance & Polish (Week 7-8)
13. **H7**: Implement virtual scrolling for large lists
14. **M9**: Add lazy loading to images
15. **M15-M17**: Accessibility improvements
16. **M6**: Optimize reactive/ref usage

---

## Specific Code Examples

### Example 1: Route Guards Implementation

**File**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/router/index.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

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
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - DestroyerBot',
      requiresAuth: true
    }
  },
  {
    path: '/guild/:id',
    name: 'GuildSettings',
    component: GuildSettings,
    meta: {
      title: 'Guild Settings - DestroyerBot',
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'DestroyerBot'

  // Check authentication
  if (to.meta.requiresAuth) {
    const userCookie = Cookies.get('discord_user')
    if (!userCookie) {
      next({ name: 'Home' })
      return
    }
  }

  next()
})

export default router
```

### Example 2: Pinia Store for Authentication

**File**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/stores/auth.js` (NEW)

```javascript
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,

    userAvatar: (state) => {
      if (!state.user) return ''

      if (state.user.avatar) {
        return `https://cdn.discordapp.com/avatars/${state.user.id}/${state.user.avatar}.png?size=256`
      }

      const discriminator = state.user.discriminator || '0'
      return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png`
    },

    discordAuthUrl: () => {
      if (typeof window === 'undefined') return '#'

      const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '773000914319048736'
      const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: `${window.location.origin}/api/auth/discord`,
        response_type: 'code',
        scope: 'identify email guilds',
        state: window.location.origin,
      })

      return `https://discord.com/api/oauth2/authorize?${params.toString()}`
    }
  },

  actions: {
    loadUserFromCookie() {
      const userCookie = Cookies.get('discord_user')
      if (userCookie) {
        try {
          this.user = JSON.parse(decodeURIComponent(userCookie))
        } catch (e) {
          console.error('Failed to parse user cookie:', e)
          this.user = null
          this.error = 'Invalid session'
        }
      }
      this.loading = false
    },

    logout() {
      this.user = null
      this.error = null
      window.location.href = '/api/auth/logout'
    },

    clearError() {
      this.error = null
    }
  }
})
```

### Example 3: Extracted GuildCard Component

**File**: `/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/components/GuildCard.vue` (NEW)

```vue
<template>
  <div
    ref="cardRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    :style="tiltStyle"
    role="button"
    :aria-label="`Configure ${guild.name} server settings`"
    tabindex="0"
    class="relative bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 hover:bg-black/40 transition-all duration-300 cursor-pointer transform-style-3d hover:shadow-xl hover:shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
  >
    <!-- Glare overlay effect -->
    <div
      :style="glareStyle"
      class="absolute inset-0 rounded-lg pointer-events-none"
    ></div>

    <!-- Card content -->
    <div class="relative flex items-center gap-4">
      <!-- Guild icon -->
      <div class="relative">
        <div
          class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden"
        >
          <img
            v-if="guildIcon"
            :src="guildIcon"
            :alt="guild.name"
            loading="lazy"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-2xl font-bold text-purple-400">
            {{ guild.name.charAt(0).toUpperCase() }}
          </span>
        </div>

        <!-- Bot status indicator -->
        <div
          class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse-slow"
          :title="botStatus"
          :aria-label="botStatus"
        ></div>
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="text-white font-semibold truncate">{{ guild.name }}</h4>
        <p class="text-gray-400 text-sm">
          <span v-if="guild.owner" class="text-yellow-400">Owner</span>
          <span v-else>Manager</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCardTilt } from '@/composables/useCardTilt.js'

const props = defineProps({
  guild: {
    type: Object,
    required: true,
    validator: (guild) => {
      return guild.id && guild.name
    }
  }
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const { cardRef, tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = useCardTilt(8)

const guildIcon = computed(() => {
  if (props.guild.icon) {
    return `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png?size=128`
  }
  return null
})

const botStatus = computed(() => 'Bot is online')

const handleClick = () => {
  emit('navigate', props.guild.id)
  router.push(`/guild/${props.guild.id}`)
}
</script>
```

---

## Summary of Recommendations

### Must-Have (Complete in 1-2 weeks)
1. Add authentication route guards
2. Implement route lazy loading
3. Set up Pinia for state management
4. Extract large components (GuildSettings) into smaller pieces
5. Begin TypeScript migration

### Should-Have (Complete in 3-4 weeks)
6. Create reusable composables (useApi, useErrorHandler)
7. Add comprehensive testing (Vitest + Vue Test Utils)
8. Implement virtual scrolling for large lists
9. Add ESLint with Vue plugin
10. Improve accessibility (ARIA labels, keyboard nav)

### Nice-to-Have (Complete in 5-8 weeks)
11. Full TypeScript migration
12. Component library extraction for reusable UI components
13. Performance optimizations (image lazy loading, memoization)
14. Enhanced error handling and logging
15. E2E testing with Cypress/Playwright

---

## Conclusion

The DestroyerBot web application has a **solid foundation** with modern Vue 3 patterns, good composable design, and clean code structure. The main areas for improvement are:

1. **TypeScript adoption** for better type safety
2. **State management** with Pinia for scalability
3. **Testing infrastructure** for reliability
4. **Component extraction** for better maintainability
5. **Performance optimizations** for large datasets

The codebase is well-positioned for these improvements and demonstrates good understanding of Vue 3 Composition API patterns. With the recommended changes, this would become an exemplary Vue 3 application.
