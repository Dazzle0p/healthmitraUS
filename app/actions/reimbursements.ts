'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ReimbursementClaim, ClaimStatus } from '@/types/reimbursements';
import { sendMail } from '@/lib/email';
import { 
    billReimbursementOpdTemplate, 
    billRejectedTemplate 
} from '@/lib/email-templates';

export async function getClaims() {
    const supabase = await createAdminClient();

    // Join with profiles if possible, or just fetch
    const { data, error } = await supabase.from('reimbursement_claims').select(`
        *,
        user:user_id(full_name)
    `).order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };

    const claims: ReimbursementClaim[] = data.map((c: any) => ({
        id: c.id,
        claimId: c.claim_id_display || `CLM-${(c.id || '').substring(0, 8).toUpperCase()}`,
        status: (c.status as ClaimStatus) || 'pending',
        customerId: c.user_id,
        customerName: c.user?.full_name || 'Unknown User',
        planName: c.plan_name || 'Standard Plan',
        title: c.title || 'Reimbursement Claim',
        amount: c.amount_requested || c.amount || 0,
        approvedAmount: c.amount_approved,
        billDate: c.bill_date,
        providerName: c.provider_name || 'Unknown Provider',
        submittedAt: c.created_at,
        documents: c.documents || [],
        adminNotes: c.admin_notes,
        customerComments: c.customer_comments
    }));

    return { success: true, data: claims };
}

export async function processClaim(id: string, status: ClaimStatus, data: { amount?: number; notes?: string }) {
    const supabase = await createAdminClient();
    const updates: any = {
        status,
        updated_at: new Date().toISOString()
    };

    if (status === 'approved' && data.amount !== undefined) {
        updates.amount_approved = data.amount;
    }

    if (data.notes) {
        updates.admin_notes = data.notes;
        if (status === 'rejected') updates.rejection_reason = data.notes;
    }

    const { error } = await supabase.from('reimbursement_claims').update(updates).eq('id', id);

    if (error) return { success: false, error: error.message };

    // Send notification email
    try {
        const { data: claim } = await supabase
            .from('reimbursement_claims')
            .select('user_id, title')
            .eq('id', id)
            .single();
            
        if (claim) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('email, full_name')
                .eq('id', claim.user_id)
                .single();
                
            if (profile?.email) {
                if (status === 'approved') {
                    await sendMail({
                        to: profile.email,
                        subject: `Reimbursement Approved - HealthMitra`,
                        html: billReimbursementOpdTemplate({
                            customerName: profile.full_name || profile.email.split('@')[0],
                            amount: data.amount || 0,
                            percentage: '100', // Default or calculated
                            taxAmount: '0' // Default or calculated
                        })
                    });
                } else if (status === 'rejected') {
                    await sendMail({
                        to: profile.email,
                        subject: `Reimbursement Claim Update - HealthMitra`,
                        html: billRejectedTemplate({
                            customerName: profile.full_name || profile.email.split('@')[0],
                            remarks: data.notes || 'No remarks provided.'
                        })
                    });
                }
            }
        }
    } catch (emailErr) {
        console.error('Failed to send claim status email:', emailErr);
    }

    return { success: true, message: `Claim ${status} successfully` };
}
