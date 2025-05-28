'use server';
import { convertToPlainObject, formatErrors } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validations";
import z from "zod";

export async function getLatestProducts(){
    const data = await prisma.product.findMany({
        take : LATEST_PRODUCTS_LIMIT,
        orderBy : {createdAt: 'desc'}
    });
    return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string){
    return await prisma.product.findFirst({
        where: { slug : slug}
    });
}

export async function getProductByID(id: string){
    const product =  await prisma.product.findFirst({
        where: { id : id}
    });
    return convertToPlainObject(product);
}

export async function getAllProducts(
    {
      query,
      limit = PAGE_SIZE,
      page,
      category
    }: {
      query : string;
      limit?: number;
      page: number;
      category? : string;
    }) {
      const data = await prisma.product.findMany({
        orderBy : {createdAt : 'desc'},
        take: limit,
        skip: (page - 1) * limit
      });
    
      const dataCount = await prisma.product.count();
      return {
        data,
        totalPages: Math.ceil(dataCount / limit),
      };
}

export async function deleteProduct(id : string){
    try {
      const productExists = await prisma.product.findFirst({
        where : { id : id }
      })

      if(!productExists) throw new Error('Product not found');

      await prisma.product.delete({where : {id}});

      revalidatePath('/admin/products');
      return {
        success : true,
        message : 'Product deleted successfully'
      }
    } catch (error) {
        return {success : false, message: formatErrors(error)}
    }
}

export async function createProduct(data : z.infer<typeof insertProductSchema>){
    try {
      const product = insertProductSchema.parse(data);
      await prisma.product.create({data : product});
      
      revalidatePath('/admin/products');
       return {
        success : true,
        message : 'Product created successfully'
      }
    } catch (error) {
        return {success : false, message: formatErrors(error)}
    }
}

export async function updateProduct(data : z.infer<typeof updateProductSchema>){
    try {
      const product = updateProductSchema.parse(data);
      const productExists = await prisma.product.findFirst({
        where : { id : product.id }
      })

      if(!productExists) throw new Error('Product not found');

      await prisma.product.update({
        where : {id : product.id},
        data : product
      })

      revalidatePath('/admin/products');
       return {
        success : true,
        message : 'Product updated successfully'
      }
    } catch (error) {
        return {success : false, message: formatErrors(error)}
    }
}