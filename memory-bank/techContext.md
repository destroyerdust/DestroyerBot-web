# DestroyerBot Web - Technical Context

## Technology Stack

### Frontend Technologies
- **Framework**: Vue.js 3.5.22 (Composition API)
- **Build Tool**: Vite 7.1.12 (fast development and optimized production builds)
- **Routing**: Vue Router 4.6.3 (SPA navigation with history mode)
- **Styling**: Tailwind CSS 4.1.16 (utility-first CSS framework)
- **HTTP Client**: Axios 1.13.1 (promise-based HTTP requests)
- **State Management**: Vue 3 Reactivity (component-level state)
- **Cookie Management**: js-cookie 3.0.5 (client-side cookie handling)

### Backend Technologies
- **Runtime**: Node.js (Vercel serverless environment)
- **Framework**: Express.js 5.1.0 (API routing and middleware)
- **Database**: MongoDB with Mongoose 8.19.2 (document database)
- **Authentication**: Discord OAuth 2.0 (social login)
- **Session Storage**: Cookie-based sessions (secure, httpOnly)
- **CORS**: cors middleware 2.8.5 (cross-origin request handling)

### Development & Deployment
- **Development Server**: Vite dev server (HMR, fast refresh)
- **Code Formatting**: Prettier 3.6.2 (consistent code style)
- **Linting**: ESLint integration (code quality)
- **Deployment**: Vercel platform (serverless functions, CDN)
- **Analytics**: Vercel Analytics 1.5.0 (usage tracking)
- **Version Control**: Git (distributed version control)

## Development Setup

### Prerequisites
- **Node.js**: v16 or higher (LTS recommended)
- **Package Manager**: npm or pnpm
- **Git**: Latest stable version
- **Code Editor**: VS Code (recommended) with Vue.js extensions

### Environment Configuration
```bash
# .env.local (development)
DISCORD_CLIENT_ID=your_dev_client_id
DISCORD_CLIENT_SECRET=your_dev_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord
MONGODB_URI=mongodb://localhost:27017/destroyerbot-dev
BOT_TOKEN=your_dev_bot_token

# Production environment variables set in Vercel dashboard
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development server (frontend only)
npm run dev

# Start full serverless environment (recommended)
npx vercel dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format

# Check formatting
npm run format:check
```

## Technical Constraints

### Serverless Limitations
- **Execution Time**: 10-second timeout for serverless functions
- **Memory**: 1024 MB RAM limit per function
- **Cold Starts**: Initial request latency (optimized with connection pooling)
- **File System**: Read-only file system, no persistent storage
- **Dependencies**: Package size limits and bundling considerations

### Database Constraints
- **Connection Limits**: MongoDB Atlas connection pooling
- **Query Timeouts**: 30-second query timeout
- **Document Size**: 16 MB document size limit
- **Indexing**: Strategic indexing for query performance

### API Rate Limits
- **Discord API**: 50 requests per second per token
- **OAuth Flow**: Rate limited by Discord
- **Database Queries**: Connection pool size limitations

### Browser Compatibility
- **Modern Browsers**: ES6+ support required
- **Mobile Support**: Responsive design for all screen sizes
- **Progressive Enhancement**: Core functionality works without JavaScript

## Dependencies & Libraries

### Core Dependencies
```json
{
  "vue": "^3.5.22",
  "vue-router": "^4.6.3",
  "@vitejs/plugin-vue": "^6.0.1",
  "axios": "^1.13.1",
  "express": "^5.1.0",
  "mongoose": "^8.19.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "cookie-parser": "^1.4.7",
  "js-cookie": "^3.0.5"
}
```

### Development Dependencies
```json
{
  "@tailwindcss/vite": "^4.1.16",
  "tailwindcss": "^4.1.16",
  "prettier": "^3.6.2",
  "concurrently": "^9.2.1",
  "vercel": "^32.0.0"
}
```

## Tool Usage Patterns

### Version Control
- **Branching Strategy**: `main` for production, feature branches for development
- **Commit Messages**: Conventional commits format
- **Pull Requests**: Code review required before merge
- **Release Tags**: Semantic versioning (v1.0.0, v1.1.0, etc.)

### Code Quality
- **Formatting**: Prettier with custom configuration
- **Naming Conventions**: camelCase for variables/functions, PascalCase for components
- **File Organization**: Feature-based folder structure
- **Import Order**: External libraries first, then internal modules

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-dashboard

# 2. Make changes with frequent commits
git add .
git commit -m "feat: add user profile component"

# 3. Test locally with vercel dev
npx vercel dev

# 4. Format code before committing
npm run format

# 5. Push and create pull request
git push origin feature/new-dashboard
```

### Deployment Pipeline
- **Development**: Local testing with `vercel dev`
- **Staging**: Vercel preview deployments for pull requests
- **Production**: Automatic deployment on `main` branch merge
- **Rollback**: Vercel deployment history for quick rollbacks

## Environment Management

### Development Environment
- **Local Database**: MongoDB running locally or MongoDB Atlas dev cluster
- **Discord App**: Development application with test server
- **Environment Variables**: `.env.local` file (gitignored)
- **Ports**: Frontend (5173), API (3000) when using `vercel dev`

### Production Environment
- **Hosting**: Vercel serverless platform
- **Database**: MongoDB Atlas production cluster
- **CDN**: Vercel edge network for global distribution
- **Monitoring**: Vercel analytics and error tracking
- **Security**: HTTPS enforced, secure headers

## Performance Considerations

### Frontend Optimization
- **Bundle Splitting**: Route-based code splitting with Vue Router
- **Asset Optimization**: Vite's built-in optimization and minification
- **Image Handling**: Future implementation of lazy loading and WebP format
- **Caching**: Browser caching headers for static assets

### Backend Optimization
- **Connection Pooling**: MongoDB connection reuse across function invocations
- **Query Optimization**: Strategic indexing and query planning
- **Response Compression**: Automatic gzip compression by Vercel
- **Caching Layer**: In-memory caching for frequently accessed data

### Monitoring & Debugging
- **Error Tracking**: Vercel function logs and error reporting
- **Performance Monitoring**: Vercel analytics for response times
- **Database Monitoring**: MongoDB Atlas performance metrics
- **User Monitoring**: Client-side error logging (future implementation)
