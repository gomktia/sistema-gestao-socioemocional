import { requireSuperAdmin } from '@/lib/auth';
import { getFeedbacks } from '@/app/actions/feedback';
import { FeedbackClient } from './feedback-client';

export const metadata = {
    title: 'Feedback dos Educadores | Triavium SaaS',
};

export default async function FeedbackPage() {
    await requireSuperAdmin();

    const feedbacks = await getFeedbacks();

    return <FeedbackClient initialFeedbacks={feedbacks} />;
}
