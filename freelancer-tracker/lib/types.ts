export type UserRole = 'FREELANCER' | 'CLIENT'

export interface UserMini {
  id: string
  name: string
  email?: string | null
}

export interface ProjectClient {
  id: string
  company?: string | null
  users?: UserMini[] | null
}

export interface ProjectFreelancer {
  id: string
  users?: UserMini[] | null
}

export interface ProjectTask {
  id: string
  title: string
  description?: string | null
  status: string
  due_date?: string | null
  estimate?: number | null
  time_spent?: number | null
  is_blocked?: boolean | null
  blocked_reason?: string | null
  created_at?: string | null
}

export interface ScopeItem {
  id: string
  title: string
  description?: string | null
  status?: string | null
  added_at?: string | null
  approved_at?: string | null
  approved_by?: string | null
}

export interface ActivityLog {
  id: string
  type: string
  title: string
  description?: string | null
  metadata?: Record<string, unknown> | null
  created_at: string
  users?: {
    name: string
    email?: string | null
  } | null
}

export interface ProjectBase {
  id: string
  name: string
  description?: string | null
  status: string
  due_date?: string | null
  budget?: number | null
  completion_percentage?: number | null
  created_at?: string | null
}

export interface ProjectSummary extends ProjectBase {
  clients?: ProjectClient[] | null
  tasks?: ProjectTask[] | null
}

export interface ProjectDetail extends ProjectSummary {
  freelancers?: ProjectFreelancer[] | null
  scope_items?: ScopeItem[] | null
  activity_logs?: ActivityLog[] | null
}

export interface FreelancerWithProjects {
  id: string
  user_id: string
  bio?: string | null
  avatar?: string | null
  hourly_rate?: number | null
  timezone?: string | null
  users?: UserMini[] | null
  projects?: ProjectSummary[] | null
  clients?: ProjectClient[] | null
}

export interface ClientWithProjects {
  id: string
  user_id: string
  company?: string | null
  phone?: string | null
  users?: UserMini[] | null
  projects?: ProjectDetail[] | null
}

export interface ClientAccessToken {
  id: string
  token: string
  is_active: boolean
  expires_at: string
  can_view_tasks: boolean
  can_view_timeline: boolean
  can_view_budget: boolean
  clients?: {
    id: string
    user_id: string
    company?: string | null
    phone?: string | null
    users?: UserMini[] | null
    projects?: ProjectDetail[] | null
  } | null
}
