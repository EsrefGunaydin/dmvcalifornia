import { generateUnsubscribeToken, SITE_URL } from './newsletter';

export interface NewsletterPost {
  title: string;
  slug: string;
  excerpt: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface NewsletterOptions {
  subject: string;
  previewText: string;
  posts: NewsletterPost[];
  updates: string[];
  youtubeId?: string;
  youtubeTitle?: string;
  quizQuestions?: QuizQuestion[];
  quizAnswerUrl?: string;
}

const DMV_BLUE = '#4e80c4';
const DMV_DARK = '#345488';
const ORANGE = '#e07b39';

function postCard(post: NewsletterPost): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:16px;">
    <tr>
      <td style="padding:20px 24px;">
        <p style="margin:0 0 6px 0;font-size:17px;font-weight:700;color:#111827;line-height:1.4;">
          <a href="${SITE_URL}/${post.slug}" style="color:#111827;text-decoration:none;">${post.title}</a>
        </p>
        <p style="margin:0 0 14px 0;font-size:14px;color:#6b7280;line-height:1.6;">${post.excerpt}</p>
        <a href="${SITE_URL}/${post.slug}"
           style="display:inline-block;background:${DMV_BLUE};color:#ffffff;font-size:13px;font-weight:600;padding:8px 18px;border-radius:6px;text-decoration:none;">
          Read the article →
        </a>
      </td>
    </tr>
  </table>`;
}

function youtubeSection(youtubeId: string, title: string): string {
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td>
        <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${DMV_BLUE};">Watch</p>
        <a href="${url}" style="display:block;text-decoration:none;border-radius:10px;overflow:hidden;position:relative;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;">
            <tr>
              <td style="position:relative;text-align:center;">
                <img src="${thumb}" width="540" alt="${title}" style="width:100%;max-width:540px;height:auto;display:block;border-radius:10px;" />
                <!-- Play button overlay -->
                <table cellpadding="0" cellspacing="0" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.7);border-radius:50%;width:64px;height:64px;">
                  <tr><td align="center" valign="middle" style="width:64px;height:64px;">
                    <span style="font-size:28px;color:#fff;line-height:1;">&#9654;</span>
                  </td></tr>
                </table>
              </td>
            </tr>
          </table>
        </a>
        <p style="margin:10px 0 0 0;font-size:13px;color:#6b7280;text-align:center;">
          <a href="${url}" style="color:${DMV_BLUE};text-decoration:none;font-weight:600;">${title}</a>
        </p>
      </td>
    </tr>
  </table>`;
}

function miniQuiz(questions: QuizQuestion[], answerUrl: string): string {
  const letters = ['A', 'B', 'C', 'D'];

  const questionRows = questions.map((q, i) => {
    const optionCells = q.options.map((opt, j) => {
      const isAnswer = j === q.answerIndex;
      return `
        <tr>
          <td style="padding:3px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid ${isAnswer ? '#22c55e' : '#e5e7eb'};border-radius:8px;background:${isAnswer ? '#f0fdf4' : '#ffffff'};">
              <tr>
                <td style="padding:10px 14px;font-size:13px;color:${isAnswer ? '#15803d' : '#374151'};">
                  <span style="font-weight:700;margin-right:8px;color:${isAnswer ? '#15803d' : DMV_BLUE};">${letters[j]}</span>${opt}${isAnswer ? ' <span style="font-weight:700;color:#15803d;">&#10003;</span>' : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    }).join('');

    return `
    <tr>
      <td style="padding-bottom:${i < questions.length - 1 ? '20' : '0'}px;">
        ${questions.length > 1 ? `<p style="margin:0 0 4px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9ca3af;">Question ${i + 1} of ${questions.length}</p>` : ''}
        <p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:#111827;line-height:1.5;">${q.question}</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${optionCells}
        </table>
        <p style="margin:8px 0 0 0;font-size:12px;color:#6b7280;line-height:1.5;">${q.explanation}</p>
      </td>
    </tr>`;
  }).join('');

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="background:${ORANGE};border-radius:8px 8px 0 0;padding:14px 20px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;">Think you know California's new laws?</p>
        <p style="margin:4px 0 0 0;font-size:12px;color:rgba(255,255,255,0.85);">Most licensed drivers miss at least one of these.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;padding:20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${questionRows}
          <tr>
            <td style="padding-top:16px;" align="center">
              <a href="${answerUrl}"
                 style="display:inline-block;background:${ORANGE};color:#ffffff;font-size:13px;font-weight:700;padding:10px 24px;border-radius:6px;text-decoration:none;">
                Read the full article &#8594;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function ctaGrid(practiceTestUrl: string, signsTestUrl: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
    <tr>
      <td width="48%" style="background:#f0f5ff;border-radius:8px;padding:18px 16px;text-align:center;vertical-align:top;">
        <p style="margin:0 0 4px 0;font-size:22px;">📝</p>
        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#111827;">Practice Test</p>
        <p style="margin:0 0 12px 0;font-size:12px;color:#6b7280;">46 real DMV questions</p>
        <a href="${practiceTestUrl}"
           style="display:inline-block;background:${DMV_BLUE};color:#fff;font-size:12px;font-weight:700;padding:8px 16px;border-radius:6px;text-decoration:none;">
          Start test →
        </a>
      </td>
      <td width="4%"></td>
      <td width="48%" style="background:#fff7ed;border-radius:8px;padding:18px 16px;text-align:center;vertical-align:top;">
        <p style="margin:0 0 4px 0;font-size:22px;">🚦</p>
        <p style="margin:0 0 8px 0;font-size:13px;font-weight:700;color:#111827;">Road Signs Test</p>
        <p style="margin:0 0 12px 0;font-size:12px;color:#6b7280;">All California signs</p>
        <a href="${signsTestUrl}"
           style="display:inline-block;background:${ORANGE};color:#fff;font-size:12px;font-weight:700;padding:8px 16px;border-radius:6px;text-decoration:none;">
          Test yourself →
        </a>
      </td>
    </tr>
  </table>`;
}

export function buildNewsletterHtml(opts: NewsletterOptions, email: string): string {
  const token = generateUnsubscribeToken(email);
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;

  const postCards = opts.posts.map(postCard).join('');
  const updateItems = opts.updates
    .map(u => `<li style="margin:0 0 8px 0;font-size:14px;color:#374151;line-height:1.6;">${u}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${opts.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;color:#f3f4f6;">
    ${opts.previewText}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${DMV_DARK};border-radius:10px 10px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">DMV California</p>
              <p style="margin:6px 0 0 0;font-size:13px;color:rgba(255,255,255,0.75);">Free practice tests for the California DMV written exam</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px 32px 24px 32px;">

              <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.7;">
                Here is what is new at DMV California this month. New laws, updated tests, and a quick quiz to see how much you already know.
              </p>

              <!-- Blog posts -->
              <p style="margin:0 0 14px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${DMV_BLUE};">Latest from the blog</p>
              ${postCards}

              <!-- YouTube -->
              ${opts.youtubeId ? youtubeSection(opts.youtubeId, opts.youtubeTitle || 'Watch on YouTube') : ''}

              <!-- Mini quiz -->
              ${opts.quizQuestions?.length ? miniQuiz(opts.quizQuestions, opts.quizAnswerUrl || SITE_URL) : ''}

              <!-- What's new -->
              ${updateItems ? `
              <p style="margin:8px 0 14px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${DMV_BLUE};">What is new on the site</p>
              <ul style="margin:0 0 24px 0;padding-left:20px;">
                ${updateItems}
              </ul>` : ''}

              <!-- CTA grid -->
              ${ctaGrid(`${SITE_URL}/practice-test/california-dmv-practice-test-2026`, `${SITE_URL}/california-dmv-road-signs-test`)}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 10px 10px;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#9ca3af;">
                You received this because you submitted your score to the leaderboard at DMV California.
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color:#6b7280;text-decoration:underline;">dmvcalifornia.us</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
