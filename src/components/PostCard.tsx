import Link from 'next/link';

interface PostCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

export default function PostCard({ title, slug, excerpt, author, createdAt }: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${slug}`}>
        <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2 transition-colors">
          {title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By <span className="font-medium text-gray-700">{author}</span></span>
        <time dateTime={createdAt}>{formattedDate}</time>
      </div>
    </article>
  );
}
