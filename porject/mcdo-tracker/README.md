# 🍔 McDonald's Employee Time Tracker

A mobile-first PWA for McDonald's crew members to track shifts and calculate payroll.

## Features

- ⏱️ **Time tracking** — Log daily time in/out with auto-calculated hours
- 💰 **Payroll calculator** — Automatic computation of basic pay, OT, holiday pay, and night differential
- 📅 **Calendar view** — Color-coded attendance overview
- 📊 **Reports** — Cutoff-period and monthly payroll breakdown
- 👤 **Profile** — Employee info with role-based pay rates
- 🌙 **Dark mode** — System-aware + manual toggle
- 📱 **PWA** — Installable as a native-like app on iOS and Android
- 💾 **Offline-first** — All data stored in localStorage, no backend needed

## Pay Rules Implemented

| Type | Rate |
|------|------|
| Crew | ₱75/hr |
| Crew Trainer | ₱77/hr |
| Overtime (after 8h) | 125% of hourly rate |
| Night Differential (10PM–6AM) | +10% |
| Special Holiday | +30% (130%) |
| Regular Holiday | Double pay (200%) |

## Cutoff Periods

- **Cutoff 1:** Day 1–15 of each month
- **Cutoff 2:** Day 16–end of each month

## Setup

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Deploy — `vercel.json` handles the config automatically

Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI (Card, Button, Input, Modal)
│   ├── layout/       # BottomNav
│   ├── dashboard/    # Home dashboard
│   ├── timetracking/ # Time entry log
│   ├── calendar/     # Calendar view
│   ├── reports/      # Reports & payroll
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
