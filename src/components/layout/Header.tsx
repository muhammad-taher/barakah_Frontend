
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCartCount } from '../../utils/cart';

export default function Header() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(getCartCount());
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  // Listen for cart changes
  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    if (searchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Search products
  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/products/`);
      const products = res.data;
      const q = searchQuery.toLowerCase();
      return products.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ).slice(0, 6);
    },
    enabled: searchQuery.trim().length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleProductClick = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${slug}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-zinc-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Mobile menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-zinc-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
              <Link to="/" className="text-2xl font-bold tracking-tight text-black hover:opacity-80 transition-opacity">
                BARAKAH
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-500">
              <Link to="/" className="hover:text-black transition-colors relative py-1">Home</Link>
              <Link to="/shop" className="hover:text-black transition-colors relative py-1">Shop</Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-zinc-500 hover:text-black transition-colors rounded-full hover:bg-zinc-50"
                aria-label="Search products"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2.5 text-zinc-500 hover:text-black transition-colors rounded-full hover:bg-zinc-50 relative"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-100 bg-white animate-in slide-in-from-top-2 duration-200">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                Shop
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div ref={searchPanelRef} className="bg-white w-full max-w-2xl mx-auto mt-0 sm:mt-20 sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            {/* Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full py-5 pl-14 pr-14 text-base border-b border-zinc-100 focus:outline-none placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Search results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() && searchResults && searchResults.length > 0 && (
                <div className="p-3">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider px-3 py-2">
                    Products
                  </p>
                  {searchResults.map((product: any) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-colors text-left"
                    >
                      <div className="w-14 h-14 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                        <img
                          src={product.image_url || 'https://via.placeholder.com/56?text=...'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{product.name}</p>
                        <p className="text-sm text-zinc-500 font-semibold">৳{product.price?.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit as any}
                    className="w-full text-center text-sm font-medium text-zinc-500 hover:text-black py-3 border-t border-zinc-100 mt-2 transition-colors"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div>
              )}

              {searchQuery.trim() && searchResults && searchResults.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-zinc-400 text-sm">No products found for "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="p-10 text-center">
                  <p className="text-zinc-400 text-sm">Start typing to search products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
