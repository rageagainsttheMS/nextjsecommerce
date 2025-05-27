import { ShippingAddress } from "@/app/types";
import { getOrderByID } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

export const metadata : Metadata = {
    title : 'Order Details'
}

const OrderDetailsPage = async (props: {params: Promise<{id:string}>}) => {

    const session = await auth();
    
    const { id } = await props.params;
    const order = await getOrderByID(id);
    if(!order) notFound();
    return ( <OrderDetailsTable isAdmin={session?.user?.role === 'admin' || false} payPalClientId={`${process.env.PAYPAL_CLIENT_ID}`} order={{
        ...order,
        shippingAddress : order.shippingAddress as ShippingAddress
    }}/>);
}
 
export default OrderDetailsPage;