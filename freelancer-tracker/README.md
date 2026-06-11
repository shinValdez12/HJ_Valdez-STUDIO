# Freelancer Project Tracker

A production-ready SaaS platform for freelancers to manage projects internally and share progress with clients professionally.

## 🎯 Product Goal

Enable freelancers to:
- Manage projects and tasks internally
- Track progress and deadlines
- Share professional project updates with clients
- Prevent scope creep with scope lock system
- Generate automated weekly reports

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (Supabase/Neon recommended)
- **Validation**: Zod
- **Deployment**: Vercel-ready

---

## 📁 Project Structure

```
freelancer-tracker/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (login, signup)
│   ├── dashboard/           # Freelancer dashboard
│   ├── projects/[id]/       # Project detail pages
│   ├── client-view/[token]/ # Public client view (token-based)
│   └── layout.tsx           # Root layout
│
├── features/                # Feature-based modules
│   ├── projects/            # Project CRUD logic
│   ├── tasks/               # Task management
│   ├── clients/             # Client management
│   └── reports/             # Weekly report generation
│
├── components/              # Reusable React components
│   ├── ui/                  # Base UI components
│   └── shared/              # Shared components
│
├── lib/
│   ├── db/                  # Database client & queries
│   ├── utils/               # Helper functions
│   └── validators/          # Zod schemas
│
├── prisma/
│   └── schema.prisma        # Database schema
│
├── DATABASE_ARCHITECTURE.md # Detailed schema documentation
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Supabase/Neon)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 📊 PHASE 1 Completion Checklist

✅ **Folder Structure**
- Feature-based organization
- Clear separation of concerns
- Scalable for solo developer

✅ **Database Schema**
- Complete Prisma schema with all core entities
- User & authentication models
- Project & task system
- Scope lock system
- Activity logging
- Client access tokens
- Weekly reports

✅ **Data Models**
- 11 core entities with proper relationships
- Cascade delete rules defined
- Indexes for performance
- Validation constraints

✅ **Configuration Files**
- TypeScript (strict mode)
- Next.js (App Router optimized)
- Tailwind CSS (extended theme)
- PostCSS setup

✅ **Validation Schemas**
- Zod schemas for all inputs
- Type-safe TypeScript exports
- No "any" types allowed

✅ **Utility Functions**
- Date formatting and calculation
- Number formatting (currency, duration)
- Helper functions for common operations

✅ **Documentation**
- Complete architecture guide
- Relationship diagrams
- Query patterns
- Development guidelines

---

## � PHASE 2 Completion Checklist

✅ **Authentication System**
- JWT-based authentication with jose library
- Password hashing with bcryptjs
- Login/signup Server Actions with error handling
- Protected routes with middleware
- Role-based redirects (freelancer vs client)

✅ **Database Utilities**
- Comprehensive query functions for all entities
- Activity logging system
- Client access token validation
- Weekly report queries

✅ **Project CRUD Backend**
- Create, read, update, delete projects
- Server Actions with validation
- Activity logging for all changes
- Authorization checks (freelancer ownership)

✅ **Task Management Backend**
- Create, update, delete tasks
- Status tracking with proper enums
- Time estimation and tracking
- Project relationship validation

✅ **Server Actions Architecture**
- Type-safe form handling with useActionState
- Zod validation on all inputs
- Error handling and user feedback
- Proper redirects after mutations

---

## 🗂️ Core Features Implemented

### Users & Auth
- **User**: Central authentication (freelancer or client)
- **Freelancer**: Freelancer profile with rate and timezone
- **Client**: Client profile linked to freelancer

### Projects & Tasks
- **Project**: Core project entity with timeline and budget
- **Task**: Individual work items with status tracking
- **ActivityLog**: Complete audit trail of all changes

### Scope & Access
- **ScopeItem**: Explicit scope boundaries for change management
- **ClientAccessToken**: Token-based public access for clients

### Analytics
- **WeeklyReport**: Pre-generated weekly summaries

---

## 🔐 Architecture Highlights

### No Invalid States
- Status enums prevent bad transitions
- Foreign key constraints enforce data integrity
- Validation at schema level

### Performance Optimized
- Strategic indexes on frequently queried columns
- Cascade delete to prevent orphaned records
- Activity logs for efficient reporting

### Scalable Design
- Feature-based folder structure
- Loose coupling between features
- Server-first architecture (minimizes client bundle)

---

## 📈 Development Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **1** | Foundation & Database | ✅ Complete |
| **2** | Auth & Core Backend | ✅ Complete |
| **3** | Dashboard UI & Components | 🔄 Next |
| **4** | Client View System | ⏳ Planned |
| **5** | Advanced Features | ⏳ Planned |

---

## 🧪 Code Quality Standards

- **TypeScript**: Strict mode, no "any"
- **Validation**: Zod schemas on all inputs
- **Components**: Server Components by default
- **Performance**: Server Actions for mutations
- **DRY**: Reusable components and logic

---

## 📖 Documentation

- [DATABASE_ARCHITECTURE.md](DATABASE_ARCHITECTURE.md) - Complete schema documentation
- [.env.example](.env.example) - Environment configuration template

---

## 🤝 Contributing

This is a solo developer project, but following these principles:
- One feature at a time
- All tests pass before commit
- Clear commit messages
- Document complex logic

---

## 📝 License

MIT

---

## 📞 Support

For issues or questions, refer to the architecture documentation.

**Next Steps (PHASE 2):**
✅ Implement authentication system
✅ Create project CRUD Server Actions  
✅ Build task management backend
✅ Set up database utilities

