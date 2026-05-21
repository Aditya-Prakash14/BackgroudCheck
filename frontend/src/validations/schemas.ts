import { z } from 'zod';

// Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// Registration Validation Schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Candidate Submission Validation Schema
export const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  aadhaarNumber: z.string().regex(/^(\d{12}|XXXX-XXXX-\d{4})$/, 'Aadhaar number must be exactly 12 digits or in masked format (XXXX-XXXX-1234)'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'PAN must be in standard format (e.g. ABCDE1234F)'),
  dob: z.string().min(1, 'Date of Birth is required'),
  address: z.string().min(10, 'Address must be at least 10 characters long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CandidateFormData = z.infer<typeof candidateSchema>;
