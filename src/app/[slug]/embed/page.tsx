import { notFound, redirect } from 'next/navigation';
import blogPostsData from '@/data/blog_posts.json';

export async function generateStaticParams() {
  return blogPostsData.posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPostsData.posts.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Redirect embed URLs to the main post page
  // This handles old WordPress embed URLs
  redirect(`/${slug}`);
}
