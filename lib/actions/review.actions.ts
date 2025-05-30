"use server";

import z from "zod";
import { insertReviewSchema } from "../validations";
import { formatErrors } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });
    const productBeingReviewed = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!productBeingReviewed) throw new Error("Product not found");

    const reviewExisting = await prisma.review.findFirst({
      where: { productId: review.productId, userId: review.userId },
    });

    prisma.$transaction(async (tx) => {
      if (reviewExisting) {
        await tx.review.update({
          where: { id: reviewExisting.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        await tx.review.create({
          data: review,
        });
      }

      const avgRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews: numReviews,
        },
      });
    });

    revalidatePath(`/product/${productBeingReviewed.slug}`);
    return { success: true, message: "Review updated successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}

export async function getReviews({ productId }: { productId: string }) {
  return await prisma.review.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy : {createdAt : 'desc'}
  });
}

export async function getReviewByUserID({productId} : {productId : string;}){
  const session = await auth();

  if(!session){
    throw new Error('User not authenticated')
  }

  return await prisma.review.findFirst({
    where : {
      productId : productId,
      userId : session?.user?.id
    }
  })
}



