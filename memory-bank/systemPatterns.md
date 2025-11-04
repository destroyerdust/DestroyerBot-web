# DestroyerBot Web - System Patterns

## System Architecture

### Frontend Architecture
- **Component-Based**: Vue 3 Composition API with single-file components
- **Routing**: Vue Router with programmatic navigation and route guards
- **State Management**: Component-level state with props/emits pattern
- **Styling**: Utility-first CSS with Tailwind CSS v4

### Backend Architecture
- **Serverless Functions**: Vercel Functions with Express.js compatibility
- **API Structure**: RESTful endpoints organized by resource type
- **Middleware Chain**: CORS, authentication, and database connection middleware
- **Connection Pooling**: MongoDB connection caching for serverless optimization

### Data Flow Patterns

#### Authentication Flow
```
User Request → Discord OAuth → Callback Handler → Session Cookie → Protected Routes
```

#### API Request Flow
```
Client Request → CORS Middleware → Auth Middleware → Route Handler → Database → Response
```

#### Guild Management Flow
```
Dashboard Load → Auth Check → Guilds API → Cache Check → Discord API → Database → UI Update
```

## Key Technical Decisions

### Serverless-First Design
- **Decision**: Vercel serverless functions over traditional Express server
- **Rationale**: Cost-effective, auto-scaling, zero maintenance
- **Implications**: Connection pooling, stateless design, cold start optimization

### Cookie-Based Sessions
- **Decision**: HTTP-only cookies over JWT tokens
- **Rationale**: Better security, automatic expiration, CSRF protection
- **Implications**: Server-side session validation, logout complexity

### MongoDB with Mongoose
- **Decision**: Document database over relational database
- **Rationale**: Flexible schema for guild settings, JSON-like data structure
- **Implications**: Schema validation, migration strategies, indexing decisions

## Design Patterns

### Component Patterns

#### Container/Presentational Split
```javascript
// Container component (logic)
<script setup>
const { data, loading } = useApi('/api/guilds')
</script>

// Presentational component (UI)
<template>
  <div v-if="loading">Loading...</div>
  <GuildList v-else :guilds="data" />
</template>
```

#### Composables for Logic Reuse
```javascript
// useAuth.js
export function useAuth() {
  const user = ref(null)
  const login = () => { /* OAuth logic */ }
  const logout = () => { /* cleanup logic */ }
  return { user, login, logout }
}
```

### API Patterns

#### Consistent Error Handling
```javascript
// api/lib/errorHandler.js
export function handleApiError(error) {
  if (error.response?.status === 401) {
    redirectToLogin()
  }
  return { error: error.message }
}
```

#### Response Standardization
```javascript
// Consistent API response format
{
  success: true,
  data: { /* payload */ },
  error: null
}
```

### Database Patterns

#### Connection Caching
```javascript
// api/lib/db.js
let cachedConnection = null

export async function connectToDatabase() {
  if (cachedConnection) return cachedConnection
  // Create new connection
  cachedConnection = await mongoose.connect(uri)
  return cachedConnection
}
```

#### Schema Patterns
```javascript
// models/GuildSettings.js
const guildSettingsSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  settings: {
    prefix: { type: String, default: '!' },
    permissions: Map,
    features: [String]
  }
})
```

## Component Relationships

### Frontend Component Hierarchy
```
App.vue
├── RouterView
    ├── Home.vue (public)
    │   ├── Hero.vue
    │   ├── AboutBot.vue
    │   ├── Features.vue
    │   ├── CommandShowcase.vue
    │   └── Footer.vue
    │
    └── Dashboard.vue (protected)
        ├── UserProfile.vue
        ├── GuildList.vue
        ├── GuildSettings.vue
        └── QuickActions.vue
```

### API Endpoint Organization
```
api/
├── auth/
│   ├── discord.js (OAuth flow)
│   └── logout.js (session cleanup)
├── guilds/
│   ├── index.js (list user guilds)
│   └── [guildId]/
│       ├── index.js (guild details)
│       ├── channels.js (channel list)
│       └── settings.js (guild config)
└── health.js (system status)
```

## Critical Implementation Paths

### Authentication Critical Path
1. User clicks "Login with Discord"
2. Redirect to Discord OAuth URL
3. Discord redirects to `/api/auth/discord`
4. Validate code, fetch user data
5. Create session cookie
6. Redirect to dashboard

### Guild Settings Critical Path
1. User selects guild in dashboard
2. Fetch guild data from Discord API
3. Load cached settings from database
4. Merge with defaults
5. Render settings form
6. Save triggers validation and database update

### Command Showcase Critical Path
1. Component mounts
2. Load command categories
3. Render tabbed interface
4. Handle tab switching
5. Copy to clipboard functionality

## Security Patterns

### Input Validation
- Client-side validation for UX
- Server-side validation for security
- Sanitization of user inputs
- Type checking with TypeScript (future)

### Authentication Guards
```javascript
// router/index.js
const requireAuth = (to, from, next) => {
  if (!hasValidSession()) {
    next('/')
  } else {
    next()
  }
}
```

### CORS Configuration
```javascript
// api/lib/cors.js
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : 'http://localhost:3000',
  credentials: true
}
```

## Performance Patterns

### Code Splitting
- Route-based splitting with Vue Router
- Component lazy loading
- Library chunking with Vite

### Caching Strategy
- Browser caching for static assets
- API response caching in memory
- Database connection pooling
- CDN delivery for assets

### Optimization Techniques
- Image optimization and lazy loading
- Bundle analysis and tree shaking
- Critical CSS inlining
- Service worker for caching (future)
