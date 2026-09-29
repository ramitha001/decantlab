"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header, Footer, ProductCard } from "@/components/storefront";
import { products } from "@/lib/catalog";
import { readWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const [savedProducts, setSavedProducts] = useState<typeof products>([]);

  useEffect(() => {
    const syncWishlist = () => {
      const savedSlugs = readWishlist();
      setSavedProducts(products.filter((product) => savedSlugs.includes(product.slug)));
    };

    syncWishlist();
    window.addEventListener("wishlist:updated", syncWishlist);

    return () => window.removeEventListener("wishlist:updated", syncWishlist);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[65vh] max-w-[1400px] px-5 py-20 lg:px-10">
        {savedProducts.length > 0 ? (
          <>
            <p className="eyebrow text-gold">Saved for later</p>
            <h1 className="display mt-4 text-5xl md:text-7xl">Your wishlist</h1>
            <div className="mt-10 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {savedProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-[900px] text-center">
            <p className="eyebrow text-gold">Saved for later</p>
            <h1 className="display mt-4 text-7xl">Your wishlist<br /><i>is quiet.</i></h1>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-muted">Save fragrances that catch your attention and return to them when the time feels right.</p>
            <Link href="/shop" className="mt-9 inline-block bg-ink px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-white">Explore the collection</Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
