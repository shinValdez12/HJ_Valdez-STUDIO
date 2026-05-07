import { z } from 'zod'

// ============================================
// AUTH SCHEMAS
// ============================================

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['FREELANCER', 'CLIENT']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ============================================
// PROJECT SCHEMAS
// ============================================

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255),
  description: z.string().max(2000).optional(),
  clientId: z.string().cuid('Invalid client ID'),
  dueDate: z.string().datetime().optional(),
  budget: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
})

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  dueDate: z.string().datetime().optional(),
  budget: z.number().int().min(0).optional(),
})

// ============================================
// TASK SCHEMAS
// ============================================

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255),
  description: z.string().max(2000).optional(),
  projectId: z.string().cuid(),
  dueDate: z.string().datetime().optional(),
  estimate: z.number().int().min(0, 'Estimate must be >= 0').optional(),
})

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  dueDate: z.string().datetime().optional(),
  estimate: z.number().int().min(0).optional(),
  timeSpent: z.number().int().min(0).optional(),
  isBlocked: z.boolean().optional(),
  blockedReason: z.string().max(500).optional(),
})

// ============================================
// SCOPE ITEM SCHEMAS
// ============================================

export const CreateScopeItemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  projectId: z.string().cuid(),
})

export const UpdateScopeItemSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['IN_SCOPE', 'OUT_OF_SCOPE', 'UNDER_REVIEW']).optional(),
  approvedBy: z.string().max(500).optional(),
})

// ============================================
// CLIENT ACCESS SCHEMAS
// ============================================

export const CreateClientAccessTokenSchema = z.object({
  clientId: z.string().cuid(),
  projectId: z.string().cuid().optional(),
  canViewTasks: z.boolean().default(true),
  canViewTimeline: z.boolean().default(true),
  canViewBudget: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginInput = z.infer<typeof LoginSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type CreateScopeItemInput = z.infer<typeof CreateScopeItemSchema>
export type UpdateScopeItemInput = z.infer<typeof UpdateScopeItemSchema>
export type CreateClientAccessTokenInput = z.infer<typeof CreateClientAccessTokenSchema>
