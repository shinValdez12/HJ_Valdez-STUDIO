# PHASE 2 Implementation Plan

Detailed plan for implementing authentication and core backend logic.

---

## 🎯 PHASE 2 Goals

1. ✅ Complete authentication system (signup/login)
2. ✅ Implement user roles (freelancer vs client)
3. ✅ Create project CRUD operations
4. ✅ Build task management backend
5. ✅ Set up activity logging
6. ✅ Database query helpers

---

## 📋 Implementation Checklist

### Authentication System

**File**: `features/auth/`

- [ ] **`server-actions.ts`** - Auth mutations
  ```typescript
  - signup(input: SignUpInput) -> User
  - login(input: LoginInput) -> Session Token
  - logout() -> void
  - getCurrentUser() -> User | null
  ```

- [ ] **`queries.ts`** - User lookups
  ```typescript
  - getUserByEmail(email: string) -> User | null
  - getUser(id: string) -> User | null
  - getFreelancer(userId: string) -> Freelancer | null
  - getClient(userId: string) -> Client | null
  ```

- [ ] **`middleware.ts`** - Auth middleware
  ```typescript
  - verifyToken(token: string) -> User
  - requireAuth(request) -> redirect if not authenticated
  - requireRole(role: UserRole) -> redirect if wrong role
  ```

- [ ] **`session.ts`** - Session management
  ```typescript
  - createSession(userId: string) -> token
  - getSession(token: string) -> Session | null
  - deleteSession(token: string) -> void
  ```

**Features**:
- Password hashing with bcrypt
- JWT token generation/verification
- Session storage (Redis or DB)
- Protected routes middleware

### Project Management

**File**: `features/projects/`

- [ ] **`server-actions.ts`** - Project mutations
  ```typescript
  - createProject(input, freelancerId)
  - updateProject(id, input, freelancerId)
  - deleteProject(id, freelancerId)
  - changeProjectStatus(id, status, freelancerId)
  ```

- [ ] **`queries.ts`** - Project queries
  ```typescript
  - getProject(id) -> Project with relations
  - getProjectsByFreelancer(freelancerId)
  - getProjectsByClient(clientId)
  - getProjectWithStats(id) -> includes completion %
  ```

- [ ] **`types.ts`** - Types
  ```typescript
  - ProjectWithStats
  - ProjectWithTasks
  - ProjectWithClient
  ```

**Features**:
- Full project lifecycle (CRUD)
- Status transitions with validation
- Auto-calculate completion percentage
- Client assignment

### Task Management

**File**: `features/tasks/`

- [ ] **`server-actions.ts`** - Task mutations
  ```typescript
  - createTask(input, projectId)
  - updateTask(id, input)
  - deleteTask(id)
  - updateTaskStatus(id, status)
  - logTimeSpent(id, minutes)
  - blockTask(id, reason)
  ```

- [ ] **`queries.ts`** - Task queries
  ```typescript
  - getTask(id)
  - getProjectTasks(projectId)
  - getTasksByStatus(projectId, status)
  - getOverdueTasks(freelancerId)
  ```

**Features**:
- Task creation within projects
- Status workflow (BACKLOG → TODO → IN_PROGRESS → REVIEW → COMPLETED)
- Time tracking
- Blocking/unblocking with reasons
- Deadline tracking

### Activity Logging

**File**: `features/reports/`

- [ ] **`activity.ts`** - Activity utilities
  ```typescript
  - logActivity(projectId, type, title, data?)
  - getProjectActivity(projectId, days = 7)
  - getActivityByType(type, projectId)
  ```

**Features**:
- Automatic logging on all mutations
- Rich metadata for each event
- Query support for reports

### Database Helpers

**File**: `lib/db/`

- [ ] **`projects.ts`** - Project queries
- [ ] **`tasks.ts`** - Task queries
- [ ] **`users.ts`** - User queries
- [ ] **`clients.ts`** - Client queries

---

## 🔐 Authentication Implementation Details

### Password Hashing

```typescript
// lib/utils/crypto.ts
import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

### JWT Sessions

```typescript
// features/auth/session.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export function createToken(userId: string): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string }
  } catch {
    return null
  }
}
```

### Protected Routes

```typescript
// app/dashboard/layout.tsx
import { getCurrentUser } from '@/features/auth/queries'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div>
      {/* Dashboard header/nav */}
      {children}
    </div>
  )
}
```

---

## 📊 Project CRUD Pattern

### Create Project

```typescript
// features/projects/server-actions.ts
'use server'

export async function createProject(
  input: unknown,
  freelancerId: string
) {
  // 1. Validate
  const parsed = CreateProjectSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid input' }

  // 2. Create in DB
  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      freelancerId,
    },
  })

  // 3. Log activity
  await logActivity(project.id, 'PROJECT_CREATED', `Created project "${project.name}"`)

  // 4. Revalidate cache
  revalidatePath('/dashboard')

  return { success: true, data: project }
}
```

### Update Project

```typescript
'use server'

export async function updateProject(
  id: string,
  input: unknown,
  freelancerId: string
) {
  // Verify ownership
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project || project.freelancerId !== freelancerId) {
    throw new Error('Unauthorized')
  }

  // Validate input
  const parsed = UpdateProjectSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid input' }

  // Update
  const updated = await prisma.project.update({
    where: { id },
    data: parsed.data,
  })

  // Log if status changed
  if (parsed.data.status && parsed.data.status !== project.status) {
    await logActivity(
      id,
      'PROJECT_STATUS_CHANGED',
      `Status changed from ${project.status} to ${parsed.data.status}`
    )
  }

  revalidatePath('/dashboard')
  return { success: true, data: updated }
}
```

---

## 📈 Project Completion Calculation

```typescript
// features/projects/queries.ts
export async function calculateProjectCompletion(
  projectId: string
): Promise<number> {
  const tasks = await prisma.task.findMany({
    where: { projectId },
    select: {
      id: true,
      status: true,
    },
  })

  if (tasks.length === 0) return 0

  const completed = tasks.filter(
    (t) => t.status === 'COMPLETED'
  ).length

  return Math.round((completed / tasks.length) * 100)
}

// Update project after task changes
export async function updateProjectCompletion(
  projectId: string
) {
  const percentage = await calculateProjectCompletion(projectId)

  await prisma.project.update({
    where: { id: projectId },
    data: { completionPercentage: percentage },
  })
}
```

---

## 🎯 API Routes Structure

Create minimal API routes for:

```typescript
// app/api/projects/route.ts
export async function GET() { /* list */ }
export async function POST() { /* create */ }

// app/api/projects/[id]/route.ts
export async function GET() { /* get */ }
export async function PUT() { /* update */ }
export async function DELETE() { /* delete */ }

// app/api/tasks/route.ts
export async function POST() { /* create */ }

// app/api/auth/login/route.ts
export async function POST() { /* login */ }

// app/api/auth/signup/route.ts
export async function POST() { /* signup */ }
```

---

## 🔄 Server Action Patterns

All server actions should follow this structure:

```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { error: string; details?: unknown }

async function serverAction(): Promise<ActionResult<T>> {
  try {
    // 1. Validate input
    // 2. Check permissions
    // 3. Execute business logic
    // 4. Log activity
    // 5. Revalidate cache
    // 6. Return success
  } catch (error) {
    console.error('[action]', error)
    return { error: 'Action failed' }
  }
}
```

---

## 🧪 Testing Priorities

Test these critical flows:

1. **Auth**
   - Signup with valid/invalid data
   - Login succeeds/fails
   - Sessions expire
   - Unauthorized access blocked

2. **Projects**
   - Create project
   - Update project
   - Change status
   - Delete project
   - Permissions enforced

3. **Tasks**
   - Create task in project
   - Update task status
   - Block/unblock task
   - Time tracking

---

## 📁 File Tree After PHASE 2

```
features/
├── auth/
│   ├── server-actions.ts
│   ├── queries.ts
│   ├── session.ts
│   ├── middleware.ts
│   └── types.ts
├── projects/
│   ├── server-actions.ts
│   ├── queries.ts
│   ├── types.ts
│   └── server.ts
├── tasks/
│   ├── server-actions.ts
│   ├── queries.ts
│   └── types.ts
└── reports/
    ├── activity.ts
    └── queries.ts

lib/
├── db/
│   ├── projects.ts
│   ├── tasks.ts
│   ├── users.ts
│   └── clients.ts
└── utils/
    └── crypto.ts

app/
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/
│   ├── page.tsx
│   └── layout.tsx
└── api/
    ├── auth/
    ├── projects/
    └── tasks/
```

---

## 📊 Environment Variables

Add to `.env.local`:

```env
# Auth
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Optional: Email for notifications
SENDGRID_API_KEY=""
```

---

## ✅ PHASE 2 Completion Criteria

- [ ] Users can signup/login
- [ ] Freelancers can create projects
- [ ] Projects display on dashboard
- [ ] Tasks can be created in projects
- [ ] Task status can be updated
- [ ] Activity logs are recorded
- [ ] All data properly validated
- [ ] No unauthorized access allowed
- [ ] Tests passing
- [ ] Code reviewed for quality

---

## 🚀 Next Steps After PHASE 2

PHASE 3 focuses on UI/UX:
- Dashboard layouts
- Project detail page
- Task management UI
- Real-time updates

PHASE 4 focuses on client view:
- Token-based public access
- Professional presentation UI
- Animation and transitions

PHASE 5 focuses on advanced features:
- Scope lock system
- Weekly report generator
- Deadline risk indicators
- Analytics and reporting

