# Dashboard UI Enhancement Plan

> Comprehensive design analysis and implementation roadmap for Dashboard.vue and GuildSettings.vue components

**Created:** 2025-11-16
**Status:** Ready for Implementation
**Estimated Time:** 6-10 days

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Assessment](#current-state-assessment)
3. [Visual Enhancement Opportunities](#visual-enhancement-opportunities)
4. [User Experience Improvements](#user-experience-improvements)
5. [Accessibility Concerns](#accessibility-concerns)
6. [Specific Component Recommendations](#specific-component-recommendations)
7. [Implementation Priority](#implementation-priority)
8. [Design System Consistency Matrix](#design-system-consistency-matrix)

---

## Executive Summary

The Dashboard and GuildSettings components require visual and interactive enhancements to match the polished, modern aesthetic of the recently enhanced landing page (Hero, Features, Documentation components). This plan provides a structured approach to implementing animations, micro-interactions, and UX improvements while maintaining excellent accessibility and usability.

**Key Goals:**
- Achieve visual consistency across all pages
- Implement delightful micro-interactions
- Add smooth animations that guide user attention
- Ensure comprehensive accessibility
- Improve configuration intuitiveness

---

## Current State Assessment

### Dashboard.vue Analysis

**Location:** `src/components/Dashboard.vue`

**Strengths:**
- ✅ Clean glassmorphism aesthetic matching landing page design language (backdrop-blur, black/30 backgrounds)
- ✅ Consistent color scheme with purple-900 gradients and purple-500 accents
- ✅ Logical information hierarchy (profile → stats → servers → actions)
- ✅ Responsive grid layouts for stats and server cards

**Weaknesses:**
- ❌ **Lack of animation**: Static elements with minimal visual feedback compared to animated Hero and Features sections
- ❌ **No loading transitions**: Data fetches show basic spinners without skeleton states or smooth entry animations
- ❌ **Limited interactivity**: Server cards have basic hover effects but lack the 3D tilt effects present on landing page feature cards
- ❌ **Static stats display**: Numbers appear instantly without count-up animations like the Hero section
- ❌ **No visual feedback**: Button clicks lack ripple effects or state changes
- ❌ **Inconsistent hover states**: Some elements use simple color changes while landing page has sophisticated hover effects with glows and transforms

### GuildSettings.vue Analysis

**Location:** `src/components/GuildSettings.vue`

**Strengths:**
- ✅ Well-organized settings sections with clear categorization
- ✅ Custom toggle switches with smooth transitions
- ✅ Searchable channel dropdowns with good UX
- ✅ Toast notification system with transitions already implemented
- ✅ Comprehensive settings coverage

**Weaknesses:**
- ❌ **No animation on settings panels**: Cards appear statically unlike the staggered reveal on Features component
- ❌ **Toggle switches lack flair**: Functional but lack the polished micro-interactions from landing page
- ❌ **Input fields are basic**: No focus glow effects or animated labels
- ❌ **Save buttons lack feedback**: No loading states, success animations, or ripple effects
- ❌ **No validation states**: Missing visual indicators for required fields or errors
- ❌ **Form sections are flat**: Could benefit from subtle animations when enabling/disabling features
- ❌ **No progress indication**: Users can't see save progress or network activity clearly

---

## Visual Enhancement Opportunities

### Animation Enhancements

#### Dashboard.vue Improvements

1. **Entry Animations**
   - Apply staggered slide-up animations to dashboard sections
   - Profile card, stats grid, server list, quick actions
   - Use existing `scroll-reveal` animation pattern from landing page

2. **Stat Counters**
   - Implement count-up animations for server count
   - Use `useCountUp` composable (already created for Hero)
   - Add animated icons with glow effects

3. **Server Cards**
   - Add 3D tilt effects matching Features cards
   - Use `useCardTilt` composable (already created)
   - Implement glare overlay that follows cursor

4. **Avatar Animations**
   - Subtle pulse or glow effect on user avatar on hover
   - Smooth scale and border color transitions

5. **Loading States**
   - Replace basic spinner with skeleton screens
   - Fade skeleton into actual content smoothly
   - Add shimmer effect to skeleton elements

6. **Quick Actions**
   - Add ripple effects on button click
   - Implement micro-animations on hover
   - Scale and glow effects

#### GuildSettings.vue Improvements

1. **Settings Panel Reveal**
   - Staggered fade-in-up animation for each settings card
   - Prefix, welcome, auto-mod, logging sections
   - Delay: 0ms, 100ms, 200ms, 300ms

2. **Toggle Animations**
   - Enhanced toggle switches with bounce effect
   - Add glow effect when enabled
   - Active scale-down for tactile feedback

3. **Channel Dropdown**
   - Smooth expand/collapse with spring animation
   - Fade-in list items with stagger
   - Highlight selected item with glow

4. **Save Button States**
   - Loading: Spinning icon with "Saving..." text
   - Success: Checkmark animation with "Saved!" text
   - Error: Shake animation with error message
   - Shimmer effect on hover

5. **Form Section Transitions**
   - Smooth height transitions when enabling/disabling features
   - Fade in/out dependent fields
   - Slide animations for revealing content

6. **Input Focus Effects**
   - Glowing border (purple-500 with shadow)
   - Label animation (slide up and scale)
   - Smooth color transitions

### Interactive Element Upgrades

#### Enhanced Toggle Switches

```vue
<!-- Current: Basic slide -->
<button class="relative w-12 h-6 rounded-full transition-colors">
  <span class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
</button>

<!-- Enhanced: Glow, bounce, spring animation -->
<button
  @click="toggle"
  :class="[
    'relative w-12 h-6 rounded-full transition-all duration-300 ease-out',
    'transform active:scale-95',
    enabled
      ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
      : 'bg-gray-600'
  ]">
  <span :class="[
    'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300',
    'shadow-lg',
    enabled ? 'left-7 scale-110' : 'left-1'
  ]"></span>
  <!-- Optional: Add glow ring when enabled -->
  <div v-if="enabled"
       class="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-30">
  </div>
</button>
```

#### Button Enhancements

- ✨ **Ripple effect** overlay on click
- ⏳ **Loading state** with spinning icon
- ✅ **Success state** with checkmark animation
- 🎯 **Hover lift** with shadow increase
- 👆 **Active state** scale-down for tactile feedback

#### Input Field Enhancements

- 🏷️ **Animated label** that moves up on focus
- 💡 **Glowing border** effect matching purple theme
- 🔢 **Character count** indicator with smooth update
- ❌ **Error state** with shake animation
- ✅ **Success state** with green checkmark

---

## User Experience Improvements

### Dashboard.vue Improvements

1. **Empty State Design**
   - When no servers exist, show illustrated empty state
   - Add call-to-action button to add bot to server
   - Friendly message explaining next steps

2. **Search/Filter Servers**
   - Add search bar above server grid
   - Useful for users with many servers
   - Real-time filtering with highlight

3. **Server Status Indicators**
   - Show bot online/offline status with colored dot
   - Display last seen timestamp
   - Connection quality indicator

4. **Quick Settings Preview**
   - Hover on server card shows preview of current settings
   - Display enabled features count
   - Show last modified date

5. **Contextual Actions**
   - Right-click or long-press on server cards
   - Quick actions menu (configure, invite, remove)
   - Keyboard shortcuts for power users

6. **Stats Comparison**
   - Show stat changes from previous session
   - Up/down arrows with percentage change
   - Trend indicators (growing, stable, declining)

### GuildSettings.vue Improvements

1. **Unsaved Changes Warning**
   - Banner at top when settings are modified but not saved
   - "You have unsaved changes" with save/discard buttons
   - Prevent navigation away without confirmation

2. **Setting Presets**
   - Quick preset buttons for common configurations
   - "Strict Moderation", "Casual Server", "Gaming Community"
   - One-click setup for new servers

3. **Live Preview**
   - Show preview of welcome message with actual formatting
   - Replace {user} and {server} placeholders
   - Preview how messages will appear in Discord

4. **Setting Dependencies**
   - Visually indicate when settings depend on each other
   - Disable dependent options when parent is off
   - Show explanation tooltips

5. **Bulk Actions**
   - "Save all" vs individual section saves
   - Clear indication of which sections have changes
   - Batch save with progress indicator

6. **Help Tooltips**
   - Information icons with helpful explanations
   - Hover or click to reveal detailed descriptions
   - Link to documentation for complex features

7. **Setting History**
   - Show when settings were last modified
   - Display who made the change (if applicable)
   - Audit log for important changes

8. **Import/Export**
   - Allow exporting settings to JSON
   - Import settings from another server
   - Share configuration templates

---

## Accessibility Concerns

### Current Issues

1. **Toggle Switch Labels**
   - ❌ Missing `aria-label` for screen readers
   - ❌ No `role="switch"` attribute
   - ❌ Missing `aria-checked` state

2. **Channel Dropdown**
   - ❌ No keyboard navigation indicators
   - ❌ Missing `aria-expanded` state
   - ❌ No live region announcements for selection

3. **Focus Management**
   - ⚠️ Focus states exist but could be more prominent
   - ⚠️ No visible focus ring on all interactive elements
   - ⚠️ Tab order could be improved

4. **Loading States**
   - ❌ Screen readers not informed of loading status
   - ❌ No `aria-busy` attribute during data fetch
   - ❌ Missing live region updates

5. **Error Messages**
   - ❌ Notifications disappear automatically without announcement
   - ❌ No `aria-live` region for dynamic messages
   - ❌ Error states not announced

6. **Color Contrast**
   - ⚠️ Some gray-400 text on dark backgrounds may not meet WCAG AA
   - ⚠️ Toggle switch states need contrast verification
   - ⚠️ Disabled states may be too subtle

### Recommended Fixes

#### Accessibility Checklist

- [ ] Add `aria-label`, `aria-checked`, `role="switch"` to all toggles
- [ ] Implement proper `aria-live` regions for notifications and dynamic content
- [ ] Add visible focus indicators with higher contrast (2px solid ring)
- [ ] Implement skip links for keyboard navigation
- [ ] Ensure all interactive elements have minimum 44x44px touch targets
- [ ] Add screen reader announcements for save success/failure
- [ ] Implement keyboard shortcuts for common actions (Ctrl+S to save)
- [ ] Add `aria-busy` during loading states
- [ ] Test with NVDA and JAWS screen readers
- [ ] Verify color contrast meets WCAG AA standards (4.5:1 for text)

#### Implementation Examples

**Toggle Switch:**
```vue
<button
  role="switch"
  :aria-checked="enabled.toString()"
  :aria-label="`Toggle ${settingName}`"
  @click="toggle"
  class="relative w-12 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
>
  <!-- toggle content -->
</button>
```

**Live Region for Notifications:**
```vue
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
>
  {{ notification.show ? notification.message : '' }}
</div>
```

**Form Validation:**
```vue
<input
  :aria-invalid="hasError.toString()"
  :aria-describedby="hasError ? 'prefix-error' : undefined"
  aria-label="Command prefix"
/>
<p v-if="hasError" id="prefix-error" class="text-red-400 text-sm mt-1">
  Prefix must be 1-5 characters
</p>
```

---

## Specific Component Recommendations

### Dashboard.vue Enhancements

**File:** `src/components/Dashboard.vue`

#### 1. User Profile Card (lines 54-67)

**Current Implementation:**
```vue
<div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8">
  <div class="flex items-center gap-6">
    <img :src="userAvatar" :alt="user.username"
         class="w-24 h-24 rounded-full border-4 border-purple-500" />
    <div>
      <h2 class="text-3xl font-bold text-white mb-2">Welcome, {{ user.username }}!</h2>
      <p class="text-gray-300">{{ user.email || 'No email provided' }}</p>
      <p class="text-gray-400 text-sm mt-1">User ID: {{ user.id }}</p>
    </div>
  </div>
</div>
```

**Enhanced Implementation:**
```vue
<div class="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 mb-8
            scroll-reveal revealed animate-slide-up
            hover:border-purple-500/40 transition-all duration-500">
  <div class="flex items-center gap-6">
    <!-- Avatar with glow effect -->
    <div class="relative group">
      <img :src="userAvatar" :alt="user.username"
           class="w-24 h-24 rounded-full border-4 border-purple-500
                  group-hover:border-purple-400 transition-all duration-300" />
      <!-- Glow ring on hover -->
      <div class="absolute inset-0 rounded-full bg-purple-500 blur-xl
                  opacity-0 group-hover:opacity-30 transition-opacity duration-300">
      </div>
    </div>

    <!-- Animated text with stagger -->
    <div class="space-y-2">
      <h2 class="text-3xl font-bold text-white animate-slide-up">
        Welcome, {{ user.username }}!
      </h2>
      <p class="text-gray-300 animate-slide-up animate-delay-100">
        {{ user.email || 'No email provided' }}
      </p>
      <p class="text-gray-400 text-sm animate-slide-up animate-delay-200">
        User ID: {{ user.id }}
      </p>
    </div>
  </div>
</div>
```

**Script Changes:**
```javascript
import { useScrollReveal } from '@/composables/useScrollReveal.js'

// Initialize scroll reveal
useScrollReveal()
```

#### 2. Dashboard Stats (lines 70-142)

**Enhanced Implementation:**
```vue
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <!-- Server Count with animation -->
  <div class="scroll-reveal bg-black/30 backdrop-blur-md border border-purple-500/20
              rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-400 text-sm">Servers</p>
        <p class="text-3xl font-bold text-white mt-1 animate-count-up">
          {{ serverCount }}
        </p>
      </div>
      <!-- Icon with glow -->
      <div class="relative group">
        <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300">
          <svg class="w-6 h-6 text-purple-400"><!-- icon --></svg>
        </div>
        <div class="absolute inset-0 bg-purple-500 rounded-lg blur-lg
                    opacity-0 group-hover:opacity-30 transition-opacity duration-300">
        </div>
      </div>
    </div>
  </div>
  <!-- Repeat for other stats with stagger delays -->
</div>
```

**Script Changes:**
```javascript
import { useCountUp } from '@/composables/useCountUp.js'

// Animated counter for servers
const { count: serverCount } = useCountUp(guilds.value.length, 2000, 500)
```

#### 3. Server Cards (lines 162-190)

**Enhanced Implementation:**
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div
    v-for="(guild, index) in guilds"
    :key="guild.id"
    :ref="el => cardRefs[index] = useCardTilt(8)"
    @mousemove="cardRefs[index]?.handleMouseMove"
    @mouseleave="cardRefs[index]?.handleMouseLeave"
    :style="cardRefs[index]?.tiltStyle.value"
    @click="navigateToGuild(guild.id)"
    class="relative bg-black/30 border border-purple-500/20 rounded-lg p-4
           hover:border-purple-500/40 transition-all duration-300 cursor-pointer
           transform-style-3d hover:shadow-xl hover:shadow-purple-500/20
           scroll-reveal animate-slide-up"
    :class="`animate-delay-${index * 100}`"
  >
    <!-- Glare effect -->
    <div :style="cardRefs[index]?.glareStyle.value"
         class="absolute inset-0 rounded-lg pointer-events-none">
    </div>

    <!-- Card content -->
    <div class="relative flex items-center gap-4">
      <!-- Guild icon with status indicator -->
      <div class="relative">
        <div class="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center
                    shrink-0 overflow-hidden">
          <img v-if="getGuildIcon(guild)" :src="getGuildIcon(guild)"
               :alt="guild.name" class="w-full h-full object-cover" />
          <span v-else class="text-2xl font-bold text-purple-400">
            {{ guild.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <!-- Bot status indicator -->
        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full
                    border-2 border-gray-900 animate-pulse">
        </div>
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
</div>
```

**Script Changes:**
```javascript
import { ref } from 'vue'
import { useCardTilt } from '@/composables/useCardTilt.js'

// Card tilt refs for each guild
const cardRefs = ref([])
```

#### 4. Loading State with Skeleton

**Enhanced Implementation:**
```vue
<!-- Loading skeleton -->
<div v-if="loadingGuilds" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div v-for="i in 6" :key="i"
       class="bg-black/30 border border-purple-500/20 rounded-lg p-4 animate-pulse">
    <div class="flex items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-purple-500/20"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-purple-500/20 rounded w-3/4"></div>
        <div class="h-3 bg-purple-500/20 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</div>
```

### GuildSettings.vue Enhancements

**File:** `src/components/GuildSettings.vue`

#### 1. Settings Section Reveal (lines 177-556)

**Enhanced Implementation:**
```vue
<!-- Add scroll reveal to each settings card -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Prefix Settings -->
  <div class="scroll-reveal animate-slide-up bg-black/30 backdrop-blur-md
              border border-purple-500/20 rounded-xl p-6
              hover:border-purple-500/30 transition-all duration-500">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <!-- Icon with glow -->
      <div class="relative group">
        <svg class="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
          <!-- icon path -->
        </svg>
        <div class="absolute inset-0 bg-purple-500 rounded-full blur-lg
                    opacity-0 group-hover:opacity-50 transition-opacity duration-300">
        </div>
      </div>
      Command Prefix
    </h3>

    <!-- Enhanced input with focus glow -->
    <div class="flex gap-2">
      <input v-model="settings.prefix"
             type="text"
             placeholder="!"
             maxlength="5"
             class="flex-1 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-purple-500
                    focus:shadow-lg focus:shadow-purple-500/20
                    transition-all duration-300" />
      <button @click="saveSettings"
              class="relative overflow-hidden group px-6 py-2 bg-purple-600
                     hover:bg-purple-700 text-white rounded-lg
                     transition-all duration-300
                     hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105
                     active:scale-95">
        <!-- Shimmer effect -->
        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full
                    transition-transform duration-1000
                    bg-linear-to-r from-transparent via-white/20 to-transparent">
        </div>
        <span class="relative z-10">Save</span>
      </button>
    </div>
  </div>

  <!-- Repeat for other sections with stagger delays -->
  <div class="scroll-reveal animate-slide-up animate-delay-100 ...">
    <!-- Welcome Messages -->
  </div>
  <div class="scroll-reveal animate-slide-up animate-delay-200 ...">
    <!-- Auto-Moderation -->
  </div>
  <div class="scroll-reveal animate-slide-up animate-delay-300 ...">
    <!-- Logging -->
  </div>
</div>
```

**Script Changes:**
```javascript
import { useScrollReveal } from '@/composables/useScrollReveal.js'

// Initialize scroll reveal
useScrollReveal()
```

#### 2. Enhanced Toggle Switches

**Enhanced Implementation:**
```vue
<button
  role="switch"
  :aria-checked="settings.welcome.enabled.toString()"
  aria-label="Toggle welcome messages"
  @click="settings.welcome.enabled = !settings.welcome.enabled"
  :class="[
    'relative w-12 h-6 rounded-full transition-all duration-300 ease-out',
    'transform active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
    settings.welcome.enabled
      ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
      : 'bg-gray-600'
  ]">
  <!-- Toggle knob -->
  <span :class="[
    'absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300',
    'shadow-lg flex items-center justify-center',
    settings.welcome.enabled ? 'left-7 scale-110' : 'left-1'
  ]">
    <!-- Optional: Checkmark icon when enabled -->
    <svg v-if="settings.welcome.enabled"
         class="w-3 h-3 text-purple-600"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
    </svg>
  </span>

  <!-- Glow effect when enabled -->
  <div v-if="settings.welcome.enabled"
       class="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-30 -z-10">
  </div>
</button>
```

#### 3. Save Button with States

**Enhanced Implementation:**
```vue
<script setup>
const saving = ref(false)
const saved = ref(false)

const saveSettings = async () => {
  if (saving.value) return

  saving.value = true
  saved.value = false

  try {
    const response = await fetch(`/api/guilds/${guildId}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(settings.value),
    })

    if (response.ok) {
      saved.value = true
      showNotification('Settings saved successfully!', 'success')

      // Reset saved state after 2 seconds
      setTimeout(() => {
        saved.value = false
      }, 2000)
    } else {
      showNotification('Failed to save settings', 'error')
    }
  } catch (err) {
    console.error('Error saving settings:', err)
    showNotification('An error occurred while saving settings', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <button
    @click="saveSettings"
    :disabled="saving"
    class="relative overflow-hidden group w-full px-6 py-2
           bg-purple-600 hover:bg-purple-700 text-white rounded-lg
           transition-all duration-300
           hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105
           active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
    <!-- Shimmer effect on hover -->
    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full
                transition-transform duration-1000
                bg-linear-to-r from-transparent via-white/20 to-transparent">
    </div>

    <!-- Button content with conditional states -->
    <span v-if="!saving && !saved" class="relative z-10">
      Save Welcome Settings
    </span>
    <span v-else-if="saving" class="relative z-10 flex items-center justify-center gap-2">
      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Saving...
    </span>
    <span v-else class="relative z-10 flex items-center justify-center gap-2 animate-scale-in">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Saved!
    </span>
  </button>
</template>
```

#### 4. Unsaved Changes Warning

**New Component to Add:**
```vue
<template>
  <!-- Unsaved changes banner -->
  <Transition name="slide-down">
    <div v-if="hasUnsavedChanges"
         class="sticky top-16 z-40 bg-yellow-500/20 border-b border-yellow-500/30
                backdrop-blur-md px-4 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-yellow-200 text-sm font-medium">
            You have unsaved changes
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="discardChanges"
                  class="px-3 py-1 text-sm text-yellow-200 hover:text-white
                         transition-colors">
            Discard
          </button>
          <button @click="saveSettings"
                  class="px-4 py-1 text-sm bg-yellow-500 hover:bg-yellow-600
                         text-gray-900 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const originalSettings = ref({})
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
})

// Watch for settings changes
watch(settings, () => {
  // Track changes
}, { deep: true })

const discardChanges = () => {
  settings.value = { ...originalSettings.value }
}
</script>
```

---

## Implementation Priority

### Phase 1: Critical Visual Consistency (1-2 days)

**Goal:** Match landing page visual quality

- [ ] Add entry animations to Dashboard and GuildSettings using `scroll-reveal`
- [ ] Implement 3D tilt effects on server cards using `useCardTilt`
- [ ] Add count-up animation to stats using `useCountUp`
- [ ] Enhance toggle switches with glow effects and bounce animations
- [ ] Add hover glow effects to all cards

**Files to Modify:**
- `src/components/Dashboard.vue`
- `src/components/GuildSettings.vue`

**New Composables:** (Already created)
- `useScrollReveal.js` ✅
- `useCardTilt.js` ✅
- `useCountUp.js` ✅

### Phase 2: Interaction Polish (2-3 days)

**Goal:** Add delightful micro-interactions

- [ ] Implement save button states (loading/success/error)
- [ ] Add input focus effects with glowing borders
- [ ] Create ripple effects for buttons
- [ ] Add shimmer effect to primary action buttons
- [ ] Implement smooth dropdown animations
- [ ] Add icon glow effects on hover

**Files to Modify:**
- `src/components/GuildSettings.vue`
- `src/components/Dashboard.vue`

### Phase 3: UX Improvements (2-3 days)

**Goal:** Enhance user experience and feedback

- [ ] Implement skeleton loading states
- [ ] Add unsaved changes warning banner
- [ ] Create empty states with illustrations
- [ ] Add tooltips and help text
- [ ] Implement better error states with animations
- [ ] Add server status indicators (online/offline)
- [ ] Create search/filter for servers

**Files to Modify:**
- `src/components/Dashboard.vue`
- `src/components/GuildSettings.vue`

**New Components to Create:**
- `EmptyState.vue`
- `SkeletonCard.vue`

### Phase 4: Accessibility & Polish (1-2 days)

**Goal:** Ensure accessibility and final touches

- [ ] Implement proper ARIA labels on all interactive elements
- [ ] Add keyboard navigation support
- [ ] Enhance focus indicators with high contrast
- [ ] Test color contrast and fix issues
- [ ] Add screen reader announcements
- [ ] Implement keyboard shortcuts (Ctrl+S to save)
- [ ] Test with screen readers (NVDA/JAWS)
- [ ] Add `prefers-reduced-motion` support

**Files to Modify:**
- `src/components/Dashboard.vue`
- `src/components/GuildSettings.vue`
- `src/assets/main.css`

---

## Design System Consistency Matrix

| Element | Landing Page | Dashboard | GuildSettings | Action Required |
|---------|-------------|-----------|---------------|-----------------|
| **Card Hover** | 3D tilt + glow ✅ | Basic border change ❌ | Basic border change ❌ | Apply 3D tilt to both |
| **Animations** | Staggered reveal ✅ | None ❌ | Partial (toast only) ⚠️ | Add staggered reveals |
| **Buttons** | Shimmer + scale ✅ | Basic hover ❌ | Basic hover ❌ | Add shimmer and scale |
| **Inputs** | N/A | Basic ❌ | Basic ❌ | Add glow and animation |
| **Loading** | N/A | Basic spinner ❌ | Basic spinner ❌ | Add skeleton states |
| **Toggles** | N/A | Functional ⚠️ | Functional ⚠️ | Add glow and bounce |
| **Stats** | Count-up animation ✅ | Static ❌ | N/A | Add count-up |
| **Icons** | Glow on hover ✅ | Static ❌ | Static ❌ | Add glow effects |
| **Dropdowns** | N/A | Basic ❌ | Basic ❌ | Add smooth animations |
| **Notifications** | N/A | N/A | Toast implemented ✅ | Enhance with progress bar |

**Legend:**
- ✅ Implemented
- ⚠️ Partially implemented
- ❌ Not implemented

---

## Technical Notes

### Reusable Composables

The following composables are already created and available for use:

1. **`useScrollReveal.js`** - Scroll-based reveal animations
2. **`useCardTilt.js`** - 3D mouse-tracking card effects
3. **`useCountUp.js`** - Animated counter with easing

### Animation Classes (Available in main.css)

- `.animate-fade-in`
- `.animate-slide-up`
- `.animate-slide-down`
- `.animate-scale-in`
- `.animate-shimmer`
- `.animate-pulse-slow`
- `.animate-count-up`
- `.animate-delay-100` through `.animate-delay-500`
- `.scroll-reveal` and `.scroll-reveal.revealed`

### Color Theme Consistency

**Primary Colors:**
- Purple: `#8b5cf6` (purple-500), `#a78bfa` (purple-400)
- Blue: `#3b82f6` (blue-500), `#60a5fa` (blue-400)
- Indigo: `#6366f1` (indigo-500)

**Background:**
- Dark: `#111827` (gray-900)
- Card: `rgba(0, 0, 0, 0.3)` with `backdrop-blur-md`

**Borders:**
- Default: `rgba(139, 92, 246, 0.2)` (purple-500/20)
- Hover: `rgba(139, 92, 246, 0.4)` (purple-500/40)

---

## Testing Checklist

### Visual Testing

- [ ] Test all animations on different screen sizes (mobile, tablet, desktop)
- [ ] Verify 3D tilt effects work smoothly on all browsers
- [ ] Check loading states and transitions
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Test dark mode consistency

### Functional Testing

- [ ] Test save functionality with loading/success/error states
- [ ] Verify form validation and error messages
- [ ] Test channel dropdown search and selection
- [ ] Verify toggle switches update settings correctly
- [ ] Test navigation and routing

### Accessibility Testing

- [ ] Navigate entire dashboard using only keyboard
- [ ] Test with NVDA screen reader
- [ ] Test with JAWS screen reader
- [ ] Verify all ARIA labels are correct
- [ ] Test with high contrast mode
- [ ] Verify focus indicators are visible
- [ ] Test with `prefers-reduced-motion` enabled

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Resources

### Design References

- **Landing Page Components:** Hero.vue, Features.vue, Documentation.vue
- **Animation Composables:** `src/composables/useCardTilt.js`, `useCountUp.js`, `useScrollReveal.js`
- **Animation CSS:** `src/assets/main.css`

### Documentation

- **Vue 3 Composition API:** https://vuejs.org/guide/extras/composition-api-faq.html
- **Tailwind CSS:** https://tailwindcss.com/docs
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices:** https://www.w3.org/WAI/ARIA/apg/

---

## Next Steps

1. **Review this plan** and prioritize features based on your timeline
2. **Set up development branch** for dashboard enhancements
3. **Start with Phase 1** to achieve visual consistency quickly
4. **Iterate and gather feedback** after each phase
5. **Test thoroughly** before deploying to production

**Estimated Total Time:** 6-10 days depending on scope and iteration

---

**Last Updated:** 2025-11-16
**Status:** Ready for Implementation
**Contact:** Review with development team before starting
