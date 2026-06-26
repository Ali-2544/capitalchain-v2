# CapitalChain — Website Color Scheme

Source of truth: CSS custom properties in `app/globals.css`. The site is **teal-on-dark by
default**, with a **light (teal-on-white)** theme applied via a `light` class on `<body>`.
Theme is toggled by adding/removing `body.light` (persisted in `localStorage` under `theme`).

Use these tokens to restyle the CRM so it matches the marketing site. Prefer wiring them as
CSS variables (same names) so both themes work; the values are listed for each mode.

---

## Brand accent (the identity color)

- **Teal** is the brand color. Dark mode uses a bright cyan-teal `#00E0E0`; light mode uses a
  slightly deeper, less-saturated teal `#02A8BC` so it stays legible on white.
- Buttons/CTAs use a teal **gradient** with dark "ink" text on top.

---

## Dark theme (default)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#050A14` | Page background (near-black navy) |
| `--bg-2` | `#081020` | Secondary background / panels |
| `--surface` | `rgba(13,24,44,.6)` | Card/surface (translucent, for glass blur) |
| `--surface-2` | `#0E1B30` | Solid surface |
| `--line` | `rgba(60,200,205,.13)` | Borders / dividers (faint teal) |
| `--line-2` | `rgba(60,200,205,.06)` | Even fainter border |
| `--text` | `#EAF3F4` | Primary text (off-white) |
| `--dim` | `#86A0AB` | Secondary / muted text |
| `--faint` | `#4A6068` | Tertiary / placeholder text |
| `--teal` | `#00E0E0` | Brand accent |
| `--teal-2` | `#5BF0F0` | Lighter accent (hover / highlights) |
| `--green` | `#00D2DC` | Secondary accent (success-ish, still teal family) |
| `--glow` | `rgba(0,224,224,.45)` | Glow / box-shadow color |
| `--soft` | `rgba(0,224,224,.12)` | Soft teal fill (chips, subtle bg) |
| `--grad` | `linear-gradient(120deg,#00E0E0,#10C8DE)` | Primary gradient (buttons, progress bar) |
| `--grad-text` | `linear-gradient(115deg,#22E8E8 10%,#8AF2F2 90%)` | Gradient text fill |
| `--btn-ink` | `#04181A` | Text/icon color on top of teal buttons (dark ink) |
| `--spot` | `rgba(0,224,224,.08)` | Cursor spotlight glow |
| `--mesh-1` | `rgba(0,224,224,.10)` | Background mesh gradient 1 |
| `--mesh-2` | `rgba(0,200,220,.07)` | Background mesh gradient 2 |
| `--footer-bg` | `rgba(7,13,26,.92)` | Footer background |

## Light theme (`body.light`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background (pure white) |
| `--bg-2` | `#FFFFFF` | Secondary background |
| `--surface` | `rgba(255,255,255,.72)` | Card/surface (translucent) |
| `--surface-2` | `#E4EEED` | Solid surface (pale teal-gray) |
| `--line` | `rgba(14,135,128,.16)` | Borders / dividers |
| `--line-2` | `rgba(14,135,128,.08)` | Fainter border |
| `--text` | `#08231F` | Primary text (near-black green) |
| `--dim` | `#42605B` | Secondary / muted text |
| `--faint` | `#86A39E` | Tertiary / placeholder text |
| `--teal` | `#02A8BC` | Brand accent (deeper for white bg) |
| `--teal-2` | `#00C8DA` | Lighter accent |
| `--green` | `#02A8BC` | Secondary accent |
| `--glow` | `rgba(0,200,216,.35)` | Glow / box-shadow color |
| `--soft` | `rgba(0,200,216,.1)` | Soft teal fill |
| `--grad` | `linear-gradient(120deg,#00E0E0,#00C2D6)` | Primary gradient |
| `--grad-text` | `linear-gradient(115deg,#02B2C8 10%,#018CAE 90%)` | Gradient text fill |
| `--btn-ink` | `#04181A` | Text on teal buttons |
| `--spot` | `rgba(0,200,216,.07)` | Cursor spotlight glow |
| `--mesh-1` | `transparent` | (No teal wash on white) |
| `--mesh-2` | `transparent` | (No teal wash on white) |
| `--footer-bg` | `rgba(228,238,237,.94)` | Footer background |

---

## Typography

| Token | Stack | Used for |
|---|---|---|
| `--fd` (display) | `Space Grotesk`, sans-serif | Headings / display |
| `--fb` (body) | `Hanken Grotesk`, sans-serif | Body text (default) |
| `--fm` (mono) | `JetBrains Mono`, ui-monospace, monospace | Eyebrows, labels, numeric/code-ish |

Base body: `font-size:17px; line-height:1.6;` font-smoothing antialiased.
Layout max width: `--w: 1380px`.

---

## Notes for porting to the CRM

- Drop these as `:root` variables, and put the light values under a `.light` (or
  `[data-theme="light"]`) selector — mirror whatever theming hook the CRM uses.
- Components should reference tokens (`var(--bg)`, `var(--text)`, `var(--teal)`, etc.),
  not raw hex, so both themes work automatically.
- For primary buttons: background `var(--grad)`, text color `var(--btn-ink)`,
  optional `box-shadow: 0 0 12px var(--glow)`.
- For accents/links/active states: `var(--teal)`, hover `var(--teal-2)`.
- For borders: `var(--line)`; cards: `var(--surface)` with `backdrop-filter: blur(...)`.
- Status colors weren't defined separately on the marketing site (it stays in the teal
  family). If the CRM needs success/warning/error, add them as new tokens rather than
  overloading `--green` (which here is just a teal variant, not a "success green").
