import { generateUnsubscribeToken, SITE_URL } from './newsletter';

export interface NewsletterPost {
  title: string;
  slug: string;
  excerpt: string;
}

export interface NewsletterOptions {
  subject: string;
  previewText: string;
  posts: NewsletterPost[];
  updates: string[];
}

const DMV_BLUE = '#4e80c4';
const DMV_DARK = '#345488';

function postCard(post: NewsletterPost): string {
  return `
    <tr>
      <td style="padding:0 0 16px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 6px 0;font-size:17px;font-weight:700;color:#111827;line-height:1.4;">
                <a href="${SITE_URL}/${post.slug}" style="color:#111827;text-decoration:none;">${post.title}</a>
              </p>
              <p style="margin:0 0 14px 0;font-size:14px;color:#6b7280;line-height:1.6;">${post.excerpt}</p>
              <a href="${SITE_URL}/${post.slug}"
                 style="display:inline-block;background:${DMV_BLUE};color:#ffffff;font-size:13px;font-weight:600;padding:8px 18px;border-radius:6px;text-decoration:none;">
                Read more
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
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
  <!-- preview text trick -->
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

              <!-- Greeting -->
              <p style="margin:0 0 24px 0;font-size:15px;color:#374151;line-height:1.7;">
                Hey there, here is what is new at DMV California this month. We have been adding new content and features to help you pass your written test on the first try.
              </p>

              <!-- Latest articles -->
              <p style="margin:0 0 16px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${DMV_BLUE};">Latest articles</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${postCards}
              </table>

              <!-- What's new -->
              ${updateItems ? `
              <p style="margin:8px 0 14px 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${DMV_BLUE};">What is new</p>
              <ul style="margin:0 0 24px 0;padding-left:20px;">
                ${updateItems}
              </ul>` : ''}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5ff;border-radius:8px;margin-bottom:8px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 14px 0;font-size:15px;font-weight:700;color:#111827;">Ready to practice?</p>
                    <a href="${SITE_URL}/practice-test"
                       style="display:inline-block;background:${DMV_BLUE};color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
                      Take a free practice test
                    </a>
                  </td>
                </tr>
              </table>

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
