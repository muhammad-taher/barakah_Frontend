import { useRef, useState } from 'react';
import { Move, RotateCcw } from 'lucide-react';

interface Props {
  imageUrl: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/**
 * Drag the image to choose which part stays visible inside the phone-shaped
 * crop. The resulting x/y map directly to CSS `object-position`, which is what
 * the hero uses on the storefront — so the preview is exact, not an approximation.
 *
 * Frame aspect 39:76 matches a 390px-wide phone against the hero's 90vh height.
 */
export default function HeroFocusPicker({ imageUrl, x, y, onChange }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: x, oy: y };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = e.clientX - drag.current.sx;
    const dy = e.clientY - drag.current.sy;
    // Dragging the image down should reveal more of its top, so subtract.
    onChange(
      Math.round(clamp(drag.current.ox - (dx / rect.width) * 100)),
      Math.round(clamp(drag.current.oy - (dy / rect.height) * 100)),
    );
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drag.current = null;
    setDragging(false);
  };

  if (!imageUrl) {
    return (
      <p className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
        Upload a hero image above to position it.
      </p>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      {/* Phone-shaped preview */}
      <div className="shrink-0">
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`relative w-[160px] aspect-[39/76] overflow-hidden rounded-[1.5rem] border-4 border-zinc-800 bg-zinc-900 select-none touch-none ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title="Drag to reposition"
        >
          <img
            src={imageUrl}
            alt="Hero position preview"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: `${x}% ${y}%` }}
          />
          {/* Rule-of-thirds guides while dragging */}
          {dragging && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 inset-y-0 w-px bg-white/40" />
              <div className="absolute left-2/3 inset-y-0 w-px bg-white/40" />
              <div className="absolute top-1/3 inset-x-0 h-px bg-white/40" />
              <div className="absolute top-2/3 inset-x-0 h-px bg-white/40" />
            </div>
          )}
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Move className="w-3 h-3" /> drag
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-2">Average phone view</p>
      </div>

      {/* Numeric controls */}
      <div className="flex-1 w-full space-y-4">
        <p className="text-sm text-gray-600">
          Drag inside the phone to choose which part of the image stays visible. Use this when
          text in the image gets cut off on mobile.
        </p>

        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Horizontal</span><span className="text-gray-400 font-normal">{x}%</span>
          </label>
          <input
            type="range" min={0} max={100} value={x}
            onChange={e => onChange(Number(e.target.value), y)}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-gray-400"><span>Left</span><span>Right</span></div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
            <span>Vertical</span><span className="text-gray-400 font-normal">{y}%</span>
          </label>
          <input
            type="range" min={0} max={100} value={y}
            onChange={e => onChange(x, Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-gray-400"><span>Top</span><span>Bottom</span></div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {([['Top', 50, 0], ['Center', 50, 50], ['Bottom', 50, 100]] as const).map(([label, px, py]) => (
            <button
              key={label} type="button" onClick={() => onChange(px, py)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                x === px && y === py
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button" onClick={() => onChange(50, 50)}
            className="text-xs px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
