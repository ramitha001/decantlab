"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Footer, Header } from "@/components/storefront";
import { readCart } from "@/lib/cart";
import { formatPrice, getProductPrice, products } from "@/lib/catalog";

const districts = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Jaffna", "Kurunegala", "Anuradhapura", "Other"];
const inputClass = "border border-black/15 bg-transparent p-4 text-sm outline-none focus:border-gold";

export default function CheckoutPage() {
  const [items, setItems] = useState<Array<{ slug: string; size: string; quantity: number; product?: (typeof products)[number] }>>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      const cart = readCart();
      setItems(
        cart
          .map((entry) => ({ ...entry, product: products.find((product) => product.slug === entry.slug) }))
          .filter((entry) => entry.product)
      );
    };

    syncCart();
    window.addEventListener("cart:updated", syncCart);
    return () => window.removeEventListener("cart:updated", syncCart);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.product ? getProductPrice(item.product, item.size) : 0) * item.quantity, 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    localStorage.removeItem("decant-lab-cart");
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="mx-auto min-h-screen max-w-[900px] px-5 py-20 text-center">
          <p className="eyebrow text-gold">Order confirmed</p>
          <h1 className="display mt-4 text-6xl md:text-7xl">Thank you for your order.</h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">Our team will contact you shortly to confirm the order and delivery details. You can keep browsing for your next favourite fragrance.</p>
          <Link href="/shop" className="mt-9 inline-block bg-ink px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-white">Continue shopping</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-[1100px] px-5 py-14 lg:py-20">
        <Link href="/cart" className="eyebrow text-muted"><ArrowLeft className="mr-2 inline" size={13} /> Back to bag</Link>
        <h1 className="display mt-10 text-6xl">Complete your order</h1>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <form className="space-y-9" onSubmit={handleSubmit}>
            <section><p className="eyebrow mb-5">Contact details</p><div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" className={inputClass} />
              <input required type="tel" placeholder="Phone number" className={inputClass} />
              <input required type="email" placeholder="Email address" className={`${inputClass} sm:col-span-2`} />
            </div></section>
            <section><p className="eyebrow mb-5">Delivery address</p><div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Address line 1" className={`${inputClass} sm:col-span-2`} />
              <input placeholder="Address line 2 (optional)" className={`${inputClass} sm:col-span-2`} />
              <input required placeholder="City" className={inputClass} />
              <select required defaultValue="" className={`${inputClass} bg-paper`}><option value="" disabled>District</option>{districts.map((district) => <option key={district}>{district}</option>)}</select>
              <input placeholder="Postal code" className={inputClass} />
              <input placeholder="WhatsApp number (optional)" className={inputClass} />
            </div></section>
            <section><p className="eyebrow mb-5">Payment method</p><label className="flex items-center gap-3 border border-black/15 p-4 text-sm"><input type="radio" name="payment" defaultChecked /> Cash on delivery</label><label className="mt-3 flex items-center gap-3 border border-black/15 p-4 text-sm"><input type="radio" name="payment" /> Bank transfer</label></section>
            <button className="w-full bg-ink py-5 text-[10px] font-bold uppercase tracking-[.18em] text-white transition hover:bg-gold">Place order</button>
          </form>

          <aside className="h-fit bg-ivory p-7">
            <p className="eyebrow">Order summary</p>
            <div className="mt-8 space-y-4">
              {items.length ? items.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="flex justify-between gap-4 text-sm">
                  <span className="text-muted">{item.product?.name} · {item.size} x {item.quantity}</span>
                  <span>{formatPrice((item.product ? getProductPrice(item.product, item.size) : 0) * item.quantity)}</span>
                </div>
              )) : <p className="text-sm text-muted">Your bag is empty.</p>}
            </div>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted">Delivery</span><span>To be confirmed</span></div>
            <div className="mt-6 flex justify-between border-t border-black/10 pt-5 font-semibold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            <p className="mt-7 text-xs leading-6 text-muted">Your order will be reviewed and confirmed by our team. Delivery rates are calculated according to destination.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
