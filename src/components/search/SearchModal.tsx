'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { searchEntries, categoryLabel, type SearchEntry } from '@/lib/searchIndex';

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const results = useMemo(() => searchEntries(query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Close automatically once navigation actually happens (covers both a
  // result click and any other way the route could change while open).
  const initialPathname = useRef(pathname);
  useEffect(() => {
    if (pathname !== initialPathname.current) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        const chosen = results[activeIndex];
        if (chosen) {
          router.push(chosen.href);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, activeIndex, onClose, router]);

  const handleSelect = (entry: SearchEntry) => {
    router.push(entry.href);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-start justify-center p-4 pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search practice tests, guides, blog posts…"
            className="flex-1 outline-none text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-400">
              Start typing to search the whole site.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-gray-400">
              No results for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul>
              {results.map((entry, i) => (
                <li key={entry.href}>
                  <button
                    onClick={() => handleSelect(entry)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left px-4 py-3 flex items-start justify-between gap-3 transition-colors ${
                      i === activeIndex ? 'bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-gray-900 truncate">{entry.title}</span>
                      <span className="block text-sm text-gray-500 truncate">{entry.description}</span>
                    </span>
                    <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-primary bg-orange-100 px-2 py-1 rounded-full">
                      {categoryLabel(entry.category)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
