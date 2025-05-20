import { getMyCart } from "@/lib/actions/cart.actions";
import CartTable from "./cart-table";
import { Metadata } from "next";

export const metadata : Metadata = {
    title: 'Shopping Cart'
}

const CartPage =  async () => {
    const cart = await getMyCart();
    return ( <CartTable cart={cart}/> );
}
 
export default CartPage;