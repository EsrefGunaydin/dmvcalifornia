import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HandbookEditionView from '@/components/handbook/HandbookEditionView';
import { HANDBOOK_EDITIONS, getHandbookEdition } from '@/data/handbook-editions';

export const dynamicParams = false;

export function generateStaticParams() {
  return HANDBOOK_EDITIONS.map((e) => ({ edition: e.editionSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ edition: string }>;
}): Promise<Metadata> {
  const { edition } = await params;
  const e = getHandbookEdition(edition);
  if (!e) return {};
  return {
    title: e.metaTitle,
    description: e.metaDescription,
    alternates: { canonical: `https://dmvcalifornia.us/california-driver-handbook/${e.editionSlug}` },
    openGraph: { title: e.metaTitle, description: e.metaDescription, type: 'article' },
  };
}

export default async function HandbookEditionPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition } = await params;
  const e = getHandbookEdition(edition);
  if (!e) notFound();
  return <HandbookEditionView edition={e} />;
}
