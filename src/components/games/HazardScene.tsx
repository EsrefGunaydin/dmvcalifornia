'use client';

import { ElementCue, ElementKind, HazardElement, SceneSetting } from '@/types/hazard';

export type ElementStatus = 'idle' | 'found' | 'wrong' | 'missed';

interface HazardSceneProps {
  setting: SceneSetting;
  elements: HazardElement[];
  elementStatus: Record<string, ElementStatus>;
  onElementTap: (id: string) => void;
  /** When true, taps are ignored (time up / reviewing results). */
  disabled: boolean;
}

// ---- Backgrounds ----------------------------------------------------------
// Everything is laid out in a 0 0 400 400 viewBox.

function ResidentialBg() {
  return (
    <g>
      {/* lawns */}
      <rect x={0} y={0} width={400} height={400} fill="#e8efe6" rx={12} />
      {/* sidewalk band */}
      <rect x={0} y={135} width={400} height={130} fill="#cbd5e1" />
      {/* road */}
      <rect x={0} y={158} width={400} height={84} fill="#5b6168" />
      {/* centerline */}
      <line x1={0} y1={200} x2={400} y2={200} stroke="#f5c542" strokeWidth={3} strokeDasharray="16 12" />
      {/* sidewalk seams */}
      <line x1={0} y1={146} x2={400} y2={146} stroke="#b6c2d1" strokeWidth={1.5} />
      <line x1={0} y1={254} x2={400} y2={254} stroke="#b6c2d1" strokeWidth={1.5} />
    </g>
  );
}

function crosswalkStripes(
  x: number,
  y: number,
  w: number,
  h: number,
  vertical: boolean,
) {
  const bars = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    bars.push(
      vertical ? (
        <rect key={i} x={x + (i * w) / count} y={y} width={w / count - 3} height={h} fill="#f5f5f4" />
      ) : (
        <rect key={i} x={x} y={y + (i * h) / count} width={w} height={h / count - 3} fill="#f5f5f4" />
      ),
    );
  }
  return bars;
}

function IntersectionBg() {
  return (
    <g>
      <rect x={0} y={0} width={400} height={400} fill="#e8efe6" rx={12} />
      {/* roads */}
      <rect x={0} y={140} width={400} height={120} fill="#5b6168" />
      <rect x={140} y={0} width={120} height={400} fill="#5b6168" />
      {/* centerlines */}
      <line x1={0} y1={200} x2={140} y2={200} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      <line x1={260} y1={200} x2={400} y2={200} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      <line x1={200} y1={0} x2={200} y2={140} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      <line x1={200} y1={260} x2={200} y2={400} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      {/* crosswalks */}
      <g opacity={0.85}>
        {crosswalkStripes(140, 122, 120, 14, true)}
        {crosswalkStripes(140, 264, 120, 14, true)}
        {crosswalkStripes(122, 140, 14, 120, false)}
        {crosswalkStripes(264, 140, 14, 120, false)}
      </g>
    </g>
  );
}

function ParkingLotBg() {
  const topLines = [];
  const botLines = [];
  for (let x = 40; x <= 360; x += 64) {
    topLines.push(<line key={`t${x}`} x1={x} y1={50} x2={x} y2={175} stroke="#e5e7eb" strokeWidth={2} />);
    botLines.push(<line key={`b${x}`} x1={x} y1={225} x2={x} y2={350} stroke="#e5e7eb" strokeWidth={2} />);
  }
  return (
    <g>
      {/* asphalt */}
      <rect x={0} y={0} width={400} height={400} fill="#6b7280" rx={12} />
      {/* parking space lines */}
      {topLines}
      {botLines}
      <line x1={40} y1={50} x2={360} y2={50} stroke="#e5e7eb" strokeWidth={2} />
      <line x1={40} y1={350} x2={360} y2={350} stroke="#e5e7eb" strokeWidth={2} />
      {/* drive lane edges + center dashes */}
      <line x1={0} y1={175} x2={400} y2={175} stroke="#fbbf24" strokeWidth={2.5} />
      <line x1={0} y1={225} x2={400} y2={225} stroke="#fbbf24" strokeWidth={2.5} />
      <line x1={0} y1={200} x2={400} y2={200} stroke="#ffffff" strokeWidth={2} strokeDasharray="12 14" opacity={0.55} />
    </g>
  );
}

function SceneBackground({ setting }: { setting: SceneSetting }) {
  if (setting === 'residential') return <ResidentialBg />;
  if (setting === 'intersection') return <IntersectionBg />;
  return <ParkingLotBg />;
}

// ---- Sprites (all drawn at the origin, facing "up" / north) ---------------

function CarSprite() {
  return (
    <g>
      <rect x={-13} y={-22} width={26} height={44} rx={8} fill="#64748b" stroke="#1f2937" strokeWidth={1.5} />
      <rect x={-10} y={-7} width={20} height={17} rx={4} fill="rgba(0,0,0,0.22)" />
      <path d="M -9 -7 L 9 -7 L 6 -15 L -6 -15 Z" fill="#cfe8ff" opacity={0.9} />
      <path d="M -8 10 L 8 10 L 6 15 L -6 15 Z" fill="#cfe8ff" opacity={0.75} />
      <rect x={-10} y={-21} width={4.5} height={3} rx={1.5} fill="#fff7cc" />
      <rect x={5.5} y={-21} width={4.5} height={3} rx={1.5} fill="#fff7cc" />
      <rect x={-10} y={18} width={4.5} height={2.6} rx={1.3} fill="#ef4444" />
      <rect x={5.5} y={18} width={4.5} height={2.6} rx={1.3} fill="#ef4444" />
    </g>
  );
}

function PedestrianSprite() {
  return (
    <g>
      <ellipse cx={0} cy={3} rx={8} ry={6} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
      <circle cx={0} cy={-5} r={5.5} fill="#fcd34d" stroke="#fff" strokeWidth={2} />
    </g>
  );
}

function CyclistSprite() {
  return (
    <g>
      <ellipse cx={0} cy={-11} rx={2.6} ry={7.5} fill="#1f2937" />
      <ellipse cx={0} cy={11} rx={2.6} ry={7.5} fill="#1f2937" />
      <rect x={-1.4} y={-11} width={2.8} height={22} fill="#15803d" />
      <rect x={-6} y={-7} width={12} height={2.4} rx={1.2} fill="#374151" />
      <circle cx={0} cy={1} r={6} fill="#16a34a" stroke="#fff" strokeWidth={1.5} />
      <circle cx={0} cy={-0.5} r={2.6} fill="#fde68a" />
    </g>
  );
}

function BallSprite() {
  return (
    <g>
      <circle r={8} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
      <path d="M -8 0 A 8 8 0 0 1 8 0" fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.85} />
      <path d="M 0 -8 A 8 8 0 0 1 0 8" fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.85} />
    </g>
  );
}

function DogSprite() {
  return (
    <g>
      {/* tail */}
      <path d="M 0 8 Q 6 11 5 16" fill="none" stroke="#92400e" strokeWidth={2.4} strokeLinecap="round" />
      {/* legs */}
      <rect x={-6} y={-2} width={2.6} height={5} rx={1.3} fill="#7c3a0c" />
      <rect x={3.4} y={-2} width={2.6} height={5} rx={1.3} fill="#7c3a0c" />
      <rect x={-6} y={5} width={2.6} height={5} rx={1.3} fill="#7c3a0c" />
      <rect x={3.4} y={5} width={2.6} height={5} rx={1.3} fill="#7c3a0c" />
      {/* body */}
      <ellipse cx={0} cy={2} rx={5.5} ry={8} fill="#92400e" stroke="#fff" strokeWidth={1.3} />
      {/* ears */}
      <path d="M -4 -10 L -6.5 -14 L -1.5 -11.5 Z" fill="#7c3a0c" />
      <path d="M 4 -10 L 6.5 -14 L 1.5 -11.5 Z" fill="#7c3a0c" />
      {/* head */}
      <circle cx={0} cy={-8} r={4.5} fill="#b45309" stroke="#fff" strokeWidth={1.2} />
      {/* nose */}
      <circle cx={0} cy={-11.5} r={1.4} fill="#1f2937" />
    </g>
  );
}

function ConeSprite() {
  // Classic top-down traffic cone — concentric orange/white rings.
  return (
    <g>
      <circle r={8} fill="#f97316" stroke="#fff" strokeWidth={1} />
      <circle r={5} fill="#fdba74" />
      <circle r={2.4} fill="#f97316" />
    </g>
  );
}

function TreeSprite() {
  // Foliage drawn as overlapping lobes so it reads as a tree canopy, not a dot.
  return (
    <g>
      <circle cx={0} cy={-4.5} r={6} fill="#3f6212" />
      <circle cx={-5} cy={1.5} r={5.5} fill="#3f6212" />
      <circle cx={5} cy={1.5} r={5.5} fill="#3f6212" />
      <circle cx={0} cy={4.5} r={5.5} fill="#3f6212" />
      <circle r={7.5} fill="#4d7c0f" />
      <circle cx={-2} cy={-2} r={3.5} fill="#65a30d" opacity={0.75} />
    </g>
  );
}

function HydrantSprite() {
  return (
    <g>
      <rect x={-7.5} y={-1.6} width={3} height={3.2} fill="#b91c1c" />
      <rect x={4.5} y={-1.6} width={3} height={3.2} fill="#b91c1c" />
      <circle r={5.5} fill="#dc2626" stroke="#fff" strokeWidth={1.5} />
      <circle r={2.4} fill="#ef4444" />
    </g>
  );
}

function ElementSprite({ kind }: { kind: ElementKind }) {
  switch (kind) {
    case 'pedestrian': return <PedestrianSprite />;
    case 'cyclist': return <CyclistSprite />;
    case 'car': return <CarSprite />;
    case 'ball': return <BallSprite />;
    case 'dog': return <DogSprite />;
    case 'cone': return <ConeSprite />;
    case 'tree': return <TreeSprite />;
    case 'hydrant': return <HydrantSprite />;
  }
}

// ---- Legend ---------------------------------------------------------------
// Top-down sprites are inherently a little abstract, so we always show a key
// of what's on the board. It never marks which items are hazards — judging
// that is the whole game.

const KIND_LABELS: Record<ElementKind, string> = {
  pedestrian: 'Person',
  cyclist: 'Cyclist',
  car: 'Car',
  ball: 'Ball',
  dog: 'Dog',
  cone: 'Cone',
  tree: 'Tree',
  hydrant: 'Hydrant',
};

export function HazardLegend({ kinds }: { kinds: ElementKind[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {kinds.map((kind) => (
        <div key={kind} className="flex items-center gap-1.5">
          <svg viewBox="-15 -15 30 30" className="w-6 h-6 flex-shrink-0" aria-hidden>
            <ElementSprite kind={kind} />
          </svg>
          <span className="text-xs text-gray-600 font-medium">{KIND_LABELS[kind]}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Cue overlays ---------------------------------------------------------
// Drawn inside the element's rotated group so they orient with the sprite.
// These are the visual "tells" that mark a developing hazard.

function CueOverlay({ cue }: { cue: ElementCue }) {
  switch (cue) {
    case 'crossing':
      return (
        <g>
          <path d="M 0 -22 L 0 -13" stroke="#ffffff" strokeWidth={6} strokeLinecap="round" />
          <path d="M 0 -22 L 0 -13" stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
          <path d="M 0 -26 L 4.5 -19 L -4.5 -19 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      );
    case 'door-open':
      return (
        <g transform="translate(-13 -3) rotate(-42)">
          <rect x={-13} y={-2} width={13} height={4} rx={2} fill="#94a3b8" stroke="#1f2937" strokeWidth={1} />
        </g>
      );
    case 'reversing':
      return (
        <g>
          <rect x={-9} y={19.5} width={6} height={3.6} rx={1.6} fill="#ffffff" stroke="#1f2937" strokeWidth={0.6} />
          <rect x={3} y={19.5} width={6} height={3.6} rx={1.6} fill="#ffffff" stroke="#1f2937" strokeWidth={0.6} />
          <path d="M -4.5 29 L 0 33.5 L 4.5 29" fill="none" stroke="#f59e0b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'rolling':
      return (
        <g opacity={0.75}>
          <path d="M 1 9 Q 7 14 5 19" fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" />
          <path d="M -4 10 Q 1 15 -2 20" fill="none" stroke="#f59e0b" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    case 'running':
      return (
        <g opacity={0.8} stroke="#f59e0b" strokeWidth={2} strokeLinecap="round">
          <path d="M -6 14 L -9 20" />
          <path d="M 0 15 L 0 22" />
          <path d="M 6 14 L 9 20" />
        </g>
      );
    case 'wobbling':
      return (
        <g opacity={0.85}>
          <path
            d="M -13 -7 Q -8 -3 -13 1 Q -18 5 -13 9"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </g>
      );
    default:
      return null;
  }
}

// ---- Status badge ---------------------------------------------------------

function StatusBadge({ kind }: { kind: 'check' | 'x' | 'bang' }) {
  const bg = kind === 'check' ? '#16a34a' : kind === 'x' ? '#dc2626' : '#f59e0b';
  return (
    <g transform="translate(15 -15)">
      <circle r={8} fill={bg} stroke="#ffffff" strokeWidth={1.5} />
      {kind === 'check' && (
        <path d="M -3.5 0 L -1 2.6 L 3.6 -3" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {kind === 'x' && (
        <path d="M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
      )}
      {kind === 'bang' && (
        <text textAnchor="middle" y={3.6} fontSize={11} fontWeight="700" fill="#ffffff">!</text>
      )}
    </g>
  );
}

// ---- Main scene -----------------------------------------------------------

export default function HazardScene({
  setting,
  elements,
  elementStatus,
  onElementTap,
  disabled,
}: HazardSceneProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-[460px] mx-auto select-none touch-manipulation"
      role="group"
      aria-label="Hazard-spotting scene"
    >
      <SceneBackground setting={setting} />

      {elements.map((el) => {
        const status = elementStatus[el.id] ?? 'idle';
        const tappable = !disabled && status === 'idle';

        return (
          <g
            key={el.id}
            transform={`translate(${el.x} ${el.y})`}
            onClick={tappable ? () => onElementTap(el.id) : undefined}
            onKeyDown={
              tappable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onElementTap(el.id);
                    }
                  }
                : undefined
            }
            role={tappable ? 'button' : undefined}
            tabIndex={tappable ? 0 : undefined}
            aria-label={el.kind}
            className={[
              tappable ? 'cursor-pointer' : 'cursor-default',
              'outline-none',
            ].join(' ')}
          >
            {/* generous invisible tap target */}
            <circle r={25} fill="transparent" />

            {/* shake on a wrong tap — inner group so the CSS transform never
                fights the positioning transform on the element above */}
            <g className={status === 'wrong' ? 'hazard-shake' : ''}>
              {/* status ring */}
              {status === 'found' && <circle r={20} fill="none" stroke="#16a34a" strokeWidth={3} />}
              {status === 'wrong' && <circle r={20} fill="none" stroke="#dc2626" strokeWidth={3} />}
              {status === 'missed' && (
                <circle r={20} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 4" />
              )}

              {/* sprite + cue, rotated to face its direction */}
              <g transform={`rotate(${el.rotation ?? 0})`}>
                <ElementSprite kind={el.kind} />
                {el.cue && <CueOverlay cue={el.cue} />}
              </g>

              {/* result badge */}
              {status === 'found' && <StatusBadge kind="check" />}
              {status === 'wrong' && <StatusBadge kind="x" />}
              {status === 'missed' && <StatusBadge kind="bang" />}
            </g>
          </g>
        );
      })}

      <style>{`
        .hazard-shake { animation: hazard-shake 0.36s ease-in-out 0s 2; }
        @keyframes hazard-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          75% { transform: translate(2px, -1px); }
        }
      `}</style>
    </svg>
  );
}
