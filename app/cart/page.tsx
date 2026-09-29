"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Footer, Header } from "@/components/storefront";
import { formatPrice, getProductPrice, products } from "@/lib/catalog";
import { readCart, removeFromCart, updateCartQuantity } from "@/lib/cart";

type CartEntry = {
	slug: string;
	size: string;
	quantity: number;
	product?: (typeof products)[number];
};

export default function CartPage() {
	const [items, setItems] = useState<CartEntry[]>([]);

	useEffect(() => {
		const syncCart = () => {
			const cart = readCart();
			setItems(
				cart.map((entry) => {
					const product = products.find((item) => item.slug === entry.slug);
					return { ...entry, product };
				})
			);
		};

		syncCart();
		window.addEventListener("cart:updated", syncCart);

		return () => window.removeEventListener("cart:updated", syncCart);
	}, []);

	const rows = items.filter((item) => item.product);
	const subtotal = rows.reduce((sum, item) => sum + (item.product ? getProductPrice(item.product, item.size) : 0) * item.quantity, 0);

	return (
		<>
			<Header />
			<main className="mx-auto min-h-[70vh] w-full max-w-[1100px] px-5 py-14 lg:py-20">
				<Link href="/shop" className="eyebrow text-muted"><ArrowLeft className="mr-2 inline" size={13} /> Continue shopping</Link>
				<h1 className="display mt-10 text-6xl">Your bag <span className="text-base text-gold">{rows.length}</span></h1>

				{rows.length === 0 ? (
					<div className="mt-12 rounded border border-black/10 bg-ivory p-10 text-center">
						<p className="eyebrow text-gold">Your bag is empty</p>
						<h2 className="display mt-4 text-5xl">Ready for your next signature scent?</h2>
						<Link href="/shop" className="mt-7 inline-block bg-ink px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-white">Browse the collection</Link>
					</div>
				) : (
					<div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_.7fr]">
						<div className="divide-y divide-black/10 border-y border-black/10">
							{rows.map((item) => (
								<div className="flex gap-5 py-6" key={`${item.slug}-${item.size}`}>
									<div className="h-32 w-28 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.product?.image})` }} />
									<div className="flex flex-1 justify-between gap-4">
										<div>
											<p className="eyebrow text-gold">{item.product?.brand}</p>
											<h2 className="display mt-2 text-3xl">{item.product?.name}</h2>
											<p className="mt-3 text-xs text-muted">{item.product?.type} · {item.size} · Qty {item.quantity}</p>
											<div className="mt-4 flex items-center gap-3">
												<button onClick={() => updateCartQuantity(item.slug, item.size, item.quantity - 1)} aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center border border-black/15"><Minus size={13} /></button>
												<span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
												<button onClick={() => updateCartQuantity(item.slug, item.size, item.quantity + 1)} aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center border border-black/15"><Plus size={13} /></button>
											</div>
										</div>
										<div className="flex flex-col items-end justify-between">
											  <span className="text-sm font-semibold">{formatPrice((item.product ? getProductPrice(item.product, item.size) : 0) * item.quantity)}</span>
											<button onClick={() => removeFromCart(item.slug, item.size)} aria-label="Remove item" className="mt-3"><Trash2 size={16} className="text-muted" /></button>
										</div>
									</div>
								</div>
							))}
						</div>

						<aside className="h-fit bg-ivory p-7">
							<p className="eyebrow">Order summary</p>
							<div className="mt-7 flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
							<div className="mt-4 flex justify-between text-sm"><span className="text-muted">Delivery</span><span>Calculated at checkout</span></div>
							<div className="mt-6 flex justify-between border-t border-black/10 pt-5 font-semibold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
							<Link href="/checkout" className="mt-7 block bg-ink py-4 text-center text-[10px] font-bold uppercase tracking-[.17em] text-white">Proceed to checkout <ArrowRight className="ml-3 inline" size={15} /></Link>
						</aside>
					</div>
				)}
			</main>
			<Footer />
		</>
	);
}