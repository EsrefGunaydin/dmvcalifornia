import Link from 'next/link';
import officesData from '../../data/dmv_offices.json';

export const metadata = {
  title: 'California DMV Offices - Find Your Local DMV | DMV California',
  description: 'Find all California DMV office locations, hours, phone numbers, and services. Get directions to your nearest DMV office.',
};

export default function DMVOfficesPage() {
  const offices = officesData.offices;

  // Group offices by first letter
  const groupedOffices = offices.reduce((acc, office) => {
    const firstLetter = office.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(office);
    return acc;
  }, {} as Record<string, typeof offices>);

  const letters = Object.keys(groupedOffices).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-600">
            DMV California
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            California DMV Office Locations
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Find your nearest DMV office location, hours of operation, phone numbers, and available services.
          </p>
          <div className="mt-6">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
              {offices.length} Locations Statewide
            </span>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white border-b py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary hover:text-white text-sm font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Offices List */}
      <section className="container mx-auto px-4 py-12">
        {letters.map(letter => (
          <div key={letter} id={`letter-${letter}`} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-primary pb-2">
              {letter}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedOffices[letter].map(office => (
                <Link
                  key={office.id}
                  href={`/${office.slug}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary group"
                >
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {office.name} DMV
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {office.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {office.hours}
                  </div>
                  <div className="mt-3 text-primary font-semibold text-sm flex items-center">
                    View Details
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} DMV California. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Not affiliated with the California Department of Motor Vehicles
          </p>
        </div>
      </footer>
    </div>
  );
}
