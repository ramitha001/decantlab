"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X, ArrowUpRight } from "lucide-react";
import { formatPrice, getProductPrice, Product } from "@/lib/catalog";
import { getCartCount } from "@/lib/cart";
import { isInWishlist, readWishlist, toggleWishlist } from "@/lib/wishlist";

const Instagram = ({ size }: { size: number; strokeWidth?: number }) => <span className="text-[10px] font-bold uppercase tracking-[.15em]" style={{ fontSize: size / 2.2 }}>Instagram</span>;
const Facebook = ({ size }: { size: number; strokeWidth?: number }) => <span className="text-[10px] font-bold uppercase tracking-[.15em]" style={{ fontSize: size / 2.2 }}>Facebook</span>;

export function Header() {
  const [open, setOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const links = [["Shop", "/shop"], ["Full bottles", "/shop?type=full"], ["Decants", "/shop?type=decant"], ["Men", "/shop?gender=men"], ["Women", "/shop?gender=women"], ["Unisex", "/shop?gender=unisex"]];

  useEffect(() => {
    const syncWishlist = () => setWishlistCount(readWishlist().length);
    const syncCart = () => setCartCount(getCartCount());

    syncWishlist();
    syncCart();

    window.addEventListener("wishlist:updated", syncWishlist);
    window.addEventListener("cart:updated", syncCart);

    return () => {
      window.removeEventListener("wishlist:updated", syncWishlist);
      window.removeEventListener("cart:updated", syncCart);
    };
  }, []);

  return <>
    <div className="bg-ink px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[.22em] text-white/80">Islandwide delivery across Sri Lanka <span className="mx-2 text-gold">·</span> Discover luxury, one scent at a time</div>
    <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur-md"><div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
      <button className="focus-ring lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} strokeWidth={1.5} /></button>
      <Link href="/" className="group flex flex-col items-center lg:items-start"><span className="display text-[25px] leading-[.8] tracking-[.08em]">Decant</span><span className="text-[9px] font-bold uppercase tracking-[.42em] text-gold">Lab</span></Link>
      <nav className="hidden items-center gap-7 lg:flex">{links.map(([label, href]) => <Link className="focus-ring text-[10px] font-bold uppercase tracking-[.14em] text-ink/70 transition hover:text-gold" href={href} key={label}>{label}</Link>)}</nav>
      <div className="flex items-center gap-4"><button className="focus-ring hidden sm:block" aria-label="Search"><Search size={19} strokeWidth={1.4} /></button><Link className="focus-ring hidden sm:block" href="/account" aria-label="Account"><UserRound size={19} strokeWidth={1.4} /></Link><Link className="focus-ring relative" href="/wishlist" aria-label="Wishlist"><Heart size={19} strokeWidth={1.4} />{wishlistCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">{wishlistCount}</span>}</Link><Link className="focus-ring relative" href="/cart" aria-label="Cart"><ShoppingBag size={19} strokeWidth={1.4} />{cartCount > 0 && <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">{cartCount}</span>}</Link></div>
    </div></header>
    {open && <div className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}><aside className="h-full w-[88%] max-w-sm bg-paper p-7" onClick={(event) => event.stopPropagation()}><div className="mb-14 flex items-center justify-between"><span className="display text-2xl">Menu</span><button aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></button></div><nav className="flex flex-col gap-6">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} className="display text-4xl" href={href} key={label}>{label}</Link>)}</nav><div className="mt-14 border-t border-black/10 pt-6 text-xs text-muted"><Link href="/about">Our story</Link><span className="mx-3">·</span><Link href="/contact">Contact</Link></div></aside></div>}
  </>;
}

export function Footer() { return <footer className="bg-ink px-5 py-14 text-white lg:px-10"><div className="mx-auto max-w-[1400px]"><div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]"><div><div className="display text-4xl">Decant Lab</div><p className="mt-5 max-w-xs text-sm leading-7 text-white/55">Authentic fragrances and considered decants, selected in Sri Lanka for every mood, moment and personality.</p><div className="mt-7 flex gap-4"><Instagram size={18} strokeWidth={1.3} /><Facebook size={18} strokeWidth={1.3} /></div></div><div><h3 className="eyebrow text-gold">Shop</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/60"><Link href="/shop">All fragrances</Link><Link href="/shop?type=full">Full bottles</Link><Link href="/shop?type=decant">Decants</Link><Link href="/shop?gender=unisex">Unisex</Link></div></div><div><h3 className="eyebrow text-gold">Customer care</h3><div className="mt-5 flex flex-col gap-3 text-sm text-white/60"><Link href="/contact">Contact us</Link><Link href="/shipping">Shipping</Link><Link href="/faq">FAQ</Link><Link href="/returns">Returns</Link></div></div><div><h3 className="eyebrow text-gold">Stay close</h3><p className="mt-5 text-sm leading-6 text-white/60">Notes on new arrivals, quiet obsessions and the art of fragrance.</p><div className="mt-5 flex border-b border-white/30 pb-3"><input aria-label="Email address" placeholder="Your email address" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /><button aria-label="Subscribe"><ArrowUpRight size={18} className="text-gold" /></button></div></div></div><div className="flex flex-col justify-between gap-4 pt-7 text-[10px] uppercase tracking-[.15em] text-white/40 sm:flex-row"><span>© 2026 Decant Lab</span><span>Colombo · Sri Lanka</span></div></div></footer> }

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isInWishlist(product.slug));
  }, [product.slug]);

  const handleWishlistToggle = () => {
    const next = toggleWishlist(product.slug);
    setLiked(next.includes(product.slug));
  };

  return <article className="product-card group"><div className="relative aspect-[.82] overflow-hidden bg-sand"><div className="product-image absolute inset-0" style={{ backgroundImage: `url(${product.image})` }} /><div className="absolute left-4 top-4 flex gap-2">{product.newArrival && <span className="bg-paper px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em]">New</span>}{product.compareAt && <span className="bg-gold px-3 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-white">Offer</span>}</div><button onClick={handleWishlistToggle} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} className="focus-ring absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/80 backdrop-blur transition hover:bg-white"><Heart size={16} fill={liked ? "#b58a4d" : "none"} className={liked ? "text-gold" : ""} strokeWidth={1.4} /></button><Link href={`/products/${product.slug}`} className="absolute bottom-4 left-4 right-4 translate-y-2 bg-paper py-3 text-center text-[10px] font-bold uppercase tracking-[.16em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">View fragrance</Link></div><div className="pt-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-gold">{product.brand}</p><Link href={`/products/${product.slug}`} className="display mt-1 block text-[23px] leading-none">{product.name}</Link></div><p className="pt-1 text-sm font-semibold">{product.sizes.length > 1 ? "From " : ""}{formatPrice(getProductPrice(product))}</p></div><div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[.13em] text-muted"><span>{product.type} · {product.gender}</span><span>{product.sizes.join(" · ")}</span></div></div></article> }