import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import chineseQuizzesData from '@/data/chinese-quizzes.json';

export const metadata = {
  title: 'California DMV 中文考試 | DMV California',
  description: '加州 DMV 駕駛考試中文版。免費的中文練習測試，幫助您準備加州駕駛執照考試。',
};

export default function ChineseTestPage() {
  const { quizzes } = chineseQuizzesData;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-6xl mb-4">🇨🇳</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                DMV Driving Test in Chinese / DMV 中文駕駛考試
              </h1>
              <p className="text-xl text-white/90 mb-6">
                加州 DMV 駕駛執照考試中文練習測試。
                使用真實的 DMV 考題進行練習，為您的考試做好準備。
              </p>
            </div>
          </div>
        </section>

        {/* Chinese Tests Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Chinese DMV Tests / 中文 DMV 考試
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {quizzes.map((quiz, index) => {
                const isSimulator = quiz.id === 'chinese-simulator-test';

                return (
                  <Link
                    key={quiz.id}
                    href={`/practice-test/${quiz.slug}`}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group border-2 border-yellow-100"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex gap-2 flex-wrap">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                          {isSimulator ? '模擬考試' : `練習 #${index}`}
                        </span>
                        {isSimulator && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            推薦
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                        {quiz.title.split(' / ')[1] || quiz.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        {isSimulator
                          ? '完整的模擬考試，包含10道真實 DMV 考題。'
                          : `${quiz.questions.length} 道練習題，涵蓋基本交通規則和標誌。`}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-500">
                          {quiz.questions.length} 問題
                        </span>
                        <span className="text-yellow-600 font-semibold group-hover:underline">
                          開始 →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                關於 DMV 中文考試 / About Chinese DMV Tests
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">中文版本</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• {quizzes.length} 個完整的練習測試</li>
                    <li>• {quizzes.reduce((sum, q) => sum + q.questions.length, 0)} 道練習題</li>
                    <li>• 所有題目均為中文</li>
                    <li>• 即時答案和解釋</li>
                    <li>• 免費使用，無需註冊</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">English Version</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• {quizzes.length} complete practice tests</li>
                    <li>• {quizzes.reduce((sum, q) => sum + q.questions.length, 0)} practice questions</li>
                    <li>• All questions in Chinese</li>
                    <li>• Instant answers and explanations</li>
                    <li>• Free to use, no registration required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                考試技巧 / Test Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-600">
                <div>
                  <p className="mb-2">✓ 建議從模擬考試開始</p>
                  <p className="mb-2">✓ 仔細閱讀每個問題</p>
                  <p className="mb-2">✓ 複習錯誤的答案</p>
                  <p className="mb-2">✓ 反複練習直到熟練</p>
                </div>
                <div>
                  <p className="mb-2">✓ Start with the simulator test</p>
                  <p className="mb-2">✓ Read each question carefully</p>
                  <p className="mb-2">✓ Review incorrect answers</p>
                  <p className="mb-2">✓ Practice until proficient</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
