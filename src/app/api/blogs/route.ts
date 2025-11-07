import { NextResponse } from 'next/server';
import blogsData from '@/data/blog_posts.json';

export async function GET() {
  try {
    // Transform blog posts to include essential info without full content
    const blogs = blogsData.posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      author: post.author,
      tags: post.tags,
      views: post.views,
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
