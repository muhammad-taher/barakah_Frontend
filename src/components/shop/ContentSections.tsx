import { ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export interface ContentSectionData {
  id: number;
  heading: string;
  bullets: string[];
}

/** Font-size presets selectable from Admin → Settings. */
export const CONTENT_FONT_SIZES: Record<string, { label: string; heading: string; bullet: string }> = {
  sm:   { label: 'Small',       heading: 'text-base sm:text-lg md:text-xl',    bullet: 'text-[13px] md:text-sm' },
  base: { label: 'Normal',      heading: 'text-lg sm:text-xl md:text-2xl',     bullet: 'text-[15px] md:text-base' },
  lg:   { label: 'Large',       heading: 'text-xl sm:text-2xl md:text-3xl',    bullet: 'text-base md:text-lg' },
  xl:   { label: 'Extra Large', heading: 'text-2xl sm:text-3xl md:text-4xl',   bullet: 'text-lg md:text-xl' },
};

interface Props {
  sections: ContentSectionData[];
  /** Key of CONTENT_FONT_SIZES; falls back to 'base'. */
  fontSize?: string;
}

/** Orange pill heading + arrow bullet list, repeated for each admin-defined section. */
export default function ContentSections({ sections, fontSize = 'base' }: Props) {
  if (!sections || sections.length === 0) return null;

  const size = CONTENT_FONT_SIZES[fontSize] ?? CONTENT_FONT_SIZES.base;

  return (
    <div className="bg-[#FBE4E9] rounded-2xl px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-8">
      {sections.map(section => (
        <div key={section.id}>
          <div className="bg-[#E8883C] rounded-full px-6 py-3 md:py-4 mb-5">
            <h3 className={`text-white ${size.heading} font-bold text-center leading-snug break-words`}>
              {section.heading}
            </h3>
          </div>

          <ul className="space-y-3 px-1 sm:px-4">
            {section.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8883C] flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                {/* Markdown so bullets can use **bold**, *italic*, [links](...) etc.
                    Rendered inline — a bullet is a single line, not a document. */}
                <div
                  className={`min-w-0 text-zinc-800 font-semibold ${size.bullet} leading-relaxed break-words [overflow-wrap:anywhere]
                    [&_p]:m-0 [&_strong]:font-extrabold [&_a]:underline [&_a]:text-orange-700
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:bg-white/60 [&_code]:px-1 [&_code]:rounded`}
                >
                  <ReactMarkdown>{bullet}</ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
