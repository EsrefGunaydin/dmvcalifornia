'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDailyWord, getDailyIndex } from '@/data/dmvordle-words';

export type GameState = 'playing' | 'won' | 'lost';

interface DMVordleProps {
  onGameStateChange?: (state: GameState, attempts: number) => void;
}

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

interface TileProps {
  letter: string;
  state: LetterState;
  reveal?: boolean;
  delay?: number;
}

// FLIP_DURATION must match the CSS animation duration below (500ms)
const FLIP_DURATION = 500;

function Tile({ letter, state, reveal = false, delay = 0 }: TileProps) {
  // Start colorless; switch to the real color at the flip midpoint so the
  // color appears while the tile is edge-on (invisible to the user).
  const [displayState, setDisplayState] = useState<LetterState>(state);

  useEffect(() => {
    if (reveal) {
      setDisplayState('tbd');
      const timer = setTimeout(() => setDisplayState(state), delay + FLIP_DURATION / 2);
      return () => clearTimeout(timer);
    } else {
      setDisplayState(state);
    }
  }, [reveal, state, delay]);

  const base = 'w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase select-none';
  const styles: Record<LetterState, string> = {
    correct: 'bg-green-500 border-green-500 text-white',
    present: 'bg-yellow-400 border-yellow-400 text-white',
    absent: 'bg-gray-400 border-gray-400 text-white',
    empty: 'border-gray-300 text-gray-900',
    tbd: 'border-gray-500 text-gray-900',
  };

  return (
    <div
      className={`${base} ${styles[displayState]} ${reveal ? 'animate-flip' : ''}`}
      style={reveal ? { animationDelay: `${delay}ms` } : {}}
    >
      {letter}
    </div>
  );
}

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function getLetterResults(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent');
  const answerArr = answer.split('');
  const remaining: Record<string, number> = {};
  for (const c of answerArr) remaining[c] = (remaining[c] || 0) + 1;

  // First pass: correct
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      remaining[guess[i]]--;
    }
  }
  // Second pass: present
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] !== 'correct' && remaining[guess[i]] > 0) {
      result[i] = 'present';
      remaining[guess[i]]--;
    }
  }
  return result;
}

function buildShareText(guesses: string[], answer: string, dayIndex: number): string {
  const rows = guesses.map((g) =>
    getLetterResults(g, answer)
      .map((s) => (s === 'correct' ? '🟩' : s === 'present' ? '🟨' : '⬛'))
      .join('')
  );
  return `DMVordle #${dayIndex} ${guesses.length <= MAX_GUESSES && guesses[guesses.length - 1] === answer ? guesses.length : 'X'}/${MAX_GUESSES}\n\n${rows.join('\n')}\n\ndmvcalifornia.us/games/dmvordle`;
}

function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-16 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-base uppercase tracking-wide">How to play</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>Guess the DMV word in <strong>6 tries</strong>. Type any 5 letters and press Enter.</li>
          <li className="flex items-center gap-2">
            <span className="w-7 h-7 bg-green-500 rounded text-white text-xs font-bold flex items-center justify-center shrink-0">Y</span>
            Right letter, right position
          </li>
          <li className="flex items-center gap-2">
            <span className="w-7 h-7 bg-yellow-400 rounded text-white text-xs font-bold flex items-center justify-center shrink-0">Y</span>
            Right letter, wrong position
          </li>
          <li className="flex items-center gap-2">
            <span className="w-7 h-7 bg-gray-400 rounded text-white text-xs font-bold flex items-center justify-center shrink-0">Y</span>
            Letter not in the word
          </li>
          <li>All words are traffic and DMV related. New word at midnight.</li>
        </ul>
      </div>
    </div>
  );
}

export default function DMVordle({ onGameStateChange }: DMVordleProps = {}) {
  const answer = getDailyWord();
  const dayIndex = getDailyIndex();
  const storageKey = `dmvordle-${answer}`;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shake, setShake] = useState(false);
  const [revealRow, setRevealRow] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [shared, setShared] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { guesses: g, gameState: gs } = JSON.parse(saved);
        setGuesses(g);
        setGameState(gs);
        if (gs !== 'playing') {
          const att = gs === 'won' ? g.length : MAX_GUESSES + 1;
          onGameStateChange?.(gs, att);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const showToast = (msg: string, duration = 1800) => {
    setToast(msg);
    setTimeout(() => setToast(''), duration);
  };

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      showToast('Not enough letters');
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    const won = currentGuess === answer;
    const lost = !won && newGuesses.length >= MAX_GUESSES;
    const newState = won ? 'won' : lost ? 'lost' : 'playing';

    setRevealRow(newGuesses.length - 1);
    setTimeout(() => setRevealRow(null), WORD_LENGTH * 300 + 400);

    setGuesses(newGuesses);
    setCurrentGuess('');
    setGameState(newState);

    localStorage.setItem(storageKey, JSON.stringify({ guesses: newGuesses, gameState: newState }));

    if (won) {
      const msgs = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
      const delay = WORD_LENGTH * 300 + 200;
      setTimeout(() => showToast(msgs[newGuesses.length - 1] ?? 'Nice!', 2500), delay);
      setTimeout(() => onGameStateChange?.('won', newGuesses.length), delay + 100);
    } else if (lost) {
      const delay = WORD_LENGTH * 300 + 200;
      setTimeout(() => showToast(answer, 4000), delay);
      setTimeout(() => onGameStateChange?.('lost', MAX_GUESSES + 1), delay + 100);
    }
  }, [currentGuess, guesses, answer, storageKey, onGameStateChange]);

  const onKey = useCallback((key: string) => {
    if (gameState !== 'playing') return;
    if (key === 'ENTER') { submitGuess(); return; }
    if (key === '⌫' || key === 'BACKSPACE') {
      setCurrentGuess((c) => c.slice(0, -1));
      return;
    }
    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((c) => c + key);
    }
  }, [gameState, currentGuess, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      onKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onKey]);

  // Build keyboard letter states
  const keyStates: Record<string, LetterState> = {};
  for (const g of guesses) {
    const results = getLetterResults(g, answer);
    for (let i = 0; i < g.length; i++) {
      const prev = keyStates[g[i]];
      const next = results[i];
      if (prev === 'correct') continue;
      if (prev === 'present' && next !== 'correct') continue;
      keyStates[g[i]] = next;
    }
  }

  const keyStyle = (k: string): string => {
    const base = 'flex items-center justify-center rounded font-bold text-sm uppercase cursor-pointer select-none active:scale-95 transition-all';
    const wide = k === 'ENTER' || k === '⌫' ? 'px-2 h-14 min-w-[3rem] text-xs' : 'w-9 h-14';
    const state = keyStates[k];
    const color = state === 'correct' ? 'bg-green-500 text-white' :
                  state === 'present' ? 'bg-yellow-400 text-white' :
                  state === 'absent' ? 'bg-gray-400 text-white' :
                  'bg-gray-200 text-gray-900';
    return `${base} ${wide} ${color}`;
  };

  const shareText = buildShareText(guesses, answer, dayIndex);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      showToast('Copied!');
      setTimeout(() => setShared(false), 2000);
    } catch {
      showToast('Could not copy');
    }
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
  };

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-2 relative w-full max-w-sm mx-auto">

      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg animate-fade-in pointer-events-none">
          {toast}
        </div>
      )}

      {/* Sub-header: day + help */}
      <div className="flex items-center justify-between w-full px-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">#{dayIndex}</p>
        <button onClick={() => setShowHelp(true)} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="How to play">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
          const guess = guesses[rowIdx] ?? '';
          const isCurrentRow = rowIdx === guesses.length && gameState === 'playing';
          const displayWord = isCurrentRow ? currentGuess : guess;
          const isRevealing = revealRow === rowIdx;

          return (
            <div key={rowIdx} className={`flex gap-1.5 ${shake && isCurrentRow ? 'animate-shake' : ''}`}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                const letter = displayWord[colIdx] ?? '';
                let state: LetterState = 'empty';
                if (isCurrentRow) {
                  state = letter ? 'tbd' : 'empty';
                } else if (guess) {
                  state = getLetterResults(guess, answer)[colIdx];
                }
                return (
                  <Tile
                    key={colIdx}
                    letter={letter}
                    state={state}
                    reveal={isRevealing && !!guess}
                    delay={colIdx * 300}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* End state */}
      {gameState !== 'playing' && (
        <div className="text-center mt-2">
          {gameState === 'won' && (
            <p className="text-green-600 font-bold text-lg mb-1">You got it!</p>
          )}
          {gameState === 'lost' && (
            <p className="text-gray-700 font-bold text-lg mb-1">The word was <span className="text-primary">{answer}</span></p>
          )}
          <p className="text-xs text-gray-400 mb-3">New word tomorrow</p>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {/* Twitter / X */}
            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L2.25 2.25h6.918l4.261 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Post
            </button>
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </button>
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              {shared ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 mt-2">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map((k) => (
              <button key={k} className={keyStyle(k)} onClick={() => onKey(k)} aria-label={k}>
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-4px)}
          40%,80%{transform:translateX(4px)}
        }
        @keyframes flip {
          0%{transform:rotateX(0)}
          50%{transform:rotateX(-90deg)}
          100%{transform:rotateX(0)}
        }
        @keyframes fade-in {
          from{opacity:0;transform:translate(-50%,-8px)}
          to{opacity:1;transform:translate(-50%,0)}
        }
        .animate-shake{animation:shake 0.5s ease-in-out;}
        .animate-flip{animation:flip 0.5s ease-in-out;}
        .animate-fade-in{animation:fade-in 0.15s ease-out;}
      `}</style>
    </div>
  );
}
