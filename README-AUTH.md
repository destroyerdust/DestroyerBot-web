# Discord OAuth Authentication Setup

## Overview
This project now includes Discord OAuth 2.0 authentication with a dashboard page. The implementation uses a local Express server for development and testing.

## Architecture

### Frontend (Port 5173 or 4173)
- **Vite Dev Server**: Serves the Vue.js application on port 5173 (dev mode)
- **Vite Preview Server**: Serves production build on port 4173 (preview mode)
- **Dashboard Component**: `/dashboard` route that displays user information
- **Hero Component**: Includes "Login with Discord" button

### Backend (Port 3000)
- **Express Server**: Handles OAuth callbacks and session management
- **CORS**: Configured to accept requests from both port 5173 and 4173
- **Dynamic Redirects**: Automatically redirects to the correct frontend port
- **Endpoints**:
  - `GET /api/auth/discord` - Discord OAuth callback
  - `GET /api/auth/logout` - Logout endpoint
  - `GET /health` - Health check

## Running the Application

You need to run both the frontend and backend servers simultaneously:

### Quick Setup (Recommended)
```bash
npm run dev:full
```
This starts both servers simultaneously and provides you with a single-command solution for development.

### Manual Setup

**Terminal 1 - Frontend:**
```bash
# Development Mode
npm run dev
# Runs on: http://localhost:5173

# OR Preview Mode (Production Build)
npm run build
npm run preview
# Runs on: http://localhost:4173
```

**Terminal 2 - Backend:**
```bash
npm run server
# Runs on: http://localhost:3000
```

**Note**:
- Both servers must be running for authentication to work properly.
- The backend server automatically supports both dev (5173) and preview (4173) ports.
- Redirects after login/logout will automatically use the correct port via OAuth state parameter.

## Testing the Authentication Flow

1. **Open the application**: http://localhost:5173
2. **Click "Login with Discord"** on the home page
3. **Authorize the application** on Discord's OAuth page
4. **Get redirected to the dashboard** with your Discord profile information
5. **View your profile**: Avatar, username, email, and user ID
6. **Click "Logout"** to clear the session and return to home

## How It Works

### Authentication Flow
1. User clicks "Login with Discord"
2. Redirected to Discord OAuth page
3. User authorizes the application
4. Discord redirects to `http://localhost:3000/api/auth/discord?code=...`
5. Backend exchanges code for access token
6. Backend fetches user data from Discord API
7. Backend sets cookies with user information
8. Backend redirects to frontend dashboard
9. Frontend reads user cookie and displays dashboard

### Session Management
- Uses cookie-based sessions
- Two cookies are set:
  - `discord_session` (HttpOnly): Base64 encoded user data for backend
  - `discord_user`: User information for frontend display
- Session expires after 7 days

## Environment Variables

Required in `.env.local`:
```env
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord
```

## Discord Application Setup

To use this authentication:

1. Go to https://discord.com/developers/applications
2. Select your application (or create a new one)
3. Go to OAuth2 → General
4. Add redirect URI: `http://localhost:3000/api/auth/discord`
5. Save changes

## Features

### Dashboard
- User profile card with Discord avatar
- Stats cards (Servers, Commands Used, Premium Status)
- Quick action buttons
- Logout functionality with error handling and loading states
- Guild management interface

### Security Features
- HttpOnly cookies for session management
- CORS configured for local development
- Secure cookie attributes (SameSite=Lax)

## Production Deployment

For production, you'll need to:
1. Update `DISCORD_REDIRECT_URI` to your production URL
2. Add the production redirect URI to Discord application settings
3. Update hardcoded URLs in the frontend components
4. Use proper session management (e.g., JWT, Redis)
5. Configure CORS for production domain
6. Use HTTPS for secure cookies

## Dependencies

### Backend
- `express` - Web server
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `cookie-parser` - Cookie parsing middleware

### Frontend
- `js-cookie` - Cookie management
- `vue-router` - Routing
- `axios` - HTTP client (for future API calls)

## File Structure
```
├── api/                           # Vercel serverless functions
│   ├── lib/
│   │   └── auth.js                # Authentication helpers
│   ├── auth/
│   │   ├── discord.js             # Discord OAuth callback
│   │   └── logout.js              # Logout endpoint
│   └── guilds/                    # Guild management endpoints
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   └── Hero.vue           # Home page with login button
│   │   └── ui/                    # Reusable UI components
│   ├── views/
│   │   ├── DashboardView.vue      # Dashboard page with error handling
│   │   └── GuildSettingsView.vue  # Guild settings with logout error handling
│   ├── composables/
│   │   ├── useAuth.js             # Authentication composable
│   │   └── useNotification.js     # Notification system
│   ├── utils/
│   │   └── animations.js          # Centralized timing constants
│   └── router/
│       └── index.js               # Vue Router configuration
└── .env.local                     # Environment variables
```

## Troubleshooting

### "Invalid OAuth2 redirect_uri"
- Make sure `http://localhost:3000/api/auth/discord` is added to your Discord application's redirect URIs
- Verify the redirect URI in `.env.local` matches exactly

### Cookies not being set
- Ensure both servers are running (frontend on 5173, backend on 3000)
- Check browser console for CORS errors
- Verify CORS origin in `server.js` matches your frontend URL

### Dashboard shows "Not Authenticated"
- Check if cookies are being set in browser DevTools
- Verify the backend server is running and accessible
- Check for JavaScript errors in the console
