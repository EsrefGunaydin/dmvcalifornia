import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Mission Section */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
                DMV California
              </h2>
              <p className="text-sm text-gray-400 mt-1">Your DMV Success Partner</p>
            </Link>
            <p className="text-gray-300 leading-relaxed mt-4 max-w-2xl">
              Our mission is to help California drivers navigate DMV procedures confidently.
              We provide clear, simplified guides and resources to make your DMV experience as smooth as possible.
            </p>
          </div>

          {/* Study Tools */}
          <div>
            <h3 className="text-xl font-bold mb-4">Study Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/california-dmv-practice-test" className="text-gray-300 hover:text-white transition-colors">
                  California DMV Practice Test
                </Link>
              </li>
              <li>
                <Link href="/practice-test" className="text-gray-300 hover:text-white transition-colors">
                  All Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-road-signs-test" className="text-gray-300 hover:text-white transition-colors">
                  Road Signs Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-cheat-sheet" className="text-gray-300 hover:text-white transition-colors">
                  DMV Cheat Sheet
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-test-study-guide" className="text-gray-300 hover:text-white transition-colors">
                  Study Guide
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-marathon-test" className="text-gray-300 hover:text-white transition-colors">
                  Marathon Test
                </Link>
              </li>
              <li>
                <Link href="/20-hardest-dmv-written-test-questions" className="text-gray-300 hover:text-white transition-colors">
                  20 Hardest Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics & More */}
          <div>
            <h3 className="text-xl font-bold mb-4">Topics &amp; More</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/california-dmv-drug-and-alcohol-test" className="text-gray-300 hover:text-white transition-colors">
                  Drug &amp; Alcohol Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-parking-test" className="text-gray-300 hover:text-white transition-colors">
                  Parking Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-speed-limit-test" className="text-gray-300 hover:text-white transition-colors">
                  Speed Limit Test
                </Link>
              </li>
              <li>
                <Link href="/california-dmv-fees" className="text-gray-300 hover:text-white transition-colors">
                  DMV Fees
                </Link>
              </li>
              <li>
                <Link href="/dmv-offices" className="text-gray-300 hover:text-white transition-colors">
                  DMV Offices
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DMVCalifornia.us. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Not affiliated with the California Department of Motor Vehicles
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
