import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import YouTubeCTA from '../../components/YouTubeCTA';
import { Play } from 'lucide-react';
import videosData from '../../data/videos.json';

export const metadata = {
  title: 'Videos — DMV California',
  description: 'Watch our California DMV videos: practice test walkthroughs, driving tips, license guides, and more.',
};

const OUR_VIDEOS = videosData.ourVideos;

const DMV_VIDEOS = [
  {
    id: 'eQ8AGkmtS1Q',
    title: 'Tips to pass your driving test',
    description: 'The official California DMV guide to what examiners look for and how to avoid the most common test failures.',
  },
  {
    id: 'cYdZZdtdsMw',
    title: 'Traffic signs — rules of the road',
    description: 'Official California DMV lesson on regulatory, warning, and guide signs: shapes, colors, and what they require.',
  },
  {
    id: 'xmNYLKYcdrw',
    title: 'Right of way — rules of the road',
    description: 'Who goes first at intersections, crosswalks, and merges — one of the most tested topics on the written exam.',
  },
  {
    id: 'QHFpGAmgct4',
    title: 'Intersections — rules of the road',
    description: 'How to navigate controlled and uncontrolled intersections, 4-way stops, and left-turn situations safely.',
  },
  {
    id: '04-J4_dfXxU',
    title: 'Speed limits — rules of the road',
    description: 'Every California default speed limit explained: residential streets, school zones, alleys, freeways, and the Basic Speed Law.',
  },
  {
    id: '9HwjrJ7J-oU',
    title: 'Parking — rules of the road',
    description: 'Colored curbs, hill parking, fire hydrant distances, and other parking rules that show up on the written test.',
  },
  {
    id: '7GrrcUR97E8',
    title: 'What to do during a traffic stop',
    description: 'Official Department of Justice and California DMV guidance on how to handle a traffic stop safely and lawfully.',
  },
  {
    id: 'D6mHYKMdPJY',
    title: 'Preparing for the motorcycle driving test',
    description: 'Official California DMV motorcycle test prep: what the examiner watches for and how to ride through each maneuver.',
  },
  {
    id: 'ILbrTbz3uLM',
    title: 'Upgrade to a REAL ID now',
    description: 'What a REAL ID is, why you need it for domestic flights and federal buildings, and what documents to bring to the DMV.',
  },
];

function VideoCard({ video }: { video: { id: string; title: string; description: string } }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-primary fill-primary ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1 leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">{video.description}</p>
      </div>
    </a>
  );
}

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">DMV California videos</h1>
              <p className="text-base text-white/90 max-w-xl">
                Practice test walkthroughs, driving test tips, license guides, and more — all free on our YouTube channel.
              </p>
            </div>
            <YouTubeCTA variant="subscribe" compact source="videos_page_header" className="mx-auto md:mx-0" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-14">

        {/* Our videos */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">From our channel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OUR_VIDEOS.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

        {/* Official CA DMV videos */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Official California DMV videos</h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              CA DMV
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6 -mt-3">
            Produced by the California DMV and the Department of Justice. Covers the core topics tested on the written exam.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DMV_VIDEOS.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

      </main>

      <CookieBanner />
      <Footer />
    </div>
  );
}
