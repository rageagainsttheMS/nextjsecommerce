import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

const StripePayment = ({priceInCents, orderId, clientSecret} : {priceInCents : number; orderId : string; clientSecret : string | null}) => {
    
    const stripePromise = loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) as string);

    const StripeForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [isLoading, setIsLoading] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [email, setEmail] = useState('')

        function handleSubmit(event: FormEvent<HTMLFormElement>): void {
            event.preventDefault();
            if(stripe === null || elements === null || email === null){
                return;
            }

            setIsLoading(true);
            stripe.confirmPayment({
                elements, 
                confirmParams : {
                    return_url : `${SERVER_URL}/order/${orderId}/stripe-payment-success`
                }
            }).then(({error}) => {
                if(error?.type === 'card_error' || error?.type === 'validation_error'){
                    setErrorMsg(error?.message ?? 'An unknown error occurred')
                } else if(error){
                    setErrorMsg('An unknown error occurred')
                }
            }).finally(() => {
                setIsLoading(false);
            })
        }

        return (
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div className="text-xl">Stripe Checkout</div>
                {errorMsg && (
                    <div className='text-destructive'>
                        {errorMsg}
                    </div>
                )}
                <PaymentElement/>
                <div>
                    <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)}/>
                </div>
                <Button className='w-full' size='lg' disabled={stripe === null || elements === null || isLoading}>
                    {isLoading ? 'Purchasing...' : `Purchase ${formatCurrency(priceInCents / 100)} `}
                </Button>
            </form>
        )
    }

    
    return ( <Elements options={{clientSecret : clientSecret ?? undefined, appearance: {
        theme : 'stripe'
    }}} stripe={stripePromise}>
        <StripeForm/>
    </Elements> );
}
 
export default StripePayment;