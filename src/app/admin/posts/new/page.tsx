import { checkAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/PostForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    redirect('/admin');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
}
