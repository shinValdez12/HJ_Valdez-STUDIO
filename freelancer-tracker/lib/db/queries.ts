import { createClient } from '@/lib/supabase/server'
import type {
  ActivityLog,
  ClientAccessToken,
  ClientWithProjects,
  FreelancerWithProjects,
  ProjectDetail,
  ProjectSummary,
} from '@/lib/types'

// User queries
export async function getUserById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('User')
    .select(`
      id,
      email,
      name,
      role,
      freelancer_id,
      client_id,
      freelancers (
        id,
        bio,
        avatar,
        hourly_rate,
        timezone
      ),
      clients (
        id,
        company,
        phone
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('User')
    .select(`
      id,
      email,
      name,
      role,
      freelancer_id,
      client_id,
      freelancers (
        id,
        bio,
        avatar,
        hourly_rate,
        timezone
      ),
      clients (
        id,
        company,
        phone
      )
    `)
    .eq('email', email)
    .single()

  if (error) throw error
  return data
}

// Freelancer queries
export async function getFreelancerWithProjects(freelancerId: string): Promise<FreelancerWithProjects | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('freelancers')
    .select(`
      id,
      user_id,
      bio,
      avatar,
      hourly_rate,
      timezone,
      users (
        id,
        name,
        email
      ),
      projects (
        id,
        name,
        description,
        status,
        due_date,
        budget,
        completion_percentage,
        created_at,
        clients (
          id,
          company,
          users (
            name
          )
        ),
        tasks (
          id,
          title,
          status,
          due_date,
          estimate,
          time_spent
        )
      ),
      clients (
        id,
        company,
        users (
          name
        )
      )
    `)
    .eq('id', freelancerId)
    .single()

  if (error) throw error
  return data as FreelancerWithProjects | null
}

// Client queries
export async function getClientWithProjects(clientId: string): Promise<ClientWithProjects | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      user_id,
      company,
      phone,
      users (
        id,
        name,
        email
      ),
      projects (
        id,
        name,
        description,
        status,
        due_date,
        budget,
        completion_percentage,
        created_at,
        freelancers (
          id,
          users (
            name
          )
        ),
        tasks (
          id,
          title,
          status,
          due_date,
          estimate,
          time_spent
        )
      )
    `)
    .eq('id', clientId)
    .single()

  if (error) throw error
  return data as ClientWithProjects | null
}

// Project queries
export async function getProjectById(id: string): Promise<ProjectDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      status,
      start_date,
      due_date,
      freelancer_id,
      client_id,
      budget,
      completion_percentage,
      created_at,
      updated_at,
      tasks (
        id,
        title,
        description,
        status,
        due_date,
        estimate,
        time_spent,
        is_blocked,
        blocked_reason,
        created_at
      ),
      clients (
        id,
        company,
        users (
          name
        )
      ),
      freelancers (
        id,
        users (
          name
        )
      ),
      scope_items (
        id,
        title,
        description,
        status,
        added_at,
        approved_at,
        approved_by
      ),
      activity_logs (
        id,
        type,
        title,
        description,
        metadata,
        created_at,
        users (
          name,
          email
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ProjectDetail | null
}

export async function getProjectsByFreelancer(freelancerId: string): Promise<ProjectSummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      status,
      due_date,
      budget,
      completion_percentage,
      created_at,
      clients (
        id,
        company,
        users (
          name
        )
      ),
      tasks (
        id,
        title,
        status
      )
    `)
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ProjectSummary[]
}

export async function getProjectsByClient(clientId: string): Promise<ProjectSummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      description,
      status,
      due_date,
      budget,
      completion_percentage,
      created_at,
      freelancers (
        id,
        users (
          name
        )
      ),
      tasks (
        id,
        title,
        status
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Task queries
export async function getTasksByProject(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getTaskById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      projects (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Activity log queries
export async function createActivityLog(data: {
  projectId: string
  userId: string
  type: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_STATUS_CHANGED' | 'TASK_COMPLETED' | 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_STATUS_CHANGED' | 'PROJECT_COMPLETED' | 'CLIENT_ACCESSED_VIEW' | 'CLIENT_COMMENT_ADDED' | 'SCOPE_ITEM_ADDED' | 'SCOPE_ITEM_APPROVED'
  title: string
  description?: string
  metadata?: Record<string, unknown>
}) {
  const supabase = await createClient()
  const { data: result, error } = await supabase
    .from('activity_logs')
    .insert({
      project_id: data.projectId,
      user_id: data.userId,
      type: data.type,
      title: data.title,
      description: data.description,
      metadata: data.metadata,
    })
    .select()
    .single()

  if (error) throw error
  return result
}

export async function getActivityLogs(projectId: string, limit = 50): Promise<ActivityLog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActivityLog[]
}

// Client access token queries
export async function getValidAccessToken(token: string): Promise<ClientAccessToken | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('client_access_tokens')
    .select(`
      *,
      clients (
        id,
        user_id,
        company,
        phone,
        users (
          name
        ),
        projects (
          id,
          name,
          description,
          status,
          due_date,
          budget,
          completion_percentage,
          tasks (
            id,
            title,
            description,
            status,
            due_date,
            estimate,
            time_spent
          )
        )
      )
    `)
    .eq('token', token)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error) throw error
  return data as ClientAccessToken | null
}

// Weekly report queries
export async function getWeeklyReportsByProject(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('project_id', projectId)
    .order('week', { ascending: false })

  if (error) throw error
  return data
}

export async function getLatestWeeklyReport(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('project_id', projectId)
    .order('week', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}