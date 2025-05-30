"use client";

import { Review } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createUpdateReview, getReviewByUserID } from "@/lib/actions/review.actions";
import { REVIEW_DEFAULT } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<Review>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: REVIEW_DEFAULT,
  });

  async function handleFormOpen() {
    form.setValue("productId", productId);
    form.setValue("userId", userId);

    const review = await getReviewByUserID({productId : productId});
    if(review){
        form.setValue('title', review.title)
        form.setValue('description', review.description)
        form.setValue('rating', review.rating)
    }
    setOpen(true);
  }

  const onSubmit = async (values: Review) => {
    const res = await createUpdateReview({ ...values, productId });
    if (!res.success) {
      return toast({
        variant: "destructive",
        description: res.message,
      });
    }

    toast({
      variant: "default",
      description: res.message,
    });

    setOpen(false);
    onReviewSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleFormOpen}>Write a Review</Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            <div className="flex items-start gap-2">
                              <StarIcon className="w-4 h-4" />
                              {index + 1}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
