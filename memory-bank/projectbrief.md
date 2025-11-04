# DestroyerBot Web - Project Brief

## Project Overview
DestroyerBot Web is a Vue.js 3 promotional website and user dashboard for DestroyerBot, a Discord moderation and utility bot. The application serves dual purposes: marketing the bot's features to potential users and providing authenticated users with a dashboard to manage their Discord servers and bot settings.

## Core Requirements
- **Public Website**: Showcase DestroyerBot's features, commands, and capabilities
- **User Authentication**: Discord OAuth 2.0 integration for secure login
- **User Dashboard**: Authenticated user interface for managing bot settings and server configurations
- **Serverless Architecture**: Deployable on Vercel with serverless functions
- **Responsive Design**: Modern, mobile-friendly interface using Tailwind CSS
- **Real-time Features**: Interactive command showcase with clipboard functionality

## Key Features
1. **Landing Page**
   - Hero section with Discord login
   - Bot feature overview
   - Interactive command showcase
   - Social links and quick stats

2. **User Dashboard**
   - User profile display
   - Server management interface
   - Guild settings configuration
   - Bot statistics and analytics

3. **Authentication System**
   - Discord OAuth 2.0 flow
   - Cookie-based session management
   - Secure logout functionality

## Technical Constraints
- Must work within Vercel's serverless function limits
- MongoDB connection optimization for serverless environment
- CORS configuration for cross-origin requests
- Environment variable management for sensitive data

## Success Criteria
- Clean, modern UI that effectively promotes DestroyerBot
- Seamless Discord OAuth authentication flow
- Functional dashboard for server management
- Fast loading times and responsive design
- Secure handling of user data and authentication

## Project Scope
This project focuses exclusively on the web interface and API endpoints for DestroyerBot. The actual Discord bot functionality is handled by a separate codebase (DestroyerBot repository).
