import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Footer, Header, ProductCard } from "@/components/storefront";
import { getProductPrice, products } from "@/lib/catalog";

type ShopParams = {
  type?: string;
  gender?: string;
  sort?: string;
};

export default async function Shop({ searchParams }: { searchParams: Promise<ShopParams> }) {
  const params = await searchParams;
  const filtered = products.filter((product) =>
    (!params.type || product.type.toLowerCase().includes(params.type.toLowerCase())) &&
    (!params.gender || product.gender.toLowerCase() === params.gender.toLowerCase())
  );

  if (params.sort === "low") {
    filtered.sort((first, second) => getProductPrice(first) - getProductPrice(second));
  } else if (params.sort === "high") {
    filtered.sort((first, second) => getProductPrice(second) - getProductPrice(first));
  } else if (params.sort === "newest") {
    filtered.sort((first, second) => Number(Boolean(second.newArrival)) - Number(Boolean(first.newArrival)));
  } else if (params.sort === "featured") {
    filtered.sort((first, second) => Number(Boolean(second.featured)) - Number(Boolean(first.featured)));
  }

  const title = params.type === "decant"
    ? "Decants"
    : params.gender
      ? `${params.gender[0].toUpperCase()}${params.gender.slice(1)} fragrances`
      : "The collection";

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-14 lg:px-10 lg:pt-20">
          <div className="flex flex-col justify-between gap-7 border-b border-black/10 pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-gold">The fragrance wardrobe</p>
              <h1 className="display mt-4 text-6xl">{title}<span className="ml-3 text-base align-top text-gold">{filtered.length}</span></h1>
            </div>
            <form action="/shop" method="get" className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="shop-gender">Filter by gender</label>
              <select id="shop-gender" name="gender" defaultValue={params.gender ?? ""} className="border border-black/15 bg-transparent px-3 py-3 text-[10px] font-bold uppercase tracking-[.12em]">
                <option value="">All genders</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
              <label className="sr-only" htmlFor="shop-type">Filter by product type</label>
              <select id="shop-type" name="type" defaultValue={params.type ?? ""} className="border border-black/15 bg-transparent px-3 py-3 text-[10px] font-bold uppercase tracking-[.12em]">
                <option value="">All products</option>
                <option value="full">Full bottles</option>
                <option value="decant">Decants</option>
              </select>
              <label className="sr-only" htmlFor="shop-sort">Sort products</label>
              <select id="shop-sort" name="sort" defaultValue={params.sort ?? "featured"} className="border border-black/15 bg-transparent px-3 py-3 text-[10px] font-bold uppercase tracking-[.12em]">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
              <button type="submit" className="flex items-center gap-2 bg-ink px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-white transition hover:bg-gold">
                <SlidersHorizontal size={15} /> Apply
              </button>
            </form>
          </div>

          <div className="mt-12 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length ? filtered.map((product) => <ProductCard key={product.slug} product={product} />) : (
              <div className="col-span-full py-24 text-center">
                <h2 className="display text-5xl">Nothing here yet.</h2>
                <p className="mt-4 text-sm text-muted">Try another edit of the collection.</p>
                <Link className="mt-7 inline-block border-b border-gold pb-2 text-[10px] font-bold uppercase tracking-[.15em]" href="/shop">View all fragrances</Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}