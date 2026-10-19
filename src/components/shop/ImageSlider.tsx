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
  objectFit?: 'cover' | 'contain';
}

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

  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    setTouchStartX(null);
  };

  const current = images[index];

  return (
    <div className="relative">
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200`}
        onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={current.image_url}
          alt={current.caption || `Slide ${index + 1}`}
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        {current.caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-4">
            <p className="text-white text-sm md:text-base font-medium text-center">{current.caption}</p>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="আগের ছবি"
              className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-2 md:p-2.5 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="পরের ছবি"
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-zinc-800 rounded-full p-2 md:p-2.5 shadow-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`ছবি ${i + 1} দেখুন`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
