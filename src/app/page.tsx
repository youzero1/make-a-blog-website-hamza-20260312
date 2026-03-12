import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

const POSTS_PER_PAGE = 10;

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10));

  let posts: Post[] = [];
  let totalPosts = 0;

  try {
    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);

    const [result, count] = await postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    });

    posts = result;
    totalPosts = count;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Posts</h1>
        <p className="text-gray-600">Thoughts, stories, and ideas</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              author={post.author}
              createdAt={post.createdAt.toISOString()}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="" />
    </div>
  );
}
