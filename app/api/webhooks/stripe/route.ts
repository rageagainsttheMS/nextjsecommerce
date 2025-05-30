import { setOrderPaid } from "@/lib/actions/order.actions";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const { object } = event.data;
    await setOrderPaid({
      orderId: object.metadata.orderId,
      paymentResult: { 
        id: object.id,
        email_address : object.billing_details.email ?? '',
        price_paid : (object.amount / 100).toFixed(),
        status : 'COMPLETED'
       },
    });

    return NextResponse.json({
        message : 'updateOrderToPaid was successful'
    })
  }

  return NextResponse.json({
    message : 'updateOrderToPaid failed'
  })
}
