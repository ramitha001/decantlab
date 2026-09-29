"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { Footer, Header } from "@/components/storefront";
import { addToCart } from "@/lib/cart";
import { formatPrice, getProductPrice, products } from "@/lib/catalog";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

export default function ProductPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const product = products.find((item) => item.slug === slug);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedSize(product?.sizes[0] ?? "");
    setLiked(product ? isInWishlist(product.slug) : false);
    setAdded(false);
  }, [product?.slug]);

  if (!product) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[900px] px-5 py-20 text-center">
          <p className="eyebrow text-gold">Product unavailable</p>
          <h1 className="display mt-4 text-6xl">This fragrance is not available right now.</h1>
          <Link href="/shop" className="mt-9 inline-block bg-ink px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-white">Back to collection</Link>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product.slug, selectedSize, 1);
    setAdded(true);
  };

  const handleWishlistToggle = () => {
    const next = toggleWishlist(product.slug);
    setLiked(next.includes(product.slug));
  };

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-10 lg:py-16">
          <div className="aspect-[.88] bg-cover bg-center lg:aspect-[.9]" style={{ backgroundImage: `url(${product.image})` }} />
          <div className="flex flex-col justify-center">
            <Link href="/shop" className="eyebrow text-muted">← Back to collection</Link>
            <p className="eyebrow mt-12 text-gold">{product.brand}</p>
            <h1 className="display mt-4 text-6xl leading-[.9] md:text-8xl">{product.name}</h1>
            <div className="mt-7 flex items-center gap-5 border-b border-black/10 pb-7">
              <span className="text-xl font-semibold">{formatPrice(getProductPrice(product, selectedSize))}</span>
              <span className="text-xs uppercase tracking-[.15em] text-muted">{product.type} · {product.gender}</span>
            </div>
            <p className="mt-7 max-w-lg text-sm leading-7 text-muted">{product.description}</p>

            <div className="mt-9">
              <p className="eyebrow mb-4">Choose a size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border px-5 py-3 text-xs ${selectedSize === size ? "border-ink bg-ink text-white" : "border-black/15"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={handleAddToCart} type="button" className="flex-1 bg-ink px-5 py-4 text-[10px] font-bold uppercase tracking-[.17em] text-white transition hover:bg-gold">{added ? "Added to bag" : "Add to cart"} <ArrowUpRight className="ml-4 inline" size={15} /></button>
              <button onClick={handleWishlistToggle} type="button" className="flex h-12 w-12 items-center justify-center border border-black/15" aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}><Heart size={18} fill={liked ? "#b58a4d" : "none"} className={liked ? "text-gold" : ""} strokeWidth={1.4} /></button>
            </div>

            <Link href={`https://wa.me/?text=${encodeURIComponent(`Hi Decant Lab, I'm interested in ${product.name}.`)}`} className="mt-4 flex items-center justify-center gap-2 border border-black/15 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-ink transition hover:border-gold hover:text-gold">Chat on WhatsApp <MessageCircle size={15} /></Link>

            <div className="mt-10 grid gap-5 border-t border-black/10 pt-7 sm:grid-cols-3">
              <div>
                <p className="eyebrow text-gold">Top notes</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">{product.notes.top.map((note) => <li key={note}>{note}</li>)}</ul>
              </div>
              <div>
                <p className="eyebrow text-gold">Heart notes</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">{product.notes.heart.map((note) => <li key={note}>{note}</li>)}</ul>
              </div>
              <div>
                <p className="eyebrow text-gold">Base notes</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">{product.notes.base.map((note) => <li key={note}>{note}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-[1400px] border-t border-black/10 px-5 py-10 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow text-gold">Why customers choose us</p>
              <h2 className="display mt-2 text-5xl">Thoughtful sourcing, no noise.</h2>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[.18em] text-muted"><ShieldCheck size={16} className="text-gold" /> Genuine stock · Expert recommendations</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
