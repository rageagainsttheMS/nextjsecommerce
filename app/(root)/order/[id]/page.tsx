import { ShippingAddress } from "@/app/types";
import { getOrderByID } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";
import Stripe from "stripe";
import { CURRENCY_AUD } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const { id } = await props.params;
  const order = await getOrderByID(id);
  if (!order) notFound();

  let client_secret = null;
  if (!order.isPaid && order.paymentMethod === "Stripe") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice)),
      currency: CURRENCY_AUD,
      metadata : {
        orderId : order.id
      }
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      isAdmin={session?.user?.role === "admin" || false}
      payPalClientId={`${process.env.PAYPAL_CLIENT_ID}`}
      stripeClientSecret = {client_secret}
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentResult : {
            email_address : '',
            id : '',
            price_paid : '',
            status : ''
        }
      }}
    />
  );
};

export default OrderDetailsPage;
