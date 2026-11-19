import Link from "next/link";
import { Cloud } from "@/components/deco";

export default function NotFound() {
  return (
    <div className="wrap py-20 text-center">
      <div className="bob relative mx-auto grid h-[150px] w-[260px] place-items-center">
        <Cloud width={260} color="var(--color-sky-3)" className="absolute inset-0" />
        <span className="display relative mt-6 text-[52px] text-sky-2">404</span>
      </div>
      <h1 className="display mt-6 text-[36px] md:text-[52px]">Хуудас олдсонгүй</h1>
      <p className="mt-2 text-ink-2">Хаяг буруу эсвэл бараа шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-sky">
          Дэлгүүр
        </Link>
        <Link href="/" className="btn btn-white">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
