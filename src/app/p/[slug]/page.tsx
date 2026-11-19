import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Hearts } from "@/components/deco";
import { EtaLine } from "@/components/delivery-eta";
import { CheckIcon, GiftIcon, QrIcon, ScaleIcon, TruckIcon } from "@/components/icons";
import { ProductCard, TINT } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, brandOf, fullName, byPopularity, getProduct, groups, products, sizes, sku, weightLabel } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const name = fullName(p);
  const desc = [p.weight && `${weightLabel(p.weight)} хүүхдэд`, p.pieces && `${p.pieces} ширхэг`, formatPrice(p.variants[0].price), p.about[0]].filter(Boolean).join(" · ").slice(0, 160);
  return { title: name, description: desc, alternates: { canonical: `/p/${p.slug}` }, openGraph: { images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const brand = brandOf(p.brand);
  const name = fullName(p);
  const group = groups.find((g) => g.id === p.group);
  const size = sizes.find((s) => s.id === p.size);
  const city = business.delivery[0];
  const v = p.variants[0];
  const img = p.images[0];

  // other pack of the same size first (SOLO ↔ DOUBLE), then the next size up, then the same group
  const idx = sizes.findIndex((s) => s.id === p.size);
  const related = products
    .filter((x) => x.slug !== p.slug && available(x))
    .map((x) => ({ x, score: (p.size && x.size === p.size ? 5 : 0) + (idx >= 0 && x.size === sizes[idx + 1]?.id ? 3 : 0) + (x.group === p.group ? 2 : 0) + (x.brand === p.brand ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || byPopularity(a.x, b.x))
    .slice(0, 10)
    .map(({ x }) => x);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: sku(v.id),
    brand: brand ? { "@type": "Brand", name: brand.name } : undefined,
    image: p.images.map((m) => absoluteUrl(m.src)),
    description: p.about[0] || undefined,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: v.price, sku: sku(v.id), availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-6 md:pt-10">
        <nav className="flex flex-wrap gap-x-1.5 text-[13px] font-bold text-ink-2" aria-label="Зам">
          <Link href="/shop" className="hover:text-sky-2">
            Дэлгүүр
          </Link>
          {group && (
            <>
              /
              <Link href={`/shop?g=${group.id}`} className="hover:text-sky-2">
                {group.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
          <div className="md:sticky md:top-32 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[32px]" style={{ background: TINT[p.group] }}>
              <span className="absolute inset-[14%] rounded-full bg-white/75 blur-2xl" aria-hidden />
              <Hearts />
              {img && <Image src={img.src} alt={name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className={`bob object-contain p-[10%] mix-blend-multiply ${available(p) ? "" : "opacity-50 grayscale"}`} />}
              {size && (
                <span className="absolute top-4 left-4 flex flex-col items-center rounded-[20px] bg-white px-4 py-2 shadow-[0_8px_20px_-10px_rgb(18_48_90/0.5)]">
                  <b className="display text-[34px] leading-none text-sky-2">{size.name}</b>
                  <span className="text-[13px] font-bold text-ink-2">{weightLabel(p.weight)}</span>
                </span>
              )}
            </div>
          </div>

          <div>
            {brand && (
              <Link href={`/shop?b=${brand.id}`} className="eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-white" style={{ background: brand.color }}>
                {brand.name}
              </Link>
            )}
            <h1 className="display mt-3 text-[34px] leading-tight md:text-[46px]">{p.title}</h1>

            {(p.weight || p.pieces) && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.weight && (
                  <li className="flex items-center gap-2 rounded-full bg-sky-3 px-3.5 py-2 text-[14.5px] font-bold text-sky-2">
                    <ScaleIcon size={17} /> {weightLabel(p.weight)} хүүхдэд
                  </li>
                )}
                {p.pieces && <li className="rounded-full bg-mint px-3.5 py-2 text-[14.5px] font-bold text-leaf-2">{p.pieces} ширхэг{p.pack === "double" ? " · 2 уут" : p.pack === "solo" ? " · 1 уут" : ""}</li>}
              </ul>
            )}

            <div className="mt-6">
              <BuyBox slug={p.slug} variants={p.variants} perPiece={p.perPiece} pieces={p.pieces} />
            </div>

            {p.promo && (
              <p className="mt-4 flex items-start gap-3 rounded-[20px] bg-sun-2 px-4 py-3 text-[14.5px]">
                <GiftIcon size={20} className="mt-0.5 shrink-0 text-[#b07c00]" />
                <span>{p.promo}</span>
              </p>
            )}

            <ul className="mt-4 grid gap-2 text-[14.5px]">
              <li className="flex items-start gap-3 rounded-[20px] bg-white px-4 py-3 shadow-[0_0_0_1.5px_var(--color-line)]">
                <TruckIcon size={20} className="mt-0.5 shrink-0 text-sky-2" />
                <span>
                  <EtaLine className="font-bold" />. Хүргэлт {formatPrice(city.fee)}, {formatPrice(city.freeFrom)}-өөс дээш үнэгүй.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-[20px] bg-white px-4 py-3 shadow-[0_0_0_1.5px_var(--color-line)]">
                <QrIcon size={20} className="mt-0.5 shrink-0 text-leaf-2" />
                <span>QPay-ээр 100% урьдчилж төлнө. И-баримт олгоно.</span>
              </li>
            </ul>

            {p.contents.length > 0 && (
              <section className="mt-8">
                <h2 className="display text-[24px]">Багцад юу орох вэ?</h2>
                <ul className="mt-3 grid gap-2">
                  {p.contents.map((c) => (
                    <li key={c} className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-[0_0_0_1.5px_var(--color-line)]">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf text-white">
                        <CheckIcon size={14} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {p.features.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {p.features.map((f) => (
                  <li key={f} className="rounded-full bg-white px-3.5 py-2 text-[14px] font-bold shadow-[0_0_0_1.5px_var(--color-line)]">
                    ✓ {f}
                  </li>
                ))}
              </ul>
            )}

            {p.about.length > 0 && (
              <section className="mt-8">
                <h2 className="display text-[24px]">Тайлбар</h2>
                <div className="prose-bt mt-3 text-[15.5px] text-ink-2">
                  {p.about.map((t, i) =>
                    t.startsWith("•") ? (
                      <p key={i} className="!mt-4 font-bold text-ink">
                        {t.replace(/^•\s*/, "")}
                      </p>
                    ) : (
                      <p key={i}>{t}</p>
                    ),
                  )}
                </div>
              </section>
            )}
            <p className="mt-6 text-[12.5px] text-ink-3">Код: {sku(v.id.split("-")[0])}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <p className="eyebrow text-leaf-2">{p.size ? "Хэмжээгээ ахиулах үед" : "Танд таалагдаж магадгүй"}</p>
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Хамт авдаг</h2>
          <Scroller label="Хамт авдаг" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {related.map((x) => (
              <div key={x.slug} className="w-[230px] shrink-0 snap-start md:w-[260px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </>
  );
}
