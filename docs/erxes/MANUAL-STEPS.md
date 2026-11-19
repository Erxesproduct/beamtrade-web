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
