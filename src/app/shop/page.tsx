import type { Metadata } from "next";
import Link from "next/link";
import { Sky } from "@/components/deco";
import { CloseIcon, GiftIcon, ScaleIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { available, brandName, brands, byPopularity, fromPrice, groups, onSale, products, sizes, weightLabel, type Product } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const KEYS = ["g", "z", "b", "q", "sale", "gift"] as const;

const SORTS = [
  ["popular", "Эрэлттэй"],
  ["new", "Шинэ"],
  ["price-asc", "Хямдаас"],
  ["price-desc", "Үнэтэйгээс"],
] as const;

function titleOf(q: Record<string, string>) {
  if (q.q) return `«${q.q}»`;
  if (q.z) return `${sizes.find((s) => s.id === q.z)?.name ?? ""} хэмжээ`;
  if (q.b) return brandName(q.b);
  if (q.g) return groups.find((g) => g.id === q.g)?.name;
  if (q.sale) return "Хямдрал";
  if (q.gift) return "Бэлэгтэй бараа";
  return null;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = Object.fromEntries(KEYS.map((k) => [k, one(sp[k])]));
  const t = titleOf(q);
  return { title: t ? `${t}: дэлгүүр` : "Дэлгүүр", alternates: { canonical: "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-zа-яёөү0-9]+/gi, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = Object.fromEntries([...KEYS, "sort"].map((k) => [k, one(sp[k]).slice(0, 60)]));
  const sort = SORTS.some(([id]) => id === q.sort) ? q.sort : "popular";

  const match = (p: Product, skip?: string) =>
    (skip === "g" || !q.g || p.group === q.g) &&
    (skip === "z" || !q.z || p.size === q.z) &&
    (skip === "b" || !q.b || p.brand === q.b) &&
    (!q.sale || onSale(p)) &&
    (!q.gift || !!p.promo) &&
    (!q.q || norm(`${brandName(p.brand) ?? ""} ${p.title} ${p.size ?? ""} ${p.contents.join(" ")}`).includes(norm(q.q)));

  const list = products.filter((p) => match(p));
  list.sort((a, b) => {
    const av = Number(available(b)) - Number(available(a));
    if (av) return av;
    if (sort === "new") return b.createdAt.localeCompare(a.createdAt);
    if (sort === "price-asc") return fromPrice(a) - fromPrice(b);
    if (sort === "price-desc") return fromPrice(b) - fromPrice(a);
    return byPopularity(a, b);
  });

  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...q, ...patch })) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const title = titleOf(q) ?? "Бүх бараа";
  const active = KEYS.filter((k) => q[k]);
  const label = (k: string) => (k === "sale" ? "Хямдрал" : k === "gift" ? "Бэлэгтэй" : k === "q" ? `«${q.q}»` : titleOf({ [k]: q[k] }));
  const has = (p: Product, key: string, id: string) => (key === "g" ? p.group === id : key === "z" ? p.size === id : p.brand === id);

  const row = (name: string, key: "g" | "z" | "b", items: { id: string; name: string; sub?: string | null }[]) => (
    <Scroller label={name} small className="no-bar flex gap-2 overflow-x-auto py-1.5">
      <span className="eyebrow mr-1 shrink-0 self-center !text-[12px] text-ink-3">{name}</span>
      {items.map((it) => {
        const n = products.filter((p) => match(p, key) && has(p, key, it.id)).length;
        if (!n && q[key] !== it.id) return null;
        return (
          <Link key={it.id} href={href({ [key]: q[key] === it.id ? null : it.id, ...(key === "z" ? { g: null } : {}) })} aria-current={q[key] === it.id} className="chip shrink-0" scroll={false}>
            {it.name}
            {it.sub && <span className="text-[12px] font-bold opacity-70">{it.sub}</span>}
            <span className="text-[12px] opacity-60">{n}</span>
          </Link>
        );
      })}
    </Scroller>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-3 to-mist">
        <Sky />
        <div className="wrap relative py-9 md:py-12">
          <nav className="text-[13px] font-bold text-ink-2" aria-label="Зам">
            <Link href="/" className="hover:text-sky-2">
              Нүүр
            </Link>{" "}
            /{" "}
            <Link href="/shop" className="hover:text-sky-2">
              Дэлгүүр
            </Link>
          </nav>
          <h1 className="display mt-2 text-[38px] leading-tight md:text-[56px]">{title}</h1>
          <p className="mt-1 font-bold text-ink-2">{list.length} бараа</p>
          {active.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {active.map((k) => (
                <Link key={k} href={href({ [k]: null })} className="chip !bg-ink !text-white" scroll={false}>
                  {label(k)} <CloseIcon size={14} />
                </Link>
              ))}
              <Link href="/shop" className="chip">
                Бүгдийг арилгах
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="wrap mt-4 space-y-1.5">
        {row("Төрөл", "g", groups)}
        {(!q.g || q.g === "diapers") && row("Живх", "z", sizes.map((s) => ({ id: s.id, name: s.name, sub: weightLabel(s) })))}
        {row("Брэнд", "b", brands)}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="eyebrow mr-1 !text-[12px] text-ink-3">Эрэмбэ</span>
          {SORTS.map(([id, name]) => (
            <Link key={id} href={href({ sort: id === "popular" ? null : id })} aria-current={sort === id} className="chip" scroll={false}>
              {name}
            </Link>
          ))}
          {products.some((p) => p.promo) && (
            <Link href={href({ gift: q.gift ? null : "1" })} aria-pressed={!!q.gift} className="chip" scroll={false}>
              <GiftIcon size={16} /> Бэлэгтэй
            </Link>
          )}
          {products.some(onSale) && (
            <Link href={href({ sale: q.sale ? null : "1" })} aria-pressed={!!q.sale} className="chip" scroll={false}>
              Хямдралтай
            </Link>
          )}
        </div>
      </div>

      {(q.g === "diapers" || q.z) && (
        <div className="wrap mt-6">
          <Link href="/size" className="lift flex items-center gap-4 rounded-[22px] bg-mint p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-white">
              <ScaleIcon size={22} />
            </span>
            <span className="min-w-0">
              <b className="block">Аль хэмжээ болохоо мэдэхгүй байна уу?</b>
              <span className="text-[14px] text-ink-2">Хүүхдийнхээ жинг оруулаад тохирохыг нь олоорой →</span>
            </span>
          </Link>
        </div>
      )}

      <section className="wrap mt-8">
        {list.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="display text-[28px]">Олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл бидэнтэй холбогдоорой.</p>
            <Link href="/shop" className="btn btn-sky mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
