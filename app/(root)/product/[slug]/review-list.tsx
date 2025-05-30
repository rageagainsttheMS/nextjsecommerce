"use client";
import { Review } from "@/app/types";
import Link from "next/link";

import { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, UserIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/ratings";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = async () => {
    const res = await getReviews({productId : productId});
    setReviews([...res]);
  }

  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({productId : productId});
      setReviews(res);
    }

    loadReviews();
  }, [productId])

  return (
    <div className="space-y-4 mt-2">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
      ) : (
        <div>
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/product${productSlug}`}
          >
            Sign In
          </Link>{" "}
          to write a review
        </div>
      )}
      <div className="flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
            <div className="flex-between">
              <CardTitle>{review.title}</CardTitle>
            </div>
            <CardDescription>
              {review.description}
            </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 team-sm text-muted-foreground">
                <Rating value={review.rating}/>
                <div className="flex items-center">
                  <UserIcon className="mr-1 h-3 w-3"></UserIcon>
                  {review.user ? review.user.name : 'User'}
                </div>
                 <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3">
                    {formatDateTime(review.createdAt).dateOnly}
                  </Calendar>
                 </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
