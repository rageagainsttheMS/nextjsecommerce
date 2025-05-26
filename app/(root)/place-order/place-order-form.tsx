"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PlaceOrderForm = () => {
  const router = useRouter();
   const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    setPending(true);
    event.preventDefault();
    const res = await createOrder();
    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
    setPending(false);
  };

  const PlaceOrderButton = () => {
    return (
      <Button disabled={pending} className="px-4 w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4"></Check>
        )}
        Create Order
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
