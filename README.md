# Beam trade · Тоди web store

Next.js 16 storefront that replaces the Zochil shop at beamtrade.mn (Beam trade LLC: Тоди diapers, Өд, Хатад, Flexa,
CUCU). «Cloud Nursery» design: sky blue, soft clouds, the logo's heart. 39 products from the Zochil shop, a size
finder by baby weight, per-diaper prices, bundle size choice, checkout with QPay (through erxes), city and countryside
delivery, eBarimt details.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real test order in erxes)
npm run export:erxes   # docs/erxes/beamtrade-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (server) and `src/data/lite.json` (cart, hearts, size finder), built from Zochil
  shop 28509. Photos in `public/images/p/`.
- Business rules (delivery fee 6,000₮, free above 40,000₮, 09:00 same-day cut-off, no Sunday delivery, QPay only,
  statuses): `src/content/business.ts`.
- Orders: `POST /api/orders` validates against catalog prices and stock, records the order in erxes (form → Sales
  card), then creates the QPay invoice in erxes. Env vars: `.env.example`.
- erxes admin work (payments, eBarimt, pipeline, import) and open questions: `docs/erxes/MANUAL-STEPS.md`.
