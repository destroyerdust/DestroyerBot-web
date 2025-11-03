# DestroyerBot Web

A promotional website and dashboard for DestroyerBot, the ultimate Discord moderation bot to keep your server safe and organized.

## About DestroyerBot

DestroyerBot is a personal Discord bot built with Discord.js v14, featuring:
- Utility commands (ping, user info, server stats)
- Gaming integrations (WoW Raider IO character/guild stats, Pokemon TCG card searches)
- Advanced role-based permission system
- Weather forecasting with Pirate Weather API
- Moderation tools and customizable command permissions

## Tech Stack

### Frontend
- **Framework**: Vue.js 3.5.22 with Vue Router 4.6.3
- **Build Tool**: Vite 5.4.11
- **Styling**: Tailwind CSS v4.1.16
- **Analytics**: Vercel Analytics

### Backend
- **Architecture**: Fully serverless (Vercel Functions)
- **API**: Vercel Serverless Functions with Express-style handlers
- **Authentication**: Discord OAuth 2.0
- **Session Management**: Cookie-based with secure httpOnly cookies
- **Database**: MongoDB with Mongoose (serverless-optimized connection caching)
- **CORS**: Configured middleware for cross-origin requests

## Features

### Public Website
- Hero section with animated gradient background
- **Discord OAuth Login** - "Login with Discord" button initiates authentication
- Bot description and technical details (Discord.js v14, Node.js)
- Interactive command showcase with tabbed categories:
  - Utility: `/ping`, `/user-info`, `/server`, `/weather`
  - Gaming: `/rio character/guild realm`, `/pokemon search/random`
  - Administrator: `/kick`, `/setcommandrole`, `/listpermissions`
- Real-time command copying with clipboard API
- Responsive design with dark theme and glassmorphism effects
- Modern UI using gradients, cards, and hover animations
- Quick stats and social links

### User Dashboard (New!)
- **Discord Authentication** - Secure OAuth 2.0 login flow
- **User Profile Display** - Shows Discord avatar, username, email, and user ID
- **Dashboard Stats** - Displays server count, commands used, and premium status
- **Quick Actions** - Add bot to server and manage server settings
- **Session Management** - Cookie-based authentication with 7-day expiration
- **Logout Functionality** - Secure session termination

## Project Structure

```
DestroyerBot-web/
├── .env.local                     # Environment variables (not in repo)
├── README.md                      # Main documentation
├── README-AUTH.md                 # Authentication setup guide
│
├── api/                           # Vercel serverless functions
│   ├── lib/                       # Shared utilities
│   │   ├── auth.js                # Authentication helpers
│   │   ├── cors.js                # CORS configuration
│   │   ├── db.js                  # Database connection
│   │   └── discord.js             # Discord API helpers
│   │
│   ├── auth/                      # Authentication endpoints
│   │   ├── discord.js             # Discord OAuth callback handler
│   │   └── logout.js              # Logout endpoint
│   │
│   ├── guilds/                    # Guild management endpoints
│   │   ├── index.js               # List user guilds
│   │   └── [guildId]/
│   │       ├── index.js           # Get guild details & settings
│   │       ├── channels.js        # Get guild channels
│   │       └── settings.js        # Save guild settings
│   │
│   └── health.js                  # Health check endpoint
│
├── src/                           # Frontend Vue.js application
│   ├── main.js                    # Vue app entry point
│   ├── App.vue                    # Root component
│   │
│   ├── components/                # Vue components
│   │   ├── Home.vue               # Home page container
│   │   ├── Hero.vue               # Hero section with login button
│   │   ├── AboutBot.vue           # Bot description
│   │   ├── Features.vue           # Feature highlights
│   │   ├── CommandShowcase.vue    # Command categories
│   │   ├── Footer.vue             # Footer section
│   │   └── Dashboard.vue          # User dashboard (authenticated)
│   │
│   ├── router/
│   │   └── index.js               # Vue Router configuration
│   │
│   └── assets/
│       └── main.css               # Tailwind CSS + custom styles
│
└── public/                        # Static assets
```

### Key Features:
- Component-based architecture with Vue 3 Composition API
- Vue Router for SPA navigation (`/` and `/dashboard` routes)
- Vercel serverless functions for both development and production
- MongoDB integration with connection caching for serverless
- Cookie-based session management
- Responsive design with Tailwind CSS v4

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/destroyerdust/DestroyerBot-web.git
   cd destroyerbot-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file with:
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Local Development with Serverless Functions

**Recommended**: Use Vercel Dev for local development to test the full serverless environment:

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Start Vercel dev environment (frontend + API functions)
vercel dev
```

This will start both the frontend and all serverless API functions at `http://localhost:3000`.

**Alternative**: Frontend-only development (no API functions):
```bash
npm run dev  # Runs on http://localhost:5173
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Discord OAuth
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Discord Bot Token (for API calls)
BOT_TOKEN=your_bot_token_here
```

**Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### Testing Production Build Locally

To test the production build:
```bash
npm run build
npm run preview
```
Then open [http://localhost:4173](http://localhost:4173)

### Discord OAuth Setup

For authentication to work, you need to configure your Discord application:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to OAuth2 → General
4. Add redirect URI: `http://localhost:3000/api/auth/discord`
5. Save changes

**For detailed authentication setup, see [README-AUTH.md](./README-AUTH.md)**

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server (frontend) on port 5173 |
| `npm run build` | Build production bundle with Vite |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without making changes |

**Note**: For full serverless API functionality during development, use `vercel dev` instead of `npm run dev`. This will run both the frontend and all serverless functions locally.

## Deployment

### Vercel Deployment (Recommended)

The application is optimized for Vercel's serverless platform with automatic deployments.

#### Initial Setup

1. **Connect Repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect the framework (Vite)

2. **Configure Environment Variables**:
   In Project Settings → Environment Variables, add:
   ```
   DISCORD_CLIENT_ID=773000914319048736
   DISCORD_CLIENT_SECRET=your_production_secret
   DISCORD_REDIRECT_URI=https://your-app.vercel.app/api/auth/discord
   MONGODB_URI=your_mongodb_connection_string
   BOT_TOKEN=your_bot_token
   ```

3. **Update Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Add redirect URI: `https://your-app.vercel.app/api/auth/discord`

4. **Deploy**:
   ```bash
   git push origin main
   ```
   Vercel will automatically build and deploy your application.

#### Automatic Deployments

- **Production**: Pushes to `main` branch trigger production deployments
- **Preview**: Pushes to other branches create preview deployments
- **Pull Requests**: Automatic preview deployments for every PR

### Manual Deployment

If you prefer manual deployments:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Post-Deployment Checklist

- ✅ Verify environment variables are set
- ✅ Test Discord OAuth login flow
- ✅ Verify MongoDB connection
- ✅ Check all API endpoints (`/api/health`, `/api/guilds`, etc.)
- ✅ Test dashboard functionality
- ✅ Verify guild settings page works

## Repository

- **Bot Code**: [DestroyerBot](https://github.com/destroyerdust/DestroyerBot)
- **Site Code**: [DestroyerBot-web](https://github.com/destroyerdust/DestroyerBot-web)

## Invite DestroyerBot

Click the invite button on the site or visit: [Discord OAuth2](https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=347136)

## License

© 2025 DestroyerBot. All rights reserved.
