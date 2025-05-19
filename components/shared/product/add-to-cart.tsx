'use client'
import { Cart, CartItem } from "@/app/types/index";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Minus, Plus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const AddToCart = ({cart, item } : {cart?: Cart, item : CartItem}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    const handleAddToCart = async (item: CartItem) => {
        startTransition(async () => {
            const response = await addItemToCart(item);
            if(!response.success){
                toast({
                    variant: 'destructive',
                    description : response.message
                })
                return;
            }
        
            toast({
                variant : 'default',
                description : response.message,
                action : (<ToastAction className="bg-primary text-white hover:bg-gray-800" altText="Go To Cart" onClick={() => router.push('/cart')}>Go To Cart</ToastAction>)
            })
        })
    }

    const handleRemoveFromCart = async(item : CartItem) => {
        startTransition(async () => {
            const response = await removeItemFromCart(item.productId);
            toast({
                variant: response.success ? 'default' : 'destructive',
                description : response.message
            })
        })
          
    }

    const existItem = cart?.items.find((x) => x.productId === item.productId);

    return existItem ? (
        <div className="flex items-center justify-center w-full">
          <div className="inline-flex items-center border rounded-md">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="h-8 px-2 rounded-r-none"
              onClick={() => handleRemoveFromCart(item)}
              aria-label="Decrease quantity"
              disabled={isPending}
            >
              {isPending ? <Loader className="w-4 h-4 animate-spin"/> : <Minus className="h-4 w-4" />}
            </Button>
            
            <span className="px-3 py-1 font-medium border-x">
              {existItem.qty}
            </span>
            
            <Button 
              type="button" 
              variant="ghost"
              size="sm" 
              className="h-8 px-2 rounded-l-none"
              onClick={() => handleAddToCart(item)}
              aria-label="Increase quantity"
              disabled={isPending}
            >
              {isPending ? <Loader className="w-4 h-4 animate-spin"/> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          className="w-full" 
          type="button" 
          onClick={() => handleAddToCart(item)}
          disabled={isPending}
        >
          {isPending ? <Loader className="w-4 h-4 animate-spin mr-2"/> : <Plus className="h-4 w-4 mr-2" />} 
          Add To Cart
        </Button>
      );
}
 
export default AddToCart;