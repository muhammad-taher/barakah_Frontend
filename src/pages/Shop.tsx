
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/shop/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/products/`);
      return res.data;
    }
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'name':
        result.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setSearchParams({ search: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-zinc-100 rounded-lg mb-4" />
              <div className="h-3 bg-zinc-100 rounded w-1/3 mb-2" />
              <div className="h-4 bg-zinc-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-zinc-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Page header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-zinc-500 text-sm">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {searchQuery && ' found'}
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition-all bg-white placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer appearance-none pr-8 transition-all"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={{...product, id: String(product.id)}} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">No products found</h3>
          <p className="text-sm text-zinc-500 mb-4">
            {searchQuery ? `We couldn't find anything matching "${searchQuery}"` : 'No products available right now.'}
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-sm font-medium text-black underline hover:no-underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
