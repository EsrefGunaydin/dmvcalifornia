'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Click-to-zoom lightbox for article body images.
 *
 * Mounts once per blog post page. Listens for clicks on <img> elements inside
 * the page's <article>, opens an overlay with the image centered, and uses the
 * highest-resolution source available (preferring the wrapping <a href> link
 * if present, since articles often link a thumbnail to the full-size image).
 */
export default function BlogImageLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string>('');
  const [alt, setAlt] = useState<string>('');

  const close = useCallback(() => {
    setOpen(false);
    setSrc('');
    setAlt('');
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Walk up from the click target to the nearest <img>
      const img = (target.tagName === 'IMG' ? target : target.closest('img')) as HTMLImageElement | null;
      if (!img) return;
      // Scope: only article-body images
      const article = img.closest('article');
      if (!article) return;
      // Skip if the image is itself a tiny UI element (decorative icons)
      if (img.naturalWidth > 0 && img.naturalWidth < 60) return;

      // If the image is wrapped in an <a>, respect the link's intent:
      //  - href points to an image asset → zoom that full-size source
      //  - href is a real navigation link (e.g. the App Store badge, a related
      //    article) → do NOT hijack the tap; let the link navigate.
      const anchor = img.closest('a') as HTMLAnchorElement | null;
      let target_src = img.currentSrc || img.src;
      if (anchor && anchor.href) {
        const href = anchor.getAttribute('href') || '';
        if (/\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(href)) {
          target_src = href;
        } else {
          // Linked to a page/app/external URL — this is a button, not a zoom.
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();
      setSrc(target_src);
      setAlt(img.alt || '');
      setOpen(true);
    }
    document.addEventListener('click', onClick, true); // capture phase, beats <a> default
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);
    // Lock body scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image preview'}
      onClick={close}
      className="fixed inset-0 z-[100050] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
    >
      <button
        type="button"
        aria-label="Close image preview"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-2xl hover:bg-gray-100 transition-colors text-xl font-bold"
      >
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[95vw] max-h-[92vh] object-contain rounded-md shadow-2xl cursor-default"
      />
      {alt && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/85 text-sm bg-black/60 px-3 py-1.5 rounded-full max-w-[90vw] text-center">
          {alt}
        </p>
      )}
    </div>
  );
}
