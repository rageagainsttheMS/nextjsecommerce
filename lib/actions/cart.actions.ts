'use server';
import { CartItem } from "@/app/types";
import { convertToPlainObject, formatErrors, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemsSchema, cartSchema } from "../validations";
import { GST } from "../constants";
import { revalidatePath } from "next/cache";

const calcPrice = (items : CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0));
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(GST * itemsPrice);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    return {
        itemsPrice : itemsPrice.toFixed(2),
        shippingPrice : shippingPrice.toFixed(2),
        taxPrice : taxPrice.toFixed(2),
        totalPrice : totalPrice.toFixed(2)
    }
}

export async function addItemToCart(data : CartItem){
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId){
            throw new Error('Cart session not found');
        }

        const session = await auth();
        const userId = session?.user?.id ? session.user.id : undefined;

        const cart = await getMyCart();

        const item = cartItemsSchema.parse(data);

        const product = await prisma.product.findFirst({
            where : {id : item.productId}
        })

        if(!product) throw new Error('Product not found');

        if(!cart){
            const newCart = cartSchema.parse({
                userId : userId,
                items: [item],
                sessionCartId : sessionCartId,
                ...calcPrice([item])
            });

            await prisma.cart.create({
                data: newCart,
            })

            revalidatePath(`/product/${product.slug}`);

            return {
                success : true,
                message : `${product.name} added to cart`
            }
        } else {
            const existingItem = cart.items.find((x) => x.productId === item.productId);
            if(existingItem){
                if(product.stock < existingItem.qty + 1){
                    throw new Error('Not enough stock');
                }

                existingItem.qty = existingItem.qty + 1;
            } else {
                if(product.stock < item.qty + 1){
                    throw new Error('Not enough stock');
                }

                cart.items.push(item);
            }

            await prisma.cart.update({
                where : {id : cart.id},
                data : {
                    items: cart.items,
                    ...calcPrice(cart.items)
                }
            })

            revalidatePath(`/product/${product.slug}`);

            return {
                success : true,
                message : `${product.name} ${existingItem ? 'updated in' : 'added to' } cart`
            }
        }
    } catch (error){
        return {
            success : false,
            message : formatErrors(error)
        }
    }
}   

export async function getMyCart(){
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId){
        throw new Error('Cart session not found');
    }

    const session = await auth();
    const userId = session?.user?.id ? session.user.id : undefined;

    const cart = await prisma.cart.findFirst({
        where : userId ? { userId : userId} : {sessionCartId : sessionCartId}
    })

    if(!cart){
        return undefined;
    }

    return convertToPlainObject({...cart, 
        items: cart.items as CartItem [], 
        itemsPrice : cart.itemsPrice.toString(),
        totalPrice : cart.totalPrice.toString(),
        shippingPrice : cart.shippingPrice.toString(),
        taxPrice : cart.taxPrice.toString()
    });
}

export async function removeItemFromCart(productId : string){
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId){
            throw new Error('Cart session not found');
        }

        const product = await prisma.product.findFirst({
            where : {id : productId}
        })

        if(!product) throw new Error('Product not found');

        const cart = await getMyCart();
        if(!cart){
            throw new Error('Cart not found');
        }

        const exist = cart.items.find(x => x.productId === productId);
        if(!exist){
            throw new Error('Item not found')
        }

        if(exist.qty === 1){
            cart.items = cart.items.filter((x) => x.productId !== exist.productId);
        } else {
            (cart.items.find(x => x.productId === productId))!.qty = exist.qty - 1;
        }

        await prisma.cart.update({
            where : {id : cart.id},
            data : {
                items: cart.items,
                ...calcPrice(cart.items)
            }
        })

        revalidatePath(`/product/${product.slug}`);

        return {
            success : true,
            message : `${product.name} was removed from cart`
        }


    } catch(error){
        return {
            success : false,
            message : formatErrors(error)
        }
    }
}