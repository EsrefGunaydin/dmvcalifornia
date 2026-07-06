'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AlsoReadCardProps {
  post: { slug: string; title: string };
}

/** Compact mid-article cross-link to a related post. */
export default function AlsoReadCard({ post }: AlsoReadCardProps) {
  const handleClick = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'also_read_click', { next_post: post.slug });
    }
  };

  return (
    <Link
      href={`/${post.slug}`}
      onClick={handleClick}
      className="my-8 block rounded-lg border-2 border-primary/30 bg-primary/5 px-5 py-4 hover:bg-primary/10 transition-colors group no-underline"
    >
      <span className="block text-xs font-semibold uppercase tracking-wide text-primary mb-1">
        Also read
      </span>
      <span className="flex items-center justify-between gap-3">
        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
          {post.title}
        </span>
        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
