#!/bin/bash

cd frontend/src

mkdir -p components/{ui,layout,shop,cart} pages data types utils assets

# Types
cat << 'EOF' > types/index.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  isNew?: boolean;
  discount?: number;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}
EOF

# Mock Data
cat << 'EOF' > data/mockData.ts
import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80' },
  { id: '2', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
  { id: '3', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
  { id: '4', name: 'New Arrivals', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&q=80' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Oversized T-Shirt',
    slug: 'premium-oversized-tshirt',
    description: 'A heavy-weight, 100% cotton oversized t-shirt built for everyday comfort.',
    price: 890,
    oldPrice: 1190,
    discount: 25,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80'],
    category: 'Men',
    isNew: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Minimalist Leather Wallet',
    slug: 'minimalist-leather-wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection.',
    price: 1290,
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80'],
    category: 'Accessories',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'Timeless denim jacket with a modern fit.',
    price: 2490,
    oldPrice: 2990,
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80'],
    category: 'Men',
    rating: 4.5,
    reviews: 56
  },
  {
    id: '4',
    name: 'Elegant Evening Dress',
    slug: 'elegant-evening-dress',
    description: 'Perfect for special occasions. Features a flattering silhouette.',
    price: 3590,
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80'],
    category: 'Women',
    isNew: true,
    rating: 4.7,
    reviews: 42
  }
];
EOF

# Layout Components
cat << 'EOF' > components/layout/AnnouncementBar.tsx
import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="bg-zinc-900 text-white text-xs py-2 text-center font-medium tracking-wide">
      🚚 Nationwide Delivery Available | Cash on Delivery
    </div>
  );
}
EOF

cat << 'EOF' > components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="p-2 text-zinc-600 hover:text-black">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black">NOVA</Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
            <Link to="/shop?category=new" className="hover:text-black transition-colors">New Arrivals</Link>
            <Link to="/shop?category=offers" className="hover:text-red-600 transition-colors">Offers</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-600 hover:text-black hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-600 hover:text-black hidden sm:block">
              <User className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 text-zinc-600 hover:text-black relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF

cat << 'EOF' > components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black mb-4 block">NOVA</Link>
            <p className="text-sm text-zinc-500 mb-4">Premium e-commerce experience designed for modern shoppers.</p>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/shop" className="hover:text-black">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-black">Men</Link></li>
              <li><Link to="/shop" className="hover:text-black">Women</Link></li>
              <li><Link to="/shop" className="hover:text-black">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="#" className="hover:text-black">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-black">FAQs</Link></li>
              <li><Link to="#" className="hover:text-black">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-black">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="#" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-black">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-zinc-400">© 2026 NOVA. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-xs font-medium text-zinc-400">Cash on Delivery Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
EOF

cat << 'EOF' > components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-900 bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
EOF

# Shop Components
cat << 'EOF' > components/shop/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-lg mb-4">
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase z-10">New</span>
        )}
        {product.discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 z-10">-{product.discount}%</span>
        )}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      
      <div className="flex flex-col flex-grow">
        <div className="text-xs text-zinc-500 mb-1">{product.category}</div>
        <Link to={`/product/${product.slug}`} className="font-medium text-sm text-black mb-1 hover:underline line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-semibold">৳{product.price.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="text-xs text-zinc-400 line-through">৳{product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      <button className="absolute bottom-20 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white lg:flex hidden">
        <ShoppingBag className="w-4 h-4" />
      </button>
    </div>
  );
}
EOF

cat << 'EOF' > components/shop/CategoryCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/shop?category=${category.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-xl">
      <img 
        src={category.image} 
        alt={category.name} 
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6">
        <h3 className="text-white font-semibold text-xl tracking-wide">{category.name}</h3>
        <span className="text-white/80 text-sm mt-2 inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-white after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
          Shop Now
        </span>
      </div>
    </Link>
  );
}
EOF

# Pages
cat << 'EOF' > pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/shop/ProductCard';
import CategoryCard from '../components/shop/CategoryCard';

export default function Home() {
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">New Season Collection</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">Designed for everyday confidence.</h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl">
            Discover our premium selection of contemporary essentials. Crafted with uncompromising quality.
          </p>
          <Link to="/shop" className="bg-white text-black px-8 py-4 font-semibold hover:bg-zinc-100 transition-colors rounded-sm inline-flex items-center gap-2">
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Trust Benefits */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-zinc-100">
          <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
            <Truck className="w-8 h-8 text-zinc-400" />
            <div>
              <h4 className="font-semibold text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-zinc-500">Fast shipping across Bangladesh</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
            <ShieldCheck className="w-8 h-8 text-zinc-400" />
            <div>
              <h4 className="font-semibold text-sm">Quality Guarantee</h4>
              <p className="text-xs text-zinc-500">Premium materials & craftsmanship</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
            <RefreshCcw className="w-8 h-8 text-zinc-400" />
            <div>
              <h4 className="font-semibold text-sm">Easy Exchanges</h4>
              <p className="text-xs text-zinc-500">7-day hassle-free exchange policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Trending Now</h2>
            <p className="text-zinc-500 text-sm">Our most loved pieces this week.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold hover:underline hidden sm:block">View All</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/shop" className="text-sm font-semibold underline">View All Products</Link>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="p-10 md:p-16 lg:p-24 flex-1 text-center md:text-left">
            <h3 className="text-white text-3xl md:text-5xl font-bold mb-4 leading-tight">Weekend Special.<br/>Up to 30% Off.</h3>
            <p className="text-zinc-400 mb-8 max-w-md">Upgrade your wardrobe with our latest arrivals. Limited time offer exclusively online.</p>
            <Link to="/shop?sale=true" className="bg-white text-black px-6 py-3 font-semibold rounded-sm hover:bg-zinc-100 transition-colors inline-block">
              Shop The Sale
            </Link>
          </div>
          <div className="flex-1 w-full md:w-auto min-h-[300px] md:min-h-full">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" 
              alt="Promo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
EOF

cat << 'EOF' > pages/Shop.tsx
import React from 'react';
import { PRODUCTS } from '../data/mockData';
import ProductCard from '../components/shop/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export default function Shop() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-zinc-500 text-sm mt-1">Showing {PRODUCTS.length} products</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 border border-zinc-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-50 w-full md:w-auto justify-center">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <select className="border border-zinc-200 px-4 py-2 rounded-md text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black w-full md:w-auto hidden sm:block">
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-8">
        {/* Desktop Filters (Placeholder) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="checkbox" className="rounded border-zinc-300" /> Men</label></li>
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="checkbox" className="rounded border-zinc-300" /> Women</label></li>
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="checkbox" className="rounded border-zinc-300" /> Accessories</label></li>
              </ul>
            </div>
            <div className="h-px bg-zinc-100" />
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="radio" name="price" className="border-zinc-300" /> Under ৳1000</label></li>
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="radio" name="price" className="border-zinc-300" /> ৳1000 - ৳2500</label></li>
                <li><label className="flex items-center gap-2 hover:text-black cursor-pointer"><input type="radio" name="price" className="border-zinc-300" /> Over ৳2500</label></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/ProductDetails.tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';
import { Star, Truck, Shield, ArrowRight } from 'lucide-react';

export default function ProductDetails() {
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        {/* Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-[4/5] bg-zinc-100 rounded-lg overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {/* Thumbnails placeholder */}
          <div className="grid grid-cols-4 gap-2">
            <div className="aspect-square bg-zinc-100 rounded-md overflow-hidden border-2 border-black">
              <img src={product.images[0]} alt="thumb" className="w-full h-full object-cover" />
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
                <span className="text-zinc-500 text-sm">({product.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">৳{product.price.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="text-lg text-zinc-400 line-through">৳{product.oldPrice.toLocaleString()}</span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold rounded">Save {product.discount}%</span>
              )}
            </div>
          </div>

          <p className="text-zinc-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-8">
            <h4 className="font-medium mb-3">Size</h4>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button key={size} className="w-10 h-10 border border-zinc-200 rounded-md flex items-center justify-center text-sm hover:border-black hover:bg-zinc-50 transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-zinc-200 rounded-md w-32">
              <button className="flex-1 py-3 text-xl leading-none text-zinc-500 hover:text-black" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button className="flex-1 py-3 text-xl leading-none text-zinc-500 hover:text-black" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <Link to="/cart" className="flex-1 bg-black text-white font-semibold flex items-center justify-center rounded-md hover:bg-zinc-800 transition-colors">
              Add to Cart
            </Link>
          </div>

          <div className="space-y-4 border-t border-zinc-100 pt-8 mt-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">Fast Delivery</h5>
                <p className="text-sm text-zinc-500">Inside Dhaka 1-2 days, Outside 3-5 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium text-sm">Secure Payment</h5>
                <p className="text-sm text-zinc-500">Cash on Delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/Cart.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const cartItems = [
    { product: PRODUCTS[0], quantity: 1, size: 'M' },
    { product: PRODUCTS[1], quantity: 2, size: 'One Size' }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 60; // Base shipping

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
            {cartItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b border-zinc-100 pb-6 sm:border-0 sm:pb-0">
                <div className="col-span-1 sm:col-span-6 flex gap-4">
                  <div className="w-20 h-24 bg-zinc-100 rounded overflow-hidden shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.product.slug}`} className="font-medium text-black hover:underline line-clamp-1">
                      {item.product.name}
                    </Link>
                    <div className="text-sm text-zinc-500 mt-1">Size: {item.size}</div>
                    <button className="text-sm text-red-600 hover:underline mt-2 flex items-center gap-1 sm:hidden">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-2 text-left sm:text-center font-medium sm:font-normal">
                  <span className="sm:hidden text-zinc-500 mr-2">Price:</span>
                  ৳{item.product.price.toLocaleString()}
                </div>
                
                <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
                  <div className="flex items-center border border-zinc-200 rounded-md w-24 h-10">
                    <button className="flex-1 text-zinc-500 hover:text-black">-</button>
                    <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                    <button className="flex-1 text-zinc-500 hover:text-black">+</button>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center font-medium">
                  <span className="sm:hidden text-zinc-500 mr-2">Total:</span>
                  ৳{(item.product.price * item.quantity).toLocaleString()}
                  <button className="text-red-500 hover:text-red-700 hidden sm:block ml-4">
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
                <span className="text-zinc-600">Shipping (Inside Dhaka)</span>
                <span className="font-medium">৳{shipping}</span>
              </div>
              <div className="border-t border-zinc-200 pt-4 flex justify-between items-center mt-2">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-xl">৳{(subtotal + shipping).toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="w-full bg-black text-white font-semibold py-4 rounded-md flex items-center justify-center hover:bg-zinc-800 transition-colors mb-4">
              Proceed to Checkout
            </Link>
            <p className="text-xs text-center text-zinc-500">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/Checkout.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Checkout() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <form className="space-y-8">
            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-zinc-100 pb-2">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number *</label>
                  <input type="tel" placeholder="01XXX-XXXXXX" className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address (Optional)</label>
                  <input type="email" placeholder="you@example.com" className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-zinc-100 pb-2">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name *</label>
                  <input type="text" className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Division *</label>
                    <select className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none bg-white">
                      <option>Dhaka</option>
                      <option>Chattogram</option>
                      <option>Sylhet</option>
                      <option>Rajshahi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">City/District *</label>
                    <select className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none bg-white">
                      <option>Dhaka City</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Area/Thana *</label>
                  <select className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none bg-white">
                    <option>Gulshan</option>
                    <option>Banani</option>
                    <option>Dhanmondi</option>
                    <option>Mirpur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Full Address *</label>
                  <textarea rows={3} placeholder="House, Road, Block, etc." className="w-full border border-zinc-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-black focus:outline-none"></textarea>
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

            <button type="button" className="w-full bg-black text-white font-bold text-lg py-4 rounded-md hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200">
              Place Order — ৳3,530
            </button>
          </form>
        </div>

        {/* Small Order Summary */}
        <div className="w-full md:w-80">
          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded border border-zinc-200 overflow-hidden shrink-0 relative">
                  <span className="absolute -top-1 -right-1 bg-black text-white w-4 h-4 text-[10px] flex items-center justify-center rounded-full z-10">1</span>
                  <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" alt="Item" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium line-clamp-1">Premium Oversized T-Shirt</p>
                  <p className="text-zinc-500 text-xs">M</p>
                </div>
                <div className="text-sm font-medium">৳890</div>
              </div>
            </div>
            
            <div className="border-t border-zinc-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>৳3,470</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>৳60</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>৳3,530</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="*" element={<div className="py-20 text-center"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
EOF

cat << 'EOF' > main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
EOF

cat << 'EOF' > index.css
@import "tailwindcss";

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}

@layer base {
  body {
    @apply antialiased text-zinc-900 bg-white;
  }
}
EOF

EOF
