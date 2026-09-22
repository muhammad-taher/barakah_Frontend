import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';
import { getCart, clearCart, type CartItem } from '../utils/cart';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add products before placing an order.');
      return;
    }
    setIsSubmitting(true);
    try {
      const items = cartItems.map(item => ({ product_id: Number(item.id), quantity: item.quantity }));
      const fullAddress = `${address}, ${area}, ${district}, ${division}`;
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/orders/checkout`, {
        customer_name: name,
        phone,
        address: fullAddress,
        items
      });
      clearCart();
      navigate('/order-success', { state: { orderNumber: res.data.order_number, totalAmount: res.data.total_amount } });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Checkout failed. Please try again.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Add some products to your cart before checkout.</p>
        <Link to="/shop" className="bg-black text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-800 transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <div className="space-y-8">
            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-zinc-100 pb-2">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number *</label>
                  <input required type="tel" placeholder="01XXX-XXXXXX" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address (Optional)</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-zinc-100 pb-2">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name *</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Division *</label>
                    <select required value={division} onChange={e => setDivision(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none bg-white">
                      <option>Dhaka</option>
                      <option>Chattogram</option>
                      <option>Sylhet</option>
                      <option>Rajshahi</option>
                      <option>Khulna</option>
                      <option>Barishal</option>
                      <option>Rangpur</option>
                      <option>Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">City/District *</label>
                    <input required type="text" value={district} onChange={e => setDistrict(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Area/Thana *</label>
                  <input required type="text" placeholder="e.g. Gulshan, Banani, Mirpur" value={area} onChange={e => setArea(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Full Address *</label>
                  <textarea required rows={3} placeholder="House, Road, Block, etc." value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-zinc-100 pb-2">Payment Method</h2>
              <div className="border border-zinc-200 rounded-md overflow-hidden">
                <label className="flex items-center p-4 bg-zinc-50 border-b border-zinc-200 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-black focus:ring-black border-zinc-300" />
                  <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                </label>
                <div className="p-4 bg-white text-sm text-zinc-600">
                  Pay with cash upon delivery.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-md hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order — ৳${total.toLocaleString()}`}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80">
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded border border-zinc-200 overflow-hidden shrink-0 relative">
                    <span className="absolute -top-1 -right-1 bg-black text-white w-4 h-4 text-[10px] flex items-center justify-center rounded-full z-10">{item.quantity}</span>
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                  </div>
                  <div className="text-sm font-medium">৳{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>৳{shipping}</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
