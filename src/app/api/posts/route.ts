import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);

    const [posts, total] = await postRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, body: postBody, author } = body;

    if (!title || !slug || !excerpt || !postBody || !author) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const postRepository = ds.getRepository(Post);

    // Check for duplicate slug
    const existing = await postRepository.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = postRepository.create({ title, slug, excerpt, body: postBody, author });
    await postRepository.save(post);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
