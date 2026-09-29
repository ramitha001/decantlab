export type CartLineItem = {
  slug: string;
  size: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "decant-lab-cart";

export function readCart(): CartLineItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is CartLineItem => {
      return !!item && typeof item === "object" && typeof item.slug === "string" && typeof item.size === "string" && typeof item.quantity === "number" && item.quantity > 0;
    });
  } catch {
    return [];
  }
}

export function writeCart(items: CartLineItem[]) {
  if (typeof window === "undefined") {
    return items;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: totalQty } }));
  return items;
}

export function addToCart(slug: string, size: string, quantity = 1) {
  const current = readCart();
  const existingIndex = current.findIndex((item) => item.slug === slug && item.size === size);

  if (existingIndex >= 0) {
    current[existingIndex].quantity += quantity;
    return writeCart(current);
  }

  return writeCart([...current, { slug, size, quantity }]);
}

export function updateCartQuantity(slug: string, size: string, quantity: number) {
  const current = readCart();
  const next = current
    .map((item) => (item.slug === slug && item.size === size ? { ...item, quantity: Math.max(0, quantity) } : item))
    .filter((item) => item.quantity > 0);

  return writeCart(next);
}

export function removeFromCart(slug: string, size: string) {
  const current = readCart();
  return writeCart(current.filter((item) => !(item.slug === slug && item.size === size)));
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}
