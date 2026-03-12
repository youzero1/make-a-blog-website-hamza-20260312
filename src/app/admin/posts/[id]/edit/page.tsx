import { checkAuth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import PostForm from '@/components/PostForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    redirect('/admin');
  }

  let post: Post | null = null;

  try {
    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);
    post = await postRepository.findOne({ where: { id: parseInt(params.id, 10) } });
  } catch (error) {
    console.error('Error fetching post for edit:', error);
  }

  if (!post) {
    notFound();
  }

  const postData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    author: post.author,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
      <PostForm post={postData} />
    </div>
  );
}
