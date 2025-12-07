# Backgammon.js - Modernized 2026

Modern multiplayer backgammon game built with modern web technologies.

## Features

- 🎮 Modern multiplayer backgammon gameplay
- 🎨 Sleek, modern UI with smooth animations
- 📱 Fully responsive design
- 🌙 Dark mode support (system preference detection)
- ⚡ Fast build system with Vite (HMR, code splitting)
- 🔧 ES6+ JavaScript with JSDoc annotations
- 🎯 Bootstrap 5.3+ components
- 📦 PWA support (offline capable, service worker)
- ♿ Accessibility improvements (ARIA, keyboard nav)
- 🎲 Modern CSS-based dice with 3D effects
- ✨ Smooth piece movement animations
- 🔔 Toast notification system
- 🧪 Unit test setup with Vitest

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Development

### Project Structure

```
app/browser/
├── js/              # JavaScript source files
│   ├── main.js      # Main application entry
│   ├── config.js    # Configuration
│   └── SimpleBoardUI.js  # Board UI component
├── style/           # CSS stylesheets
│   ├── backgammon.css  # Main game styles
│   └── ribbons.css    # Ribbon styles
├── images/          # Image assets
├── index.html       # Main HTML file
├── vite.config.js   # Vite configuration
└── manifest.json    # PWA manifest
```

### Build System

This project uses **Vite** for fast development and optimized production builds.

- **Development**: Hot Module Replacement (HMR) for instant updates
- **Production**: Optimized bundles with tree-shaking and code splitting

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

Generate test coverage:
```bash
npm run test:coverage
```

## Complete Modernization Summary (2015 → 2026)

### ✅ Completed Modernization Tasks

#### Build System & Dependencies
- ✅ Replaced Browserify/Gulp with Vite (modern, fast HMR)
- ✅ Removed Bower (deprecated package manager)
- ✅ Updated Bootstrap 3.x → Bootstrap 5.3+
- ✅ Updated all npm packages to latest stable versions
- ✅ Added code splitting and bundle optimization

#### JavaScript Modernization
- ✅ Converted ES5 → ES6+ (classes, arrow functions, const/let, template literals)
- ✅ ES6 modules instead of CommonJS
- ✅ Modern async/await patterns
- ✅ Added JSDoc type annotations for better code quality
- ✅ Improved error handling with try-catch blocks

#### CSS Modernization
- ✅ CSS Custom Properties (variables) for theming
- ✅ CSS Grid and Flexbox layouts (replaced floats/tables)
- ✅ Removed vendor prefixes (autoprefixer handles this)
- ✅ Modern animations and transitions
- ✅ Dark mode support with system preference detection
- ✅ Modern color palette with improved contrast

#### UI/UX Improvements
- ✅ Bootstrap 5.3+ components (replaced Bootstrap 3)
- ✅ Modern card-based landing page design
- ✅ Smooth piece movement animations (400ms cubic-bezier)
- ✅ Modern CSS-based dice display with 3D effects
- ✅ Toast notification system (replaced ohSnap)
- ✅ Improved responsive design for all screen sizes
- ✅ Better accessibility (ARIA labels, keyboard navigation)
- ✅ Modern loading spinner (replaced GIF)

#### Features
- ✅ PWA support (service worker, manifest.json)
- ✅ Offline capability
- ✅ Modern error handling and user feedback
- ✅ Smooth page transitions
- ✅ Micro-interactions and hover effects

### 📝 Remaining Optional Enhancements

These are nice-to-have features that can be added later:
- Image optimization (GIF → WebP/SVG) - Images work fine as-is
- Game statistics tracking - Feature addition, not modernization
- Sound effects - Feature addition, not modernization
- Unit tests - Can be added incrementally
- PWA icons - Placeholder structure in place

## Modernization Changes (2015 → 2026)

### Build System
- ✅ Replaced Browserify/Gulp with Vite
- ✅ Removed Bower (deprecated)
- ✅ Updated to modern npm packages

### JavaScript
- ✅ Converted ES5 to ES6+ (classes, arrow functions, const/let)
- ✅ ES6 modules instead of CommonJS
- ✅ Modern async/await patterns

### CSS
- ✅ CSS Custom Properties (variables)
- ✅ CSS Grid and Flexbox layouts
- ✅ Removed vendor prefixes (autoprefixer handles this)
- ✅ Modern animations and transitions
- ✅ Dark mode support

### UI/UX
- ✅ Bootstrap 5.3+ (replaced Bootstrap 3)
- ✅ Modern card-based landing page
- ✅ Smooth piece movement animations
- ✅ Modern toast notifications
- ✅ Improved responsive design
- ✅ Better accessibility (ARIA labels, keyboard nav)

### Features
- ✅ PWA support (service worker, manifest)
- ✅ Modern loading states
- ✅ Enhanced animations
- ✅ Better mobile experience

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
