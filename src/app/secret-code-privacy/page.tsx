import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Secret Code Privacy Policy',
  description: 'What the Secret Code code-breaking game for iPhone and iPad collects, why, and who it is shared with.',
  alternates: { canonical: '/secret-code-privacy' },
};

export default function SecretCodePrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Secret Code privacy policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> October 18, 2026
          </p>

          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This policy explains what data the Secret Code app (listed on the App Store as Secret Code Cracking)
              for iPhone and iPad collects, why, and who it is shared with. The app is published by Esref Gunaydin.
              This policy covers the app only. The rest of DMVCalifornia.us has its own{' '}
              <a href="/privacy-policy" className="text-dmv-700 underline">privacy policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You don&apos;t need an account to play, and the app never asks for your name, email address, phone
              number or contacts. Your progress, stars, coins, themes, streaks, statistics, your agent&apos;s look and
              your settings are stored on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The app is free and shows ads from Google AdMob: a banner, an ad between some games, and optional ads
              you can choose to watch for a hint or extra coins. To show and measure ads, Google may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>your device&apos;s advertising identifier (IDFA), only if you allow tracking when the app asks</li>
              <li>your approximate location, estimated from your IP address</li>
              <li>which ads were shown and tapped, plus basic app interaction and diagnostic data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Where the law requires it, for example in the EU and UK, the app first asks for your consent with
              Google&apos;s consent form. It then shows Apple&apos;s App Tracking Transparency prompt. If you choose
              &quot;Ask App Not to Track&quot;, Google shows ads without your advertising identifier. You can change
              these choices at any time: tracking in iOS Settings, Privacy &amp; Security, Tracking, and ad consent in
              the app under Agent, Privacy choices.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Google explains how it uses ad data in{' '}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                How Google uses information from sites or apps that use its services
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-700 leading-relaxed">
              The app uses Mixpanel to see how it is played, for example which games and missions are started and
              finished, when hints are used and when an ad is watched. These events carry a random identifier that
              isn&apos;t linked to your identity, and Mixpanel estimates your approximate location (country and city)
              from your IP address. The data is used only to improve the game. See{' '}
              <a href="https://mixpanel.com/legal/privacy-policy" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                Mixpanel&apos;s privacy policy
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnostics</h2>
            <p className="text-gray-700 leading-relaxed">
              Google&apos;s SDKs may collect crash and performance data to keep the app and its ads working.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Center</h2>
            <p className="text-gray-700 leading-relaxed">
              If you sign in to Game Center, your scores and achievements are sent to Apple for the leaderboards. In
              a live Duel, your Game Center nickname and your guesses are passed to the other player through
              Apple&apos;s servers. Apple handles this data under{' '}
              <a href="https://www.apple.com/legal/privacy/" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                Apple&apos;s privacy policy
              </a>
              . We never see your Apple Account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-gray-700 leading-relaxed">
              If you allow notifications, reminders about the daily code and the weekly challenge are scheduled on
              your device. You can turn them off in the app under Agent, Notifications, or in iOS Settings,
              Notifications, Secret Code.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchases</h2>
            <p className="text-gray-700 leading-relaxed">
              The app has no in-app purchases. Coins and themes are earned by playing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we don&apos;t do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We don&apos;t sell your data.</li>
              <li>We don&apos;t collect precise location, contacts, photos or health data.</li>
              <li>We don&apos;t knowingly collect data from children under 13. The app is a general-audience puzzle game.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deleting your data</h2>
            <p className="text-gray-700 leading-relaxed">
              Deleting the app removes everything stored on your device. For anything else, contact us using the
              support link on the app&apos;s App Store page.
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
