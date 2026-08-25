# Pinia State Management Implementation Plan
**DestroyerBot Web Application**

**Priority:** HIGH (H2 in recommended_improvements_plan.md)
**Estimated Effort:** 2-3 days implementation + 1 day testing
**Date:** 2025-12-02

---

## Executive Summary

Implement Pinia state management to solve critical architectural issues in the DestroyerBot web application:

**Current Problems:**
- No centralized state management - state scattered across components
- Guild data refetched on every navigation (no caching)
- Inconsistent error handling patterns
- Difficult debugging and state tracking

**Solution:**
Add Pinia with 3 core stores:
1. **Auth Store** - Centralized authentication state
2. **Guilds Store** - Guild data with 5-minute caching
3. **UI Store** - Global UI state (notifications, loading)

**Expected Benefits:**
- 80% reduction in API calls through caching
- Centralized error handling and loading states
- Better debugging with Vue Devtools
- Foundation for TypeScript migration

---

## Current State Analysis

### Authentication Management
- **File:** `src/composables/useAuth.js`
- **Pattern:** Distributed - each component creates its own auth instance
- **Issues:** Multiple sources of truth, no shared state

### Guild Data Management
- **Files:** `src/views/DashboardView.vue`, `src/views/GuildSettingsView.vue`
- **Pattern:** Local component state with fetch on mount
- **Issues:** Re-fetches on every navigation, no caching, data duplication

### Notification System
- **File:** `src/composables/useNotification.js`
- **Pattern:** Module-level shared state (already global)
- **Status:** Well-designed, can coexist with Pinia or migrate to UI store

---

## Store Architecture

### 1. Auth Store (`src/stores/auth.js`)

**Responsibilities:**
- User authentication state
- Discord OAuth URL generation
- User avatar computation
- Session loading from cookies
- Logout functionality

**State:**
```javascript
{
  user: null | { id, username, email, avatar, discriminator },
  loading: boolean,
  error: string | null,
  DISCORD_CLIENT_ID: string
}
```

**Getters:**
- `isAuthenticated` - Boolean check for user session
- `userAvatar` - Computed Discord CDN avatar URL
- `discordAuthUrl` - Computed OAuth authorization URL

**Actions:**
- `loadUserFromCookie()` - Parse and set user from cookie
- `logout()` - Clear user and redirect to logout endpoint
- `clearError()` - Reset error state

### 2. Guilds Store (`src/stores/guilds.js`)

**Responsibilities:**
- Guild list management with 5-minute caching
- Guild settings management
- Channel data caching
- API error handling

**State:**
```javascript
{
  guilds: Array<Guild>,
  currentGuild: null | object,
  currentGuildChannels: Array<Channel>,
  settings: object,
  loading: {
    guilds: boolean,
    guild: boolean,
    channels: boolean,
    settings: boolean
  },
  error: {
    guilds: null | string,
    guild: null | string,
    channels: null | string,
    settings: null | string
  },
  cache: {
    guildsLastFetched: null | number,
    guildDataLastFetched: Map<guildId, timestamp>,
    channelsLastFetched: Map<guildId, timestamp>
  },
  CACHE_DURATION: 300000 // 5 minutes
}
```

**Getters:**
- `managedGuilds` - Filter guilds with manage permission
- `serverCount` - Count of managed guilds
- `getGuildById(id)` - Find guild by ID
- `isGuildCacheValid` - Check if guilds cache is still valid
- `getGuildIcon(guild)` - Generate Discord CDN icon URL

**Actions:**
- `fetchGuilds(force = false)` - Fetch user guilds with caching
- `fetchGuildDetails(guildId, force = false)` - Fetch single guild details
- `fetchGuildChannels(guildId, force = false)` - Fetch guild channels
- `saveGuildSettings(guildId, settings)` - Save guild settings
- `invalidateCache(type, guildId)` - Clear specific cache
- `clearErrors()` - Reset all error states

### 3. UI Store (`src/stores/ui.js`)

**Responsibilities:**
- Global notification state
- Global loading overlays

**State:**
```javascript
{
  notification: {
    show: boolean,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  },
  globalLoading: boolean
}
```

**Actions:**
- `showNotification(message, type, duration)` - Display notification
- `hideNotification()` - Hide current notification
- `setGlobalLoading(loading)` - Set global loading state

---

## Implementation Phases

### Phase 1: Setup & Store Creation (Day 1)

**Tasks:**
1. Install Pinia: `npm install pinia`
2. Configure Pinia in `src/main.js`
3. Create `/src/stores/` directory
4. Create `src/stores/auth.js` store
5. Create `src/stores/guilds.js` store
6. Create `src/stores/ui.js` store
7. Create `src/stores/index.js` for exports

**Key Changes:**
- `src/main.js`: Add `createPinia()` and `app.use(pinia)` before router

### Phase 2: Migrate Authentication (Day 1-2)

**Tasks:**
1. Update router navigation guards to use auth store
2. Initialize auth store on app mount (in App.vue)
3. Migrate Hero component to use auth store
4. Migrate DashboardView to use auth store
5. Migrate GuildSettingsView to use auth store
6. Deprecate or remove `src/composables/useAuth.js`

**Critical Files:**
- `src/router/index.js` - Replace cookie check with `authStore.isAuthenticated`
- `src/App.vue` - Call `authStore.loadUserFromCookie()` on mount
- `src/components/home/Hero.vue` - Use `authStore.discordAuthUrl`
- `src/views/DashboardView.vue` - Use `authStore` for user, logout
- `src/views/GuildSettingsView.vue` - Use `authStore.logout()`

### Phase 3: Migrate Guild Data (Day 2)

**Tasks:**
1. Update DashboardView to use guilds store
2. Remove local `fetchGuilds()` function
3. Update GuildSettingsView to use guilds store
4. Remove local `fetchGuildSettings()`, `fetchGuildChannels()` functions
5. Implement cache validation logic
6. Test cache expiration (5 minutes)

**Critical Files:**
- `src/views/DashboardView.vue`:
  - Replace `const guilds = ref([])` with `const { guilds } = storeToRefs(guildsStore)`
  - Replace `fetchGuilds()` with `guildsStore.fetchGuilds()`

- `src/views/GuildSettingsView.vue`:
  - Replace local state with `storeToRefs(guildsStore)`
  - Replace API calls with store actions

### Phase 4: Migrate Notifications (Day 2-3)

**Tasks:**
1. Decide: Keep `useNotification.js` or migrate to UI store
2. Update NotificationToast component if migrating
3. Update all notification calls in components
4. Test notification display across app

**Recommendation:** Keep `useNotification.js` as-is (it's already well-designed)

### Phase 5: Testing & Validation (Day 3)

**Manual Testing Checklist:**
- [ ] User can login with Discord
- [ ] User session persists on refresh
- [ ] Dashboard shows guilds (cached)
- [ ] Refreshing dashboard uses cache (check Network tab)
- [ ] After 5 minutes, cache refreshes
- [ ] Force refresh works
- [ ] Guild settings load correctly
- [ ] Guild channels load correctly
- [ ] Settings save successfully
- [ ] Notifications appear and disappear
- [ ] Logout clears state and redirects
- [ ] Protected routes redirect when not authenticated
- [ ] Navigation between routes maintains state

**Vue Devtools Verification:**
- Open Vue Devtools
- Check Pinia tab exists
- Verify stores are registered (auth, guilds, ui)
- Inspect state changes during navigation
- Check getters compute correctly
- Monitor actions being dispatched

**Cache Testing:**
- Navigate to dashboard (guilds fetched)
- Check Network tab - API call made
- Navigate away and back to dashboard
- Check Network tab - NO API call (cached)
- Wait 5 minutes
- Navigate to dashboard again
- Check Network tab - API call made (cache expired)

---

## File Changes

### Files to CREATE (4)

1. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/stores/auth.js`**
   - Auth store with state, getters, actions
   - See detailed implementation in agent plan

2. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/stores/guilds.js`**
   - Guilds store with caching logic
   - See detailed implementation in agent plan

3. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/stores/ui.js`**
   - UI store for notifications
   - See detailed implementation in agent plan

4. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/stores/index.js`** (Optional)
   - Export all stores for convenient imports
   ```javascript
   export { useAuthStore } from './auth'
   export { useGuildsStore } from './guilds'
   export { useUIStore } from './ui'
   ```

### Files to MODIFY (9)

1. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/package.json`**
   - Add pinia dependency: `"pinia": "^2.1.x"`

2. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/main.js`**
   - Import and register Pinia
   - Add before router: `app.use(pinia)`

3. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/router/index.js`**
   - Replace cookie check with auth store check
   - Import `useAuthStore`
   - Use `authStore.isAuthenticated` in `beforeEach` guard

4. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/App.vue`**
   - Initialize auth on mount
   - Call `authStore.loadUserFromCookie()` in `onMounted`

5. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/views/DashboardView.vue`**
   - Replace `useAuth` with `useAuthStore`
   - Replace local guild fetching with `useGuildsStore`
   - Remove `fetchGuilds` function (lines ~453-501)
   - Update template refs to use store state

6. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/views/GuildSettingsView.vue`**
   - Replace `useAuth` with `useAuthStore`
   - Replace local guild/settings/channels fetching with `useGuildsStore`
   - Replace `useNotification` with `useUIStore` (if migrating)
   - Remove `fetchGuildSettings`, `fetchGuildChannels`, `saveSettings` functions
   - Update template refs to use store state

7. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/components/home/Hero.vue`**
   - Replace `useAuth` with `useAuthStore`
   - Use `storeToRefs` for reactive properties

8. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/composables/useAuth.js`**
   - **Option A:** Delete (clean break)
   - **Option B:** Convert to compatibility wrapper with deprecation warning

9. **`/mnt/c/Users/Sean/Documents/Development/DestroyerBot-web/src/composables/useNotification.js`**
   - **Option A:** Delete and migrate to UI store
   - **Option B:** Keep as-is (recommended - already well-designed)
   - **Option C:** Convert to compatibility wrapper

---

## Caching Strategy

### Cache Implementation

**Cache Structure:**
```javascript
cache: {
  guildsLastFetched: null,              // Timestamp of last guild list fetch
  guildDataLastFetched: new Map(),      // Per-guild data cache (guildId -> timestamp)
  channelsLastFetched: new Map()        // Per-guild channels cache (guildId -> timestamp)
}
```

**Cache Duration:**
```javascript
CACHE_DURATION: 5 * 60 * 1000 // 5 minutes (300,000ms)
```

### Cache Validation

**Check if cache is valid:**
```javascript
getters: {
  isGuildCacheValid: (state) => {
    if (!state.cache.guildsLastFetched) return false
    const now = Date.now()
    return (now - state.cache.guildsLastFetched) < state.CACHE_DURATION
  }
}
```

### Cache Invalidation

**Manual Invalidation:**
```javascript
// Force refresh
guildsStore.fetchGuilds(force = true)

// Invalidate specific cache
guildsStore.invalidateCache('guilds')
guildsStore.invalidateCache('guild', guildId)
guildsStore.invalidateCache('channels', guildId)
```

**Automatic Invalidation:**
- After mutations (saveGuildSettings)
- On logout (clear all guilds cache)
- Time-based (automatic via isGuildCacheValid getter)

---

## Error Handling Pattern

### In Stores (Actions)

```javascript
async fetchGuilds(force = false) {
  // 1. Set loading state
  this.loading.guilds = true
  this.error.guilds = null

  try {
    // 2. Perform operation
    const response = await fetch('/api/guilds', { credentials: 'include' })
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)

    const data = await response.json()
    this.guilds = data.guilds || []
    this.cache.guildsLastFetched = Date.now()
  } catch (err) {
    // 3. Set error state
    this.error.guilds = err.message || 'Failed to load guilds'
    throw err // Re-throw for component handling
  } finally {
    // 4. Clear loading state
    this.loading.guilds = false
  }
}
```

### In Components

```javascript
const guildsStore = useGuildsStore()
const uiStore = useUIStore()

const loadGuilds = async () => {
  try {
    await guildsStore.fetchGuilds()
  } catch (err) {
    // Store already has error in guildsStore.error.guilds
    uiStore.showNotification(err.message, 'error')
  }
}
```

### Template Usage

```vue
<template>
  <!-- Loading state -->
  <div v-if="guildsStore.loading.guilds">Loading...</div>

  <!-- Error state -->
  <div v-else-if="guildsStore.error.guilds" class="error">
    {{ guildsStore.error.guilds }}
  </div>

  <!-- Success state -->
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

---

## Testing Strategy

### Manual Testing (Day 3)

**Authentication Flow:**
1. Test Discord login
2. Verify session persistence on refresh
3. Test logout functionality
4. Verify protected routes redirect

**Guild Data Flow:**
1. Load dashboard - verify guilds appear
2. Check Network tab - API call made
3. Navigate away and back - verify cache used (no API call)
4. Wait 5 minutes - verify cache expires
5. Test guild settings loading
6. Test guild channels loading
7. Test settings save

**Error Handling:**
1. Disconnect internet - verify error states
2. Test 403/404 responses
3. Test rate limiting (429)
4. Verify error notifications appear

### Vue Devtools Testing

1. Open Vue Devtools
2. Navigate to Pinia tab
3. Inspect state in each store
4. Trigger actions and watch state changes
5. Verify getters compute correctly
6. Check cache timestamps

### Performance Testing

**Metrics to Track:**
- Initial page load time
- Guild list from cache (should be < 100ms)
- Guild list fresh fetch (should be < 1s)
- API call reduction (should be 80%+)

---

## Success Criteria

### Functional Requirements
- ✅ User can login with Discord
- ✅ User session persists across page refreshes
- ✅ Dashboard displays user guilds
- ✅ Guild list uses 5-minute cache
- ✅ Guild settings load and save correctly
- ✅ Channels load for guild configuration
- ✅ Notifications display for user actions
- ✅ Logout clears state and redirects
- ✅ Protected routes check authentication

### Performance Requirements
- ✅ Initial page load < 2s
- ✅ Guild list from cache < 100ms
- ✅ Guild list fresh fetch < 1s
- ✅ No unnecessary API calls (verify in Network tab)
- ✅ Cache reduces API calls by 80%+

### Code Quality Requirements
- ✅ All stores have JSDoc comments
- ✅ Consistent error handling patterns
- ✅ Loading states for all async operations
- ✅ No console errors in production

### Developer Experience Requirements
- ✅ State visible in Vue Devtools
- ✅ Clear debugging with store logging
- ✅ Documentation updated

---

## Rollback Plan

### Immediate Rollback

If implementation encounters critical issues:

1. **Revert Git Commits**
   ```bash
   git log --oneline  # Find commit before Pinia
   git reset --hard <commit-hash>
   ```

2. **Remove Pinia Dependency**
   ```bash
   npm uninstall pinia
   npm install  # Restore package-lock.json
   ```

### Prevention Strategies

1. **Work in Feature Branch**
   ```bash
   git checkout -b feature/pinia-implementation
   # Merge to main only after full testing
   ```

2. **Incremental Commits**
   - Commit after each phase
   - Tag stable points
   ```bash
   git commit -m "feat: add Pinia stores"
   git commit -m "feat: migrate auth to Pinia"
   git commit -m "feat: migrate guilds to Pinia"
   git tag pinia-complete
   ```

---

## Implementation Checklist

### Day 1: Setup & Auth
- [ ] Install Pinia: `npm install pinia`
- [ ] Configure Pinia in `src/main.js`
- [ ] Create `/src/stores/` directory
- [ ] Create `auth.js` store with full implementation
- [ ] Create `guilds.js` store with full implementation
- [ ] Create `ui.js` store with full implementation
- [ ] Create `stores/index.js` for exports
- [ ] Update router guards to use auth store
- [ ] Migrate Hero component
- [ ] Test authentication flow

### Day 2: Guilds & Settings
- [ ] Migrate DashboardView to use stores
- [ ] Remove local `fetchGuilds` from DashboardView
- [ ] Migrate GuildSettingsView to use stores
- [ ] Remove local guild/settings/channels fetching
- [ ] Test guild list caching
- [ ] Test settings saving
- [ ] Test channel loading
- [ ] Verify cache expiration works

### Day 3: Notifications & Testing
- [ ] Decide on notification migration (keep useNotification or migrate to UI store)
- [ ] Update notification usage if migrating
- [ ] Complete manual testing checklist
- [ ] Vue Devtools verification
- [ ] Cache behavior testing
- [ ] Error handling testing
- [ ] Performance testing (Network tab)

### Day 4: Documentation & Cleanup
- [ ] Update `CLAUDE.md` with Pinia patterns
- [ ] Add JSDoc comments to stores
- [ ] Remove or deprecate `useAuth.js`
- [ ] Update `recommended_improvements_plan.md` (mark H2 as complete)
- [ ] Commit and push to feature branch
- [ ] Create PR for review

---

## Additional Notes

### TypeScript Preparation

While this implementation uses JavaScript, the stores are designed for easy TypeScript migration:
- State shape is documented
- Actions have JSDoc type hints
- Getters have clear return types

When ready to migrate to TypeScript:
1. Rename `.js` to `.ts`
2. Add interface definitions for User, Guild, Channel, Settings
3. Type store state and actions
4. Use `storeToRefs` for type-safe refs

### Future Enhancements

After successful implementation:
- **Pinia Plugins**: Persistence, logger, sync
- **Advanced Caching**: Background refresh, stale-while-revalidate
- **More Stores**: Settings, commands, modals
- **Store Composition**: Combine stores for complex features
- **Performance Monitoring**: Track action performance

---

## Reference

**Detailed Implementation:** See complete store implementations with full code in the detailed agent plan.

**Key Files to Reference:**
- Current: `src/composables/useAuth.js` (lines 1-79)
- Current: `src/views/DashboardView.vue` (lines 441-501)
- Current: `src/views/GuildSettingsView.vue` (lines 360-481)

---

**END OF IMPLEMENTATION PLAN**
