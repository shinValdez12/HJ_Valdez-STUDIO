# Development Guide

A comprehensive guide for developing the Freelancer Project Tracker consistently and efficiently.

---

## 🎯 Core Principles

1. **Server-First**: Use Server Components and Server Actions by default
2. **Type Safety**: No "any" types - TypeScript strict mode always
3. **Validation**: Zod validation on all inputs
4. **Performance**: Optimize for solo developer maintenance
5. **DRY**: Reuse components and logic aggressively
6. **Clear Naming**: Self-documenting code

---

## 📁 File Organization

### Component Structure

```
components/
  ├── ui/
  │   ├── Button.tsx          # Base reusable component
  │   ├── Card.tsx
  │   └── Input.tsx
  └── shared/
      ├── Navbar.tsx          # Cross-feature shared
      ├── Footer.tsx
      └── ErrorBoundary.tsx

features/
  ├── projects/
  │   ├── components/         # Feature-specific components
  │   │   ├── ProjectCard.tsx
  │   │   └── ProjectForm.tsx
  │   ├── server-actions.ts   # Server Actions
  │   ├── queries.ts          # Database queries
  │   └── types.ts            # Feature types
```

### Server Actions Location

**Rule**: Place Server Actions in feature folders, NOT in /app routes.

```
features/projects/server-actions.ts

// Usage in route
'use server'
import { createProject } from '@/features/projects/server-actions'
```

---

## 🧩 Building Components

### Server Component Example

```typescript
// components/ui/Button.tsx
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  onClick,
}: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  }

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`btn-base ${variants[variant]} ${sizes[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Client Component (Minimal)

Only use `'use client'` when you need interactivity.

```typescript
'use client'

import { useState } from 'react'

interface ClientFormProps {
  onSubmit: (data: FormData) => Promise<void>
}

export function ClientForm({ onSubmit }: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 🔄 Server Actions Pattern

### Standard Server Action

```typescript
// features/projects/server-actions.ts
'use server'

import { prisma } from '@/lib/db/client'
import { CreateProjectSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createProject(
  input: unknown,
  freelancerId: string
) {
  // 1. Validate input
  const parsed = CreateProjectSchema.safeParse(input)
  if (!parsed.success) {
    return {
      error: 'Invalid input',
      details: parsed.error.flatten(),
    }
  }

  try {
    // 2. Database operation
    const project = await prisma.project.create({
      data: {
        ...parsed.data,
        freelancerId,
      },
    })

    // 3. Log activity
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        type: 'PROJECT_CREATED',
        title: `Project "${project.name}" created`,
      },
    })

    // 4. Revalidate cache
    revalidatePath('/dashboard')

    // 5. Return success
    return {
      success: true,
      data: project,
    }
  } catch (error) {
    console.error('[createProject]', error)
    return {
      error: 'Failed to create project',
    }
  }
}
```

---

## 📊 Database Query Patterns

### Efficient Queries

```typescript
// features/projects/queries.ts
import { prisma } from '@/lib/db/client'

// Include only needed relations
export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          dueDate: true,
        },
      },
      client: {
        select: {
          id: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  })
}

// Batch queries
export async function getProjectsWithStats(freelancerId: string) {
  const projects = await prisma.project.findMany({
    where: { freelancerId },
    select: {
      id: true,
      name: true,
      status: true,
      dueDate: true,
      _count: {
        select: { tasks: true },
      },
    },
  })

  // Don't do this (N+1):
  // for (const project of projects) {
  //   await prisma.task.findMany({ where: { projectId: project.id } })
  // }

  return projects
}
```

---

## ✅ Validation Best Practices

```typescript
// Always validate at boundaries
'use server'

import { LoginSchema, type LoginInput } from '@/lib/validators'

export async function login(input: unknown) {
  // 1. Parse and validate
  const result = LoginSchema.safeParse(input)

  if (!result.success) {
    // Return frontend-safe errors
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  // 2. Business logic with validated data
  // (no need to re-check types)
}
```

---

## 🎨 UI Component Best Practices

### Reusable Card Component

```typescript
// components/shared/ProjectCard.tsx
import { Project } from '@prisma/client'
import { formatDate } from '@/lib/utils/helpers'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      className="card-interactive p-6 cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
      <p className="text-brand-600 text-sm mb-4">
        {project.description}
      </p>

      <div className="flex-between">
        <span className={`badge-${getStatusColor(project.status)}`}>
          {project.status}
        </span>
        {project.dueDate && (
          <span className="text-xs text-brand-600">
            Due {formatDate(project.dueDate)}
          </span>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    ACTIVE: 'success',
    ON_HOLD: 'warning',
    COMPLETED: 'success',
    ARCHIVED: 'info',
  }
  return colors[status] || 'info'
}
```

---

## 🔍 Common Patterns

### Loading States

```typescript
import { Suspense } from 'react'

export function ProjectsList() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ProjectsListContent />
    </Suspense>
  )
}

function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton h-48 rounded-lg" />
      ))}
    </div>
  )
}

async function ProjectsListContent() {
  const projects = await getProjects()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}
```

### Error Handling

```typescript
// app/projects/page.tsx
export default async function ProjectsPage() {
  try {
    const projects = await getProjects()
    return <ProjectsList projects={projects} />
  } catch (error) {
    return (
      <div className="page-container flex-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Failed to load projects
          </h2>
          <p className="text-brand-600">Please try again later.</p>
        </div>
      </div>
    )
  }
}
```

---

## 📋 Naming Conventions

### Files
- Component files: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Server actions: `server-actions.ts`
- Database queries: `queries.ts`

### Variables & Functions
- React components: `PascalCase` (`ProjectCard`)
- Functions: `camelCase` (`getProjects`)
- Constants: `UPPER_SNAKE_CASE` (`MAX_FILE_SIZE`)
- Boolean: `isActive`, `canView`, `hasAccess`

### Database
- Models: `PascalCase` (`Project`, `Task`)
- Enums: `UPPER_SNAKE_CASE` (`PROJECT_STATUS`)
- Fields: `camelCase` (`createdAt`, `dueDate`)

---

## 🧪 Testing Approach

### Minimal Testing for Solo Developer

Focus on:
1. Critical user flows (auth, project creation)
2. Data integrity (validation, constraints)
3. Integration tests over unit tests

```typescript
// __tests__/projects.test.ts
import { createProject } from '@/features/projects/server-actions'

describe('Projects', () => {
  it('should create project with valid input', async () => {
    const result = await createProject({
      name: 'Test Project',
      clientId: 'client-123',
    }, 'freelancer-123')

    expect(result.success).toBe(true)
    expect(result.data.name).toBe('Test Project')
  })

  it('should reject invalid input', async () => {
    const result = await createProject({
      name: '',
    }, 'freelancer-123')

    expect(result.error).toBeDefined()
  })
})
```

---

## 🚀 Performance Checklist

Before shipping a feature:

- [ ] Used Server Components where possible
- [ ] No unnecessary client-side state
- [ ] Queries only select needed fields
- [ ] Used indexes on filtered columns
- [ ] Implemented loading states
- [ ] No N+1 queries
- [ ] Cached revalidation paths specified
- [ ] Images optimized
- [ ] Bundle size checked (`npm run build`)

---

## 📝 Code Review Checklist

When reviewing your own code:

- [ ] No TypeScript errors (`npm run lint`)
- [ ] All Zod schemas validate inputs
- [ ] Server Actions handle errors gracefully
- [ ] Database queries are optimal
- [ ] Component props documented
- [ ] Reused existing components
- [ ] No hardcoded values
- [ ] Accessibility considered

---

## 🔧 Debugging Tips

### Enable Query Logging

In `lib/db/client.ts`:
```typescript
new PrismaClient({
  log: ['query', 'error', 'warn'],
})
```

### Prisma Studio

```bash
npm run db:studio
```

Opens UI for inspecting database at `http://localhost:5555`

### Next.js DevTools

Add React DevTools browser extension for debugging components.

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zod Validation](https://zod.dev)

