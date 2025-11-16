# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DestroyerBot Web is a promotional website and dashboard for DestroyerBot, a Discord moderation bot. The application is built with Vue.js 3 (frontend) and Vercel serverless functions (backend), featuring Discord OAuth 2.0 authentication and MongoDB integration.

## Core Architecture

### Serverless-First Design

This project is architected for Vercel's serverless platform:

- **Frontend**: Vue 3 SPA with Vite build system
- **Backend**: Vercel Serverless Functions (not Express) located in `/api` directory
- **Database**: MongoDB with connection caching optimized for serverless (see `api/lib/db.js`)
- **Authentication**: Cookie-based sessions with Discord OAuth 2.0

**Critical**: The backend uses Vercel serverless functions, not traditional Express routes. Each file in `/api` exports a default handler function.

### Key Architectural Patterns

#### 1. Serverless Connection Caching

MongoDB connections are cached globally to prevent connection exhaustion in serverless environments. The pattern in `api/lib/db.js`:

```javascript
let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  // ... establish new connection
}
```

Always use `connectToDatabase()` before database operations in serverless functions.

#### 2. Session Management

Authentication uses three cookies (see `api/lib/auth.js`):
- `discord_session` (HttpOnly): Base64-encoded user data for server-side validation
- `discord_user`: User information accessible to frontend JavaScript
- `discord_token` (HttpOnly): Discord OAuth access token

Session helpers in `api/lib/auth.js`:
- `requireAuth(req)` - Throws if not authenticated, returns `{ token, userId }`
- `getUserIdFromSession(req)` - Extracts user ID from session cookie
- `setAuthCookies(res, sessionToken, userInfo, accessToken)` - Sets all auth cookies
- `clearAuthCookies(res)` - Clears all auth cookies

#### 3. Frontend Routing

Vue Router configuration in `src/router/index.js` defines three routes:
- `/` - Home page (public)
- `/dashboard` - User dashboard (requires authentication)
- `/guild/:id` - Guild settings page (requires authentication)

The frontend is a client-side SPA. Vercel routing in `vercel.json` rewrites all non-API requests to `/index.html` for SPA functionality.

## Development Commands

### Local Development (Recommended)

```bash
vercel dev
```
Runs both frontend and serverless functions at `http://localhost:3000`. This is the preferred development method as it simulates the full production environment.

### Alternative: Frontend-Only Development

```bash
npm run dev
```
Runs only the Vite development server on `http://localhost:5173`. API functions will not work in this mode.

### Building and Previewing

```bash
npm run build          # Build production bundle
npm run preview        # Preview production build at http://localhost:4173
```

### Code Formatting

```bash
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without changes
```

### Testing Local Production Build with Serverless Functions

```bash
npm run build && vercel dev
```

## Environment Variables

Required in `.env.local` (never commit this file):

```bash
# Discord OAuth
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord  # Local dev
# Production: https://your-app.vercel.app/api/auth/discord

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Discord Bot Token (for API calls to Discord)
BOT_TOKEN=your_bot_token_here
```

## API Endpoints Structure

All serverless functions are in `/api`:

### Authentication
- `GET /api/auth/discord` - Discord OAuth callback handler
- `GET /api/auth/logout` - Session logout endpoint

### Guild Management
- `GET /api/guilds` - List user's guilds
- `GET /api/guilds/[guildId]` - Get guild details and settings
- `GET /api/guilds/[guildId]/channels` - Get guild channels
- `POST /api/guilds/[guildId]/settings` - Save guild settings

### Utility
- `GET /api/health` - Health check endpoint

### Shared Utilities (`/api/lib`)
- `auth.js` - Authentication helpers and session management
- `cors.js` - CORS configuration for serverless functions
- `db.js` - MongoDB connection with serverless caching
- `discord.js` - Discord API interaction helpers

## Frontend Components

Located in `/src/components`:

- `Home.vue` - Landing page container
- `Hero.vue` - Hero section with Discord login button
- `AboutBot.vue` - Bot description and features
- `Features.vue` - Feature highlights
- `Documentation.vue` - Complete command documentation with search and categorized commands
- `Footer.vue` - Footer section
- `Dashboard.vue` - Authenticated user dashboard
- `GuildSettings.vue` - Guild configuration page

## Important Implementation Details

### Discord OAuth Flow

1. User clicks "Login with Discord" in `Hero.vue`
2. Redirects to Discord OAuth authorization URL
3. Discord redirects to `/api/auth/discord` with authorization code
4. Backend exchanges code for access token, fetches user data
5. Backend sets authentication cookies via `setAuthCookies()`
6. Backend redirects to `/dashboard`
7. Frontend reads `discord_user` cookie and displays dashboard

### Vercel Deployment Configuration

`vercel.json` contains:
- SPA routing: Rewrites all non-API requests to `/index.html`
- Asset caching: Static assets cached for 1 year
- Function timeout: 10 seconds for all API functions

### MongoDB Schema

While using Mongoose, the codebase stores guild settings and user data. Check existing API handlers for schema definitions before making changes.

## Common Development Tasks

### Adding a New Serverless Function

1. Create new file in `/api` directory (e.g., `/api/example.js`)
2. Export default handler function:
```javascript
import { connectToDatabase } from './lib/db.js';
import { requireAuth } from './lib/auth.js';

export default async function handler(req, res) {
  // Authenticate if needed
  const { token, userId } = requireAuth(req);

  // Connect to database if needed
  await connectToDatabase();

  // Handle request
  res.status(200).json({ success: true });
}
```

### Adding a New Frontend Route

1. Create component in `/src/components`
2. Add route to `/src/router/index.js`
3. Component will automatically work with SPA routing

### Working with Discord API

Use helpers from `/api/lib/discord.js` for Discord API interactions. The `BOT_TOKEN` environment variable is available for bot-authenticated requests.

## Tech Stack Summary

**Frontend:**
- Vue.js 3.5.22 (Composition API)
- Vue Router 4.6.3
- Tailwind CSS v4.1.16
- Vite 7.1.12
- Vercel Analytics

**Backend:**
- Vercel Serverless Functions
- MongoDB with Mongoose 8.19.2
- Discord OAuth 2.0
- Cookie-based sessions

**Development:**
- Prettier for code formatting
- Vercel CLI for local development

## Deployment

Deployment is automatic via Vercel:
- Pushes to `main` branch trigger production deployments
- Other branches create preview deployments
- Environment variables must be configured in Vercel dashboard

### Post-Deployment Verification
1. Test Discord OAuth login flow
2. Verify `/api/health` endpoint responds
3. Check MongoDB connection
4. Test dashboard and guild settings pages

## Related Documentation

- Main README: `README.md`
- Authentication Guide: `README-AUTH.md`
- Bot Repository: https://github.com/destroyerdust/DestroyerBot
