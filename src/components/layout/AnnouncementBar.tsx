import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement-dismissed');
    if (dismissed) setVisible(false);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('announcement-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className="bg-zinc-900 text-white text-xs py-2.5 text-center font-medium tracking-wide relative">
      <div className="max-w-7xl mx-auto px-8">
        <span className="inline-flex items-center gap-2">
          🚚 সারাদেশে হোম ডেলিভারি &nbsp;|&nbsp; 💵 ক্যাশ অন ডেলিভারি &nbsp;|&nbsp; ✨ Premium Quality Products
        </span>
      </div>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
