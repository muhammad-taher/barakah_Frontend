import type { Product, Category } from '../types';

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
