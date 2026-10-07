import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state as { orderNumber?: string; totalAmount?: number; items?: any[] } | null;
  const purchaseFiredRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (state?.orderNumber && state?.totalAmount) {
      // Guard: prevent duplicate purchase events for the same order
      const storageKey = `purchase_fired_${state.orderNumber}`;
      if (purchaseFiredRef.current || sessionStorage.getItem(storageKey)) {
        return;
      }
      purchaseFiredRef.current = true;
      sessionStorage.setItem(storageKey, '1');

      // Push ecommerce purchase event to dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object
      window.dataLayer.push({
        event: 'purchase',
        event_id: state.orderNumber,
        ecommerce: {
          transaction_id: state.orderNumber,
          value: state.totalAmount,
          currency: 'BDT',
          items: state.items || []
        }
      });
    }
  }, [state]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-3">অর্ডার কনফার্ম হয়েছে!</h1>
      <p className="text-zinc-600 mb-8">আপনার অর্ডারের জন্য ধন্যবাদ। আমরা খুব শীঘ্রই এটি প্রসেস করবো।</p>

      {state?.orderNumber && (
        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">অর্ডার নাম্বার</span>
            <span className="font-bold">{state.orderNumber}</span>
          </div>
          {state.totalAmount != null && (
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">সর্বমোট</span>
              <span className="font-bold">৳{state.totalAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">পেমেন্ট মেথড</span>
            <span className="font-medium">ক্যাশ অন ডেলিভারি (COD)</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop" className="bg-black text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-800 transition-colors">
          শপিং চালিয়ে যান
        </Link>
      </div>
    </div>
  );
}
