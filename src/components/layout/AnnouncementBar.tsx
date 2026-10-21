import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const DEFAULT_HEADLINE = 'ঘরে বসেই আপনার পুরোনো ফার্নিচারকে দিন নতুন রূপ';

/** Size presets selectable from Admin → Settings → Top Headline. */
export const HEADLINE_SIZES: Record<string, { label: string; cls: string }> = {
  sm:   { label: 'Small',       cls: 'text-sm sm:text-base md:text-lg' },
  base: { label: 'Normal',      cls: 'text-base sm:text-xl md:text-2xl' },
  lg:   { label: 'Large',       cls: 'text-lg sm:text-2xl md:text-3xl' },
  xl:   { label: 'Extra Large', cls: 'text-xl sm:text-3xl md:text-4xl' },
};

/** Black bar at the very top of the page carrying the main headline. */
export default function AnnouncementBar() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/settings/`);
      return res.data;
    }
  });

  const headline: string = settings?.top_headline ?? DEFAULT_HEADLINE;
  const size = HEADLINE_SIZES[settings?.top_headline_size as string] ?? HEADLINE_SIZES.base;

  if (!headline.trim()) return null;

  return (
    // Warm amber gradient picked to match the #E8883C section headings further
    // down the page and the wood-varnish product itself.
    <div className="bg-gradient-to-r from-[#B5651D] via-[#E8883C] to-[#B5651D] text-white py-3 sm:py-4 px-4 text-center shadow-md">
      <h1 className={`max-w-4xl mx-auto ${size.cls} font-bold leading-snug break-words drop-shadow-sm`}>
        {headline}
      </h1>
    </div>
  );
}
