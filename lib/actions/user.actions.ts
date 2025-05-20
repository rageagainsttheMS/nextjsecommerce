'use server';
import { shippingAddressSchema, signInSchema, signUpSchema } from "../validations";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatErrors } from "../utils";
import { ShippingAddress } from "@/app/types";
import { auth } from '@/auth';


export async function signInWithCredentials(prevState : unknown, formData : FormData) {
    try {
        const user = signInSchema.parse({
            email : formData.get('email'),
            password : formData.get('password')
        });
        await signIn('credentials', user);

        return { success : true, message : 'Signed in successfully'}
    } catch (error) {
        if(isRedirectError(error)){
            throw error;
        }

        return {success : false, message : 'Invalid email or password'}
    }
}

export async function signOutUser(){
    await signOut();
}

export async function  signUpUser(prevState: unknown, formData : FormData){
    try {
        const user = signUpSchema.parse({
            email : formData.get('email'),
            name : formData.get('name'),
            password : formData.get('password'),
            confirmPassword : formData.get('confirmPassword')
        })

        const plainPassword = user.password

        user.password = hashSync(user.password, 10);

        await prisma.user.create({
            data : {
                name : user.name,
                email : user.email,
                password : user.password
            }
        })

        await signIn('credentials', {
            email : user.email,
            password : plainPassword
        })

        return {success : true, message : 'User registered successfully'}
    } catch (error) {

        if(isRedirectError(error)){
            throw error;
        }

        return {success : false, message : formatErrors(error)}
    }
}

export async function getUserByID(userId : string){
    const user = await prisma.user.findFirst({
        where : {id : userId}
    });

    if(!user){
        throw new Error('User not found');
    }

    return user;
}

export async function updateUserAddress(data : ShippingAddress){
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where : {id : session?.user?.id}
        })

        if(!currentUser){
            throw new Error("User not found")
        }

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where : {id : currentUser.id},
            data : {address}
        })

        return {
            success : true,
            message : 'User updated successfully'
        }

    } catch (error) {
        return {
            success : false,
            message : formatErrors(error)
        }
    }
}

