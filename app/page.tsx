import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Footer, Header, ProductCard } from "@/components/storefront";
import { formatPrice, getProductPrice, products } from "@/lib/catalog";

const categories = [["Men", "category-men", "/shop?gender=men"], ["Women", "category-women", "/shop?gender=women"], ["Unisex", "category-unisex", "/shop?gender=unisex"], ["Decants", "category-decants", "/shop?type=decant"]];

export default function Home() {
  const featuredProduct = products[0];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        <section className="luxury-hero relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,138,77,0.18),transparent_34%),linear-gradient(90deg,rgba(17,13,12,0.84),rgba(17,13,12,0.45))]" />
          <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-gold/25 blur-3xl animate-slow-pulse" />
          <div className="absolute bottom-12 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-float-slow" />

          <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
            <div className="relative z-10 max-w-xl pt-8 md:pt-0">
              <span className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[.24em] text-white/80 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Curated for new rituals
              </span>

              <h1 className="display mt-8 text-6xl leading-[.82] text-white md:text-[96px]">
                Find your
                <br />
                <i>signature</i>
                <br />
                scent.
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/75 md:text-base">
                Authentic fragrances and premium decants, carefully selected for every mood, moment and personality.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center bg-white px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-ink transition hover:bg-gold hover:text-white"
                  href="/shop"
                >
                  Shop perfumes
                  <ArrowUpRight className="ml-5 inline" size={15} />
                </Link>

                <Link
                  className="border border-white/35 bg-white/5 px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-white transition hover:border-white/80 hover:bg-white/10"
                  href="/shop?type=decant"
                >
                  Explore decants
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-[10px] font-medium uppercase tracking-[.2em] text-white/60">
                <span>Authentic stock</span>
                <span>Luxury decants</span>
                <span>Worldwide delivery</span>
              </div>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-end">
              <div className="hero-showcase">
                <div className="floating-card floating-card-top">
                  <span className="text-[9px] uppercase tracking-[.16em] text-gold">New arrival</span>
                  <p className="display mt-3 text-3xl text-white">Noir</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/60">Amber & oud</p>
                </div>

                <div className="floating-card floating-card-bottom">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[9px] uppercase tracking-[.18em] text-white/60">Top notes</span>
                    <Sparkles size={14} className="text-gold" />
                  </div>
                  <p className="mt-3 display text-3xl leading-none">Saffron</p>
                </div>

                <Link href={`/products/${featuredProduct.slug}`} className="hero-product-card group block">
                  <div
                    className="hero-product-image"
                    style={{ backgroundImage: `url(${featuredProduct.image})` }}
                  />

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[9px] font-bold uppercase tracking-[.18em] text-gold">{featuredProduct.brand}</p>
                      <span className="text-xs font-medium text-white/70">{featuredProduct.type}</span>
                    </div>

                    <h3 className="display mt-4 text-4xl leading-none text-white">{featuredProduct.name}</h3>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[.18em] text-white/55">From</p>
                        <p className="mt-2 text-xl font-semibold text-white">{formatPrice(getProductPrice(featuredProduct))}</p>
                      </div>

                      <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-gold transition group-hover:translate-x-1">
                        View scent
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="mb-8 flex flex-col gap-5 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-gold">Explore by mood</p>
              <h2 className="display mt-4 text-[4.2rem] leading-[0.82] md:text-[6.4rem] lg:text-[8rem]">Find your <i>world.</i></h2>
            </div>
            <Link className="inline-flex items-center self-start border border-black/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-ink transition hover:border-gold hover:text-gold lg:self-auto" href="/shop">
              View all scents
            </Link>
          </div>

          <div className="mood-grid">
            {categories.map(([name, image, href], index) => (
              <Link
                className={`mood-card group ${image} ${index % 2 === 0 ? "mood-card-tall" : "mood-card-short"}`}
                href={href}
                key={name}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 group-hover:bg-black/10" />

                <div className="relative flex h-full items-center justify-center px-6 md:px-7">
                  <div className="flex w-full items-center justify-center gap-3">
                    <span className="mood-label display text-white">{name}</span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-gold group-hover:bg-gold/20 md:h-11 md:w-11">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-ivory px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-gold">The edit</p>
                <h2 className="display mt-4 text-5xl md:text-6xl">The house <i>favourites.</i></h2>
              </div>
              <Link className="hidden text-[10px] font-bold uppercase tracking-[.16em] underline decoration-gold underline-offset-8 sm:block" href="/shop">Shop best sellers</Link>
            </div>
            <div className="mt-12 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {products.filter((product) => product.featured).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink px-5 py-20 text-white lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow text-gold">The decant edit</p>
              <h2 className="display mt-5 text-6xl leading-[.9] md:text-8xl">Try before<br /><i>you commit.</i></h2>
              <p className="mt-7 max-w-sm text-sm leading-7 text-white/60">Experience luxury fragrances without purchasing the full bottle. Wear it, live with it, make it yours.</p>
              <Link className="mt-9 inline-flex items-center gap-7 border-b border-gold pb-3 text-[10px] font-bold uppercase tracking-[.18em]" href="/shop?type=decant">Discover decants <ArrowUpRight size={15} className="text-gold" /></Link>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              <div className="relative col-span-2 aspect-[1.3] bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85')] bg-cover bg-center" />
              <div className="flex flex-col justify-end border-l border-gold/50 pl-4 md:pl-7">
                <div className="mb-8">
                  <Sparkles className="mb-4 text-gold" size={20} />
                  <p className="display text-3xl">Try</p>
                  <p className="text-xs text-white/50">a little first</p>
                </div>
                <div className="mb-8">
                  <p className="display text-3xl">Wear</p>
                  <p className="text-xs text-white/50">it your way</p>
                </div>
                <div>
                  <p className="display text-3xl">Discover</p>
                  <p className="text-xs text-white/50">what lingers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="eyebrow text-gold">Why the house</p>
              <h2 className="display mt-4 text-5xl md:text-6xl">A little more<br /><i>considered.</i></h2>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {[ ["01", "Curated with intention", "A considered edit of beloved icons and scents worth discovering."], ["02", "Premium decants", "The freedom to explore a fragrance before making it part of your ritual."], ["03", "Islandwide delivery", "Your next signature scent, delivered thoughtfully across Sri Lanka."], ["04", "Here to help", "A real person on the other side for recommendations and questions."] ].map(([number, title, text]) => (
                <div className="border-t border-black/15 py-7 sm:pr-10" key={number}>
                  <span className="text-xs text-gold">{number}</span>
                  <h3 className="display mt-4 text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-sand/50 px-5 py-20 text-center lg:py-28">
          <p className="eyebrow text-gold">The journal</p>
          <h2 className="display mx-auto mt-4 max-w-2xl text-5xl md:text-6xl">A scent is a memory<br /><i>waiting to happen.</i></h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">Notes on fragrance, ritual and the stories we carry with us.</p>
          <button className="mt-8 text-[10px] font-bold uppercase tracking-[.17em] underline decoration-gold underline-offset-8">Coming soon <ArrowDownRight className="ml-2 inline text-gold" size={14} /></button>
        </section>
      </main>
      <Footer />
    </>
  );
}

