import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CookieBanner from '../../components/CookieBanner';
import { Play } from 'lucide-react';

export const metadata = {
  title: 'Videos — DMV California',
  description: 'Watch our California DMV videos: practice test walkthroughs, driving tips, license guides, and more.',
};

const VIDEOS = [
  {
    id: 'AAYjx6l9X5g',
    title: 'California DMV practice test 2026',
    description: '46 real questions with answers and full explanations, covering every topic on the written exam.',
  },
  {
    id: 'qoAq535Khqc',
    title: 'How to renew your driver license at a DMV kiosk',
    description: 'Step-by-step walkthrough of the DMV Now self-service kiosk renewal process.',
  },
  {
    id: '__jvm6b2l78',
    title: "State driver's licenses: all 51 designs",
    description: "A visual tour of every U.S. state driver's license design, including REAL ID features and security elements.",
  },
  {
    id: 'ZILES86M7Ic',
    title: 'How to get a driver license as an international student in the USA (2026)',
    description: 'What international students need to get a U.S. driver\'s license, from documentation to the road test.',
  },
  {
    id: 'JgdKvdyQ87s',
    title: 'Behind the wheel mistakes that fail the driving test',
    description: 'The most common errors drivers make during the California behind-the-wheel test, and how to avoid them.',
  },
  {
    id: 'svw0ITHJJFM',
    title: 'Bad driving habits that cost you points and money',
    description: 'Everyday habits California drivers develop that lead to violations, fines, and higher insurance rates.',
  },
];

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">DMV California videos</h1>
          <p className="text-base text-white/90 max-w-xl mx-auto">
            Practice test walkthroughs, driving test tips, license guides, and more — all free on our YouTube channel.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
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

              {/* Card body */}
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-1 leading-snug group-hover:text-primary transition-colors">
                  {video.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">{video.description}</p>
              </div>
            </a>
          ))}
        </div>
      </main>

      <CookieBanner />
      <Footer />
    </div>
  );
}
