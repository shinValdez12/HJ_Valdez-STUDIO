# Workforce Management SaaS Platform

> Enterprise-Grade Hybrid Workforce Management — Demo & Reference

![Status](https://img.shields.io/badge/status-demo-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Package Manager](https://img.shields.io/badge/package%20manager-pnpm-orange)

This repository contains a frontend-only, production-quality demo of a hybrid workforce management SaaS. It is built for showcasing features, running interactive demos, and serving as a reference implementation for UI/UX and architecture.

Key highlights:

- 100% mock data (no external backend required)
- Modern stack: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- Feature-complete demo: attendance, leave workflows, reporting, calendar, docs vault, security pages
- pnpm-first project

---

## Quick Start

Requirements:

- Node.js 18+ (LTS recommended)
- pnpm

Install & run:

```powershell
pnpm install
pnpm dev
# Open http://localhost:3000
```

Build & run production:

```powershell
pnpm build
pnpm start
```

---

## Demo Accounts

- Super Admin: admin@workforce.demo / demo123
- Department Manager: manager@workface.demo / demo123
- Employee: employee@workface.demo / demo123

Tip: the login page includes role quick-fill buttons.

---

## Notable Routes (demo)

- `/auth/login` — login page
- `/admin` — admin dashboard
- `/admin/attendance` — attendance management
- `/admin/leaves` — leave approvals
- `/admin/reports` — reports & exports
- `/admin/calendar` — calendar & holidays
- `/admin/documents` — documents vault (admin)
- `/admin/departments` — manage departments
- `/admin/positions` — manage positions
- `/admin/security` — device & security admin
- `/employee` — employee dashboard
- `/employee/leaves` — submit leave
- `/employee/calendar` — personal calendar
- `/employee/documents` — personal documents vault

---

## Project Structure (short)

`src/mock` contains the in-memory `MockDataStore` and realistic generators. UI pages live under `src/app` organized by role (`admin`, `employee`, `auth`).

## Contributing / Extending

- Add new mock behaviors in `src/mock/store.ts` and `src/mock/generators.ts`.
- Follow the existing `useAuth` context for auth flows.
- Components use `shadcn/ui` patterns — run `pnpm dlx shadcn@latest` to regenerate components if needed.

---

## License

MIT

---

Last updated: June 2026
- Announcements
- Reports

### Phase 2 (Next)
- Calendar integration
- Advanced analytics
- Performance tracking
- Mobile app
- Real-time notifications

### Phase 3 (Future)
- AI analytics engine
- Facial recognition
- Payroll API integration
- Team collaboration
- Multi-language support

## 🧪 Development

### Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build production
pnpm start            # Start production server

# Code quality
pnpm lint             # Run ESLint

# Dependencies
pnpm add <pkg>        # Add dependency
pnpm remove <pkg>     # Remove dependency
pnpm update           # Update dependencies

# Components
pnpm dlx shadcn@latest add <component>  # Add shadcn component
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

This demo is meant for learning and showcasing. To contribute:

1. Follow existing code patterns
2. Use TypeScript throughout
3. Add proper component documentation
4. Test responsive design
5. Ensure animations are smooth
6. Update documentation

## 📄 License

MIT License - Free for commercial and personal use

## 📞 Support

- Check `/docs` for detailed documentation
- Review component code in `/src/components`
- Explore mock data in `/src/mock`
- Read architecture guide in `/docs/ARCHITECTURE.md`

## 🙏 Acknowledgments

Built with:
- Next.js & React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Recharts
- pnpm

---

**Status:** ✅ Production-Ready Demo v1.0
**Last Updated:** May 2024
**Perfect For:** Demos, Portfolios, Learning

**Made with ❤️ for SaaS builders**
