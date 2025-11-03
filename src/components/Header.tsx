import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Tagline */}
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary hover:text-primary-600">
              DMV California
            </h1>
            <p className="text-sm text-gray-600 mt-1">Simplified DMV California Guide</p>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Blog
            </Link>
            <Link href="/dmv-offices" className="text-gray-700 hover:text-primary font-medium transition-colors">
              DMV Offices
            </Link>
            <Link href="/privacy-policy" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Privacy
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
