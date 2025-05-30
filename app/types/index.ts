import { z }  from 'zod';
import { cartItemsSchema, cartSchema, inserOrderItemSchema, insertOrderSchema, insertProductSchema, insertReviewSchema, paymentResultSchema, shippingAddressSchema } from '@/lib/validations'; 

export type Product = z.infer<typeof insertProductSchema> &{
    id: string;
    rating: string;
    numReviews : number;
    createdAt: Date;
}

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof cartItemsSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid : boolean;
    paidAt : Date | null;
    isDelivered : boolean;
    deliveredAt : Date | null;
    orderItems : OrderItem[];
    user: { name: string; email : string}
}
export type OrderItem = z.infer<typeof inserOrderItemSchema>

export type PaymentResult = z.infer<typeof paymentResultSchema>

export type SalesDataType = {
    month : string;
    totalSales : number;
}

export type Review = z.infer<typeof insertReviewSchema> & {
    id : string;
    createdAt : Date;
    user?: {name : string}
}

