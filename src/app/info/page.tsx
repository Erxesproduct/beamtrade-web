import type { Metadata } from "next";
import Image from "next/image";
import { Sky } from "@/components/deco";
import { EtaCard } from "@/components/delivery-eta";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, бидний тухай",
  description: "Beam trade LLC: хүргэлтийн бүс, үнэ, хугацаа, QPay төлбөр, и-баримт, түгээмэл асуулт, Тоди брэндийн түүх.",
  alternates: { canonical: "/info" },
};

const LINKS = [
  ["#delivery", "Хүргэлт"],
  ["#payment", "Төлбөр"],
  ["#faq", "Асуулт"],
  ["#about", "Бидний тухай"],
  ["#contact", "Холбоо барих"],
] as const;

export default function InfoPage() {
  const city = business.delivery[0];
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-3 to-mist">
        <Sky />
        <div className="wrap relative pt-10 pb-10 md:pt-14">
          <h1 className="display text-[38px] leading-tight md:text-[56px]">Хэрэгтэй мэдээлэл</h1>
          <nav className="no-bar mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Хэсгүүд">
            {LINKS.map(([href, name]) => (
              <a key={href} href={href} className="chip shrink-0">
                {name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="wrap mt-6 space-y-14">
        <section id="delivery" className="scroll-mt-32">
          <h2 className="display flex items-center gap-3 text-[30px]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-sky text-white">
              <TruckIcon size={24} />
            </span>
            Хүргэлт
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="card p-6">
              <p className="eyebrow text-sky-2">Улаанбаатар</p>
              <p className="display mt-1 text-[34px] leading-none">{formatPrice(city.fee)}</p>
              <p className="mt-2 font-bold text-leaf-2">{formatPrice(city.freeFrom)}-өөс дээш захиалгад үнэгүй</p>
            </div>
            <div className="card p-6">
              <EtaCard />
            </div>
            <div className="card p-6">
              <p className="eyebrow text-[#b07c00]">Орон нутаг</p>
              <p className="mt-2 text-ink-2">{business.delivery[1].note}</p>
              <p className="mt-2 text-[14px] text-ink-2">{business.rules.countryside}</p>
            </div>
          </div>
          <p className="mt-4 rounded-[20px] bg-white px-5 py-4 shadow-[0_0_0_1.5px_var(--color-line)]">{business.rules.delivery}</p>
          <h3 className="display mt-8 text-[22px]">Хүргэлтийн бүсийн хязгаар</h3>
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_auto] items-center gap-3 sm:gap-4">
            {(["Хойд", "Баруун", "Зүүн", "Урд"] as const).map((dir) => {
              const z = business.zones.find((x) => x.dir === dir)!;
              const pos = { Хойд: "col-start-1 col-span-3 row-start-1 justify-self-center", Баруун: "col-start-1 row-start-2", Зүүн: "col-start-3 row-start-2", Урд: "col-start-1 col-span-3 row-start-3 justify-self-center" }[dir];
              return (
                <div key={dir} className={`card max-w-[360px] p-4 ${pos}`}>
                  <b className="display text-[18px] text-sky-2">{dir}</b>
                  <p className="mt-1 text-[14px] leading-snug text-ink-2">{z.places}</p>
                </div>
              );
            })}
            <span className="display col-start-2 row-start-2 grid h-20 w-20 place-items-center rounded-full bg-sky text-center text-[13px] leading-tight text-white shadow-[0_6px_0_var(--color-sky-2)] sm:h-24 sm:w-24 sm:text-[15px]">
              Улаан-
              <br />
              баатар
            </span>
          </div>
        </section>

        <section id="payment" className="scroll-mt-32">
          <h2 className="display flex items-center gap-3 text-[30px]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf text-white">
              <QrIcon size={24} />
            </span>
            Төлбөр, и-баримт
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            <li className="card p-5">
              <b className="display block text-[19px]">QPay</b>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.payments[0].note}</p>
            </li>
            <li className="card p-5">
              <b className="display block text-[19px]">100% урьдчилгаа</b>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.rules.payment}</p>
            </li>
            <li className="card p-5">
              <b className="display block text-[19px]">И-баримт</b>
              <p className="mt-1 text-[14.5px] text-ink-2">{business.rules.ebarimt}</p>
            </li>
          </ul>
          <p className="mt-4 rounded-[20px] bg-rose-2 px-5 py-4 font-bold">⚠ {business.rules.cancel}</p>
        </section>

        <section id="faq" className="scroll-mt-32">
          <h2 className="display text-[30px]">Түгээмэл асуулт</h2>
          <div className="mt-5 space-y-3">
            {business.faq.map((f) => (
              <details key={f.q} className="card group p-5 open:shadow-[0_0_0_2px_var(--color-sky)]" open>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-3 text-sky-2 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="about" className="grid scroll-mt-32 gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <Image src="/brand/about.webp" alt="Тоди живхний үйлдвэр" width={1400} height={997} sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full rounded-[30px]" />
          <div>
            <h2 className="display text-[30px]">Бидний тухай</h2>
            <div className="prose-bt mt-3 text-ink-2">
              {business.about.map((t) => (
                <p key={t.slice(0, 20)}>{t}</p>
              ))}
            </div>
            <ul className="mt-5 grid gap-2">
              {business.standards.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-[18px] bg-mint px-4 py-3">
                  <ShieldIcon size={20} className="shrink-0 text-leaf-2" />
                  <span>
                    <b>{s.name}</b> · <span className="text-[14px] text-ink-2">{s.line}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32">
          <h2 className="display text-[30px]">Холбоо барих</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a href={`tel:${business.phone.tel}`} className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf text-white">
                <PhoneIcon size={20} />
              </span>
              <b className="display text-[20px]">{business.phone.display}</b>
            </a>
            <a href={`mailto:${business.email}`} className="card lift flex min-w-0 items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun text-ink">
                <MailIcon size={20} />
              </span>
              <b className="truncate text-[15px]">{business.email}</b>
            </a>
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky text-white">
                <FacebookIcon size={20} />
              </span>
              <b>Facebook</b>
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="card lift flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose text-white">
                <InstagramIcon size={20} />
              </span>
              <b>Instagram</b>
            </a>
            <div className="card flex items-start gap-3 p-5 sm:col-span-2 lg:col-span-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-3 text-sky-2">
                <PinIcon size={20} />
              </span>
              <span>
                <span className="block text-[13px] text-ink-2">Хаяг</span>
                <b>{business.address}</b>
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
