import { notFound, redirect } from 'next/navigation';
import blogPostsData from '@/data/blog_posts.json';

export async function generateStaticParams() {
  return blogPostsData.posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function EmbedPage({ params }: { params: { slug: string } }) {
  const post = blogPostsData.posts.find((p: any) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Redirect embed URLs to the main post page
  // This handles old WordPress embed URLs
  redirect(`/${params.slug}`);
}
