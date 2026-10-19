import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideImage {
  id: number | string;
  image_url: string;
  caption?: string | null;
}

interface ImageSliderProps {
  images: SlideImage[];
  /** Tailwind aspect-ratio class for each slide frame. */
  aspectClass?: string;
  objectFit?: 'cover' | 'contain';
}

/**
 * Carousel showing up to three images at once: the active one centred and
 * emphasised, its neighbours smaller and dimmed on either side.
 */
export default function ImageSlider({
  images,
  aspectClass = 'aspect-[4/3]',
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

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain';
  const current = images[safeIndex];
  // With only two images the "previous" and "next" neighbour are the same one,
  // so show it on a single side instead of duplicating it.
  const prevImage = count > 2 ? images[(safeIndex - 1 + count) % count] : null;
  const nextImage = count > 1 ? images[(safeIndex + 1) % count] : null;

  // Narrow peeks on phones so the focused image gets most of the width.
  const sideClasses =
    'w-[12%] sm:w-[22%] shrink-0 cursor-pointer transition-all duration-300 opacity-45 hover:opacity-70 scale-90 hover:scale-95';
  const sidePlaceholder = 'w-[12%] sm:w-[22%] shrink-0';

  return (
    <div className="relative">
      <div
        className="flex items-center justify-center gap-2 sm:gap-4"
        onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous (dimmed) */}
        {prevImage ? (
          <button type="button" onClick={prev} aria-label="আগের ছবি" className={sideClasses}>
            <div className={`${aspectClass} w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200`}>
              <img src={prevImage.image_url} alt="" className={`w-full h-full ${fitClass}`} loading="lazy" />
            </div>
          </button>
        ) : (
          count > 1 && <div className={sidePlaceholder} aria-hidden="true" />
        )}

        {/* Active (focused) */}
        <div className={`${count > 1 ? 'w-[72%] sm:w-[56%]' : 'w-full max-w-xl'} shrink-0 transition-all duration-300`}>
          <div
            className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 shadow-xl`}
          >
            <img
              src={current.image_url}
              alt={current.caption || `Slide ${safeIndex + 1}`}
              className={`w-full h-full ${fitClass}`}
              loading={safeIndex === 0 ? 'eager' : 'lazy'}
            />

            {current.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
                <p className="text-white text-xs sm:text-sm md:text-base font-medium text-center">
                  {current.caption}
                </p>
              </div>
            )}

            {count > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full">
                {safeIndex + 1} / {count}
              </div>
            )}
          </div>
        </div>

        {/* Next (dimmed) */}
        {nextImage ? (
          <button type="button" onClick={next} aria-label="পরের ছবি" className={sideClasses}>
            <div className={`${aspectClass} w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200`}>
              <img src={nextImage.image_url} alt="" className={`w-full h-full ${fitClass}`} loading="lazy" />
            </div>
          </button>
        ) : (
          count > 1 && <div className={sidePlaceholder} aria-hidden="true" />
        )}

        {/* Arrow controls overlaid on the centre image */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-[14%] sm:left-[23%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-1.5 sm:p-2.5 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-[14%] sm:right-[23%] top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-1.5 sm:p-2.5 shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
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
