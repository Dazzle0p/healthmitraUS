import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';
import { validatePromoCode } from '@/app/actions/coupons';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { planId, amount, promoCode } = await request.json();

        // Get Razorpay settings
        const adminClient = await createAdminClient();
        const { data: settings } = await adminClient.from('system_settings')
            .select('key, value')
            .in('key', ['razorpay_enabled', 'razorpay_key_id', 'razorpay_key_secret']);

        const enabled = settings?.find(s => s.key === 'razorpay_enabled')?.value === 'true';
        const keyId = settings?.find(s => s.key === 'razorpay_key_id')?.value;
        const keySecret = settings?.find(s => s.key === 'razorpay_key_secret')?.value;

        if (!enabled || !keyId || !keySecret) {
            return NextResponse.json({ success: false, error: 'Razorpay not configured' }, { status: 400 });
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

        // Security check: ensure amount passed from client matches server calculation
        if (Math.abs(finalAmount - amount) > 0.01) {
            console.error('Price mismatch in order creation:', { finalAmount, amount });
            // For now, use the server-calculated amount to be safe
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
            amount: Math.round(finalAmount * 100),
            currency: 'USD',
            receipt: `hm_${planId}_${Date.now()}`,
            notes: {
                planId,
                userId: user.id,
                promoCode: promoCode || '',
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId,
            }
        });
    } catch (error: any) {
        console.error('Razorpay order error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
