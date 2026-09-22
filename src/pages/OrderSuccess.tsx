import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state as { orderNumber?: string; totalAmount?: number } | null;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold tracking-tight mb-3">Order Confirmed!</h1>
      <p className="text-zinc-600 mb-8">Thank you for your order. We'll process it shortly.</p>

      {state?.orderNumber && (
        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">Order Number</span>
            <span className="font-bold">{state.orderNumber}</span>
          </div>
          {state.totalAmount != null && (
            <div className="flex justify-between">
              <span className="text-zinc-500 text-sm">Total Amount</span>
              <span className="font-bold">৳{state.totalAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-zinc-500 text-sm">Payment Method</span>
            <span className="font-medium">Cash on Delivery</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/shop" className="bg-black text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
