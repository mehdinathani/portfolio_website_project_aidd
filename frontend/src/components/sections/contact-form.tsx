'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['General Inquiry', 'Project Collaboration', 'Job Opportunity', 'Other']

function SuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 py-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
        <motion.circle
          cx="32" cy="32" r="28"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M20 32l8 8 16-16"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <p className="text-lg font-medium text-foreground">Message sent!</p>
      <p className="text-sm text-muted-foreground">Thank you — I&apos;ll get back to you soon.</p>
    </motion.div>
  )
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', category: CATEGORIES[0] })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!validate()) {
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      await api.submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        category: form.category,
      })
      setStatus('success')
      setForm({ name: '', email: '', message: '', category: CATEGORIES[0] })
      setErrors({})
      toast.success('Message sent! I\'ll get back to you soon.')
    } catch {
      setStatus('error')
      setErrorMsg('Failed to submit. Please try again later.')
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <SuccessAnimation key="success" />
      ) : (
    <form key="form" onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-5 text-left">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((prev) => ({ ...prev, name: '' })) }}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <p id="name-error" className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors((prev) => ({ ...prev, email: '' })) }}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <p id="email-error" className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
          Category
        </label>
        <Select
          value={form.category}
          onValueChange={(value) => setForm({ ...form, category: value })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <Textarea
          id="message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors((prev) => ({ ...prev, message: '' })) }}
          placeholder="Your message..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <p id="message-error" className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>

      {status === 'error' && errorMsg && !Object.keys(errors).length && (
        <p role="alert" className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="w-full"
        size="lg"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
      )}
    </AnimatePresence>
  )
}
