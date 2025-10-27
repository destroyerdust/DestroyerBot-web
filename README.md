# DestroyerBot Web

A promotional website for DestroyerBot, the ultimate Discord moderation bot to keep your server safe and organized.

## About DestroyerBot

DestroyerBot is a personal Discord bot built with Discord.js v14, featuring:
- Utility commands (ping, user info, server stats)
- Gaming integrations (WoW Raider IO character/guild stats, Pokemon TCG card searches)
- Advanced role-based permission system
- Weather forecasting with Pirate Weather API
- Moderation tools and customizable command permissions

## Tech Stack

- **Frontend**: Vue.js 3.4.0 with Vue Router 4.6
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS v4.0 (alpha)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Features

The website showcases:
- Hero section with animated gradient background and invite button
- Bot description and technical details (Discord.js v14, Node.js)
- Interactive command showcase with tabbed categories:
  - Utility: `/ping`, `/user-info`, `/server`, `/weather`
  - Gaming: `/rio character/guild realm`, `/pokemon search/random`
  - Administrator: `/kick`, `/setcommandrole`, `/listpermissions`
- Real-time command copying with clipboard API
- Responsive design with dark theme and glassmorphism effects
- Modern UI using gradients, cards, and hover animations
- Quick stats and social links

## Project Structure

This is a single-page Vue.js application with:
- Component-based architecture using 5 main sections
- Vue Router for client-side routing
- Custom CSS animations and responsive layouts
- SPA optimized for deployment on Vercel

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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

The site is configured for deployment on Vercel with SPA routing. Push to the main branch to trigger automatic deployment.

## Repository

- **Bot Code**: [DestroyerBot](https://github.com/destroyerdust/DestroyerBot)
- **Site Code**: [DestroyerBot-web](https://github.com/destroyerdust/DestroyerBot-web)

## Invite DestroyerBot

Click the invite button on the site or visit: [Discord OAuth2](https://discord.com/oauth2/authorize?client_id=773000914319048736&scope=bot%20applications.commands&permissions=347136)

## License

© 2025 DestroyerBot. All rights reserved.
