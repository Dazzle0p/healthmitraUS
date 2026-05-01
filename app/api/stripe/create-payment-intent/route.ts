import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { validatePromoCode } from '@/app/actions/coupons';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { planId, amount, promoCode } = await request.json();

        // Get Stripe settings
        const adminClient = await createAdminClient();
        const { data: settings } = await adminClient.from('system_settings')
            .select('key, value')
            .in('key', ['stripe_enabled', 'stripe_secret_key']);

        const enabled = settings?.find(s => s.key === 'stripe_enabled')?.value === 'true' || process.env.STRIPE_ENABLED === 'true';
        const secretKey = settings?.find(s => s.key === 'stripe_secret_key')?.value || process.env.STRIPE_SECRET_KEY;

        if (!enabled || !secretKey) {
            return NextResponse.json({ success: false, error: 'Stripe not configured or enabled' }, { status: 400 });
        }

        // Validate plan and amount
        const { data: plan } = await supabase.from('plans').select('*').eq('id', planId).single();
        if (!plan) return NextResponse.json({ success: false, error: 'Plan not found' }, { status: 404 });

        let finalAmount = plan.price;
        if (promoCode) {
            const promoRes = await validatePromoCode(promoCode, plan.price);
            if (promoRes.success && promoRes.data) {
                finalAmount = promoRes.data.finalPrice;
            }
        }

        // Security check
        if (Math.abs(finalAmount - amount) > 0.01) {
            console.error('Price mismatch in Stripe payment creation:', { finalAmount, amount });
        }

        const stripe = new Stripe(secretKey, {
            apiVersion: '2026-04-22.dahlia',
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(finalAmount * 100),
            currency: 'usd',
            metadata: {
                planId,
                userId: user.id,
                promoCode: promoCode || '',
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Stripe payment intent error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create payment' }, { status: 500 });
    }
}
