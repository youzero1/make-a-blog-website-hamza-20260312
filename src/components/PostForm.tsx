'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostData {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  author?: string;
}

interface PostFormProps {
  post?: PostData;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post?.id;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    body: post?.body || '',
    author: post?.author || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post?.id);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugManuallyEdited ? prev.slug : slugify(newTitle),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEditing ? `/api/posts/${post!.id}` : '/api/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save post');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Post title"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={formData.slug}
          onChange={handleSlugChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="post-slug"
          required
        />
        <p className="text-xs text-gray-500 mt-1">URL: /posts/{formData.slug || 'your-slug'}</p>
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Author <span className="text-red-500">*</span>
        </label>
        <input
          id="author"
          name="author"
          type="text"
          value={formData.author}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Author name"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder="Brief description of the post"
          required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Body <span className="text-red-500">*</span>
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {[
            { label: 'Bold', wrap: ['<strong>', '</strong>'] },
            { label: 'Italic', wrap: ['<em>', '</em>'] },
            { label: 'H2', wrap: ['<h2>', '</h2>'] },
            { label: 'H3', wrap: ['<h3>', '</h3>'] },
            { label: 'Quote', wrap: ['<blockquote>', '</blockquote>'] },
            { label: 'Code', wrap: ['<code>', '</code>'] },
            { label: 'Link', wrap: ['<a href="">', '</a>'] },
            { label: 'UL', wrap: ['<ul>\n  <li>', '</li>\n</ul>'] },
            { label: 'P', wrap: ['<p>', '</p>'] },
          ].map(({ label, wrap }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                const textarea = document.getElementById('body') as HTMLTextAreaElement;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selected = formData.body.substring(start, end);
                const newText =
                  formData.body.substring(0, start) +
                  wrap[0] +
                  selected +
                  wrap[1] +
                  formData.body.substring(end);
                setFormData((prev) => ({ ...prev, body: newText }));
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(
                    start + wrap[0].length,
                    start + wrap[0].length + selected.length
                  );
                }, 0);
              }}
              className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={20}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-vertical"
          placeholder="Write your post content here (HTML is supported)..."
          required
        />
        <p className="text-xs text-gray-500 mt-1">HTML is supported. Use the buttons above to insert formatting.</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}
