'use client';

import { LeaderboardEntry } from '@/types/quiz';
import { useState } from 'react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  quizTitle: string;
  limit?: number;
}

export default function Leaderboard({ entries, quizTitle, limit = 10 }: LeaderboardProps) {
  const [showAll, setShowAll] = useState(false);

  // Get top entries (sorted by percentage descending)
  const sortedEntries = [...entries]
    .sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      // If percentages are equal, earlier date wins
      return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
    });

  const displayedEntries = showAll ? sortedEntries : sortedEntries.slice(0, limit);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-500 text-center py-8">
          Be the first to appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          🏆 Leaderboard
        </h2>
        <span className="text-sm text-gray-500">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3 text-center">Score</div>
          <div className="col-span-3 text-right">Date</div>
        </div>

        {/* Entries */}
        {displayedEntries.map((entry, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={entry.id}
              className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-lg transition-colors ${
                isTopThree
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center">
                <span className={`text-sm font-bold ${
                  isTopThree ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {getMedalEmoji(rank) || `#${rank}`}
                </span>
              </div>

              {/* Name */}
              <div className="col-span-5 flex items-center">
                <span className={`text-sm font-medium truncate ${
                  isTopThree ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {entry.name}
                </span>
              </div>

              {/* Score */}
              <div className="col-span-3 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${
                    entry.percentage >= 90 ? 'text-green-600' :
                    entry.percentage >= 80 ? 'text-blue-600' :
                    entry.percentage >= 70 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {entry.percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    ({entry.points} pts)
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-3 flex items-center justify-end">
                <span className="text-xs text-gray-500">
                  {formatDate(entry.completedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {entries.length > limit && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:text-primary-600 font-medium text-sm transition-colors"
          >
            {showAll ? 'Show Less' : `Show All ${entries.length} Entries`}
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sortedEntries[0]?.percentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Highest Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {(entries.reduce((sum, e) => sum + e.percentage, 0) / entries.length).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">Average Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {entries.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Attempts</div>
        </div>
      </div>
    </div>
  );
}
