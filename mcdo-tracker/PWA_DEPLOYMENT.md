# PWA Deployment Guide

Progressive Web Apps (PWA) allow the application to be installed on any device with a web browser without app store approval.

## Current PWA Features

The app includes:
- ✅ Service Worker for offline support
- ✅ Web App Manifest for installation
- ✅ Responsive design for all screen sizes
- ✅ Dark mode support
- ✅ Cache-first strategy for assets
- ✅ Installable on Android, iOS, and Desktop

## How to Install PWA

### Android Chrome

1. Open app URL in Chrome browser
2. Tap the menu icon (⋮) in the top right
3. Select "Install app"
4. Confirm installation
5. App appears on home screen

**Alternative:** Look for an install prompt in the address bar

### iPhone Safari

1. Open app URL in Safari
2. Tap the Share button (↑)
3. Scroll down and tap "Add to Home Screen"
4. Enter app name (default: "CrewTime")
5. Tap "Add"
6. App appears on home screen

### Desktop (Chrome, Edge, Brave)

1. Open app URL in browser
2. Click install icon in address bar (looks like 📦)
3. Click "Install"
4. App opens in standalone window

## Deployment Platforms

### Recommended: Vercel (Best for React/Vite)

Vercel automatically optimizes for PWA:

**Setup:**
```bash
npm install -g vercel
vercel
```

**Features:**
- Free tier available
- Automatic HTTPS
- Global CDN
- Preview deployments
- Custom domains
- Environment variables

**Deploy:**
```bash
vercel --prod
```

### Netlify

**Setup:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Features:**
- Free tier with bandwidth limits
- Automatic HTTPS
- Global CDN
- Custom domains
- Form handling

### Firebase Hosting

**Setup:**
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

**Features:**
- Free tier
- Automatic HTTPS
- Global CDN
- Realtime database (optional)
- Cloud functions (optional)

### GitHub Pages

**For free hosting:**

1. Push to GitHub
2. In repository settings:
   - Go to Pages section
   - Select "Deploy from branch"
   - Choose `main` branch and `/root` folder
3. GitHub automatically builds and deploys

**Note:** Uses `github.com/username/repo` as base URL

### Custom Server

For self-hosted deployment:

```bash
# Build the app
npm run build

# Upload dist/ folder to server
# Configure web server to:
# 1. Serve index.html for all routes (SPA routing)
# 2. Enable HTTPS
# 3. Set appropriate cache headers
# 4. Serve with gzip compression
```

**Nginx Configuration Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    root /var/www/mcdo-tracker/dist;
    
    # Cache busting for assets
    location ~* \.(js|css|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # Service worker
    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}
```

## PWA Configuration

### Manifest Configuration

Located in vite.config.ts:

```typescript
manifest: {
  name: "McDonald's Time Tracker",
  short_name: 'CrewTime',
  description: 'Employee time tracking and payroll calculator',
  theme_color: '#DA291C',
  background_color: '#ffffff',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/',
  scope: '/',
  icons: [
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
  ]
}
```

### Required Icons

Generate and place in `public/`:

- `pwa-64x64.png` - Small icon
- `pwa-192x192.png` - Home screen
- `pwa-512x512.png` - Splash screen
- `maskable-icon-192x192.png` - Maskable format
- `maskable-icon-512x512.png` - Maskable format
- `apple-touch-icon.png` - iOS home screen (180x180)
- `favicon.svg` - Favicon (SVG)
- `favicon-32x32.png` - Favicon 32x32
- `favicon-16x16.png` - Favicon 16x16

### Generate Icons

Use an online tool or library:

**Option 1: PWA Generator (Online)**
- Visit [PWABuilder](https://www.pwabuilder.com/)
- Upload image
- Download generated icons

**Option 2: ImageMagick (Command Line)**
```bash
# Install ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: apt-get install imagemagick

# Generate icons from source image (source.png)
convert source.png -resize 192x192 public/pwa-192x192.png
convert source.png -resize 512x512 public/pwa-512x512.png
convert source.png -resize 180x180 public/apple-touch-icon.png
```

**Option 3: Vite Plugin**
```bash
npm install vite-plugin-icons --save-dev
```

## Service Worker Configuration

The Service Worker is configured in vite.config.ts with Workbox:

```typescript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 31536000 }
      }
    }
  ]
}
```

### How Offline Mode Works

1. **First Load:** App downloads and caches all files
2. **Offline:** Service Worker serves cached files
3. **Back Online:** Service Worker updates cache in background
4. **LocalStorage:** User data persists automatically

## Testing PWA

### Before Publishing

1. **Test Installation:**
   - Chrome: Check install prompt appears
   - Safari: Check share menu shows "Add to Home Screen"

2. **Test Offline:**
   - Go to DevTools > Network > Offline
   - App should still work
   - Navigate between pages offline
   - Verify data persists

3. **Test Performance:**
   - DevTools > Lighthouse
   - Score should be 90+

4. **Test Icons:**
   - Check home screen icon
   - Check splash screen
   - Verify colors match

5. **Test Manifest:**
   - DevTools > Application > Manifest
   - Check all fields are correct
   - Verify icons load

### Lighthouse Audit

In Chrome DevTools:

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "PWA"
4. Click "Analyze page"
5. Review results

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

## Updating PWA

### Deploy New Version

```bash
npm run build
# Deploy dist/ folder to host
```

### Service Worker Update

Service Worker automatically checks for updates:
- Every visit to the site
- Every 24 hours
- When user closes and reopens app

Users get automatic updates with no action required.

### Force Update

Users can force refresh:
1. Settings > App Info > Storage > Clear Cache (Android)
2. Remove from home screen and reinstall (iOS)
3. Ctrl+Shift+R or Cmd+Shift+R (Desktop)

## PWA Vs Native App

| Feature | PWA | Android APK | iOS App |
|---------|-----|------------|---------|
| Installation | Browser + Home Screen | Play Store | App Store |
| Offline | ✅ Yes | ✅ Yes | ✅ Yes |
| Storage | 50MB+ | GB+ | GB+ |
| Hardware Access | Limited | Full | Full |
| Push Notifications | ✅ Yes | ✅ Yes | ✅ Yes |
| Home Screen Icon | ✅ Yes | ✅ Yes | ✅ Yes |
| App Store Review | ❌ No | ✅ Required | ✅ Required |
| Update Distribution | Instant | Store | Store |
| Development Speed | Fastest | Medium | Medium |

## Troubleshooting

### App Not Installing

**Issue:** No install prompt appears

**Solutions:**
- Verify HTTPS is enabled
- Check manifest.json is valid
- Verify icons exist and load
- Clear browser cache
- Try different browser

### Offline Mode Not Working

**Issue:** App doesn't work without internet

**Solutions:**
- Verify service worker registered (DevTools > Application > Service Workers)
- Check DevTools console for errors
- Go online, reload, then go offline
- Clear cache and reinstall app

### Manifest.json 404

**Issue:** Browser can't find manifest

**Solutions:**
- Verify manifest in public/ folder
- Restart build: `npm run build`
- Hard refresh browser (Ctrl+Shift+R)
- Check Vite PWA configuration

### Icons Not Showing

**Issue:** Home screen icon is blank or wrong

**Solutions:**
- Verify icon files exist in public/
- Check manifest icon paths are correct
- Clear app cache and reinstall
- Use maskable format icons

## Resources

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Next Steps

1. ✅ PWA is already configured
2. Test on Android Chrome - see "How to Install PWA"
3. Test on iPhone Safari - see "How to Install PWA"
4. Deploy to production server with HTTPS
5. Share app URL with users
6. Users install from browser menu

No additional configuration needed for PWA! The app is already production-ready as a PWA.
