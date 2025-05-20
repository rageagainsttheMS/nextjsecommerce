import { z }  from 'zod';
import { cartItemsSchema, cartSchema, insertProductSchema, shippingAddressSchema } from '@/lib/validations'; 

export type Product = z.infer<typeof insertProductSchema> &{
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof cartItemsSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
