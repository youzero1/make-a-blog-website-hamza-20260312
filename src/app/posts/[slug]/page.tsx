import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post: Post | null = null;

  try {
    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);
    post = await postRepository.findOne({ where: { slug: params.slug } });
  } catch (error) {
    console.error('Error fetching post:', error);
  }

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
        &larr; Back to all posts
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>By <span className="font-medium text-gray-700">{post.author}</span></span>
            <span>&bull;</span>
            <time dateTime={post.createdAt.toISOString()}>{formattedDate}</time>
          </div>
          {post.excerpt && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        <div
          className="prose-content text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
    </div>
  );
}
