import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'PillTracker Privacy Policy',
  description: 'What the PillTracker medication reminder app for iPhone, iPad and Apple Watch collects, and what stays on your device.',
  alternates: { canonical: '/pill-tracker-privacy' },
};

export default function PillTrackerPrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">PillTracker privacy policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> October 13, 2026
          </p>

          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This policy explains what data the PillTracker app for iPhone, iPad and Apple Watch collects and
              where it goes. The app is published by Esref Gunaydin. This policy covers the app only. The rest of
              DMVCalifornia.us has its own <a href="/privacy-policy" className="text-dmv-700 underline">privacy policy</a>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              In short: PillTracker has no accounts, no ads, no analytics and no tracking. Your medications and
              doses are stored on your device, not on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You don&apos;t need an account to use the app, and it never asks for your name, email address or phone
              number. The medications, schedules, doses, notes, symptoms and settings you enter are stored on your
              iPhone, and on your Apple Watch if you use the Watch app. They are included in your device backups,
              which Apple handles under its own privacy terms. We don&apos;t have a copy.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Home Screen widgets, the Live Activity, watch face complications and Siri read the same data on your
              device to show and log your doses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Medication name search</h2>
            <p className="text-gray-700 leading-relaxed">
              When you search for a medication name, the text you type is sent to public drug databases run by the
              U.S. Food and Drug Administration (openFDA) and the U.S. National Library of Medicine (RxNorm and
              DailyMed) to find matching names, strengths and label information, such as possible interactions. No
              other information is sent with these searches, and we don&apos;t store them. Like any website, these
              services receive your device&apos;s IP address with each request; see the{' '}
              <a href="https://www.fda.gov/about-fda/about-website/website-policies" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                FDA&apos;s website policies
              </a>{' '}
              and the{' '}
              <a href="https://www.nlm.nih.gov/web_policies.html" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                National Library of Medicine&apos;s web policies
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apple Health (optional)</h2>
            <p className="text-gray-700 leading-relaxed">
              If you choose to connect Apple Health, PillTracker reads heart rate, blood pressure, blood glucose,
              oxygen saturation, body temperature, respiratory rate, sleep and weight, only to show them alongside
              your medications on your device. PillTracker doesn&apos;t write to Apple Health, and Health data is
              never sent anywhere or used for advertising. You can turn off access at any time in the Health app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reminders, Siri and Apple Watch</h2>
            <p className="text-gray-700 leading-relaxed">
              Reminders are scheduled on your device. Doses you log on your Apple Watch are sent directly to your
              iPhone over Apple&apos;s Watch connection. If you use Siri or Shortcuts, your requests are handled by
              Apple under its privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips</h2>
            <p className="text-gray-700 leading-relaxed">
              The app is free. Optional tips are in-app purchases processed by Apple. We don&apos;t receive your
              payment details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising, analytics and tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              PillTracker shows no ads and, since version 1.2, contains no analytics or tracking. Version 1.1
              included anonymous usage analytics through Mixpanel (when the app was opened), only for people who
              allowed tracking when asked. It never included medication information, and it was removed in
              version 1.2.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we don&apos;t do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We don&apos;t sell or share your data.</li>
              <li>We don&apos;t collect your location, contacts or photos.</li>
              <li>We don&apos;t use your health or medication information for advertising, or send it to our own servers.</li>
              <li>We don&apos;t knowingly collect data from children under 13.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deleting your data</h2>
            <p className="text-gray-700 leading-relaxed">
              Use Settings, Clear All Data in the app, or delete the app, to remove everything stored on your
              device. Because we don&apos;t hold your data, there is nothing to delete on our side. For anything
              else, contact us using the support link on the app&apos;s App Store page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to this policy</h2>
            <p className="text-gray-700 leading-relaxed">
              If this policy changes, we&apos;ll update the date at the top of this page.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
