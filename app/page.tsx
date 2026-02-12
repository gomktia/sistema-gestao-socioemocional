import { redirect } from 'next/navigation';
import { getCurrentUser, getHomeForRole } from '@/lib/auth';
import LandingPage from './marketing/page';

export default async function Home() {
    const user = await getCurrentUser();

    if (user) {
        const homePath = getHomeForRole(user.role);
        redirect(homePath);
    }

    return <LandingPage />;
}
