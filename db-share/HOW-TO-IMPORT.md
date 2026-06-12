# Capital Chain — database (for your co-partner)

This folder contains the full Capital Chain database (schema + all payout rows)
exported as a portable SQL file. Import it into any PostgreSQL.

**File:** `capitalchain-db.sql`

---

## Option 1 — Import into a LOCAL Postgres (Mac/Windows/Linux)

1. Install PostgreSQL (any recent version), then create the database:
   ```bash
   createdb capitalchain
   ```
2. Import this dump:
   ```bash
   psql -d capitalchain -f capitalchain-db.sql
   ```
3. In the project, set `.env`:
   ```bash
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/capitalchain?schema=public"
   ```
   (use your own Postgres user/password/port)
4. Generate the client and run:
   ```bash
   npx prisma generate
   npm run dev
   ```

## Option 2 — Import into a HOSTED Postgres (shared between both partners)

If you want **both partners to share one live database**, create a free Postgres
on **Supabase / Neon / Railway**, then import this file into it:

```bash
psql "postgresql://USER:PASS@HOST:5432/DBNAME" -f capitalchain-db.sql
```

Put that same hosted `DATABASE_URL` in **both** partners' `.env` files — now you
both read/write the same data.

---

## What's inside

- One table: **`Payout`** — each row is one payout (flag, country, traderName,
  amount, amountValue, accountSize, method, createdAt).
- It powers the globe pills, the Live Rewards feed, the leaderboard, and every
  payout certificate on the site.

## Notes

- This is a **snapshot/copy**. If you keep editing your local DB afterwards, those
  changes won't appear in your partner's copy — use **Option 2 (hosted)** if you
  need a truly shared, always-in-sync database.
- The dump uses `DROP ... IF EXISTS` then re-creates the table, so re-importing
  refreshes everything cleanly.
