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
- **Framework**: Vue.js 3.4.0 with Vue Router 4.6
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS v4.0 (alpha)
- **Analytics**: Vercel Analytics

### Backend (Development)
- **Server**: Express 5.1.0
- **Authentication**: Discord OAuth 2.0
- **Session Management**: Cookie-based with js-cookie
- **CORS**: Configured for local development

### Deployment
- **Frontend**: Vercel
- **API Routes**: Vercel Serverless Functions

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
├── server.js                      # Express auth server for local development
├── .env.local                     # Environment variables (not in repo)
├── README.md                      # Main documentation
├── README-AUTH.md                 # Authentication setup guide
│
├── api/                           # Vercel serverless functions
│   └── auth/
│       ├── discord.js             # Discord OAuth callback handler
│       └── logout.js              # Logout endpoint
│
├── src/
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
- Express server for local OAuth development
- Serverless functions for production deployment on Vercel
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

4. Start the development servers:
   ```bash
   # Terminal 1: Frontend (Vite)
   npm run dev
   
   # Terminal 2: Backend (Express Auth Server)
   npm run server
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

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
| `npm run server` | Start Express auth server (backend) on port 3000 |
| `npm run build` | Build production bundle with Vite |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without making changes |

**Note**: For full authentication functionality during development, you must run both `npm run dev` and `npm run server` simultaneously in separate terminals.

## Deployment

The site is configured for deployment on Vercel with SPA routing. Push to the main branch to trigger automatic deployment.

## Repository

- **Bot Code**: [DestroyerBot](https://github.com/destroyerdust/DestroyerBot)
- **Site Code**: [DestroyerBot-web](https://github.com/destroyerdust/DestroyerBot-web)

## Invite DestroyerBot

Click the invite button on the site or visit: [Discord OAuth2](https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=347136)

## License

© 2025 DestroyerBot. All rights reserved.
