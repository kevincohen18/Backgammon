# PWA Icons Setup

To complete the PWA setup, you need to create app icons. The manifest.json references these icons:

- `/images/icon-192.png` - 192x192px icon
- `/images/icon-512.png` - 512x512px icon

## Creating Icons

You can create these icons using any image editor or online tool:

1. **Design Requirements:**
   - Square format (192x192 and 512x512)
   - PNG format with transparency
   - Should represent the backgammon game
   - Works well on both light and dark backgrounds

2. **Quick Generation:**
   - Use tools like [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Or create manually with design software
   - Or use AI image generators with prompt: "backgammon game icon, modern, minimalist, square"

3. **Placement:**
   - Save as `app/browser/images/icon-192.png`
   - Save as `app/browser/images/icon-512.png`

4. **Favicon:**
   - Also create a `favicon.ico` (16x16, 32x32, 48x48) for browser tabs
   - Place in `app/browser/images/favicon.ico`

The PWA will work without these icons, but they enhance the user experience when installing the app to home screens.

