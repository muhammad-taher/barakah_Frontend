import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { getCart, updateQuantity, removeFromCart, type CartItem } from '../utils/cart';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    updateQuantity(id, newQty);
    loadCart();
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    loadCart();
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-zinc-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-black text-white font-semibold px-8 py-3 rounded-md hover:bg-zinc-800 transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="border-b border-zinc-200 pb-4 mb-4 hidden sm:grid grid-cols-12 text-sm font-medium text-zinc-500">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b border-zinc-100 pb-6">
                <div className="col-span-1 sm:col-span-6 flex gap-4">
                  <div className="w-20 h-24 bg-zinc-100 rounded overflow-hidden shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.slug}`} className="font-medium text-black hover:underline line-clamp-1">
                      {item.name}
                    </Link>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-sm text-red-600 hover:underline mt-2 flex items-center gap-1 sm:hidden"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-2 text-left sm:text-center font-medium sm:font-normal">
                  <span className="sm:hidden text-zinc-500 mr-2">Price:</span>
                  ৳{item.price.toLocaleString()}
                </div>
                
                <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
                  <div className="flex items-center border border-zinc-200 rounded-md w-24 h-10">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="flex-1 text-zinc-500 hover:text-black"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="flex-1 text-zinc-500 hover:text-black"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center font-medium">
                  <span className="sm:hidden text-zinc-500 mr-2">Total:</span>
                  ৳{(item.price * item.quantity).toLocaleString()}
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 hidden sm:block ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-[380px]">
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-medium">৳{shipping}</span>
              </div>
              <div className="border-t border-zinc-200 pt-4 flex justify-between items-center mt-2">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-xl">৳{total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-black text-white font-semibold py-4 rounded-md flex items-center justify-center hover:bg-zinc-800 transition-colors mb-4">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="w-full border border-zinc-200 text-zinc-700 font-medium py-3 rounded-md flex items-center justify-center hover:bg-zinc-50 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
