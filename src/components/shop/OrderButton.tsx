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
      className={`bg-[#001B3A] border-[3px] border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.6)] text-white px-8 py-4 rounded-full font-extrabold hover:shadow-[0_0_25px_rgba(0,191,255,0.8)] hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 text-lg md:text-xl animate-bounce ${className}`}
    >
      <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
      অর্ডার করতে ক্লিক করুন
      <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
