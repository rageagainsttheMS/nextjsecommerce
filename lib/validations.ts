import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS } from './constants';

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

export const updateProductSchema = insertProductSchema.extend({
    id : z.string().min(1, 'Id is required')
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

export const cartItemsSchema = z.object({
    productId : z.string().min(1, 'Product is required'),
    name : z.string().min(1, 'Name is required'),
    slug : z.string().min(1, 'Slug is required'),
    qty : z.number().int().nonnegative('Quantity must be a positive number'),
    image : z.string().min(1, 'Image is required'),
    price : currency
})

export const cartSchema = z.object({
    items: z.array(cartItemsSchema),
    itemsPrice: currency,
    totalPrice : currency,
    shippingPrice : currency,
    taxPrice : currency,
    sessionCartId : z.string().min(1, 'Session cart ID is required'),
    userId : z.string().optional().nullable()
})

export const shippingAddressSchema = z.object({
    fullName : z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress : z.string().min(3, 'Address must be at least 3 characters'),
    city : z.string().min(3, 'City must be at least 3 characters'),
    postalCode : z.string().min(3, 'Post code must be at least 3 characters'),
    country : z.string().min(3, 'Country must be at least 3 characters'),
    lat : z.number().optional(),
    long : z.number().optional()
})

export const paymentMethodSchema = z.object({
    type: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        path: ['type'],
        message: 'Invalid payment method'
    })
});

export const insertOrderSchema = z.object({
    userId: z.string().min(1, "user is required"),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        path: ['paymentMethod'],
        message: 'Invalid payment method'
    }),
    shippingAddress: shippingAddressSchema
});

export const inserOrderItemSchema = z.object({
    productId : z.string(),
    slug : z.string(),
    image  : z.string(),
    name : z.string(),
    price : currency,
    qty : z.number()

})

export const updateProfileSchema = z.object({
    name : z.string().min(3, 'Name must be at least 3 chars'),
    email : z.string().min(3, 'Email must be at least 3 chars')

})

export const paymentResultSchema = z.object({
    id: z.string(),
    status : z.string(),
    email_address : z.string(),
    price_paid : z.string()
})

