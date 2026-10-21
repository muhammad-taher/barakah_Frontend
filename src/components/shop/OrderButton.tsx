import { ArrowRight, ShoppingCart } from 'lucide-react';

interface OrderButtonProps {
  /** Id of the element to scroll to. Defaults to the home page order form. */
  targetId?: string;
  className?: string;
}

/** Scrolls the customer down to the order form instead of navigating away. */
export default function OrderButton({ targetId = 'order-form', className = '' }: OrderButtonProps) {
  const scrollToForm = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Form not on this page — fall back to the standalone order page
      window.location.href = '/package-order';
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToForm}
      className={`bg-green-600 hover:bg-green-700 text-white border-2 border-green-700 shadow-lg shadow-green-600/30 px-5 py-3 sm:px-8 sm:py-4 rounded-full font-extrabold hover:shadow-xl hover:shadow-green-600/40 hover:scale-105 transition-all duration-200 inline-flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl whitespace-nowrap ${className}`}
    >
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0" />
      <span className="whitespace-nowrap">অর্ডার করতে ক্লিক করুন</span>
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0" />
    </button>
  );
}
