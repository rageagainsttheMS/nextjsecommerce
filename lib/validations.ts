import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Price must have exactly two decimal places');

export const insertProductSchema = z.object({
    name: z.string().min(3, 'Must be at least 3 characters'),
    slug: z.string().min(3, 'Must be at least 3 characters'),
    category: z.string().min(3, 'Must be at least 3 characters'),
    brand: z.string().min(3, 'Must be at least 3 characters'),
    description: z.string().min(3, 'Must be at least 3 characters'),
    stock : z.coerce.number(),
    images : z.array(z.string().min(1, "product must have at least one image")),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

export const signInSchema = z.object({
    email : z.string().email('Invalid email address'),
    password : z.string().min(6, 'Password must be at least 6 characters')
})

export const signUpSchema = z.object({
    email : z.string().email('Invalid email address'),
    password : z.string().min(6, 'Password must be at least 6 characters'),
    name : z.string().min(3, 'Name must be at least 3 characters'),
    confirmPassword : z.string().min(3, 'Password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {message: 'Passwords do not match', path: ['confirmPassword']})

