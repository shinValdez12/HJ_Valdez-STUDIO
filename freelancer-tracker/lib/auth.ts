import { createClient } from '@/lib/supabase/server'

export interface User {
  id: string
  email: string
  name: string
  role: 'FREELANCER' | 'CLIENT'
  freelancerId?: string
  clientId?: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile from our users table
    const { data: profile, error: profileError } = await supabase
      .from('User')
      .select(`
        id,
        email,
        name,
        role,
        freelancer_id,
        client_id
      `)
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      freelancerId: profile.freelancer_id,
      clientId: profile.client_id,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireFreelancer(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'FREELANCER') {
    throw new Error('Freelancer access required')
  }
  return user
}

export async function requireClient(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== 'CLIENT') {
    throw new Error('Client access required')
  }
  return user
}