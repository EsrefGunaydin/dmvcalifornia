import { Metadata } from 'next';
import KeywordHub from '@/components/seo/KeywordHub';
import { getHub } from '@/data/seo-hubs';
const hub = getHub('california-dmv-practice-test-chinese')!;
export const metadata: Metadata = {
  title: hub.metaTitle,
  description: hub.metaDescription,
  keywords: hub.keywords,
  alternates: { canonical: `https://www.dmvcalifornia.us/${hub.slug}` },
  openGraph: { title: hub.metaTitle, description: hub.metaDescription, type: 'website' },
};
export default function CaliforniaPracticeTestChineseHub() {
  return <KeywordHub config={hub} />;
}
