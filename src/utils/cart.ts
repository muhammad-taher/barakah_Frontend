// Cart utility functions for localStorage-based cart management

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Dispatch a custom event so other components can react to cart changes
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

export function removeFromCart(id: string) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}
