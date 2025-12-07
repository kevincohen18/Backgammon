# Detailed TODO: Why Server Doesn't Show Game

## Problem Analysis

The server is running on port 8080 and serving static files, but the game doesn't display properly because:

1. **Server serves raw source files** - The Express server serves `app/browser` as static files, but the modernized code uses ES6 modules that need to be processed by Vite
2. **Vite dev server is separate** - Vite runs on port 3000, but the server expects to serve the game directly
3. **Module system mismatch** - Server serves CommonJS-style, but code uses ES6 imports
4. **Build output not served** - Server doesn't serve the `dist` folder from Vite builds

---

## Detailed TODO List

### 🔴 CRITICAL ISSUES (Must Fix)

#### 1. Server Static File Serving Configuration
**Problem**: Server serves `app/browser` directly, but modern code needs Vite processing
- [ ] **Issue**: `expressServer.use(express.static(path.join(__dirname, '../browser')))` serves raw source
- [ ] **Fix**: Update server to serve Vite `dist` folder in production, or proxy to Vite dev server
- [ ] **Location**: `app/server/server.js` line 153
- [ ] **Action**: Add conditional logic to serve `dist` folder when built, or proxy to Vite dev server

#### 2. Vite Build Output Not Integrated
**Problem**: Vite builds to `app/browser/dist` but server doesn't know about it
- [ ] **Issue**: Server serves source files instead of built files
- [ ] **Fix**: Update server to check for `dist` folder and serve it, or serve source with Vite middleware
- [ ] **Location**: `app/server/server.js` line 153
- [ ] **Action**: Add `express.static` for `dist` folder with higher priority

#### 3. ES6 Module Import Errors
**Problem**: Server serves raw `.js` files with ES6 imports, but browser can't resolve them without Vite
- [ ] **Issue**: Browser tries to load `import` statements directly, fails without module bundler
- [ ] **Fix**: Either serve built files from `dist` or add Vite middleware to process on-the-fly
- [ ] **Location**: All `app/browser/js/*.js` files
- [ ] **Action**: Ensure server serves processed/built JavaScript, not raw source

#### 4. Missing Vite Dev Server Integration
**Problem**: Vite dev server runs separately on port 3000, but server expects to serve game on port 8080
- [ ] **Issue**: Two separate servers (Vite on 3000, Express on 8080) - game should be accessible from one
- [ ] **Fix**: Integrate Vite middleware into Express server, or configure server to proxy to Vite
- [ ] **Location**: `app/server/server.js`
- [ ] **Action**: Add Vite middleware for development, or serve built files for production

#### 5. Socket.io Connection Mismatch
**Problem**: Client connects to wrong server URL or can't connect
- [ ] **Issue**: Client config uses `window.location.host` but Vite proxy might not work with server
- [ ] **Fix**: Ensure client connects to correct Socket.io server (port 8080)
- [ ] **Location**: `app/browser/js/config.js` and `app/browser/js/main.js`
- [ ] **Action**: Verify Socket.io connection URL matches server port

---

### 🟡 MEDIUM PRIORITY ISSUES

#### 6. Production Build Not Generated
**Problem**: No `dist` folder exists, so server can't serve built files
- [ ] **Issue**: `npm run build` hasn't been run, or build output is in wrong location
- [ ] **Fix**: Run `npm run build` in `app/browser` to generate `dist` folder
- [ ] **Location**: `app/browser/dist/`
- [ ] **Action**: Build the project and verify `dist` folder exists

#### 7. Server Port Configuration
**Problem**: Server runs on port 8080, but client might expect different port
- [ ] **Issue**: Port mismatch between server (8080) and client expectations
- [ ] **Fix**: Ensure client config matches server port, or use environment variables
- [ ] **Location**: `app/server/server.js` line 205, `app/browser/js/config.js`
- [ ] **Action**: Standardize port configuration

#### 8. CORS Configuration
**Problem**: CORS might block requests between Vite dev server and Express server
- [ ] **Issue**: Vite on port 3000, server on 8080 - CORS might block Socket.io
- [ ] **Fix**: Verify CORS settings allow connections from Vite dev server
- [ ] **Location**: `app/server/server.js` line 8-14
- [ ] **Action**: Test CORS with Vite dev server origin

#### 9. Static File Path Issues
**Problem**: Server serves from `app/browser` but paths might be wrong
- [ ] **Issue**: CSS, images, and JS files might not load due to incorrect paths
- [ ] **Fix**: Verify all asset paths work when served from Express
- [ ] **Location**: `app/browser/index.html` and all asset references
- [ ] **Action**: Test all asset loading (CSS, images, JS)

#### 10. Vite Proxy Configuration
**Problem**: Vite proxy to Socket.io might not work correctly
- [ ] **Issue**: Vite proxy configured for `/socket.io` but might not connect properly
- [ ] **Fix**: Test Socket.io connection through Vite proxy
- [ ] **Location**: `app/browser/vite.config.js` line 31-36
- [ ] **Action**: Verify proxy works and Socket.io connects

---

### 🟢 LOW PRIORITY / OPTIMIZATION

#### 11. Development vs Production Mode
**Problem**: No clear separation between dev and production serving
- [ ] **Issue**: Server doesn't know if it should serve Vite dev or built files
- [ ] **Fix**: Add environment variable to switch between dev/prod modes
- [ ] **Location**: `app/server/server.js`
- [ ] **Action**: Add `NODE_ENV` check to serve appropriate files

#### 12. Error Handling for Missing Files
**Problem**: No error handling when files are missing
- [ ] **Issue**: Server doesn't handle 404s gracefully
- [ ] **Fix**: Add error handling middleware
- [ ] **Location**: `app/server/server.js`
- [ ] **Action**: Add Express error handling

#### 13. Build Script Integration
**Problem**: Server start script doesn't build browser code first
- [ ] **Issue**: `npm start` in root doesn't build before serving
- [ ] **Fix**: Update root `package.json` to build before starting server
- [ ] **Location**: Root `package.json` scripts
- [ ] **Action**: Update `start` script to build first

---

## Recommended Solutions

### Solution 1: Serve Built Files (Production)
```javascript
// In server.js
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  expressServer.use(express.static(path.join(__dirname, '../browser/dist')));
} else {
  expressServer.use(express.static(path.join(__dirname, '../browser')));
}
```

### Solution 2: Integrate Vite Middleware (Development)
```javascript
// Add Vite middleware for development
if (!isProduction) {
  const { createServer } = require('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  expressServer.use(vite.middlewares);
}
```

### Solution 3: Proxy Setup
- Keep Vite dev server on 3000
- Keep Express server on 8080
- Configure Express to proxy static requests to Vite
- Socket.io stays on Express server

---

## Quick Fix Steps

1. **Build the browser code:**
   ```bash
   cd app/browser
   npm run build
   ```

2. **Update server to serve dist folder:**
   - Modify `app/server/server.js` line 153
   - Change to serve `dist` folder when it exists

3. **Test server:**
   ```bash
   cd app/server
   node server.js
   ```
   - Visit `http://localhost:8080`
   - Check browser console for errors

4. **Verify Socket.io connection:**
   - Check browser Network tab
   - Verify WebSocket connection to `/socket.io`

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] HTML page loads at `http://localhost:8080`
- [ ] CSS files load correctly
- [ ] JavaScript files load (check Network tab)
- [ ] No console errors about missing modules
- [ ] Socket.io connects successfully
- [ ] Buttons are clickable
- [ ] Game board appears when starting a game
- [ ] Pieces can be moved
- [ ] Dice roll works

---

## Current Status

- ✅ Server runs on port 8080
- ✅ Vite dev server runs on port 3000
- ❌ Server serves raw source files (needs Vite processing)
- ❌ No integration between Express and Vite
- ❌ Built files not being served
- ❌ ES6 modules fail to load when served directly

---

## Priority Order

1. **Fix static file serving** (serve dist or add Vite middleware)
2. **Build the project** (generate dist folder)
3. **Test Socket.io connection** (verify WebSocket works)
4. **Fix any import errors** (ensure modules load)
5. **Test full game flow** (start game, move pieces, etc.)

