import Image from "next/image";
import Link from "next/link";
import { Cloud, Heart, Hearts, Sky } from "@/components/deco";
import { EtaCard } from "@/components/delivery-eta";
import { HeroSlides, type Slide } from "@/components/hero-slides";
import { ArrowIcon, GiftIcon, PhoneIcon, QrIcon, ScaleIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductCard, TINT } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { SizeFinder } from "@/components/size-finder";
import { business } from "@/content/business";
import { available, banners, brands, groups, popular, products, sizes, weightLabel } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

// every Тоди diaper pack, NB → XL, SOLO before DOUBLE: the hero photo changes through them by itself
const ORDER = sizes.map((s) => s.id);
const SLIDES: Slide[] = products
  .filter((p) => p.group === "diapers" && p.size && p.images[0])
  .sort((a, b) => ORDER.indexOf(a.size!) - ORDER.indexOf(b.size!) || (a.pack === "double" ? 1 : 0) - (b.pack === "double" ? 1 : 0))
  .map((p) => ({ slug: p.slug, title: p.title, src: p.images[0].src, size: p.size!.toUpperCase(), kg: weightLabel(p.weight), price: p.variants[0].price, perPiece: p.perPiece, pieces: p.pieces, gift: !!p.promo }));

const STEPS = [
  { icon: ScaleIcon, title: "Жингээ оруул", text: "Хүүхдийнхээ кг-г сонгоход тохирох хэмжээ гарч ирнэ.", color: "var(--color-sky)" },
  { icon: QrIcon, title: "QPay-ээр төл", text: "Сагсандаа хийгээд аль ч банкны аппаар уншуулна.", color: "var(--color-leaf)" },
  { icon: TruckIcon, title: "Гэртээ ав", text: "9 цагаас өмнө бол өдөртөө, үгүй бол маргааш нь.", color: "var(--color-sun)" },
];

export default function Home() {
  const best = popular.filter((p) => available(p)).slice(0, 10);
  const bundles = products.filter((p) => p.group === "bundles");
  const gifts = products.filter((p) => p.promo && available(p)).sort((a, b) => ORDER.indexOf(a.size ?? "") - ORDER.indexOf(b.size ?? "") || a.variants[0].price - b.variants[0].price);
  const city = business.delivery[0];
  const cover = (g: string) => popular.find((p) => p.group === g && p.images[0])?.images[0].thumb.src;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-3 to-mist">
        <Sky dense />
        <div className="wrap relative z-10 grid items-center gap-8 pt-10 pb-14 md:pt-14 lg:grid-cols-[1.1fr_1fr] lg:pb-16">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold text-leaf-2 shadow-[0_6px_16px_-10px_rgb(18_48_90/0.5)]">
              <Heart size={16} /> 2016 оноос Монголдоо үйлдвэрлэж байна
            </p>
            <h1 className="display rise mt-5 text-[40px] leading-[1.05] text-ink sm:text-[54px] lg:text-[66px]" style={{ animationDelay: "80ms" }}>
              Зөөлөн, хуурай, <span className="text-sky">эх орны</span> живх
            </h1>
            <p className="rise mt-4 max-w-xl text-[17.5px] text-ink-2" style={{ animationDelay: "160ms" }}>
              Тоди хүүхдийн живх, ээж нярайн хэрэглэл, Өд цаас, салфетик. Хүүхдийнхээ жинг оруулаад тохирох хэмжээгээ шууд олоорой.
            </p>
            <div className="rise mt-7 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <Link href="/size" className="btn btn-sky h-14 text-[17px]">
                <ScaleIcon size={20} /> Хэмжээ олох
              </Link>
              <Link href="/shop" className="btn btn-white h-14 text-[17px]">
                Бүх бараа <ArrowIcon size={18} />
              </Link>
            </div>
            <ul className="rise mt-8 flex flex-wrap gap-2 text-[13.5px] font-bold" style={{ animationDelay: "320ms" }}>
              <li>
                <Link href="/shop?gift=1" className="gift-tag !py-1.5 !text-[13.5px]">
                  <GiftIcon size={15} /> {formatPrice(business.gift.from)}+ бэлэгтэй
                </Link>
              </li>
              <li className="rounded-full bg-white/80 px-3 py-1.5">✓ ISO 9001:2015</li>
              <li className="rounded-full bg-white/80 px-3 py-1.5">✓ OEKO-TEX 100</li>
              <li className="rounded-full bg-white/80 px-3 py-1.5">✓ {formatPrice(city.freeFrom)}-өөс дээш хүргэлт үнэгүй</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <Hearts />
            <HeroSlides slides={SLIDES} />
            <div className="card relative mx-auto mt-2 max-w-[340px] p-4">
              <EtaCard />
            </div>
          </div>
        </div>
        <div className="cloud-edge" style={{ ["--cloud" as string]: "var(--color-mist)" }} />
      </section>

      {/* SIZE FINDER + 3 STEPS */}
      <section className="wrap mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <Reveal>
          <SizeFinder sizes={sizes} compact />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="display text-[30px] leading-tight md:text-[36px]">Захиалах нь 3 алхам</h2>
          <ol className="mt-5 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card lift flex items-center gap-4 p-4">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-white" style={{ background: s.color }}>
                  <s.icon size={26} />
                  <b className="display absolute -top-2 -left-2 grid h-7 w-7 place-items-center rounded-full bg-ink text-[14px] text-white">{i + 1}</b>
                </span>
                <span>
                  <b className="display block text-[19px]">{s.title}</b>
                  <span className="block text-[14.5px] text-ink-2">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* CATEGORIES */}
      <section className="wrap mt-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Юу хайж байна?</h2>
          <Link href="/shop" className="font-bold text-sky-2 hover:underline">
            Бүгдийг үзэх →
          </Link>
        </Reveal>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {groups.map((g, i) => (
            <Reveal as="li" key={g.id} delay={i * 60}>
              <Link href={`/shop?g=${g.id}`} className="group lift relative flex h-full min-h-[150px] overflow-hidden rounded-[26px] p-4 md:min-h-[190px] md:p-6" style={{ background: TINT[g.id] }}>
                <span className="relative z-10 flex max-w-[62%] flex-col">
                  <b className="display text-[19px] leading-tight md:text-[24px]">{g.name}</b>
                  <span className="mt-1 hidden text-[13.5px] text-ink-2 sm:block">{g.line}</span>
                  <span className="mt-auto pt-3 text-[13px] font-bold text-ink-2">{g.count} бараа →</span>
                </span>
                {cover(g.id) && (
                  <span className="absolute -right-3 -bottom-3 h-[78%] w-[55%] mix-blend-multiply transition duration-500 group-hover:-translate-y-1 group-hover:rotate-3">
                    <Image src={cover(g.id)!} alt="" fill sizes="(min-width: 768px) 220px, 40vw" className="object-contain" />
                  </span>
                )}
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* BESTSELLERS */}
      <section className="mt-20">
        <Reveal className="wrap flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-leaf-2">Ээжүүдийн сонголт</p>
            <h2 className="display text-[30px] leading-tight md:text-[38px]">Хамгийн их захиалдаг</h2>
          </div>
          <Link href="/shop" className="font-bold text-sky-2 hover:underline">
            Дэлгүүр →
          </Link>
        </Reveal>
        <div className="wrap mt-6">
          <Scroller label="Хамгийн их захиалдаг" className="no-bar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {best.map((p, i) => (
              <div key={p.slug} className="w-[230px] shrink-0 snap-start md:w-[260px]">
                <ProductCard p={p} priority={i < 2} />
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      {/* GIFT: the shop's mystery box promo on the Тоди SOLO / DOUBLE packs */}
      {gifts.length > 0 && (
        <section className="wrap mt-14">
          <Reveal className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#ff5a74] to-[#d81f3a] p-6 text-white md:p-10">
            <Sky color="rgba(255,255,255,0.12)" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13.5px] font-bold text-[#d81f3a]">
                  <GiftIcon size={15} /> Бэлэгтэй
                </span>
                <h2 className="display mt-3 text-[30px] leading-tight md:text-[40px]">
                  <span className="whitespace-nowrap">{formatPrice(business.gift.from)}-өөс</span> дээш захиалгад <span className="text-sun">{business.gift.name}</span> бэлэг
                </h2>
                <p className="mt-2 max-w-xl text-white/90">
                  Тоди SOLO, DOUBLE живхний багцтай захиалга {formatPrice(business.gift.from)}-өөс давбал бэлэгтэй. Сагсанд хэр дутуу байгааг тань бид тоолоод харуулна.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {gifts.map((p) => (
                    <Link key={p.slug} href={`/p/${p.slug}`} className="rounded-full bg-white/15 px-3.5 py-2 text-[14px] font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#d81f3a]">
                      {p.title.replace(" багц", "")} · {formatPrice(p.variants[0].price)}
                    </Link>
                  ))}
                </div>
                <Link href="/shop?gift=1" className="btn btn-sun mt-6">
                  Бэлэгтэй живх үзэх →
                </Link>
              </div>
              <div className="relative mx-auto hidden h-[220px] w-[220px] md:block" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-white/15" />
                <span className="jiggle absolute inset-[18%] grid place-items-center rounded-[34px] bg-sun text-[#d81f3a] shadow-[0_14px_0_#d9a908]" style={{ ["--r" as string]: "-6deg" }}>
                  <GiftIcon size={92} />
                </span>
                <span className="beat absolute top-[8%] right-[10%] text-[28px]">✦</span>
                <span className="beat absolute bottom-[12%] left-[6%] text-[20px]" style={{ animationDelay: "0.6s" }}>
                  ✦
                </span>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* PROMO BANNERS from the shop */}
      {banners.length > 0 && (
        <section className="wrap mt-14 grid gap-4 md:grid-cols-2">
          {banners.map((b, i) => (
            <Reveal key={b.src} delay={i * 100}>
              <Link href={i === 0 ? "/info#delivery" : "/shop?g=women"} className="lift block overflow-hidden rounded-[26px]">
                <Image src={b.src} alt={b.title} width={b.w} height={b.h} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
              </Link>
            </Reveal>
          ))}
        </section>
      )}

      {/* BUNDLES */}
      {bundles.length > 0 && (
        <section className="relative mt-20 overflow-hidden bg-sun-2 py-14">
          <Cloud width={260} className="absolute -top-12 -left-16 opacity-70" />
          <Cloud width={180} className="absolute right-[6%] bottom-6 opacity-60" />
          <div className="wrap relative">
            <Reveal>
              <p className="eyebrow text-[#b07c00]">Хэмнэлттэй</p>
              <h2 className="display text-[30px] leading-tight md:text-[38px]">Багцаар авбал илүү амар</h2>
              <p className="mt-2 max-w-xl text-ink-2">Ээжийн цүнх, гэр ахуйн хэрэглэл, бэлэг: хэрэгтэй бүхэн нэг дор.</p>
            </Reveal>
            <ul className="mt-7 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
              {bundles.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 70}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* BRANDS */}
      <section className="wrap mt-20">
        <Reveal>
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Манай брэндүүд</h2>
        </Reveal>
        <Scroller label="Брэндүүд" className="no-bar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 pt-1 pb-4">
          {brands.map((b) => (
            <Link key={b.id} href={`/shop?b=${b.id}`} className="lift flex w-[220px] shrink-0 flex-col rounded-[24px] bg-white p-5 shadow-[0_0_0_1.5px_var(--color-line)]">
              <span className="display grid h-12 w-12 place-items-center rounded-full text-[20px] text-white" style={{ background: b.color }}>
                {b.name.slice(0, 1)}
              </span>
              <b className="display mt-3 text-[22px]">{b.name}</b>
              <span className="mt-1 text-[13.5px] text-ink-2">{b.line}</span>
              <span className="mt-auto pt-3 text-[13px] font-bold" style={{ color: b.color === "#f5b31b" ? "#b07c00" : b.color }}>
                {b.count} бараа →
              </span>
            </Link>
          ))}
        </Scroller>
      </section>

      {/* STANDARDS + ABOUT */}
      <section className="wrap mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal className="relative overflow-hidden rounded-[30px]">
          <Image src="/brand/about.webp" alt="Тоди живхний үйлдвэр" width={1400} height={997} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow text-sky-2">Бидний тухай</p>
          <h2 className="display mt-1 text-[30px] leading-tight md:text-[38px]">Монголд, Монгол хүүхдэд зориулж</h2>
          <p className="mt-3 text-ink-2">2016 оны 1-р сарын 18-нд анхны живхээ зах зээлд нийлүүлсэн. Бүрэн автомат шугам дээр, олон улсын стандартаар үйлдвэрлэдэг.</p>
          <ul className="mt-6 grid gap-3">
            {business.standards.map((s) => (
              <li key={s.name} className="flex items-start gap-3 rounded-[20px] bg-mint p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf text-white">
                  <ShieldIcon size={20} />
                </span>
                <span>
                  <b className="block">{s.name}</b>
                  <span className="text-[14px] text-ink-2">{s.line}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/info#about" className="mt-5 inline-block font-bold text-sky-2 hover:underline">
            Дэлгэрэнгүй →
          </Link>
        </Reveal>
      </section>

      {/* DELIVERY */}
      <section className="wrap mt-20">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-sky p-6 text-white md:p-10">
          <Sky color="rgba(255,255,255,0.14)" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow !text-sun">Хүргэлт</p>
              <h2 className="display mt-1 text-[30px] leading-tight md:text-[40px]">
                Хүргэлт {formatPrice(city.fee)}
                <span className="mt-1 block text-[22px] md:text-[28px]">
                  <span className="whitespace-nowrap">{formatPrice(city.freeFrom)}-өөс</span> дээш бол <span className="text-sun">үнэгүй</span>
                </span>
              </h2>
              <p className="mt-3 text-white/90">{business.rules.delivery}</p>
              <p className="mt-2 text-white/90">Орон нутагт таны заасан унаанд тавьж өгнө.</p>
              <Link href="/info#delivery" className="btn btn-white mt-6">
                Бүсийн хязгаар үзэх
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              {business.zones.map((z, i) => (
                <li key={z.dir} className="rounded-[22px] bg-white/15 p-4 backdrop-blur-sm">
                  <b className="display flex items-center gap-2 text-[19px]">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[15px] text-sky-2" aria-hidden>
                      {["←", "→", "↓", "↑"][i]}
                    </span>
                    {z.dir}
                  </b>
                  <span className="mt-1.5 block text-[13.5px] leading-snug text-white/90">{z.places}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="wrap mt-20 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="display text-[30px] leading-tight md:text-[38px]">Түгээмэл асуулт</h2>
          <p className="mt-2 text-ink-2">Өөр асуух зүйл байвал залгаарай.</p>
          <a href={`tel:${business.phone.tel}`} className="btn btn-leaf mt-5">
            <PhoneIcon size={18} /> {business.phone.display}
          </a>
        </Reveal>
        <Reveal delay={100} className="space-y-3">
          {business.faq.map((f) => (
            <details key={f.q} className="card group p-5 open:shadow-[0_0_0_2px_var(--color-sky)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-3 text-sky-2 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink-2">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>
    </>
  );
}
