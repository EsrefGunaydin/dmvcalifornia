import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy - DMV California',
  description: 'Privacy Policy and Cookie Policy for DMVCalifornia.us',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Website</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>"DMVCalifornia.us"</strong> is a privately-owned blog and is{' '}
              <strong>NOT affiliated with government agencies or the California Department of Motor Vehicles (DMV)</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to help California drivers navigate DMV procedures confidently by providing
              clear, simplified guides and resources to make your DMV experience as smooth as possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not actively collect, store, or share personal information from our visitors. However,
              like most websites, we may use third-party services that collect basic usage data:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Page views and navigation patterns</li>
              <li>Browser type and operating system</li>
              <li>Referring website (if applicable)</li>
              <li>Time and date of visit</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use minimal cookies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Essential Cookies:</strong> To remember your cookie consent preference
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand how visitors use our website (via Google Analytics)
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not use cookies for advertising purposes or to track you across different websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Google Analytics:</strong> To analyze website traffic and user behavior
              </li>
              <li>
                <strong>Google AdSense:</strong> To display relevant advertisements
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These services may collect their own data as per their respective privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or share your personal information with third parties, except:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
              <li>When required by law or legal process</li>
              <li>To protect our rights or the rights of others</li>
              <li>In connection with third-party services mentioned above</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">External Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to external websites, including official government websites
              like DMV.ca.gov. We are not responsible for the privacy practices or content of these
              external sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Opt out of cookie tracking by adjusting your browser settings</li>
              <li>Request information about data we may have collected</li>
              <li>Request deletion of any personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website is not directed at children under the age of 13. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of any significant
              changes by posting a notice on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary-600 font-semibold transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
