import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const DEFAULT_HEADLINE = 'ঘরে বসেই আপনার পুরোনো ফার্নিচারকে দিন নতুন রূপ';

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

  if (!headline.trim()) return null;

  return (
    <div className="bg-zinc-900 text-white py-3 sm:py-4 px-4 text-center">
      <h1 className="max-w-4xl mx-auto text-base sm:text-xl md:text-2xl font-bold leading-snug break-words">
        {headline}
      </h1>
    </div>
  );
}
