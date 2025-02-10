import { z }  from 'zod';
import { insertProductSchema } from '@/lib/validations'; 

export type Product = z.infer<typeof insertProductSchema> &{
    id: string;
    rating: number;
    createdAt: Date;
}