import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Wrong Wire Privacy Policy',
  description: 'What the Wrong Wire bomb-defusing arcade game for iPhone and iPad collects, why, and who it is shared with.',
  alternates: { canonical: '/wrong-wire-privacy' },
};

export default function WrongWirePrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Wrong Wire privacy policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> October 21, 2026
          </p>

          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This policy explains what data the Wrong Wire app for iPhone and iPad collects, why, and who it is
              shared with. The app is published by Esref Gunaydin. This policy covers the app only. The rest of
              DMVCalifornia.us has its own{' '}
              <a href="/privacy-policy" className="text-dmv-700 underline">privacy policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You don&apos;t need an account to play, and the app never asks for your name, email address, phone
              number or contacts. Your best score, wires cut, the stage tips you have already seen and your settings
              are stored on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The app is free. Its only ad is an optional video from Google AdMob: when the bomb goes off, you can
              choose to watch it to continue your run, or skip it. To show and measure that ad, Google may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>an identifier for your device (the app never asks to track you, so Google doesn&apos;t get your advertising identifier)</li>
              <li>your approximate location, estimated from your IP address</li>
              <li>which ads were shown and watched, plus basic app interaction and diagnostic data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Where the law requires it, for example in the EU and UK, the app first asks for your consent with
              Google&apos;s consent form. You can change that choice at any time with the Privacy choices button on
              the app&apos;s home screen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Google explains how it uses ad data in{' '}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                How Google uses information from sites or apps that use its services
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnostics</h2>
            <p className="text-gray-700 leading-relaxed">
              Google&apos;s SDKs may collect crash and performance data to keep the app and its ads working. The app
              has no analytics of its own.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Center</h2>
            <p className="text-gray-700 leading-relaxed">
              If you sign in to Game Center, your best score and the number of wires you cut are sent to Apple for the
              leaderboard, where other players can see them next to your Game Center nickname. Apple handles this data
              under{' '}
              <a href="https://www.apple.com/legal/privacy/" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                Apple&apos;s privacy policy
              </a>
              . We never see your Apple Account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings</h2>
            <p className="text-gray-700 leading-relaxed">
              Now and then the app may show Apple&apos;s standard rating prompt. Ratings go to Apple and the App Store,
              not to us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchases and notifications</h2>
            <p className="text-gray-700 leading-relaxed">
              The app has no in-app purchases and sends no notifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we don&apos;t do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We don&apos;t sell your data.</li>
              <li>We don&apos;t track you across other companies&apos; apps or websites.</li>
              <li>We don&apos;t collect precise location, contacts, photos or health data.</li>
              <li>We don&apos;t knowingly collect data from children under 13. The app is rated 13+.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deleting your data</h2>
            <p className="text-gray-700 leading-relaxed">
              Deleting the app removes everything stored on your device. Game Center scores can be managed in your
              Apple Account settings. For anything else, contact us using the support link on the app&apos;s App Store
              page.
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
