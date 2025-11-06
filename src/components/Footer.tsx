import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/practice-test" className="text-gray-300 hover:text-white transition-colors">
                  Practice Tests
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
              <li>
                <Link href="/dmv-offices" className="text-gray-300 hover:text-white transition-colors">
                  DMV Offices
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
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
