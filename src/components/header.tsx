import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { EtaLine } from "./delivery-eta";
import { Heart } from "./deco";
import { HeaderTools } from "./header-tools";
import { TruckIcon } from "./icons";
import { Scroller } from "./scroller";

export const NAV = [
  { href: "/shop?g=diapers", label: "Живх" },
  { href: "/shop?g=mama", label: "Ээж ба нярай" },
  { href: "/shop?g=bundles", label: "Багц" },
  { href: "/shop?g=women", label: "Эмэгтэй" },
  { href: "/shop?g=wipes", label: "Салфетик" },
  { href: "/shop?g=paper", label: "Цаас" },
];

export function Header() {
  const city = business.delivery[0];
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-sky text-white">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-[13.5px]">
          <span className="flex min-w-0 items-center gap-2">
            <TruckIcon size={16} className="shrink-0" />
            <EtaLine className="truncate" />
          </span>
          <span className="hidden shrink-0 items-center gap-1.5 sm:flex">
            <Heart size={14} color="var(--color-sun)" /> {formatPrice(city.freeFrom)}-өөс дээш хүргэлт үнэгүй
          </span>
        </div>
      </div>
      <div className="border-b border-line bg-white/95 backdrop-blur">
        <div className="wrap flex h-[68px] items-center gap-3 md:h-[80px]">
          <Link href="/" className="shrink-0 transition hover:scale-105" aria-label={`${business.fullName}: нүүр хуудас`}>
            <Image src="/brand/logo.png" alt="Тоди хүүхдийн живх" width={640} height={314} priority className="h-[42px] w-auto md:h-[52px]" />
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="display rounded-full px-3.5 py-2 text-[15.5px] text-ink transition hover:bg-sky-3 hover:text-sky-2">
                {n.label}
              </Link>
            ))}
            <Link href="/size" className="display ml-1 flex items-center gap-1.5 rounded-full bg-mint px-4 py-2 text-[15.5px] text-leaf-2 transition hover:bg-leaf hover:text-white">
              <Heart size={15} /> Хэмжээ олох
            </Link>
          </nav>
          <HeaderTools />
        </div>
        <Scroller as="nav" label="Ангилал" small className="no-bar wrap flex gap-2 overflow-x-auto pb-3 lg:hidden">
          <Link href="/size" className="chip shrink-0 !bg-mint !text-leaf-2">
            <Heart size={14} /> Хэмжээ олох
          </Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="chip shrink-0">
              {n.label}
            </Link>
          ))}
        </Scroller>
      </div>
    </header>
  );
}
