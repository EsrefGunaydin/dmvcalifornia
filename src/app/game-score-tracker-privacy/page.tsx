import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Game Score Tracker Privacy Policy',
  description: 'What the Game Score Tracker app for iPhone and iPad collects, why, and who it is shared with.',
  alternates: { canonical: '/game-score-tracker-privacy' },
};

export default function GameScoreTrackerPrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Game Score Tracker privacy policy</h1>

          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> October 12, 2026
          </p>

          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This policy explains what data the Game Score Tracker app for iPhone and iPad collects, why, and
              who it is shared with. The app is published by Esref Gunaydin. This policy covers the app only.
              The rest of DMVCalifornia.us has its own <a href="/privacy-policy" className="text-dmv-700 underline">privacy policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You don't need an account to use the app, and it never asks for your name, email address, phone
              number or contacts. Player names, scores, game history and tournaments are stored on your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Live sharing</h2>
            <p className="text-gray-700 leading-relaxed">
              If you turn on &quot;Share live&quot; for a game, the game&apos;s name, the player names you typed and the
              scores are uploaded to Google Firebase so that people who enter your 6-letter game code can follow
              along. The app signs in to Firebase anonymously with a random identifier that isn&apos;t linked to you.
              Only the device that started the game can change it, and finished shared games are removed a few
              days later. If you don&apos;t use live sharing, no game data leaves your device.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advertising</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The app is free and shows ads from Google AdMob. To show and measure ads, Google may collect:
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
              these choices at any time: tracking in iOS Settings, Privacy &amp; Security, Tracking, and ad consent
              in the app under Settings, Privacy choices.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Google explains how it uses this data in{' '}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-dmv-700 underline" rel="noopener noreferrer" target="_blank">
                How Google uses information from sites or apps that use its services
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-700 leading-relaxed">
              The app uses Mixpanel to see how it is used, for example which games are played, how many rounds a
              game has and whether a game was finished. This data isn&apos;t linked to your identity and is used only
              to improve the app. See{' '}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we don&apos;t do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We don&apos;t sell your data.</li>
              <li>We don&apos;t collect precise location, contacts, photos or health data.</li>
              <li>We don&apos;t knowingly collect data from children under 13. The app is a general-audience score keeper.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deleting your data</h2>
            <p className="text-gray-700 leading-relaxed">
              Deleting the app removes everything stored on your device. Live-shared games are removed from
              Firebase automatically. For anything else, contact us using the support link on the app&apos;s App
              Store page.
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
