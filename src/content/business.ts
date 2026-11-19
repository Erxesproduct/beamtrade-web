import data from "@/data/catalog.json";

/**
 * Business facts from beamtrade.mn (Zochil shop 28509: shop settings, payment / delivery rules, delivery option, FAQ,
 * about page), read on 2026-11-19. Nothing here is invented; open points are in docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.delivery[0];

export const business = {
  name: "Beam trade",
  fullName: "Beam trade LLC",
  brand: "Тоди",
  domain: "beamtrade.mn",
  tagline: "Эх орондоо үйлдвэрлэгддэг хүүхдийн живх",
  description: "Тоди хүүхдийн живх, ээж нярайн хэрэглэл, Өд цаас салфетик, Хатад, Flexa эмэгтэй хэрэглэл. Улаанбаатарт маргааш нь, өглөө 9 цагаас өмнө захиалбал өдөртөө хүргэнэ.",
  phone: { display: "9191-9477", tel: "+97691919477" },
  email: shop.email,
  facebook: shop.facebook,
  instagram: shop.instagram,
  /** Office / warehouse address from the Zochil shop settings (no opening hours are given). */
  address: shop.address,
  /** About page: «Сүлд Шонхор» ХХК makes Тоди diapers in Mongolia since 2016. */
  about: shop.about,
  /** From the Тоди diaper description. */
  standards: [
    { name: "ISO 9001:2015", line: "Түүхий эдээс сав баглаа боодол хүртэл чанарын тогтолцоотой" },
    { name: "OEKO-TEX Standard 100", line: "Хорт бодис, харшил үүсгэгчгүй нь лабораторид батлагдсан" },
    { name: "FSC", line: "Түүхий эдийн гарал үүсэл шалгагдсан, байгальд ээлтэй" },
  ],
  /** Zochil payment rule: 100% up front; FAQ: no payment on delivery. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө. Захиалга өгсний дараа төлбөрийн хуудас нээгдэнэ." }],
  /** Zochil delivery option «Бүсчлэл»: 6,000₮, free above 40,000₮. Countryside is on in Zochil: handed to the car the customer names. */
  delivery: [
    { id: "city", name: "Улаанбаатар", note: "Хүргэлтийн бүсийн дотор хаяг дээр", fee: zone?.price ?? 6000, freeFrom: zone?.freeFrom ?? 40000 },
    { id: "countryside", name: "Орон нутаг", note: "Таны заасан унаанд тавьж өгнө. Унааны төлбөр энэ дүнд ороогүй.", fee: zone?.price ?? 6000, freeFrom: zone?.freeFrom ?? 40000 },
  ],
  /** Delivery zone limits, word for word from the shop's terms. */
  zones: [
    { dir: "Баруун", places: "Хуучин 22 товчоо, Тахилтын эцэс, Буман-Өлзий хороолол" },
    { dir: "Зүүн", places: "Хуучин Баянзүрхийн товчоо, Улиастай, Хужирбулан" },
    { dir: "Урд", places: "Яармаг, Нүхт, Нисэхийн эцэс" },
    { dir: "Хойд", places: "Зунжин, Бэлх плаза" },
  ],
  /** Same-day cut-off and the day off, from the Zochil delivery rule and FAQ. */
  schedule: { cutoffHour: 9, dayOff: 0 },
  rules: {
    payment: "Төлбөрөө 100% төлснөөр захиалга баталгаажна. Хүргэлтийн компаниар хүргэдэг тул жолооч төлбөр авах боломжгүй.",
    delivery: "Өнөөдөр захиалбал маргааш хүргэнэ. Өглөөний 9 цагаас өмнө захиалбал өдөртөө хүргэнэ. Ням гарагт хүргэлт гарахгүй.",
    cancel: "Сагсаа сайтар шалгаад захиалаарай: захиалга орсон тохиолдолд цуцлах боломжгүй.",
    countryside: "Орон нутгийн захиалгад хаанаас, ямар унаанд тавихыг дэлгэрэнгүй бичнэ үү.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
  faq: shop.faq,
  /**
   * The shop's promo line on the Тоди SOLO / DOUBLE diaper packs, word for word: «50,000-с дээш үнийн дүнд mystery box
   * бэлгэнд очно.» Read as: an order with one of those packs and goods above 50,000₮ gets the gift. The website only
   * shows it and writes it on the order; staff add the box (open question 3).
   */
  gift: { from: 50000, name: "Mystery box", rule: "50,000-с дээш үнийн дүнд mystery box бэлгэнд очно." },
} as const;

/** Does an order get the mystery box? Needs a gift-promo product and goods above the line. */
export const giftEarned = (subtotal: number, hasGiftItem: boolean) => hasGiftItem && subtotal > business.gift.from;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id) ?? business.delivery[0];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil: 6,000₮; 0₮ when the goods are above 40,000₮. */
export function deliveryFee(id: DeliveryId, subtotal: number): number {
  const d = deliveryOption(id);
  return d.freeFrom && subtotal > d.freeFrom ? 0 : d.fee;
}

/**
 * When an order placed at `now` arrives: same day before 09:00 (Ulaanbaatar time), otherwise the next day; never on
 * Sunday. Returns the delivery date in UB time and whether it is today.
 */
export function deliveryDay(now: Date) {
  const ub = new Date(now.getTime() + 8 * 3600_000); // Ulaanbaatar is UTC+8 all year
  const day = new Date(Date.UTC(ub.getUTCFullYear(), ub.getUTCMonth(), ub.getUTCDate()));
  if (ub.getUTCHours() >= business.schedule.cutoffHour || ub.getUTCDay() === business.schedule.dayOff) day.setUTCDate(day.getUTCDate() + 1);
  while (day.getUTCDay() === business.schedule.dayOff) day.setUTCDate(day.getUTCDate() + 1);
  const today = Date.UTC(ub.getUTCFullYear(), ub.getUTCMonth(), ub.getUTCDate());
  return { date: day, days: Math.round((day.getTime() - today) / 86400_000), beforeCutoff: ub.getUTCHours() < business.schedule.cutoffHour && ub.getUTCDay() !== business.schedule.dayOff, ubHour: ub.getUTCHours(), ubMinute: ub.getUTCMinutes() };
}
export const WEEKDAYS = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Хүлээгдэж байна", note: "Захиалга ирсэн, төлбөр хүлээгдэж байна" },
  { id: "confirmed", name: "Баталгаажсан", note: "100% төлбөр орсон" },
  { id: "packing", name: "Бэлтгэж байна", note: "Агуулахаас бэлтгэж байна" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "9 цагаас өмнө бол өдөртөө, үгүй бол маргааш (Ням гарагаас бусад)" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Хүлээн авсан" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй" },
] as const;
