# 🍔 McDonald's Employee Time Tracker (CrewTime)

A mobile-first application for McDonald's crew members to track shifts and calculate payroll. Available as **PWA, Android App, or iOS App**.

## ✨ Features

- ⏱️ **Time tracking** — Log daily time in/out with auto-calculated hours
- 💰 **Payroll calculator** — Automatic computation of base pay, extended hours, OT, holiday pay, and night differential
- 📅 **Calendar view** — Color-coded attendance overview with integrated payroll reports
- 📊 **Payroll breakdown** — Cutoff-period and monthly payroll analysis
- 👤 **Profile** — Employee info with role-based pay rates
- 🌙 **Dark mode** — System-aware + manual toggle
- 📱 **Multi-platform** — Installable on Web, iOS, Android
- 💾 **Offline-first** — All data stored in localStorage, no backend needed
- 🔄 **Auto-sync** — Updates automatically when connection restored

## 📦 Platform Support

| Platform | Status | Install | Notes |
|----------|--------|---------|-------|
| **PWA** (Web) | ✅ Ready | Browser menu | Works on all devices, instant updates |
| **Android** | ✅ Ready | Google Play (pending) | Full native app, offline support |
| **iOS** | ✅ Ready | App Store (pending) | Full native app, offline support |

## 💼 Pay Rules Implemented

| Type | Rate |
|------|------|
| Crew | ₱75/hr |
| Crew Trainer | ₱77/hr |
| Extended Hours (Base–8h) | Normal rate |
| Overtime (after 8h) | 125% of hourly rate |
| Night Differential (10PM–6AM) | +10% |
| Special Holiday | +30% (130% total) |
| Regular Holiday | ×2.0 (200% total) |

## 📅 Cutoff Periods

- **Cutoff 1:** Day 1–15 of each month
- **Cutoff 2:** Day 16–end of each month

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser: http://localhost:5173
```

### Build for Production

```bash
# Build web app (creates dist/)
npm run build

# Preview production build
npm run preview
```

### Deploy to Web (PWA)

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel --prod
```

**Other options:**
- Netlify: `netlify deploy --prod --dir=dist`
- Firebase: `firebase deploy`
- GitHub Pages: Push to `main` branch (auto-deploy)

## 📱 Mobile App Development

### Add Android Platform

```bash
npm run cap:add:android
npm run cap:open:android
```

Then build APK/AAB in Android Studio.

### Add iOS Platform (macOS)

```bash
npm run cap:add:ios
npm run cap:open:ios
```

Then build in Xcode.

### Mobile Build Scripts

```bash
npm run build:mobile      # Build web + sync to both platforms
npm run cap:sync          # Sync code without rebuilding
npm run cap:open:android  # Open Android Studio
npm run cap:open:ios      # Open Xcode (macOS)
```

## 📚 Documentation

- **[MOBILE_COMPLETE.md](./MOBILE_COMPLETE.md)** — Overview & getting started
- **[MOBILE_SETUP.md](./MOBILE_SETUP.md)** — Detailed setup guide
- **[PWA_DEPLOYMENT.md](./PWA_DEPLOYMENT.md)** — PWA configuration & deployment
- **[ANDROID_BUILD.md](./ANDROID_BUILD.md)** — Android app building & publishing
- **[IOS_BUILD.md](./IOS_BUILD.md)** — iOS app building & publishing (macOS)

## 🏗️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Mobile:** Capacitor
- **PWA:** Vite PWA Plugin
- **Storage:** localStorage (offline-first)
- **Date handling:** date-fns

## 📂 Project Structure

```
mcdo-tracker/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── hooks/           # React hooks
│   ├── services/        # LocalStorage & utilities
│   ├── utils/           # Payroll calculations, helpers
│   └── types/           # TypeScript definitions
├── public/              # Static assets, icons
├── dist/                # Production build (PWA & mobile)
├── android/             # Android native project
├── ios/                 # iOS native project
├── capacitor.config.ts  # Capacitor configuration
├── vite.config.ts       # Vite & PWA configuration
└── index.html           # HTML entry point
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build optimized web app
npm run preview         # Test production build locally

# Mobile
npm run build:mobile    # Build web + sync to mobile
npm run cap:sync        # Sync changes to mobile
npm run cap:add:android # Add Android platform
npm run cap:add:ios     # Add iOS platform (macOS)
```

## 💾 Data Storage

All data is stored **locally** on the device:

- ✅ Time entries
- ✅ Employee profile
- ✅ Settings & preferences
- ✅ App state

**No backend or account required** — Data stays on user's device.

### LocalStorage Limits

- Web: ~5-10 MB per domain
- Android: ~10 MB+ per app
- iOS: ~10 MB+ per app

For this app, ~50 entries per user = <1 MB.

## 🔐 Privacy & Security

- ✅ No data sent to servers
- ✅ No tracking or analytics
- ✅ All calculations done locally
- ✅ HTTPS only (production)
- ✅ No API keys or credentials stored
- ✅ Open source (inspect code freely)

## 📊 Offline Support

The app works **completely offline**:

1. **First load:** Downloads and caches all files
2. **Offline:** Service Worker serves cached files
3. **Offline mode:** Full functionality, data persists locally
4. **Back online:** Service Worker checks for updates
5. **Updates:** Automatic in background

## 🛠️ Development Workflow

1. **Make changes** to `src/` files
2. **Dev server hot-reloads** automatically
3. **Test in browser** at http://localhost:5173
4. **Test offline** in DevTools > Network > Offline
5. **Build for production:** `npm run build`
6. **Deploy to web:** `npm run build && vercel --prod`
7. **Deploy to mobile:** `npm run build:mobile && npm run cap:open:android`

## 🐛 Troubleshooting

### App won't start
```bash
npm install          # Reinstall dependencies
npm run build        # Check for TypeScript errors
```

### Changes not appearing
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear app cache in Settings
- Uninstall and reinstall app

### LocalStorage not working
- Check browser privacy settings
- Verify offline storage permissions
- Check DevTools > Application > LocalStorage

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📈 Performance

- **Load time:** <1 second (cached)
- **Bundle size:** ~210 KB JavaScript (gzipped: 60 KB)
- **Lighthouse score:** 90+ on all metrics
- **Offline:** Instant (Service Worker)

## 🤝 Contributing

This is a single-user development project. For contributions or issues:

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "description"`
5. Push: `git push origin feature/name`
6. Create pull request

## 📄 License

MIT License — Feel free to use and modify.

## 🎯 Next Steps

### To Deploy PWA Now
```bash
npm run build
vercel --prod
```

### To Build Mobile Apps
1. Follow guides in `ANDROID_BUILD.md` and `IOS_BUILD.md`
2. Test on devices
3. Submit to app stores

### To Modify App
1. Edit React components in `src/`
2. Run `npm run dev` to test
3. Build: `npm run build`
4. Deploy: `npm run build && vercel --prod`

## 📞 Support

For issues or questions:
- Check documentation files in project root
- Review code comments in `src/`
- Check browser console (F12) for errors

---

**Built with ❤️ for McDonald's crew members worldwide**

Made with React + TypeScript + Vite + Capacitor + Tailwind CSS

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI (Card, Button, Input, Modal)
│   ├── layout/       # BottomNav
│   ├── dashboard/    # Home dashboard
│   ├── timetracking/ # Time entry log
│   ├── calendar/     # Calendar view + payroll reports
│   └── profile/      # Employee profile & settings
├── hooks/
│   └── useApp.tsx    # Global context + state
├── services/
│   └── storage.ts    # LocalStorage CRUD
├── types/
│   └── index.ts      # TypeScript types & constants
└── utils/
    ├── payroll.ts    # Payroll calculation logic
    └── helpers.ts    # Date/format utilities
```

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** for bundling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **vite-plugin-pwa** for PWA support
- **localStorage** for data persistence
