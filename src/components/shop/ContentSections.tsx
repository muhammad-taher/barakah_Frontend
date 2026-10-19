import { ArrowRight } from 'lucide-react';

export interface ContentSectionData {
  id: number;
  heading: string;
  bullets: string[];
}

/** Orange pill heading + arrow bullet list, repeated for each admin-defined section. */
export default function ContentSections({ sections }: { sections: ContentSectionData[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="bg-[#FBE4E9] rounded-2xl px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-8">
      {sections.map(section => (
        <div key={section.id}>
          <div className="bg-[#E8883C] rounded-full px-6 py-3 md:py-4 mb-5">
            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center leading-snug break-words">
              {section.heading}
            </h3>
          </div>

          <ul className="space-y-3 px-1 sm:px-4">
            {section.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E8883C] flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </span>
                <span className="min-w-0 text-zinc-800 font-semibold text-[15px] md:text-base leading-relaxed break-words [overflow-wrap:anywhere]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
