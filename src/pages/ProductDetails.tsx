import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Star, Truck, Shield, Check } from 'lucide-react';
import { addToCart } from '../utils/cart';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/products/${slug}`);
      return res.data;
    }
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url || (product.images && product.images[0]) || 'https://via.placeholder.com/400x500?text=No+Image',
      slug: product.slug
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url || (product.images && product.images[0]) || 'https://via.placeholder.com/400x500?text=No+Image',
      slug: product.slug
    }, quantity);
    navigate('/checkout');
  };

  if (isLoading || !product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center">প্রোডাক্ট লোড হচ্ছে...</div>;
  }

  const displayImage = product.image_url || (product.images && product.images[0]) || 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-zinc-100 rounded-lg overflow-hidden">
            <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="aspect-square bg-zinc-100 rounded-md overflow-hidden border-2 border-black">
              <img src={displayImage} alt="thumb" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-6">
            <div className="text-sm text-zinc-500 mb-2">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-zinc-800">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium text-sm">{product.rating}</span>
                <span className="text-zinc-500 text-sm">({product.reviews} রিভিউ)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">৳{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-lg text-zinc-400 line-through">৳{product.oldPrice.toLocaleString()}</span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold rounded">ছাড় {product.discount}%</span>
              )}
            </div>
          </div>

          <p className="text-zinc-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center border border-zinc-200 rounded-md w-32">
              <button className="flex-1 py-3 text-xl leading-none text-zinc-500 hover:text-black" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button className="flex-1 py-3 text-xl leading-none text-zinc-500 hover:text-black" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-1 font-semibold flex items-center justify-center rounded-md transition-colors ${
                added 
                  ? 'bg-green-600 text-white' 
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              {added ? <><Check className="w-4 h-4 mr-2" /> যোগ করা হয়েছে!</> : 'কার্টে যোগ করুন'}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full border-2 border-black text-black font-semibold py-3 rounded-md hover:bg-black hover:text-white transition-colors mb-8"
          >
            এখুনি কিনুন
          </button>

          <div className="space-y-4 border-t border-zinc-100 pt-8 mt-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">দ্রুত ডেলিভারি</h5>
                <p className="text-sm text-zinc-500">ঢাকায় ১-২ দিন, ঢাকার বাইরে ৩-৫ দিন</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">নিরাপদ পেমেন্ট</h5>
                <p className="text-sm text-zinc-500">ক্যাশ অন ডেলিভারি সুবিধা</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
