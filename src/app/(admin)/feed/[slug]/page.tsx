import { notFound, redirect } from 'next/navigation';

import { getFeedPostBySlug } from '@/features/feed/actions';
import { FeedDetail } from '@/features/feed/components/FeedDetail';

import { auth } from '@/shared/lib/auth';

interface FeedPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function FeedPostPage({ params }: FeedPostPageProps) {
    const session = await auth();
    if (!session) redirect('/login');

    const { slug } = await params;
    const { post, others } = await getFeedPostBySlug(slug);

    if (!post) notFound();

    return <FeedDetail post={post} others={others} currentUser={session.user} />;
}
