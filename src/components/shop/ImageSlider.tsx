import { useState, useEffect } from 'react';
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
  /** Caps how wide the image gets on large screens; full width on phones. */
  maxWidthClass?: string;
  objectFit?: 'cover' | 'contain';
}

/** One large image at a time, with arrows, dots and swipe to move between them. */
export default function ImageSlider({
  images,
  aspectClass = 'aspect-[4/3]',
  maxWidthClass = 'max-w-4xl',
  objectFit = 'cover',
}: ImageSliderProps) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Keep the index valid if the image list shrinks
  useEffect(() => {
    if (index > images.length - 1) setIndex(0);
  }, [images.length, index]);

  if (images.length === 0) return null;

  const count = images.length;
  const safeIndex = Math.min(index, count - 1);
  const prev = () => setIndex(i => (i === 0 ? count - 1 : i - 1));
  const next = () => setIndex(i => (i === count - 1 ? 0 : i + 1));

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    setTouchStartX(null);
  };

  const current = images[safeIndex];
  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <div className={`${maxWidthClass} mx-auto`}>
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 shadow-xl`}
        onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={current.image_url}
          alt={current.caption || `Slide ${safeIndex + 1}`}
          className={`w-full h-full ${fitClass}`}
          loading={safeIndex === 0 ? 'eager' : 'lazy'}
        />

        {current.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-12 pb-4">
            <p className="text-white text-sm sm:text-base md:text-lg font-medium text-center">
              {current.caption}
            </p>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-2 sm:p-3 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-2 sm:p-3 shadow-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full">
              {safeIndex + 1} / {count}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
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
