import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideImage {
  id: number | string;
  image_url: string;
  caption?: string | null;
}

interface ImageSliderProps {
  images: SlideImage[];
  /** Tailwind aspect-ratio class for the slide frame. */
  aspectClass?: string;
  /** Caps how wide the frame gets; the frame is full width below that. */
  maxWidthClass?: string;
  objectFit?: 'cover' | 'contain';
  /** Milliseconds between automatic slides. 0 disables autoplay. */
  autoPlayMs?: number;
}

/**
 * Auto-advancing carousel: one slide at a time on a sliding track, with
 * arrows, dots, swipe, and pause-on-hover. Autoplay stops while the pointer
 * is over the frame and restarts after any manual navigation.
 */
export default function ImageSlider({
  images,
  aspectClass = 'aspect-[4/3]',
  maxWidthClass = 'max-w-md',
  objectFit = 'cover',
  autoPlayMs = 4000,
}: ImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;
  const safeIndex = count ? Math.min(index, count - 1) : 0;

  // Keep the index valid if the image list shrinks
  useEffect(() => {
    if (index > count - 1) setIndex(0);
  }, [count, index]);

  // Autoplay. `safeIndex` is a dependency so the timer restarts from zero
  // after a manual arrow/dot click rather than firing immediately after.
  useEffect(() => {
    if (!autoPlayMs || paused || count < 2) return;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const timer = setTimeout(() => setIndex(i => (i + 1) % count), autoPlayMs);
    return () => clearTimeout(timer);
  }, [safeIndex, paused, count, autoPlayMs]);

  if (count === 0) return null;

  const prev = () => setIndex(i => (i === 0 ? count - 1 : i - 1));
  const next = () => setIndex(i => (i === count - 1 ? 0 : i + 1));

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className={`${maxWidthClass} mx-auto`}>
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-lg`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding track */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img.id} className="relative w-full h-full shrink-0">
              <img
                src={img.image_url}
                alt={img.caption || `Slide ${i + 1}`}
                className={`w-full h-full ${fitClass}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
                  <p className="text-white text-xs sm:text-sm font-medium text-center break-words">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-1.5 sm:p-2 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-1.5 sm:p-2 shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="absolute top-2 right-2 z-10 bg-black/60 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
              {safeIndex + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`ছবি ${i + 1} দেখুন`}
              className={`h-2 rounded-full transition-all ${
                i === safeIndex ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
