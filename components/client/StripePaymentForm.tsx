'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

interface StripePaymentFormProps {
    total: number;
    planId: string;
    promoCode?: string;
    onSuccess: (paymentId: string) => void;
}

export default function StripePaymentForm({ total, planId, promoCode, onSuccess }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message || 'Payment failed');
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            onSuccess(paymentIntent.id);
        } else {
            toast.error('Payment status: ' + (paymentIntent?.status || 'Unknown'));
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <PaymentElement />
            
            <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg text-indigo-700 text-sm mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Your payment is secured with Stripe SSL encryption</span>
            </div>

            <Button 
                type="submit" 
                disabled={!stripe || loading} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold shadow-lg"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                    </>
                ) : (
                    `Pay $${total.toLocaleString()}`
                )}
            </Button>
        </form>
    );
}
