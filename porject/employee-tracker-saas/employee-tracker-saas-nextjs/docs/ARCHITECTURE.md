# Workforce Management SaaS - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Problems Solved](#problems-solved)
3. [How It Works](#how-it-works)
4. [System Architecture](#system-architecture)
5. [Database Schema (Simulated)](#database-schema-simulated)
6. [Getting Started](#getting-started)
7. [Features Guide](#features-guide)
8. [Security & Offline](#security--offline)
9. [Future Roadmap](#future-roadmap)

---

## Project Overview

### What is This?

**Workforce Management SaaS** is a comprehensive, production-ready demo of a hybrid workforce management platform designed for enterprises with diverse employee work arrangements (onsite, work-from-home, hybrid).

### Why It Exists

This is a **demo showcase project** created for:
- **Clients**: Demonstrating capabilities and user experience
- **Investors**: Showing product viability and market fit
- **Portfolio**: Showcasing professional-grade SaaS development
- **Presentations**: Providing interactive, tangible proof of concept

### Key Characteristics

✅ **100% Demo/Mock Data** - No real backend, no database, all static/simulated
✅ **Production-Ready UI/UX** - Enterprise-grade design and interactions
✅ **Full-Featured Demo** - All core features implemented and interactive
✅ **Scalable Architecture** - Built with modularity and extensibility in mind
✅ **Modern Tech Stack** - Next.js, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui

---

## Problems Solved

### 1. **Manual Attendance Tracking**
**Problem**: Companies with hybrid workforces struggle with manual attendance logs, spreadsheets, and unreliable data.

**Solution**: 
- Automated attendance tracking via check-in/check-out system
- Kiosk mode for office-based employees
- Digital badges and device detection simulation
- Real-time attendance status dashboard

### 2. **Hybrid Workforce Complexity**
**Problem**: Managing employees across onsite, WFH, and hybrid arrangements is chaotic.

**Solution**:
- Centralized employee directory with work mode tracking
- Department and position management
- Customizable scheduling for different work arrangements
- Work mode-specific reporting

### 3. **Leave Management Chaos**
**Problem**: Leave requests, approvals, and balance tracking across systems is error-prone.

**Solution**:
- Streamlined leave request workflow
- Multi-type leave support (sick, vacation, emergency, maternity, personal)
- Real-time leave balance tracking
- Approval queue with audit trail simulation

### 4. **Weak Attendance Visibility**
**Problem**: Management lacks real-time visibility into workforce attendance patterns.

**Solution**:
- Live dashboard with present/absent/late counts
- Weekly attendance trend charts
- Department-wise performance metrics
- Attendance rate calculations and KPIs

### 5. **Difficult Payroll Preparation**
**Problem**: HR spends weeks preparing payroll, reconciling absences and overtime.

**Solution**:
- Attendance-based payroll preview
- Overtime calculations
- Leave deduction automation
- Export-ready reports (simulated PDF/CSV)

### 6. **Poor Leave Visibility**
**Problem**: No centralized view of who's on leave and when.

**Solution**:
- Holiday calendar with employee leave overlay
- Department-specific holiday support
- Leave balance visibility for all roles
- Leave history and trends

### 7. **Communication Gaps**
**Problem**: Important announcements don't reach the right people efficiently.

**Solution**:
- Centralized announcement system
- Priority levels (urgent, high, medium, low)
- Department-specific announcements
- Pinned important updates
- Read/unread tracking

### 8. **Lack of Compliance & Audit**
**Problem**: No audit trail for HR decisions and system actions.

**Solution**:
- Activity logging for all user actions
- Timestamp and device tracking simulation
- Role-based access control
- Security dashboard with session management

---

## How It Works

### **Attendance Workflow**

```
1. Employee Arrives
   ↓
2. Check-In via Kiosk/Mobile/Web
   ↓
3. System Records Time, Device, Location
   ↓
4. Status Updates: Present/Late/Absent
   ↓
5. Dashboard Reflects Attendance
   ↓
6. Payroll Uses Data for Calculations
```

### **Leave Request Workflow**

```
1. Employee Initiates Leave Request
   ↓
2. Selects Leave Type & Dates
   ↓
3. Provides Reason (Optional)
   ↓
4. Submits to Manager/Admin
   ↓
5. Approval Queue
   ↓
6. Status: Approved/Rejected/Pending
   ↓
7. Leave Balance Updated
   ↓
8. Calendar Reflects Leave
```

### **Scheduling Workflow**

```
1. Admin Creates Schedule
   ↓
2. Assigns Employees to Shifts
   ↓
3. Sets Work Mode (Onsite/WFH/Hybrid)
   ↓
4. Employees View Schedule
   ↓
5. Can Request Changes
   ↓
6. Admin Approves/Rejects
```

### **Offline Sync Workflow** (Simulated)

```
1. Employee Checks In (Offline)
   ↓
2. Action Queued Locally
   ↓
3. "Pending Sync" Badge Shows
   ↓
4. Connection Restored
   ↓
5. Automatic Sync Attempt
   ↓
6. Success → Queued Item Removed
   7. Failure → Retry with Error Log
```

---

## System Architecture

### **Frontend Architecture**

```
Next.js App Router (Server Components + Client Components)
    ↓
├── Authentication Layer (AuthProvider, useAuth hook)
│   └── Session Management
│
├── Layout System
│   ├── RootLayout (Global context)
│   └── DashboardLayout (Role-based)
│
├── Pages
│   ├── /auth/* (Login, Register, Password Reset)
│   ├── /admin/* (Admin Dashboard, Management)
│   ├── /employee/* (Employee Dashboard)
│   └── / (Home Redirect)
│
├── Components
│   ├── /layouts (Dashboard wrappers)
│   ├── /dashboards (Dashboard implementations)
│   ├── /features (Feature-specific components)
│   └── /ui (shadcn/ui components)
│
├── Services
│   └── auth.ts (Authentication logic)
│
├── Mock Data
│   ├── generators.ts (Realistic data generation)
│   └── store.ts (Centralized mock data store)
│
├── Hooks
│   └── useAuth.tsx (Authentication context hook)
│
├── Types
│   └── index.ts (TypeScript interfaces)
│
└── Lib
    └── utilities (Helper functions)
```

### **State Management**

- **Local State**: React useState for component-level state
- **Global State**: Auth context for user session
- **Mock Store**: Singleton pattern for data access
- **Browser Storage**: LocalStorage for session persistence

### **Component Architecture**

```
Atomic Design Pattern:
- Atoms: UI components (Button, Input, Badge)
- Molecules: Feature components (MetricCard, LoginForm)
- Organisms: Page sections (Dashboard, EmployeeDirectory)
- Templates: Full pages (AdminDashboard, LoginPage)
```

---

## Routes (quick reference)

- `/` — Redirects to dashboard or login
- `/auth/login` — Login UI
- `/admin` — Admin dashboard (metrics, charts)
- `/admin/attendance` — Attendance management
- `/admin/leaves` — Leave approvals
- `/admin/reports` — Reports & exports (CSV/PDF simulated)
- `/admin/calendar` — Calendar & holidays
- `/admin/documents` — Document vault (admin view)
- `/admin/departments` — Departments CRUD
- `/admin/positions` — Positions CRUD
- `/admin/security` — Device & security admin
- `/employee` — Employee dashboard
- `/employee/leaves` — Employee leave requests
- `/employee/calendar` — Personal calendar
- `/employee/documents` — Personal documents vault

## Contributing Notes

- To extend data models, update `src/types/index.ts` and add generators in `src/mock/generators.ts`.
- Add mock behaviors to `src/mock/store.ts` and access them via `mockDataStore` across the app.
- Run `pnpm dev` to test changes locally. Use `pnpm build` to validate TypeScript and production bundling.


## Database Schema (Simulated)

### **Users Table**
```typescript
{
  id: string (Primary Key)
  email: string (Unique)
  name: string
  avatar?: string
  departmentId: string (FK → Departments)
  positionId: string (FK → Positions)
  role: "super_admin" | "department_admin" | "employee"
  workMode: "onsite" | "wfh" | "hybrid"
  joinDate: Date
  phone?: string
  reportingManagerId?: string (FK → Users)
  status: "active" | "on_leave" | "inactive"
}

Relationships:
- Many Users → One Department
- Many Users → One Position
- Many Users → One Manager (self-referencing)
```

### **Departments Table**
```typescript
{
  id: string (Primary Key)
  name: string (Unique)
  description: string
  headId?: string (FK → Users)
  budget?: number
  employeeCount: number
  createdAt: Date
}

Relationships:
- One Department → Many Users
- One Department → Many Positions
- Optional: One Department Head → One User
```

### **Positions Table**
```typescript
{
  id: string (Primary Key)
  title: string
  description: string
  departmentId: string (FK → Departments)
  baseSalary?: number
  level: "entry" | "mid" | "senior" | "lead" | "manager" | "director"
  createdAt: Date
}

Relationships:
- Many Positions → One Department
- Many Users → One Position
```

### **AttendanceLogs Table**
```typescript
{
  id: string (Primary Key)
  employeeId: string (FK → Users)
  date: Date
  timeIn?: DateTime
  timeOut?: DateTime
  breakStartTime?: DateTime
  breakEndTime?: DateTime
  totalHours?: number
  status: "present" | "absent" | "late" | "half_day" | "on_leave"
  deviceInfo?: string
  locationInfo?: string
  notes?: string
}

Relationships:
- Many AttendanceLogs → One User
- Indexes: (employeeId, date), (date)
```

### **LeaveRequests Table**
```typescript
{
  id: string (Primary Key)
  employeeId: string (FK → Users)
  leaveType: "sick" | "vacation" | "emergency" | "maternity" | "personal"
  startDate: Date
  endDate: Date
  numberOfDays: number
  reason?: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  approvedBy?: string (FK → Users)
  approvedAt?: DateTime
  createdAt: Date
}

Relationships:
- Many LeaveRequests → One User
- Many LeaveRequests → One Approver (optional)
```

### **LeaveBalances Table**
```typescript
{
  id: string (Primary Key)
  employeeId: string (FK → Users)
  leaveType: "sick" | "vacation" | "emergency" | "maternity" | "personal"
  totalDays: number
  usedDays: number
  remainingDays: number
  year: number
}

Relationships:
- Many Balances → One User
- Unique: (employeeId, leaveType, year)
```

### **Holidays Table**
```typescript
{
  id: string (Primary Key)
  name: string
  date: Date
  type: "national" | "company" | "department_specific"
  departmentIds?: string[] (FK → Departments)
  description?: string
}

Relationships:
- Many Holidays → Many Departments (optional)
```

### **Announcements Table**
```typescript
{
  id: string (Primary Key)
  title: string
  content: string
  authorId: string (FK → Users)
  priority: "low" | "medium" | "high" | "urgent"
  departmentIds?: string[] (FK → Departments)
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
  readBy: string[] (User IDs)
}

Relationships:
- Many Announcements → One Author (User)
- Many Announcements → Many Departments (optional)
```

### **ActivityLogs Table**
```typescript
{
  id: string (Primary Key)
  userId: string (FK → Users)
  action: string
  entityType: "attendance" | "leave" | "user" | "announcement" | "schedule" | "document"
  entityId: string
  changes?: Record<string, unknown>
  ipAddress?: string
  deviceInfo?: string
  timestamp: Date
}

Relationships:
- Many ActivityLogs → One User
- Indexes: (userId, timestamp), (timestamp)
```

### **EmployeeDocuments Table**
```typescript
{
  id: string (Primary Key)
  employeeId: string (FK → Users)
  documentType: "contract" | "id_proof" | "certificate" | "license" | "insurance" | "other"
  fileName: string
  uploadedAt: Date
  expiryDate?: Date
  status: "active" | "expired" | "pending_renewal"
  url?: string
}

Relationships:
- Many Documents → One User
```

### **SyncQueue Table** (For Offline Support)
```typescript
{
  id: string (Primary Key)
  action: "create" | "update" | "delete"
  entityType: string
  entityId: string
  payload: object
  timestamp: Date
  synced: boolean
  syncedAt?: Date
}
```

---

## Getting Started

### **Prerequisites**

- Node.js 18+ (LTS recommended)
- pnpm 10+ (package manager requirement)

### **Installation**

```bash
# Clone or navigate to project directory
cd workforce-demo

# Install dependencies with pnpm
pnpm install

# Install additional shadcn/ui components (if needed)
pnpm dlx shadcn@latest add card button input table tabs badge avatar dropdown-menu dialog

```

### **Running Locally**

```bash
# Development server (hot reload)
pnpm dev

# Open browser
# Navigate to http://localhost:3000
# You'll be redirected to login page
```

### **Build for Production**

```bash
# Create optimized build
pnpm build

# Start production server
pnpm start
```

### **Demo Credentials**

**Three pre-configured demo accounts:**

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@workforce.demo` | `demo123` |
| Department Manager | `manager@workface.demo` | `demo123` |
| Employee | `employee@workface.demo` | `demo123` |

Each role shows different features and permissions.

---

## Features Guide

### **1. Authentication System**

**Login Page**
- Three quick-select buttons for different roles
- Credentials auto-filled for convenience
- Animated transitions
- Session persistence (localStorage)

**Demo Accounts**
- Super Admin: Full system access
- Department Admin: Department-level management
- Employee: Personal dashboard only

### **2. Admin Dashboard**

**Metrics Section**
- Total employees count
- Present today
- On leave count
- Late employees count
- Average attendance rate
- Pending leave requests

**Charts & Analytics**
- Weekly attendance trend line chart
- Department distribution pie chart
- Activity logs
- Announcements feed

**Quick Actions**
- Approve/reject leave requests
- View pending approvals
- Latest announcements

### **3. Employee Dashboard**

**Personal Metrics**
- Today's check-in/out status
- Attendance rate percentage
- Leave balance (vacation, sick, etc.)
- Work mode display

**Quick Actions**
- Check In button
- Check Out button
- Request Leave button

**Information Sections**
- Leave balance breakdown with progress bars
- Recent activity logs
- Company announcements

### **4. Attendance Tracking**

**Desktop Mode**
- Employee search and filtering
- Check-in/check-out buttons for each employee
- Real-time status updates
- Department display
- Work mode badges

**Kiosk Mode**
- Full-screen tablet interface
- Large touch-friendly buttons
- Employee selection grid
- Simplified check-in/out
- Exit option

### **5. Leave Management** (Simulated)

**Features**
- Leave request form
- Leave type selection
- Date range picker
- Multiple leave types
- Leave balance tracking
- Request history
- Status tracking (pending/approved/rejected)

### **6. Employee Directory**

**Features**
- Searchable employee list
- Filter by department
- Filter by work mode
- Attendance rate display
- Quick contact info
- Department info

### **7. Reports & Analytics**

**Available Reports**
- Attendance reports (CSV export simulated)
- Overtime reports
- Payroll preview
- Leave summaries
- Department performance

### **8. Announcements**

**Features**
- Priority levels (urgent, high, medium, low)
- Pinned announcements
- Department-specific announcements
- Read/unread status
- Recent announcements on dashboard

### **9. Security Dashboard** (Simulated)

**Features**
- Active sessions view
- Device management
- Two-factor authentication toggle
- Login history
- Activity logs

### **10. Holiday & Calendar Management**

**Features**
- Holiday calendar
- National holidays
- Company holidays
- Department-specific holidays
- Leave overlay on calendar

---

## Security & Offline

### **Security Concepts** (Production Would Implement)

**Authentication**
- JWT token-based authentication
- Secure session management
- Password hashing (bcrypt)
- Account lockout after failed attempts
- Session expiration

**Authorization**
- Role-based access control (RBAC)
- Permission-based routes
- Data-level access control
- Department isolation

**Audit & Compliance**
- Activity logging for all actions
- IP address and device tracking
- Timestamp on all records
- Immutable audit trail
- GDPR compliance ready

**Data Protection**
- Encryption at rest
- HTTPS/TLS in transit
- Rate limiting on APIs
- CSRF protection
- XSS prevention

**Advanced Security**
- Two-factor authentication (2FA)
- Biometric authentication support
- Attendance via facial recognition (simulated)
- SSL certificate pinning
- API key rotation

### **Offline Mode** (Simulated)

**Current Implementation (Demo)**
- Shows "Offline" banner when simulated
- Queues attendance actions
- Displays pending sync count
- Shows sync failures
- Simulates reconnection

**Production Would Support**
- Service workers for offline support
- IndexedDB for local data storage
- Automatic sync queue management
- Conflict resolution
- Sync status notifications

---

## Future Roadmap

### **Phase 2: Advanced Analytics**

- AI-powered attendance predictions
- Anomaly detection for unusual patterns
- Department performance benchmarking
- Employee engagement metrics
- Predictive leave forecasting

### **Phase 3: Mobile & Biometrics**

- Native iOS/Android app
- Facial recognition integration
- Fingerprint authentication
- Geofencing-based check-in
- Mobile notifications

### **Phase 4: Payroll Integration**

- Real bank API integration
- Automated salary processing
- Tax calculation engine
- Statutory compliance (PF, ESI, etc.)
- Expense reimbursement

### **Phase 5: Real-time Collaboration**

- Team chat integration
- Video conferencing
- Project timesheet tracking
- Task management
- Resource allocation

### **Phase 6: HR Workflows**

- Recruitment workflow
- Onboarding automation
- Performance management
- Training & development
- Employee promotions

### **Phase 7: Integrations**

- Slack integration
- Teams integration
- Google Workspace
- Office 365
- HRIS platforms

### **Phase 8: Enterprise Features**

- Multi-company support
- Custom workflow builder
- API marketplace
- White-label options
- Advanced reporting engine

---

## Tech Stack Details

### **Frontend**
- **Next.js 16.2**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS
- **Framer Motion**: Animation library
- **shadcn/ui**: Component library
- **Lucide React**: Icon library
- **Recharts**: Charting library
- **date-fns**: Date utilities
- **Sonner**: Toast notifications

### **Development Tools**
- **pnpm**: Package manager
- **ESLint**: Code linting
- **TypeScript**: Static type checking

### **Deployment Options**
- Vercel (recommended for Next.js)
- AWS (EC2, Amplify, ECS)
- Google Cloud
- Azure
- Self-hosted Docker

---

## Support & Contact

This is a **demo/showcase project**. For production implementation:

1. Backend development needed
2. Real database setup (PostgreSQL, MongoDB, etc.)
3. Authentication server
4. API gateway
5. DevOps and deployment
6. Security hardening

---

**Last Updated**: May 2024
**Version**: 1.0.0 (Demo)
**Status**: Production-Ready UI/UX, Mock Data Implementation
