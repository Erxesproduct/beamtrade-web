import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Cloud, Heart } from "./deco";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative mt-24 pb-24 md:pb-0">
      <div className="cloud-edge" style={{ ["--cloud" as string]: "var(--color-sky)" }} />
      <div className="relative overflow-hidden bg-sky text-white">
        <Cloud width={220} className="absolute -top-6 right-[8%] opacity-15" />
        <Cloud width={160} className="absolute bottom-10 left-[4%] opacity-10" />
        <div className="wrap relative grid gap-10 py-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <span className="inline-block rounded-[22px] bg-white px-4 py-3">
              <Image src="/brand/logo.png" alt="Тоди хүүхдийн живх" width={640} height={314} className="h-12 w-auto" />
            </span>
            <p className="display mt-5 max-w-sm text-[24px] leading-tight">{business.tagline}</p>
            <p className="mt-2 max-w-sm text-white/85">{business.fullName}: Тоди, Өд, Хатад, Flexa, CUCU брэндийн бүтээгдэхүүн.</p>
            <div className="mt-6 flex gap-3">
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-white/15 transition hover:bg-white hover:text-sky" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full bg-white/15 transition hover:bg-white hover:text-sky" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={`tel:${business.phone.tel}`} className="lift flex items-center gap-4 rounded-[24px] bg-white p-5 text-ink">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-white">
                <PhoneIcon size={22} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Утас, Facebook chat</span>
                <b className="display text-[24px]">{business.phone.display}</b>
              </span>
            </a>
            <a href={`mailto:${business.email}`} className="lift flex items-center gap-4 rounded-[24px] bg-white p-5 text-ink">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sun text-ink">
                <MailIcon size={22} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] text-ink-2">Имэйл</span>
                <b className="block truncate text-[15.5px]">{business.email}</b>
              </span>
            </a>
            <div className="flex items-start gap-4 rounded-[24px] bg-white p-5 text-ink sm:col-span-2">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-3 text-sky-2">
                <PinIcon size={22} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Хаяг</span>
                <b className="block text-[15.5px]">{business.address}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="wrap relative flex flex-wrap items-center justify-between gap-3 border-t border-white/20 py-6 text-[14px] text-white/85">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Доод холбоос">
            <Link href="/shop" className="hover:text-white">
              Дэлгүүр
            </Link>
            <Link href="/size" className="hover:text-white">
              Живхний хэмжээ
            </Link>
            <Link href="/info#delivery" className="hover:text-white">
              Хүргэлт
            </Link>
            <Link href="/info#faq" className="hover:text-white">
              Түгээмэл асуулт
            </Link>
            <Link href="/info#about" className="hover:text-white">
              Бидний тухай
            </Link>
          </nav>
          <span className="flex items-center gap-1.5">
            © {new Date().getFullYear()} {business.fullName} <Heart size={14} color="var(--color-sun)" />
          </span>
        </div>
      </div>
    </footer>
  );
}
