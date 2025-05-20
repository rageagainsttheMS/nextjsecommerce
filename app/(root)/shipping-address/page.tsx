import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserByID } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/app/types";
import CheckOutSteps from "@/components/shared/checkout-steps";
export const metadata : Metadata = {
    title : 'Shipping Address'
}
const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if(!cart || cart.items.length === 0){
        redirect('/cart')
    }

    const session = await auth();
    const userId = session?.user?.id;
    if(!userId){
        throw new Error('No user ID')
    }

    const user = await getUserByID(userId);

    return ( 
    <>
    <CheckOutSteps current={1}/>
    <ShippingAddressForm address={user.address as ShippingAddress}/></>
 );
}
 
export default ShippingAddressPage;