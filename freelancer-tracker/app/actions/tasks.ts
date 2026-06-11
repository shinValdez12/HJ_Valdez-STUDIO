'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireFreelancer } from '@/lib/auth'

const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  estimate: z.number().min(0).optional(),
  dueDate: z.string().optional(),
})

const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  estimate: z.number().min(0).optional(),
  timeSpent: z.number().min(0).optional(),
  dueDate: z.string().optional(),
})

export async function createTask(_prevState: unknown, formData: FormData) {
  try {
    const user = await requireFreelancer()

    const data = createTaskSchema.parse({
      projectId: formData.get('projectId'),
      title: formData.get('title'),
      description: formData.get('description'),
      estimate: formData.get('estimate') ? Number(formData.get('estimate')) : undefined,
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string).toISOString() : undefined,
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

    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        project_id: data.projectId,
        title: data.title,
        description: data.description,
        estimate: data.estimate,
        due_date: data.dueDate,
      })
      .select()
      .single()

    if (taskError) {
      console.error('Task creation error:', taskError)
      return { error: 'Failed to create task' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: data.projectId,
        user_id: user.id,
        type: 'TASK_CREATED',
        title: `Task "${data.title}" was created`,
        description: 'New task added to project',
      })

    revalidatePath(`/projects/${data.projectId}`)
    return { success: true, task }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Create task error:', error)
    return { error: 'Something went wrong' }
  }
}

export async function updateTask(formData: FormData) {
  try {
    const user = await requireFreelancer()

    const taskId = formData.get('id') as string
    const supabase = await createClient()

    // Verify task ownership through project
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        project_id,
        projects!inner(freelancer_id)
      `)
      .eq('id', taskId)
      .eq('projects.freelancer_id', user.freelancerId)
      .single()

    if (taskError || !task) {
      return { error: 'Task not found or unauthorized' }
    }

    const data = updateTaskSchema.parse({
      id: taskId,
      title: formData.get('title') || undefined,
      description: formData.get('description') || undefined,
      status: formData.get('status') || undefined,
      estimate: formData.get('estimate') ? Number(formData.get('estimate')) : undefined,
      timeSpent: formData.get('timeSpent') ? Number(formData.get('timeSpent')) : undefined,
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string).toISOString() : undefined,
    })

    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.status !== undefined) updateData.status = data.status
    if (data.estimate !== undefined) updateData.estimate = data.estimate
    if (data.timeSpent !== undefined) updateData.time_spent = data.timeSpent
    if (data.dueDate !== undefined) updateData.due_date = data.dueDate

    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single()

    if (updateError) {
      console.error('Task update error:', updateError)
      return { error: 'Failed to update task' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: task.project_id,
        user_id: user.id,
        type: 'TASK_UPDATED',
        title: `Task "${updatedTask.title}" was updated`,
        description: 'Task details modified',
      })

    revalidatePath(`/projects/${task.project_id}`)
    return { success: true, task: updatedTask }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Update task error:', error)
    return { error: 'Something went wrong' }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const user = await requireFreelancer()
    const supabase = await createClient()

    // Verify task ownership through project
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        project_id,
        projects!inner(freelancer_id)
      `)
      .eq('id', taskId)
      .eq('projects.freelancer_id', user.freelancerId)
      .single()

    if (taskError || !task) {
      return { error: 'Task not found or unauthorized' }
    }

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (deleteError) {
      console.error('Task deletion error:', deleteError)
      return { error: 'Failed to delete task' }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        project_id: task.project_id,
        user_id: user.id,
        type: 'TASK_STATUS_CHANGED',
        title: `Task "${task.title}" was deleted`,
        description: 'Task removed from project',
      })

    revalidatePath(`/projects/${task.project_id}`)
    return { success: true }
  } catch (error) {
    console.error('Delete task error:', error)
    return { error: 'Something went wrong' }
  }
}