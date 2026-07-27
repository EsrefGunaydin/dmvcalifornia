/** Round "verified/authentic" stamp badge for a hub hero, with text curving
 * along the top and bottom of the ring (classic seal/stamp look). The
 * heroBadge string is split into two lines automatically. */
export default function HeroStampBadge({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const topText = words.slice(0, mid).join(' ');
  const bottomText = words.slice(mid).join(' ');

  const cx = 80;
  const cy = 80;
  const r = 46;
  const topPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const bottomPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;

  // Solve per-string letter-spacing so top and bottom text fill the same
  // fraction of the arc, regardless of word length — otherwise a longer
  // string (e.g. "DMV QUIZ") reads as more cramped than a shorter one.
  const FONT_SIZE = 17;
  const CHAR_WIDTH_FACTOR = 0.62;
  const TARGET_ARC_FRACTION = 0.58;
  const targetWidth = TARGET_ARC_FRACTION * Math.PI * r;
  const letterSpacingFor = (str: string) => {
    const chars = str.length;
    const gaps = Math.max(chars - 1, 1);
    const naturalWidth = chars * CHAR_WIDTH_FACTOR * FONT_SIZE;
    return Math.max((targetWidth - naturalWidth) / gaps, 0.4);
  };
  const topLetterSpacing = letterSpacingFor(topText);
  const bottomLetterSpacing = letterSpacingFor(bottomText);

  return (
    <svg
      viewBox="0 0 160 160"
      className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 drop-shadow"
      aria-label={text}
      role="img"
    >
      <defs>
        <path id="stamp-top-arc" d={topPath} />
        <path id="stamp-bottom-arc" d={bottomPath} />
      </defs>

      {/* Double ring, seal style */}
      <circle cx={cx} cy={cy} r={76} fill="none" stroke="#fbbf24" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={69} fill="none" stroke="#fbbf24" strokeWidth={3} />

      {/* Curved top/bottom text */}
      <text fill="#fbbf24" fontSize={FONT_SIZE} fontWeight={800} letterSpacing={topLetterSpacing}>
        <textPath href="#stamp-top-arc" startOffset="50%" textAnchor="middle">
          {topText.toUpperCase()}
        </textPath>
      </text>
      <text fill="#fbbf24" fontSize={FONT_SIZE} fontWeight={800} letterSpacing={bottomLetterSpacing}>
        <textPath href="#stamp-bottom-arc" startOffset="50%" textAnchor="middle">
          {bottomText.toUpperCase()}
        </textPath>
      </text>

      {/* Center checkmark */}
      <circle cx={cx} cy={cy} r={26} fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.6} />
      <path
        d={`M ${cx - 13} ${cy} l 9 9 l 17 -18`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
