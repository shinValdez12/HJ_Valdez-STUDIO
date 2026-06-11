'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireFreelancer } from '@/lib/auth'

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  clientId: z.string(),
  budget: z.number().min(0).optional(),
  dueDate: z.string().optional(),
})

const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
  budget: z.number().min(0).optional(),
  dueDate: z.string().optional(),
})

export async function createProject(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const data = createProjectSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      clientId: formData.get('clientId'),
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string).toISOString() : undefined,
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

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        description: data.description,
        client_id: data.clientId,
        freelancer_id: user.freelancerId!,
        budget: data.budget,
        due_date: data.dueDate,
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      return { error: 'Failed to create project' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: project.id,
        user_id: user.id,
        type: 'PROJECT_CREATED',
        title: `Project "${data.name}" was created`,
        description: 'New project created by freelancer',
      })

    revalidatePath('/projects')
    redirect(`/projects/${project.id}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Create project error:', error)
    return { error: error instanceof Error ? error.message : 'Something went wrong' }
  }
}

export async function updateProject(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const projectId = formData.get('id') as string
    const supabase = await createClient()

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', projectId)
      .eq('freelancer_id', user.freelancerId)
      .single()

    if (projectError || !project) {
      return { error: 'Project not found or unauthorized' }
    }

    const data = updateProjectSchema.parse({
      id: projectId,
      name: formData.get('name') || undefined,
      description: formData.get('description') || undefined,
      status: formData.get('status') || undefined,
      budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string).toISOString() : undefined,
    })

    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.budget !== undefined) updateData.budget = data.budget
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single()

    if (updateError) {
      console.error('Project update error:', updateError)
      return { error: 'Failed to update project' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: projectId,
        user_id: user.id,
        type: 'PROJECT_UPDATED',
        title: `Project "${updatedProject.name}" was updated`,
        description: 'Project details modified',
      })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, project: updatedProject }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Update project error:', error)
    return { error: 'Something went wrong' }
  }
}

export async function deleteProject(projectId: string) {
  try {
    const user = await requireFreelancer()
    const supabase = await createClient()

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('freelancer_id', user.freelancerId)
      .single()

    if (projectError || !project) {
      return { error: 'Project not found or unauthorized' }
    }

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (deleteError) {
      console.error('Project deletion error:', deleteError)
      return { error: 'Failed to delete project' }
    }

    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    console.error('Delete project error:', error)
    return { error: 'Something went wrong' }
  }
}