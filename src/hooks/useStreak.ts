'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY_DATE    = 'lastStudyDate';
const KEY_STREAK  = 'currentStreak';
const KEY_BEST    = 'bestStreak';

function toDateStr(d = new Date()) {
  // The streak is personal and device-local (localStorage, no shared
  // board), so it should reset at the visitor's own local midnight, not
  // UTC — d.toISOString() converts to UTC first, which flipped the
  // "day" hours before local midnight for anyone west of Greenwich.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
}

export interface StreakState {
  streak: number;
  bestStreak: number;
  studiedToday: boolean;
  /** Call once when the user finishes any quiz/game/flashcard session. */
  recordStudy: () => number;
}

export function useStreak(): StreakState {
  const [streak, setStreak]           = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);
  const [studiedToday, setStudiedToday] = useState(false);

  useEffect(() => {
    const today     = toDateStr();
    const yesterday = yesterdayStr();
    const lastDate  = localStorage.getItem(KEY_DATE) ?? '';
    const current   = parseInt(localStorage.getItem(KEY_STREAK) ?? '0', 10);
    const best      = parseInt(localStorage.getItem(KEY_BEST)   ?? '0', 10);

    setBestStreak(best);

    if (lastDate === today) {
      setStreak(current);
      setStudiedToday(true);
    } else if (lastDate === yesterday) {
      // Streak still alive — not yet incremented today
      setStreak(current);
      setStudiedToday(false);
    } else {
      // First visit ever, or missed at least one day
      setStreak(0);
      setStudiedToday(false);
    }
  }, []);

  const recordStudy = useCallback((): number => {
    const today     = toDateStr();
    const yesterday = yesterdayStr();
    const lastDate  = localStorage.getItem(KEY_DATE) ?? '';

    // Already counted today — idempotent
    if (lastDate === today) {
      return parseInt(localStorage.getItem(KEY_STREAK) ?? '0', 10);
    }

    let current = parseInt(localStorage.getItem(KEY_STREAK) ?? '0', 10);
    const best  = parseInt(localStorage.getItem(KEY_BEST)   ?? '0', 10);

    current = lastDate === yesterday ? current + 1 : 1;

    localStorage.setItem(KEY_STREAK, String(current));
    localStorage.setItem(KEY_DATE,   today);
    if (current > best) {
      localStorage.setItem(KEY_BEST, String(current));
      setBestStreak(current);
    }

    setStreak(current);
    setStudiedToday(true);
    return current;
  }, []);

  return { streak, bestStreak, studiedToday, recordStudy };
}
