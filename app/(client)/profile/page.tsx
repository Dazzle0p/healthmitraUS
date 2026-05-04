import { getUserProfile } from "@/app/actions/user";
import ProfileView from "@/components/client/ProfileView";

export const dynamic = 'force-dynamic';

export default async function ProfilePage(props: { searchParams: Promise<{ tab?: string }> }) {
    const searchParams = await props.searchParams;
    const { success, data } = await getUserProfile();

    const initialTab = searchParams.tab || 'personal';

    // Fallback to minimal profile if fetch fails or map appropriately
    // The ProfileView likely handles partial data or we map usage

    return <ProfileView profile={data || {}} initialTab={initialTab} />;
}
