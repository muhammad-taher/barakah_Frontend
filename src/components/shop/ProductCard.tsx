
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { ShoppingBag } from 'lucide-react';
import { addToCart } from '../../utils/cart';

export default function ProductCard({ product }: { product: Product }) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image_url || (product.images && product.images[0]) || '',
      slug: product.slug,
    });
  };

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-xl mb-3">
        {product.isNew && (
          <span className="absolute top-2.5 left-2.5 bg-black text-white text-[10px] font-bold px-2.5 py-1 uppercase z-10 rounded">
            New
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-1 z-10 rounded">
            -{product.discount}%
          </span>
        )}
        <img 
          src={product.image_url || (product.images && product.images[0]) || 'https://via.placeholder.com/400x500?text=No+Image'} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>
      
      <div className="flex flex-col flex-grow">
        {product.category && (
          <div className="text-[11px] text-zinc-400 mb-1 uppercase tracking-wider font-medium">{product.category}</div>
        )}
        <Link to={`/product/${product.slug}`} className="font-medium text-sm text-zinc-900 mb-1.5 hover:underline line-clamp-1 leading-snug">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-[15px] text-zinc-900">৳{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-xs text-zinc-400 line-through">৳{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      <button
        onClick={handleQuickAdd}
        className="absolute bottom-[4.5rem] right-2 bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:scale-110 lg:flex hidden items-center justify-center"
        title="Quick add to cart"
      >
        <ShoppingBag className="w-4 h-4" />
      </button>
    </div>
  );
}
