import { phoneRegex } from '@/constants'
import { z } from 'zod'

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export const RegisterSchema = z.object({
  first_name: z.string().min(3, {
    message: 'Minimum 3 characters required',
  }),
  last_name: z.string().min(3, {
    message: 'Minimum 3 characters required',
  }),
  company: z.string().min(3, {
    message: 'Minimum 3 characters required',
  }),
  phone: z.string().regex(phoneRegex, 'Invalid Number!'),

  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
})
