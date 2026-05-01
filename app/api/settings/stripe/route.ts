import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createAdminClient();
        const { data: settings } = await supabase.from('system_settings')
            .select('key, value')
            .in('key', ['stripe_enabled', 'stripe_publishable_key']);

        const enabled = settings?.find(s => s.key === 'stripe_enabled')?.value === 'true' || process.env.STRIPE_ENABLED === 'true';
        const publishableKey = settings?.find(s => s.key === 'stripe_publishable_key')?.value || process.env.STRIPE_PUBLISHABLE_KEY;

        return NextResponse.json({
            success: true,
            data: {
                enabled,
                publishableKey
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
