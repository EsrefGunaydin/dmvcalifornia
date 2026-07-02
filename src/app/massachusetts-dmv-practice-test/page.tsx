import { Metadata } from 'next';
import KeywordHub from '@/components/seo/KeywordHub';
import { getHub } from '@/data/seo-hubs';
const hub = getHub('massachusetts-dmv-practice-test')!;
export const metadata: Metadata = {
  title: hub.metaTitle,
  description: hub.metaDescription,
  keywords: hub.keywords,
  alternates: { canonical: `https://dmvcalifornia.us/${hub.slug}` },
  openGraph: { title: hub.metaTitle, description: hub.metaDescription, type: 'website' },
};
export default function MassachusettsDmvPracticeTestHub() {
  return <KeywordHub config={hub} />;
}
