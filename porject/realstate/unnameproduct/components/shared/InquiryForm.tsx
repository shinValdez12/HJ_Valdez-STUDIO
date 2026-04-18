'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InquiryFormProps {
  propertyTitle?: string
  className?: string
  compact?: boolean
}

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export default function InquiryForm({ propertyTitle, className, compact = false }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: propertyTitle ? `Hi, I am interested in "${propertyTitle}" and would like to schedule a viewing.` : '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('flex flex-col items-center justify-center text-center py-10 gap-3', className)}
      >
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-xl font-bold text-foreground">Message Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Thank you for reaching out. One of our agents will be in touch with you within one business day.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
          className="mt-3 text-accent text-sm font-medium hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      noValidate
      aria-label={propertyTitle ? `Inquiry about ${propertyTitle}` : 'Contact form'}
    >
      <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
        <div>
          <label htmlFor="inq-name" className="block text-sm font-medium text-foreground mb-1.5">
            Full Name <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="inq-name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Jane Smith"
            autoComplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'inq-name-err' : undefined}
            className={cn(
              'w-full px-4 py-2.5 rounded-md border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition',
              errors.name ? 'border-destructive' : 'border-border',
            )}
          />
          {errors.name && <p id="inq-name-err" className="mt-1 text-xs text-destructive" role="alert">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="inq-email" className="block text-sm font-medium text-foreground mb-1.5">
            Email <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="inq-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="jane@example.com"
            autoComplete="email"
            aria-required="true"
            aria-describedby={errors.email ? 'inq-email-err' : undefined}
            className={cn(
              'w-full px-4 py-2.5 rounded-md border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition',
              errors.email ? 'border-destructive' : 'border-border',
            )}
          />
          {errors.email && <p id="inq-email-err" className="mt-1 text-xs text-destructive" role="alert">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="inq-phone" className="block text-sm font-medium text-foreground mb-1.5">
          Phone <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </label>
        <input
          id="inq-phone"
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          className="w-full px-4 py-2.5 rounded-md border border-border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
        />
      </div>

      <div>
        <label htmlFor="inq-message" className="block text-sm font-medium text-foreground mb-1.5">
          Message <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <textarea
          id="inq-message"
          value={form.message}
          onChange={handleChange('message')}
          rows={compact ? 3 : 4}
          placeholder="I would like to schedule a viewing..."
          aria-required="true"
          aria-describedby={errors.message ? 'inq-msg-err' : undefined}
          className={cn(
            'w-full px-4 py-2.5 rounded-md border text-foreground bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition leading-relaxed',
            errors.message ? 'border-destructive' : 'border-border',
          )}
        />
        {errors.message && <p id="inq-msg-err" className="mt-1 text-xs text-destructive" role="alert">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-md bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
