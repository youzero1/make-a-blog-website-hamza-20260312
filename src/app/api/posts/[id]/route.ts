import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, body: postBody, author } = body;

    if (!title || !slug || !excerpt || !postBody || !author) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check for duplicate slug (excluding current post)
    const existing = await postRepository.findOne({ where: { slug } });
    if (existing && existing.id !== post.id) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    post.title = title;
    post.slug = slug;
    post.excerpt = excerpt;
    post.body = postBody;
    post.author = author;

    await postRepository.save(post);

    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);
    const post = await postRepository.findOne({ where: { id: parseInt(params.id, 10) } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepository.remove(post);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
