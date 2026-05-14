'use client';

import { Agent, Direction, Intent, IntersectionType } from '@/types/intersection';

export type AgentStatus = 'idle' | 'going' | 'done' | 'crashed';

interface IntersectionSceneProps {
  intersectionType: IntersectionType;
  agents: Agent[];
  agentStatus: Record<string, AgentStatus>;
  /** Tap-order number to show on a badge (1-based). */
  agentBadge: Record<string, number>;
  onAgentTap: (agentId: string) => void;
  /** When true, taps are ignored (crashed / complete states). */
  disabled: boolean;
}

// ---- Geometry -------------------------------------------------------------
// viewBox is 0 0 400 400. Roads are 120px-wide bands crossing at the centre.
const C = 200; // centre
const HALF_ROAD = 60;

type Pt = { x: number; y: number };

// Where a vehicle sits frozen before entering, by the arm it approaches from.
// Lane offset keeps it on the correct (right-hand) side of the road.
function vehicleStart(approachFrom: Direction): Pt {
  switch (approachFrom) {
    case 'south': return { x: C + 30, y: 350 };
    case 'north': return { x: C - 30, y: 50 };
    case 'west': return { x: 50, y: C + 30 };
    case 'east': return { x: 350, y: C - 30 };
  }
}

// Direction a vehicle ends up facing after its turn.
function resultingDirection(approachFrom: Direction, intent: Intent): Direction {
  const order: Direction[] = ['north', 'east', 'south', 'west'];
  // The travel direction when approaching from a given arm.
  const travel: Record<Direction, Direction> = {
    south: 'north', north: 'south', west: 'east', east: 'west',
  };
  let idx = order.indexOf(travel[approachFrom]);
  if (intent === 'right') idx = (idx + 1) % 4;
  if (intent === 'left') idx = (idx + 3) % 4;
  return order[idx];
}

// Where a vehicle exits the frame, based on its resulting travel direction.
// Lane offset matches right-hand-side driving so a vehicle stays in its own
// lane after clearing the intersection (it never drifts into oncoming traffic).
function vehicleExit(approachFrom: Direction, intent: Intent): Pt {
  const dir = resultingDirection(approachFrom, intent);
  switch (dir) {
    case 'north': return { x: C + 30, y: 50 };  // northbound -> right-hand (east) lane
    case 'south': return { x: C - 30, y: 350 }; // southbound -> right-hand (west) lane
    case 'east': return { x: 350, y: C + 30 };  // eastbound  -> right-hand (south) lane
    case 'west': return { x: 50, y: C - 30 };   // westbound  -> right-hand (north) lane
  }
}

// The corner point of a vehicle's path through the intersection. For a
// straight move it's just the midpoint (keeps the lane); for a turn it's the
// right-angle corner where the entry lane meets the exit lane, so the vehicle
// tracks its lane in and its lane out.
function vehicleMid(approachFrom: Direction, intent: Intent, start: Pt, exit: Pt): Pt {
  if (intent === 'straight') {
    return { x: (start.x + exit.x) / 2, y: (start.y + exit.y) / 2 };
  }
  const startVertical = approachFrom === 'south' || approachFrom === 'north';
  return startVertical
    ? { x: start.x, y: exit.y } // came in vertically, leaves horizontally
    : { x: exit.x, y: start.y }; // came in horizontally, leaves vertically
}

// Pedestrians cross one arm of the intersection perpendicular to traffic.
function pedPath(approachFrom: Direction): { start: Pt; mid: Pt; exit: Pt } {
  switch (approachFrom) {
    case 'north': return { start: { x: 120, y: 110 }, mid: { x: C, y: 110 }, exit: { x: 280, y: 110 } };
    case 'south': return { start: { x: 280, y: 290 }, mid: { x: C, y: 290 }, exit: { x: 120, y: 290 } };
    case 'west': return { start: { x: 110, y: 280 }, mid: { x: 110, y: C }, exit: { x: 110, y: 120 } };
    case 'east': return { start: { x: 290, y: 120 }, mid: { x: 290, y: C }, exit: { x: 290, y: 280 } };
  }
}

// Rotation (deg) so a north-pointing sprite faces its travel direction.
function travelAngle(approachFrom: Direction): number {
  switch (approachFrom) {
    case 'south': return 0;
    case 'north': return 180;
    case 'west': return 90;
    case 'east': return 270;
  }
}

const AGENT_COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#db2777', '#ca8a04'];

// Colour-code the label pill by what it conveys, so signal state reads at a
// glance: red light -> red pill, green light/arrow -> green pill, siren -> red.
function labelStyle(label: string): { bg: string; fg: string } {
  const l = label.toLowerCase();
  if (l.includes('red')) return { bg: '#dc2626', fg: '#ffffff' };
  if (l.includes('green')) return { bg: '#16a34a', fg: '#ffffff' };
  if (l.includes('siren') || l.includes('emergency')) return { bg: '#dc2626', fg: '#ffffff' };
  if (l.includes('yellow') || l.includes('caution')) return { bg: '#f59e0b', fg: '#1f2937' };
  return { bg: '#1f2937', fg: '#ffffff' }; // neutral
}

// ---- Sub-renderers --------------------------------------------------------

function RoadBase({ type }: { type: IntersectionType }) {
  const isT = type === 't-intersection';
  return (
    <g>
      {/* grass / ground */}
      <rect x={0} y={0} width={400} height={400} fill="#e8efe6" rx={12} />
      {/* horizontal road */}
      <rect x={0} y={C - HALF_ROAD} width={400} height={HALF_ROAD * 2} fill="#5b6168" />
      {/* vertical road — full, or only the southern arm for a T */}
      {isT ? (
        <rect x={C - HALF_ROAD} y={C - HALF_ROAD} width={HALF_ROAD * 2} height={200 + HALF_ROAD} fill="#5b6168" />
      ) : (
        <rect x={C - HALF_ROAD} y={0} width={HALF_ROAD * 2} height={400} fill="#5b6168" />
      )}
      {/* centre lane dashes */}
      <line x1={0} y1={C} x2={C - HALF_ROAD} y2={C} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      <line x1={C + HALF_ROAD} y1={C} x2={400} y2={C} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
      {!isT && (
        <>
          <line x1={C} y1={0} x2={C} y2={C - HALF_ROAD} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
        </>
      )}
      <line x1={C} y1={C + HALF_ROAD} x2={C} y2={400} stroke="#f5c542" strokeWidth={3} strokeDasharray="14 12" />
    </g>
  );
}

function Crosswalks({ type }: { type: IntersectionType }) {
  if (type === 'four-way-stop') return null;
  const stripe = (x: number, y: number, w: number, h: number, vertical: boolean) => {
    const bars = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      bars.push(
        vertical
          ? <rect key={i} x={x + (i * w) / count} y={y} width={w / count - 3} height={h} fill="#f5f5f4" />
          : <rect key={i} x={x} y={y + (i * h) / count} width={w} height={h / count - 3} fill="#f5f5f4" />,
      );
    }
    return bars;
  };
  return (
    <g opacity={0.85}>
      {/* north + south crosswalks (horizontal stripes across the vertical road) */}
      {stripe(C - HALF_ROAD, C - HALF_ROAD - 18, HALF_ROAD * 2, 14, true)}
      {stripe(C - HALF_ROAD, C + HALF_ROAD + 4, HALF_ROAD * 2, 14, true)}
      {/* west + east crosswalks (vertical stripes across the horizontal road) */}
      {stripe(C - HALF_ROAD - 18, C - HALF_ROAD, 14, HALF_ROAD * 2, false)}
      {stripe(C + HALF_ROAD + 4, C - HALF_ROAD, 14, HALF_ROAD * 2, false)}
    </g>
  );
}

function StopSign({ x, y }: Pt) {
  // Small red octagon.
  const r = 11;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <g>
      <polygon points={pts} fill="#dc2626" stroke="#fff" strokeWidth={1.5} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={6} fontWeight="700" fill="#fff">STOP</text>
    </g>
  );
}

function SignalHead({ x, y }: Pt) {
  return (
    <g>
      <rect x={x - 5} y={y - 13} width={10} height={26} rx={3} fill="#1f2937" />
      <circle cx={x} cy={y - 7} r={3} fill="#7f1d1d" />
      <circle cx={x} cy={y} r={3} fill="#78350f" />
      <circle cx={x} cy={y + 7} r={3} fill="#14532d" />
    </g>
  );
}

function Controls({ type }: { type: IntersectionType }) {
  if (type === 'four-way-stop') {
    return (
      <g>
        <StopSign x={C + HALF_ROAD + 16} y={C + HALF_ROAD + 16} />
        <StopSign x={C - HALF_ROAD - 16} y={C - HALF_ROAD - 16} />
        <StopSign x={C + HALF_ROAD + 16} y={C - HALF_ROAD - 16} />
        <StopSign x={C - HALF_ROAD - 16} y={C + HALF_ROAD + 16} />
      </g>
    );
  }
  if (type === 'signal') {
    return (
      <g>
        <SignalHead x={C + HALF_ROAD + 14} y={C + HALF_ROAD + 14} />
        <SignalHead x={C - HALF_ROAD - 14} y={C - HALF_ROAD - 14} />
        <SignalHead x={C + HALF_ROAD + 14} y={C - HALF_ROAD - 14} />
        <SignalHead x={C - HALF_ROAD - 14} y={C + HALF_ROAD + 14} />
      </g>
    );
  }
  return null;
}

// Bold turn-intent indicator, drawn in the agent's local frame (north = up,
// front of the vehicle at the top). The shaft starts just in front of the
// vehicle and the arrowhead shows where it's headed. A white halo keeps it
// readable on the gray road.
function IntentArrow({ intent }: { intent: Intent }) {
  let shaft: string;
  let head: { x: number; y: number; rot: number };

  if (intent === 'straight') {
    shaft = 'M 0 -28 L 0 -46';
    head = { x: 0, y: -46, rot: 0 };
  } else if (intent === 'left') {
    // up out of the car, curve over to the left
    shaft = 'M 6 -28 L 6 -42 Q 6 -48 0 -48 L -10 -48';
    head = { x: -10, y: -48, rot: -90 };
  } else {
    // up out of the car, curve over to the right
    shaft = 'M -6 -28 L -6 -42 Q -6 -48 0 -48 L 10 -48';
    head = { x: 10, y: -48, rot: 90 };
  }

  // Triangle arrowhead, apex pointing up by default.
  const headPath = 'M 0 -8 L 8 5 L -8 5 Z';

  return (
    <g>
      {/* white halo + amber shaft */}
      <path d={shaft} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d={shaft} fill="none" stroke="#f59e0b" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      {/* arrowhead */}
      <g transform={`translate(${head.x} ${head.y}) rotate(${head.rot})`}>
        <path d={headPath} fill="#f59e0b" stroke="#ffffff" strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    </g>
  );
}

// All sprites are drawn pointing "up" (north / front at top); the parent
// group rotates them to face their travel direction.

function AgentSprite({ agent, color }: { agent: Agent; color: string }) {
  if (agent.type === 'pedestrian') {
    return (
      <g>
        {/* shoulders */}
        <ellipse cx={0} cy={3} rx={9} ry={6.5} fill="#f59e0b" stroke="#fff" strokeWidth={2} />
        {/* head */}
        <circle cx={0} cy={-4} r={6} fill="#fcd34d" stroke="#fff" strokeWidth={2} />
      </g>
    );
  }

  if (agent.type === 'cyclist') {
    return (
      <g>
        {/* wheels (front at top) */}
        <ellipse cx={0} cy={-13} rx={3} ry={8.5} fill="#1f2937" />
        <ellipse cx={0} cy={13} rx={3} ry={8.5} fill="#1f2937" />
        {/* frame */}
        <rect x={-1.6} y={-13} width={3.2} height={26} fill="#15803d" />
        {/* handlebars */}
        <rect x={-7} y={-8} width={14} height={2.6} rx={1.3} fill="#374151" />
        {/* rider */}
        <circle cx={0} cy={1} r={7} fill="#16a34a" stroke="#fff" strokeWidth={1.6} />
        <circle cx={0} cy={-0.5} r={3} fill="#fde68a" />
        <IntentArrow intent={agent.intent} />
      </g>
    );
  }

  if (agent.type === 'emergency') {
    return (
      <g>
        {/* body */}
        <rect x={-15} y={-25} width={30} height={50} rx={7} fill="#f8fafc" stroke="#dc2626" strokeWidth={2.2} />
        {/* light bar at the front */}
        <rect x={-12} y={-24} width={24} height={6} rx={2} fill="#dc2626" className="intersection-siren" />
        {/* windshield */}
        <path d="M -11 -17 L 11 -17 L 8 -11 L -8 -11 Z" fill="#cfe8ff" opacity={0.92} />
        {/* red cross on the roof */}
        <g transform="translate(0 7)">
          <rect x={-2.6} y={-7.5} width={5.2} height={15} fill="#dc2626" />
          <rect x={-7.5} y={-2.6} width={15} height={5.2} fill="#dc2626" />
        </g>
        {/* taillights */}
        <rect x={-12} y={21} width={5} height={3} rx={1.5} fill="#ef4444" />
        <rect x={7} y={21} width={5} height={3} rx={1.5} fill="#ef4444" />
        <IntentArrow intent={agent.intent} />
      </g>
    );
  }

  // car — top-down shape
  return (
    <g>
      {/* painted body */}
      <rect x={-14} y={-23} width={28} height={46} rx={9} fill={color} stroke="#1f2937" strokeWidth={1.5} />
      {/* darker roof panel */}
      <rect x={-11} y={-8} width={22} height={19} rx={5} fill="rgba(0,0,0,0.24)" />
      {/* front windshield */}
      <path d="M -10 -8 L 10 -8 L 7 -16 L -7 -16 Z" fill="#cfe8ff" opacity={0.92} />
      {/* rear window */}
      <path d="M -9 11 L 9 11 L 7 17 L -7 17 Z" fill="#cfe8ff" opacity={0.78} />
      {/* headlights (front) */}
      <rect x={-11} y={-22} width={5} height={3.4} rx={1.6} fill="#fff7cc" />
      <rect x={6} y={-22} width={5} height={3.4} rx={1.6} fill="#fff7cc" />
      {/* taillights (rear) */}
      <rect x={-11} y={18.8} width={5} height={3} rx={1.5} fill="#ef4444" />
      <rect x={6} y={18.8} width={5} height={3} rx={1.5} fill="#ef4444" />
      {/* side mirrors */}
      <rect x={-16.5} y={-11} width={3} height={4} rx={1} fill={color} stroke="#1f2937" strokeWidth={0.8} />
      <rect x={13.5} y={-11} width={3} height={4} rx={1} fill={color} stroke="#1f2937" strokeWidth={0.8} />
      <IntentArrow intent={agent.intent} />
    </g>
  );
}

// ---- Main scene -----------------------------------------------------------

export default function IntersectionScene({
  intersectionType,
  agents,
  agentStatus,
  agentBadge,
  onAgentTap,
  disabled,
}: IntersectionSceneProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-[460px] mx-auto select-none touch-manipulation"
      role="group"
      aria-label="Intersection puzzle"
    >
      <RoadBase type={intersectionType} />
      <Crosswalks type={intersectionType} />
      <Controls type={intersectionType} />

      {agents.map((agent, i) => {
        const color = AGENT_COLORS[i % AGENT_COLORS.length];
        const status = agentStatus[agent.id] ?? 'idle';
        const badge = agentBadge[agent.id];

        // Resolve the path: start -> lane-aware corner -> exit. The corner
        // keeps each vehicle in its own lane, so no two vehicles ever pass
        // through the same point and nobody drifts into oncoming traffic.
        let start: Pt;
        let mid: Pt;
        let exit: Pt;
        let startAngle = 0;
        let finalAngle = 0;
        if (agent.type === 'pedestrian') {
          const p = pedPath(agent.approachFrom);
          start = p.start; mid = p.mid; exit = p.exit;
        } else {
          start = vehicleStart(agent.approachFrom);
          exit = vehicleExit(agent.approachFrom, agent.intent);
          mid = vehicleMid(agent.approachFrom, agent.intent, start, exit);
          startAngle = travelAngle(agent.approachFrom);
          finalAngle =
            agent.intent === 'left'
              ? startAngle - 90
              : agent.intent === 'right'
                ? startAngle + 90
                : startAngle;
        }

        const moving = status === 'going' || status === 'done';
        // Vehicle faces its travel direction; turners rotate during phase 2.
        const renderAngle = moving ? finalAngle : startAngle;
        // Outer group slides start->mid; inner slides mid->exit (delayed).
        const outerShift = moving ? { x: mid.x - start.x, y: mid.y - start.y } : { x: 0, y: 0 };
        const innerShift = moving ? { x: exit.x - mid.x, y: exit.y - mid.y } : { x: 0, y: 0 };

        const tappable = status === 'idle' && !disabled;

        return (
          <g
            key={agent.id}
            style={{
              transform: `translate(${outerShift.x}px, ${outerShift.y}px)`,
              transition: 'transform 0.45s ease-in',
            }}
          >
            <g
              style={{
                transform: `translate(${innerShift.x}px, ${innerShift.y}px)`,
                transition: 'transform 0.45s ease-out 0.4s',
              }}
            >
              <g
                transform={`translate(${start.x} ${start.y})`}
                onClick={tappable ? () => onAgentTap(agent.id) : undefined}
                onKeyDown={
                  tappable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onAgentTap(agent.id);
                        }
                      }
                    : undefined
                }
                role={tappable ? 'button' : undefined}
                tabIndex={tappable ? 0 : undefined}
                aria-label={`${agent.type} approaching from the ${agent.approachFrom}${
                  agent.label ? `, ${agent.label}` : ''
                }`}
                className={[
                  tappable ? 'cursor-pointer' : 'cursor-default',
                  'outline-none',
                  status === 'crashed' ? 'intersection-crash' : '',
                  status === 'done' ? 'opacity-40' : '',
                ].join(' ')}
              >
                {/* generous invisible tap target */}
                <circle r={30} fill="transparent" />

                {/* selection / status ring */}
                {status === 'idle' && !disabled && (
                  <circle r={26} fill="none" stroke="#f4511e" strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />
                )}
                {moving && (
                  <circle r={26} fill="none" stroke="#16a34a" strokeWidth={3} />
                )}
                {status === 'crashed' && (
                  <circle r={26} fill="none" stroke="#dc2626" strokeWidth={3} />
                )}

                <g
                  style={{
                    transform: `rotate(${renderAngle}deg)`,
                    transformOrigin: '0px 0px',
                    transition: 'transform 0.4s ease-in-out 0.4s',
                  }}
                >
                  <AgentSprite agent={agent} color={color} />
                </g>

                {/* order badge */}
                {badge != null && (
                  <g transform="translate(18 -22)">
                    <circle r={10} fill="#16a34a" stroke="#fff" strokeWidth={2} />
                    <text textAnchor="middle" y={3.5} fontSize={11} fontWeight="700" fill="#fff">
                      {badge}
                    </text>
                  </g>
                )}

                {/* label tag — colour-coded, placed behind the vehicle so it
                    never overlaps the turn arrow (which emanates from the front) */}
                {agent.label && status === 'idle' && (() => {
                  const { bg, fg } = labelStyle(agent.label);
                  const w = Math.max(60, agent.label.length * 6.2 + 14);
                  // "Behind the car" — opposite the travel direction.
                  const labelY = agent.approachFrom === 'north' ? -44 : 40;
                  return (
                    <g transform={`translate(0 ${labelY})`}>
                      <rect x={-w / 2} y={-10} width={w} height={20} rx={10} fill={bg} />
                      <text textAnchor="middle" y={4} fontSize={10} fontWeight={600} fill={fg}>
                        {agent.label}
                      </text>
                    </g>
                  );
                })()}
              </g>
            </g>
          </g>
        );
      })}

      <style>{`
        .intersection-crash { animation: intersection-shake 0.4s ease-in-out 0s 2; }
        @keyframes intersection-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-3px, 2px); }
          75% { transform: translate(3px, -2px); }
        }
        .intersection-siren { animation: intersection-flash 0.6s steps(1) infinite; }
        @keyframes intersection-flash {
          0%, 100% { fill: #dc2626; }
          50% { fill: #2563eb; }
        }
      `}</style>
    </svg>
  );
}
