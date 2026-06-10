# Dynamic content — setup (Postgres + Prisma + /admin)

Three sections are now driven by a Postgres database and editable from a
password-protected dashboard at **`/admin`**:

| Section | Powered by | Public API |
| --- | --- | --- |
| Globe payout pills | `Payout` table | `GET /api/payouts` |
| Live Rewards feed (recent settlements) | `Settlement` table | `GET /api/settlements` |
| Leaderboard ("This month's champions") | `LeaderboardEntry` table | `GET /api/leaderboard` |

The public sections **auto-refresh every 30 seconds** (polling) and fall back to
built-in sample data until the database is configured — so the site never breaks.

---

## ✅ Already set up on this machine

Everything below has been done for you locally:

- PostgreSQL 16 installed (Homebrew) and a project-local cluster created in `./.pgdata`.
- It runs on **port 5433** (so it doesn't clash with the other Postgres already on 5432).
- Database `capitalchain` created, schema pushed, and **seeded** (34 payouts, 8 settlements, 5 leaderboard rows).
- `.env` is filled in:
  - `DATABASE_URL="postgresql://oracle@localhost:5433/capitalchain?schema=public"`
  - **`ADMIN_PASSWORD="CapitalChain#Admin2026"`**  ← login at `/admin` with this

**Just run the app:**

```bash
npm run db:start   # start the local Postgres (after a reboot / if it's stopped)
npm run dev        # then open http://localhost:3000  and  /admin
```

Other helpers: `npm run db:stop`, `npm run db:status`, `npm run db:studio` (visual DB editor), `npm run db:seed` (reset to starter data).

> The rest of this file is the generic guide for setting it up on **another** machine / production.

---

## 1. Configure environment

Edit `.env` (already created from `.env.example`):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/capitalchain?schema=public"
ADMIN_PASSWORD="a-strong-password"   # protects /admin — change this
```

Use any Postgres: a local install, Docker (`docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`), or a hosted one (Neon, Supabase, Railway, RDS, …).

## 2. Create the tables

```bash
npx prisma db push        # creates the tables from prisma/schema.prisma
# (or, for migration history: npx prisma migrate dev --name init)
```

## 3. Seed the starter data

```bash
npm run db:seed           # loads the current payouts / settlements / leaderboard
```

## 4. Run

```bash
npm run dev
```

- Visit **`/admin`**, sign in with `ADMIN_PASSWORD`.
- Use the **Globe Payouts / Live Rewards / Leaderboard** tabs to add, edit (inline) and delete rows.
- Changes appear on the public site within ~30s (or on next page load).

Helpful: `npm run db:studio` opens Prisma Studio to browse/edit the DB directly.

## Notes

- Amounts are stored as **display strings** (e.g. `$867K`, `$2,140`) — type them exactly as they should appear.
- Settlement **time-ago** ("8m", "3h") is computed automatically from each row's `createdAt`.
- The admin session is a httpOnly cookie derived from `ADMIN_PASSWORD` (no raw password stored). Changing `ADMIN_PASSWORD` logs everyone out.
- For production, set `DATABASE_URL` and `ADMIN_PASSWORD` as real environment variables (don't commit `.env`).
