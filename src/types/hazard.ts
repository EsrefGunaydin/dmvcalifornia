// Types for the "Eyes on the Road" hazard-spotting game.

export type SceneSetting = 'residential' | 'intersection' | 'parking-lot';

export type ElementKind =
  | 'pedestrian'
  | 'cyclist'
  | 'car'
  | 'ball'
  | 'dog'
  | 'cone'
  | 'tree'
  | 'hydrant';

/**
 * A visual modifier the renderer draws on top of the base sprite. Hazard
 * elements usually carry a cue (the "tell"); decoys never do — though a few
 * hazards rely on a dangerous position instead of a cue.
 */
export type ElementCue =
  | 'door-open'  // a parked car with the driver door swung into the lane
  | 'crossing'   // a pedestrian who has stepped off the curb
  | 'rolling'    // a ball with a motion trail
  | 'running'    // an animal mid-stride
  | 'wobbling'   // a cyclist drifting out of the bike lane
  | 'reversing'; // a car backing out, reverse lights on

export interface HazardElement {
  /** Stable id — used for React keys and result bookkeeping. */
  id: string;
  kind: ElementKind;
  /** Position in the 0-400 viewBox. */
  x: number;
  y: number;
  /** Sprite rotation in degrees (0 = facing up / north). */
  rotation?: number;
  /** Optional visual cue drawn over the sprite. */
  cue?: ElementCue;
  /** Whether tapping this element scores (true) or counts as a wrong tap. */
  isHazard: boolean;
  /** Short name shown on reveal, e.g. "Jaywalking pedestrian". */
  hazardLabel?: string;
  /** Why it's dangerous — shown in the results recap. */
  hazardWhy?: string;
}

export interface HazardScene {
  /** "scene-1" .. "scene-N" */
  id: string;
  title: string;
  description: string;
  setting: SceneSetting;
  /** Seconds on the countdown timer. */
  timeLimit: number;
  elements: HazardElement[];
  /** Optional reference, e.g. "CA Driver Handbook — Scanning the road". */
  reference?: string;
}

export interface HazardScenesFile {
  scenes: HazardScene[];
}

export interface HazardResult {
  sceneId: string;
  stars: 1 | 2 | 3;
  /** Hazards correctly found. */
  found: number;
  /** Total hazards in the scene. */
  total: number;
  /** Non-hazard elements tapped by mistake. */
  wrongTaps: number;
  /** ISO timestamp. */
  solvedAt: string;
}

/**
 * Star rating. A "mistake" is either a hazard you missed or a decoy you
 * tapped: 3 = a clean run, 2 = one or two slips, 1 = finished.
 */
export function starsForHazardRun(
  found: number,
  total: number,
  wrongTaps: number,
): 1 | 2 | 3 {
  const mistakes = total - found + wrongTaps;
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}
