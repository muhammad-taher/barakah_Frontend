export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  oldPrice?: number;
  images?: string[];
  image_url?: string;
  category?: string;
  category_id?: number;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  stock?: number;
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
