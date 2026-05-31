import { z } from 'zod'
import { SignupRequest } from '#/lib/contracts'

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

export const signupFormSchema = SignupRequest.extend({
  name: z.string().min(2, 'Please enter your name'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords must match',
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type SignupFormValues = z.infer<typeof signupFormSchema>
