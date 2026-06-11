'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['FREELANCER', 'CLIENT']),
})

export async function login(_prevState: unknown, formData: FormData) {
  try {
    const data = loginSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    redirect('/dashboard')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Login error:', error)
    return { error: error instanceof Error ? error.message : 'Something went wrong' }
  }
}

export async function signup(_prevState: unknown, formData: FormData) {
  try {
    const data = signupSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    })

    const supabase = await createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user' }
    }


    // Create user profile
    const { error: profileError } = await supabase
      .from('User')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.role,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'Failed to create user profile' }
    }

    // Create freelancer or client profile
    if (data.role === 'FREELANCER') {
      const { error: freelancerError } = await supabase
        .from('freelancers')
        .insert({
          user_id: authData.user.id,
        })

      if (freelancerError) {
        console.error('Freelancer creation error:', freelancerError)
        return { error: 'Failed to create freelancer profile' }
      }
    } else {
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: authData.user.id,
        })

      if (clientError) {
        console.error('Client creation error:', clientError)
        return { error: 'Failed to create client profile' }
      }
    }

    revalidatePath('/')
    redirect('/dashboard')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    console.error('Signup error:', error)
    return { error: error instanceof Error ? error.message : 'Something went wrong' }
  }
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
  }

  revalidatePath('/')
  redirect('/')
}