# Beam trade LLC: erxes manual steps

Owner of every step below: **Terbish**, with Beam trade for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → beamtrade-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for Beam trade yet ("erxes 3.0: NOT SET"). Create the workspace first.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 39 products (48 sellable rows with bundle sizes) imported from Zochil | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: 6,000₮, free above 40,000₮, 09:00 cut-off, city zones, countryside; status list | delivery products, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (31 checks, `npm run test:order`) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: beamtrade.mn (Zochil shop 28509), read 2026-11-19: **39 products**, MNT prices 3,000₮–149,900₮, one photo
each (pre-sized WebP on the website), 2 banners, logo, about photo.

- Groups (from the Zochil categories): diapers 9, mama & baby 5, bundles 4, women 8, wipes 7, paper 6.
- Brands: Тоди 19, Өд 10, Хатад 3, Flexa 5, CUCU 2 (Zochil brand field). The «Chef ramen» brand has 0 products.
- Diapers: size (NB, S, M, L, XL), baby weight and diapers per pack are read from the shop's own product text; the
  per-diaper price is price ÷ pieces (S 566₮, M 621₮, L 664₮, XL 713₮, NB 450₮; the same for SOLO and DOUBLE).
- Bundles whose text says «S,M,L,XL сонголтоор» (Бүрэн, Ээжийн, Нярайн багц) get 4 sellable rows `BT-<id>-s|m|l|xl`:
  same price, **one shared stock** (the website checks the sum).
- Stock: every product tracks stock on Zochil (17–167).
- The shop's promo line («50,000-с дээш үнийн дүнд mystery box бэлгэнд очно») is shown word for word on the products
  that carry it; the website does not add a gift by itself (open question 3).
- Old Zochil URLs (`/products/<category>/<id>`, category pages, `/about`, `/checkout`, …) redirect to the new pages.

Files (made by `npm run export:erxes` from `src/data/catalog.json`):

- `docs/erxes/beamtrade-categories.csv`: `BT` → `BT-DIAPERS`, `BT-MAMA`, `BT-BUNDLES`, `BT-WOMEN`, `BT-WIPES`,
  `BT-PAPER`, `BT-DELIVERY`.
- `docs/erxes/beamtrade-products.csv`: 48 rows, code `BT-<zochilId>` (bundles `BT-<id>-<size>`), name, category, unit
  price, brand, diaper size, baby weight, pieces, price per piece, Zochil stock, shared-stock codes, photo path.

Steps:

1. **Products & services → Categories**: import `beamtrade-categories.csv` (parents first; already ordered).
2. **Settings → Import & Export → Import → Products**: upload `beamtrade-products.csv`. Map `code → Code`,
   `name → Name`, `category code → Category code`, `unit price → Unit price`, `type → Type`. Keep the codes: website
   orders name every line with its `BT-…` code.
3. Brands: **Products & services → Brands** (or a product property «Брэнд») from the `brand` column.
4. **Inventories → Remainders**: enter real stock. For the bundle size rows decide whether erxes keeps one stock for
   the bundle (recommended: one product + a size note on the order) or one per size (open question 6).
5. Photos: upload from `public/images/p/` (path in the CSV) if erxes should show them too.

## 1.2 Payment (QPay)

Zochil payment rule: **100% up front**; the FAQ says the delivery company cannot take cash. On Zochil `has_qpay` is on
but the QPay2, Pocket and Sono methods all show `checkout_status: disabled` (open question 1). The website offers
**QPay only**, through erxes.

How the website uses erxes (erxes 3.0 source, `backend/plugins/payment_api`):

- `generateInvoiceUrl` (public) creates the invoice after the order is saved in erxes; the customer pays on the erxes
  payment page and returns to `/order/<reference>`. `invoicesCheck` (public) is asked every 5 s there.
- No order is sent to QPay unless it was first recorded in erxes (no money asked for an order staff cannot see).

Steps:

1. Get Beam trade's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil
   whether the current merchant can be used outside Zochil.
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`. If Pocket / Sono are added in erxes later, add
   their ids too: the erxes payment page then lets the customer choose.
4. **Not yet tested**: nothing has been run against a real QPay merchant. Do not call payments working until step 2
   and section 1.5 pass with authorized credentials.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff (or the POS) after payment.

1. Collect from Beam trade: company TIN (Zochil has no `regno`), district code, VAT status, product classification
   codes (diapers, hygiene paper products).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (check the card first) and send the lottery number by SMS / email.

## 1.4 Delivery zones, fees and order statuses

Website (done), from Zochil shop 28509:

| Option | Fee | Rule |
| --- | --- | --- |
| Улаанбаатар (Zochil «Бүсчлэл», id 1718) | 6,000₮, free when goods are above 40,000₮ | before 09:00 the same day, otherwise next day; no delivery on Sunday; district, khoroo 1–45, address |
| Орон нутаг | same 6,000₮ (open question 2); the car fare is paid by the customer | aimag + soum / address + which car / bus to hand it to |

- Zone limits (word for word from the shop): Баруун: Хуучин 22 товчоо, Тахилтын эцэс, Буман-Өлзий хороолол · Зүүн:
  Хуучин Баянзүрхийн товчоо, Улиастай, Хужирбулан · Урд: Яармаг, Нүхт, Нисэхийн эцэс · Хойд: Зунжин, Бэлх плаза.
  The website shows them; it cannot check an address against them, so staff confirm by phone.
- The header and checkout show «Одоо захиалбал: Өнөөдөр / Маргааш / Даваа гарагт хүргэнэ» from the cut-off rule in
  Ulaanbaatar time.
- Fees and rules live in `src/content/business.ts`; change them there and in the erxes delivery products.

erxes:

1. Import `docs/erxes/beamtrade-delivery.csv` (`BT-DELIVERY-1718` Улаанбаатар 6,000₮, `BT-DELIVERY-1718-AIMAG`).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website order page):
   Хүлээгдэж байна → Баталгаажсан → Бэлтгэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Хүлээгдэж байна» for every submission.
   Staff move it to «Баталгаажсан» when the erxes invoice shows paid.
