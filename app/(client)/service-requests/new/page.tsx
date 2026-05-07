import { ServiceRequestForm } from "@/components/client/ServiceRequestForm";
import { Suspense } from "react";
import { getUserProfile } from "@/app/actions/user";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewServiceRequestPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirect=/service-requests/new");
    }

    const { data: profile } = await getUserProfile();

    // Fetch active subscriptions
    const { data: memberPlans } = await supabase
        .from('ecard_members')
        .select(`
            plan_id,
            plans (
                allowed_services
            )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

    // Aggregate allowed_services from all active plans
    const allowedServicesSet = new Set<string>();
    
    if (memberPlans) {
        for (const membership of memberPlans) {
            const plan = membership.plans as any;
            if (plan && Array.isArray(plan.allowed_services)) {
                for (const svc of plan.allowed_services) {
                    allowedServicesSet.add(svc);
                }
            }
        }
    }

    const allowedServices = Array.from(allowedServicesSet);

    return (
        <div className="container mx-auto max-w-4xl py-6 animate-in fade-in-50">
            <Suspense fallback={<div>Loading form...</div>}>
                <ServiceRequestForm 
                    userProfile={profile || {}} 
                    allowedServices={allowedServices}
                />
            </Suspense>
        </div>
    );
}
