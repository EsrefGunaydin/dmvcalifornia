// Daily answer words — all 5-letter DMV/traffic terms
// Rotates by day index from the epoch date in getDailyWord()
export const WORDS = [
  'YIELD', 'MERGE', 'BRAKE', 'SPEED', 'LANES', 'CURBS', 'FAULT', 'STALL', 'WHEEL', 'LIGHT',
  'LIMIT', 'SHARP', 'ZONES', 'TURNS', 'SIGNS', 'DRIVE', 'TRUCK', 'ROUTE', 'ROADS', 'EXITS',
  'CRASH', 'GUARD', 'SKIDS', 'PARKS', 'FLARE', 'TIRES', 'PEDAL', 'BLINK', 'STEER', 'BLIND',
  'DRUNK', 'SIREN', 'MINOR', 'HANDS', 'BIKES', 'CLEAR', 'FRONT', 'ALERT', 'CARGO', 'ENTRY',
  'SHIFT', 'TOWED', 'TOLLS', 'BLOCK', 'RIGHT', 'PLATE', 'FINES', 'LEGAL', 'NIGHT', 'TRUNK',
  'FLOOD', 'RIDER', 'MOPED', 'COURT', 'RULES', 'MOTOR', 'CYCLE', 'FLAGS', 'PATHS', 'RAILS',
  'HILLS', 'CURVE', 'ZEBRA', 'URBAN', 'CROSS', 'FOGGY', 'FERRY', 'TOKEN', 'PHOTO', 'TRACK',
  'GATES', 'FLOOR', 'AHEAD', 'STRIP', 'CONES', 'COAST', 'PHASE', 'PAINT', 'SIGHT', 'SLICK',
  'STORM', 'AVOID', 'WEAVE', 'AMBER',
];

// Epoch: first word was played on this date
const EPOCH = new Date('2026-07-08T00:00:00Z');

export function getDailyWord(): string {
  const now = new Date();
  const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const utcEpoch = Date.UTC(EPOCH.getUTCFullYear(), EPOCH.getUTCMonth(), EPOCH.getUTCDate());
  const dayIndex = Math.floor((utcNow - utcEpoch) / 86400000);
  return WORDS[((dayIndex % WORDS.length) + WORDS.length) % WORDS.length];
}

export function getDailyIndex(): number {
  const now = new Date();
  const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const utcEpoch = Date.UTC(EPOCH.getUTCFullYear(), EPOCH.getUTCMonth(), EPOCH.getUTCDate());
  return Math.floor((utcNow - utcEpoch) / 86400000) + 1;
}
