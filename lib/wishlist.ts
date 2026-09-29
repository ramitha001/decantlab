export const WISHLIST_STORAGE_KEY = "decant-lab-wishlist";

export function readWishlist(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function writeWishlist(slugs: string[]) {
  if (typeof window === "undefined") {
    return slugs;
  }

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent("wishlist:updated", { detail: { count: slugs.length } }));
  return slugs;
}

export function toggleWishlist(slug: string): string[] {
  const current = readWishlist();
  const exists = current.includes(slug);
  const next = exists ? current.filter((item) => item !== slug) : [...current, slug];

  return writeWishlist(next);
}

export function isInWishlist(slug: string): boolean {
  return readWishlist().includes(slug);
}
