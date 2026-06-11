'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireFreelancer, requireClient } from '@/lib/auth'

const createClientAccessTokenSchema = z.object({
  clientId: z.string(),
  projectId: z.string().optional(),
  canViewTasks: z.boolean().default(true),
  canViewTimeline: z.boolean().default(true),
  canViewBudget: z.boolean().default(false),
  expiresAt: z.string().optional(),
})

const createScopeItemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  projectId: z.string(),
})

const updateScopeItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['IN_SCOPE', 'OUT_OF_SCOPE', 'UNDER_REVIEW']).optional(),
})

// Calculate project progress based on completed tasks
export async function calculateProjectProgress(projectId: string) {
  try {
    const supabase = await createClient()

    // Get all tasks for the project
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('status')
      .eq('project_id', projectId)

    if (error) {
      console.error('Error fetching tasks:', error)
      return 0
    }

    if (!tasks || tasks.length === 0) {
      return 0
    }

    const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length
    const progress = Math.round((completedTasks / tasks.length) * 100)

    // Update project completion percentage
    await supabase
      .from('projects')
      .update({ completion_percentage: progress })
      .eq('id', projectId)

    return progress
  } catch (error) {
    console.error('Error calculating progress:', error)
    return 0
  }
}

// Generate client access token
export async function createClientAccessToken(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const data = createClientAccessTokenSchema.parse({
      clientId: formData.get('clientId'),
      projectId: formData.get('projectId') || undefined,
      canViewTasks: formData.get('canViewTasks') === 'on',
      canViewTimeline: formData.get('canViewTimeline') === 'on',
      canViewBudget: formData.get('canViewBudget') === 'on',
      expiresAt: formData.get('expiresAt') || undefined,
    })

    const supabase = await createClient()

    // Verify client belongs to freelancer
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', data.clientId)
      .eq('freelancer_id', user.freelancerId)
      .single()

    if (clientError || !client) {
      return { error: 'Client not found or unauthorized' }
    }

    // If projectId is provided, verify it belongs to freelancer
    if (data.projectId) {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', data.projectId)
        .eq('freelancer_id', user.freelancerId)
        .single()

      if (projectError || !project) {
        return { error: 'Project not found or unauthorized' }
      }
    }

    const { data: token, error: tokenError } = await supabase
      .from('client_access_tokens')
      .insert({
        client_id: data.clientId,
        project_id: data.projectId,
        can_view_tasks: data.canViewTasks,
        can_view_timeline: data.canViewTimeline,
        can_view_budget: data.canViewBudget,
        expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      })
      .select()
      .single()

    if (tokenError) {
      console.error('Token creation error:', tokenError)
      return { error: 'Failed to create access token' }
    }

    return { success: true, token }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Create token error:', error)
    return { error: 'Something went wrong' }
  }
}

// Validate scope lock (prevent changes when scope is locked)
export async function validateScopeLock(projectId: string, action: string) {
  try {
    const supabase = await createClient()

    // Check if project has any scope items that are under review
    const { data: scopeItems, error } = await supabase
      .from('scope_items')
      .select('status')
      .eq('project_id', projectId)
      .eq('status', 'UNDER_REVIEW')

    if (error) {
      console.error('Error checking scope lock:', error)
      return { locked: false, reason: 'Unable to verify scope status' }
    }

    if (scopeItems && scopeItems.length > 0) {
      return {
        locked: true,
        reason: 'Project scope is currently under review. Changes are not allowed until scope is approved.'
      }
    }

    return { locked: false }
  } catch (error) {
    console.error('Scope lock validation error:', error)
    return { locked: false, reason: 'Unable to verify scope status' }
  }
}

// Calculate deadline risk status
export async function calculateDeadlineRisk(projectId: string) {
  try {
    const supabase = await createClient()

    const { data: project, error } = await supabase
      .from('projects')
      .select('due_date, completion_percentage')
      .eq('id', projectId)
      .single()

    if (error || !project) {
      return { risk: 'unknown', daysRemaining: 0 }
    }

    if (!project.due_date) {
      return { risk: 'no_deadline', daysRemaining: 0 }
    }

    const now = new Date()
    const dueDate = new Date(project.due_date)
    const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining < 0) {
      return { risk: 'overdue', daysRemaining }
    }

    const progress = project.completion_percentage || 0
    const expectedProgress = Math.max(0, 100 - (daysRemaining * 2)) // Rough estimate

    if (progress < expectedProgress - 20) {
      return { risk: 'high', daysRemaining }
    } else if (progress < expectedProgress - 10) {
      return { risk: 'medium', daysRemaining }
    } else {
      return { risk: 'low', daysRemaining }
    }
  } catch (error) {
    console.error('Deadline risk calculation error:', error)
    return { risk: 'unknown', daysRemaining: 0 }
  }
}

// Create scope item
export async function createScopeItem(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const data = createScopeItemSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      projectId: formData.get('projectId'),
    })

    const supabase = await createClient()

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', data.projectId)
      .eq('freelancer_id', user.freelancerId)
      .single()

    if (projectError || !project) {
      return { error: 'Project not found or unauthorized' }
    }

    const { data: scopeItem, error: scopeError } = await supabase
      .from('scope_items')
      .insert({
        project_id: data.projectId,
        title: data.title,
        description: data.description,
      })
      .select()
      .single()

    if (scopeError) {
      console.error('Scope item creation error:', scopeError)
      return { error: 'Failed to create scope item' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: data.projectId,
        user_id: user.id,
        type: 'SCOPE_ITEM_ADDED',
        title: `Scope item "${data.title}" was added`,
        description: 'New scope item added to project',
      })

    return { success: true, scopeItem }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Create scope item error:', error)
    return { error: 'Something went wrong' }
  }
}

// Update scope item
export async function updateScopeItem(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const scopeItemId = formData.get('id') as string
    const supabase = await createClient()

    // Verify scope item ownership through project
    const { data: scopeItem, error: scopeError } = await supabase
      .from('scope_items')
      .select(`
        id,
        title,
        project_id,
        projects!inner(freelancer_id)
      `)
      .eq('id', scopeItemId)
      .eq('projects.freelancer_id', user.freelancerId)
      .single()

    if (scopeError || !scopeItem) {
      return { error: 'Scope item not found or unauthorized' }
    }

    const data = updateScopeItemSchema.parse({
      id: scopeItemId,
      title: formData.get('title') || undefined,
      description: formData.get('description') || undefined,
      status: formData.get('status') || undefined,
    })

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status

    const { data: updatedItem, error: updateError } = await supabase
      .from('scope_items')
      .update(updateData)
      .eq('id', scopeItemId)
      .select()
      .single()

    if (updateError) {
      console.error('Scope item update error:', updateError)
      return { error: 'Failed to update scope item' }
    }

    // Log activity if status changed to approved
    if (data.status === 'IN_SCOPE') {
      await supabase
        .from('activity_logs')
        .insert({
          project_id: scopeItem.project_id,
          user_id: user.id,
          type: 'SCOPE_ITEM_APPROVED',
          title: `Scope item "${updatedItem.title}" was approved`,
          description: 'Scope item approved and locked',
        })
    }

    return { success: true, scopeItem: updatedItem }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Update scope item error:', error)
    return { error: 'Something went wrong' }
  }
}

// Client view access (for client-view page)
export async function getClientViewData(token: string) {
  try {
    const supabase = await createClient()

    // Get valid access token with client and project data
    const { data: tokenData, error: tokenError } = await supabase
      .from('client_access_tokens')
      .select(`
        id,
        can_view_tasks,
        can_view_timeline,
        can_view_budget,
        last_accessed_at,
        clients (
          id,
          user_id,
          company,
          users (
            name
          )
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
          ),
          activity_logs (
            id,
            type,
            title,
            description,
            created_at,
            users (
              name
            )
          )
        )
      `)
      .eq('token', token)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return { error: 'Invalid or expired access token' }
    }

    // Update last accessed time
    await supabase
      .from('client_access_tokens')
      .update({
        last_accessed_at: new Date().toISOString()
      })
      .eq('id', tokenData.id)

    // Log client access
    if (tokenData.projects && tokenData.projects.length > 0) {
      await supabase
        .from('activity_logs')
        .insert({
          project_id: tokenData.projects[0].id,
          user_id: tokenData.clients[0].user_id,
          type: 'CLIENT_ACCESSED_VIEW',
          title: 'Client accessed project view',
          description: `Client viewed project via access token`,
        })
    }

    return {
      success: true,
      data: {
        client: tokenData.clients,
        project: tokenData.projects,
        permissions: {
          canViewTasks: tokenData.can_view_tasks,
          canViewTimeline: tokenData.can_view_timeline,
          canViewBudget: tokenData.can_view_budget,
        }
      }
    }
  } catch (error) {
    console.error('Client view error:', error)
    return { error: 'Something went wrong' }
  }
}