# Quick Start Guide

Get your modernized backgammon game running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Navigate to the browser directory:**
   ```bash
   cd app/browser
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The dev server will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in terminal

## Available Commands

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## What's New?

### 🚀 Modern Build System
- **Vite** for lightning-fast development
- Hot Module Replacement (instant updates)
- Optimized production builds

### 🎨 Modern UI
- Bootstrap 5.3+ components
- Dark mode support
- Smooth animations
- Responsive design

### 💻 Modern JavaScript
- ES6+ syntax
- Classes and modules
- Better error handling
- JSDoc annotations

### 📦 PWA Ready
- Service worker for offline support
- Installable as app
- Fast loading

## Troubleshooting

### Port already in use?
Change the port in `vite.config.js`:
```js
server: {
  port: 3001, // Change to available port
}
```

### Build errors?
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf .vite
   ```

### Module not found?
Make sure you're in the `app/browser` directory when running commands.

## Next Steps

1. **Create PWA icons** - See `ICONS_README.md`
2. **Customize theme** - Edit CSS variables in `style/backgammon.css`
3. **Add features** - Extend the game with new functionality
4. **Deploy** - Build and deploy to your hosting service

## Need Help?

- Check `README.md` for detailed documentation
- See `MODERNIZATION_COMPLETE.md` for what changed
- Review `MODERNIZATION_PLAN.md` for the full plan

Happy coding! 🎲

