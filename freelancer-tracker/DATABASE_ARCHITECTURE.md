# Database Architecture - Freelancer Project Tracker

## Overview
Production-ready PostgreSQL schema with full relational integrity, designed for scalability and clean separation of concerns.

---

## Core Models

### 1. User & Auth Models

#### **User**
Central authentication model supporting both freelancers and clients.

```
User (1) ──┬──> (1) Freelancer
           └──> (1) Client
```

- **Fields**: id, email, name, password, role, freelancerId, clientId
- **Constraints**: 
  - Email must be unique
  - Both freelancerId and clientId are optional (can be null)
  - Indexes on: email, role (for fast lookups)

#### **Freelancer**
Profile for project creators/managers.

```
Freelancer (1) ──────> (N) Project
Freelancer (1) ──────> (N) Client (who they work with)
```

- **Fields**: id, userId, bio, avatar, hourlyRate, timezone
- **Cascade**: On freelancer delete → all their projects/activities deleted
- **Key Features**: 
  - Hourly rate in cents (avoid floats)
  - Timezone for scheduling reports

#### **Client**
Profile for project viewers/stakeholders.

```
Client (1) ────> (N) Project
Client (1) ────> (N) ClientAccessToken
Client (N) ────> (1) Freelancer (optional)
```

- **Fields**: id, userId, company, phone, freelancerId
- **Relationships**:
  - Optional freelancer relationship (can have multiple clients)
  - Multiple access tokens for public view sharing

---

### 2. Project Models

#### **Project**
Core entity representing a single project/engagement.

```
Project (1) ──────┬──> (N) Task
                  ├──> (N) ActivityLog
                  ├──> (N) ScopeItem
                  ├──> (1) WeeklyReport
                  └──> (1) Freelancer
                  └──> (1) Client
```

- **Fields**:
  - `name`, `description`, `status` (PLANNING | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED)
  - `startDate`, `dueDate` (nullable for flexible timelines)
  - `budget` (in cents)
  - `completionPercentage` (auto-calculated from tasks)

- **Relationships**:
  - Requires both freelancer AND client
  - Soft delete via status field (prefer over hard delete)
  - Indexes on: freelancerId, clientId, status, dueDate (for queries)

- **Key Design**:
  - No hard delete → preserves history
  - Status enum prevents invalid states
  - Budget optional (some projects are fixed scope)

#### **Task**
Individual work items within a project.

```
Task (N) ──> (1) Project
Task (1) has many status (BACKLOG | TODO | IN_PROGRESS | REVIEW | COMPLETED)
```

- **Fields**:
  - `title`, `description`, `status`
  - `dueDate`, `estimate` (in minutes), `timeSpent` (auto-tracked)
  - `isBlocked`, `blockedReason` (for dependency tracking)
  - `order` (for custom sorting)

- **Key Features**:
  - `estimate` vs `timeSpent` → burndown tracking
  - Blocked status prevents misleading progress
  - Cascade delete with project

- **Performance**:
  - Index on projectId for fast filtering
  - Index on status for dashboard queries (show "IN_PROGRESS" tasks)
  - Index on dueDate for deadline risk indicators

---

### 3. Scope Lock System

#### **ScopeItem**
Prevents scope creep by explicitly tracking scope boundaries.

```
ScopeItem (N) ──> (1) Project
ScopeItem has many status (IN_SCOPE | OUT_OF_SCOPE | UNDER_REVIEW)
```

- **Fields**:
  - `title`, `description`, `status`
  - `addedAt`, `approvedAt`, `approvedBy` (audit trail)

- **Key Design**:
  - Separate from tasks (scope vs execution)
  - UNDER_REVIEW status for client discussions
  - `approvedBy` string for freelancer notes on why something was rejected
  - Timestamp fields for audit compliance

- **Use Cases**:
  - Client requests feature → added as OUT_OF_SCOPE
  - After discussion → move to IN_SCOPE and link as new task
  - Protects against "just one more thing" scope creep

---

### 4. Activity & Logging

#### **ActivityLog**
Complete audit trail for transparency and reports.

```
ActivityLog (N) ──> (1) Project
```

- **Fields**:
  - `type` (TASK_CREATED | TASK_UPDATED | PROJECT_STATUS_CHANGED | etc.)
  - `title`, `description`, `metadata` (JSON for flexible data)

- **Event Types**:
  - Task lifecycle (created, updated, status changes)
  - Project lifecycle (created, completed, archived)
  - Client interactions (accessed view, comments)
  - Scope changes (items added/approved)

- **Key Design**:
  - JSON metadata for context-specific data
  - Never deleted (historical record)
  - Indexes on projectId, type, createdAt for efficient queries
  - Used for Weekly Report Generator

- **Performance**:
  - Partitioning by month recommended for large datasets
  - Activity queries usually filtered by project + date range

---

### 5. Client View & Access

#### **ClientAccessToken**
Public, token-based access for sharing project progress with clients.

```
ClientAccessToken (N) ──┬──> (1) Client
                        └──> (1) Project (optional)
```

- **Fields**:
  - `token` (unique, CUID for unguessable URLs)
  - `isActive` (soft disable)
  - `canViewTasks`, `canViewTimeline`, `canViewBudget` (granular permissions)
  - `expiresAt`, `lastAccessedAt`, `accessCount` (analytics + security)

- **Key Features**:
  - `projectId` nullable → can show multiple projects to one client
  - Expiring tokens for security (optional)
  - Access tracking for usage analytics
  - No password required (token is the secret)

- **Security**:
  - Token as primary lookup (indexed)
  - `isActive` check before rendering
  - No direct database access from public URLs
  - Rate limiting recommended at application level

- **Example Usage**:
  ```
  Client receives: https://app.com/client-view/abc123xyz
  Query: ClientAccessToken.findUnique({ token: 'abc123xyz' })
  If valid & active → render project view
  ```

---

### 6. Analytics & Reports

#### **WeeklyReport**
Pre-generated weekly summaries for client delivery and freelancer retrospectives.

```
WeeklyReport (N) ──> (1) Project
```

- **Fields**:
  - `week` (DateTime for start of week)
  - `tasksCompleted`, `tasksInProgress`, `timeTracked`
  - `htmlContent` (pre-rendered for email)

- **Key Design**:
  - Unique constraint on (projectId, week) → one report per week per project
  - `htmlContent` pre-generated for fast email sending
  - Not calculated on-demand (performance optimization)

- **Generation Strategy**:
  - Cron job runs Sunday night
  - Aggregates data from Task + ActivityLog
  - Computes from weekStartDate to weekEndDate
  - Generated in feature/reports/server-actions

---

## Relationship Diagram

```
┌─────────────┐
│    User     │ (Central Auth)
└──────┬──────┘
       │
   ┌───┴────────────┐
   │                │
┌──▼───────┐  ┌─────▼──────┐
│Freelancer│  │   Client   │
└──┬───────┘  └─────┬──────┘
   │                │
   │          ┌─────▼─────────────────┐
   └─────┬────▶     Project           │
        │     ├─────────────┬─────────┤
        │     │             │         │
        │  ┌──▼──────┐ ┌────▼──┐ ┌───▼─────┐
        │  │   Task  │ │Scope  │ │Activity │
        │  └─────────┘ │Item   │ │  Log    │
        │              └───────┘ └─────────┘
        │
    ┌───┴─────────────────┐
    │                     │
┌───▼──────────┐  ┌──────▼─────────┐
│ClientAccess  │  │WeeklyReport    │
│  Token       │  │                │
└──────────────┘  └────────────────┘
```

---

## Cascade Behavior

| Parent Deletion | Child Behavior |
|---|---|
| User | Freelancer + Client deleted |
| Freelancer | All projects + tasks + activities deleted |
| Client | Access tokens deleted, but projects remain (reassign?) |
| Project | Tasks, ScopeItems, ActivityLogs, WeeklyReports deleted |

---

## Indexes Strategy

**Performance-Critical Indexes**:
```sql
-- Project queries (dashboard)
Index: Project(freelancerId, status)
Index: Project(clientId)
Index: Project(dueDate)

-- Task filtering
Index: Task(projectId, status)
Index: Task(dueDate)

-- Activity logs (reports)
Index: ActivityLog(projectId, createdAt)
Index: ActivityLog(type)

-- Client access (public view)
Index: ClientAccessToken(token)
Index: ClientAccessToken(clientId)

-- Lookups
Index: User(email)
Index: Freelancer(userId)
Index: Client(userId)
```

---

## Query Patterns

### 1. Dashboard - Freelancer View
```sql
SELECT * FROM Project 
WHERE freelancerId = $1 AND status != 'ARCHIVED'
ORDER BY dueDate ASC;
```

### 2. Project Details with Tasks
```sql
SELECT p.*, t.* FROM Project p
LEFT JOIN Task t ON p.id = t.projectId
WHERE p.id = $1 AND p.freelancerId = $2
ORDER BY t.order ASC;
```

### 3. Client Public View
```sql
SELECT token, project, client FROM ClientAccessToken
WHERE token = $1 AND isActive = true
AND (expiresAt IS NULL OR expiresAt > NOW());
```

### 4. Weekly Report Data
```sql
SELECT COUNT(*) as tasksCompleted, SUM(timeSpent) as totalTime
FROM Task
WHERE projectId = $1 
AND updatedAt BETWEEN $2 AND $3
AND status = 'COMPLETED';
```

---

## Data Integrity Rules

1. **Project must have both freelancer and client** (foreign keys not null)
2. **Tasks can only exist within a project** (cascade delete)
3. **One freelancer account per user** (unique freelancerId)
4. **One client account per user** (unique clientId)
5. **Email globally unique** (prevents duplicate signups)
6. **Activity logs are immutable** (no updates, only inserts)
7. **Client tokens are secrets** (never expose raw in UI)

---

## Future Scalability Notes

- **Archival Strategy**: Use status field instead of hard deletes
- **Soft Deletes**: Consider adding `deletedAt` if complete recovery needed
- **Partitioning**: ActivityLog table by month for large datasets
- **Time Series**: Consider separate analytics table if heavy reporting
- **Caching**: Project summary stats can be cached (materialized view)
- **Sharding**: User-based sharding if multi-tenant at massive scale

---

## Development Next Steps

1. ✅ Schema defined (PHASE 1)
2. Run `prisma db push` to create tables
3. Generate Prisma Client: `prisma generate`
4. Create database utility functions (Phase 2)
5. Implement auth and server actions (Phase 2)
