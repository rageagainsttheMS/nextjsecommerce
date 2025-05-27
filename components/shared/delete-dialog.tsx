"use client";

import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        setOpen(false);
        toast({
          description: res.message,
        });
      }
    });
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive" className="ml-2">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={"destructive"}
              size={"sm"}
              disabled={isPending}
              onClick={handleDeleteClick}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
