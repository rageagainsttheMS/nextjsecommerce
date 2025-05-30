import { Button } from "@/components/ui/button";
import { getOrderByID } from "@/lib/actions/order.actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {

 const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


  const { id } = await props.params;
  const { payment_intent: intentId } = await props.searchParams;

  const order = await getOrderByID(id);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
  if (
    paymentIntent.metadata.orderId === null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 text-center">
      <h1 className="h1-bold">Thanks for your purchase</h1>
      <div>We are processing your order</div>
      <Button asChild>
        <Link href={`/order/${id}`}>View Order</Link>
      </Button>
    </div>
  );
};

export default SuccessPage;
