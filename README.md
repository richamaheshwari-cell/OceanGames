# TheOceanGame (TOG Public)

Next.js + MUI public site. Connects to TOG Backend at `http://localhost:3000`.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env: set NEXT_PUBLIC_API_URL if backend runs elsewhere
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (or the port shown).

## Structure

- **`src/lib/api.ts`** — API base URL, `ENDPOINTS`, and `publicFetch` for the public API.
- **`src/components/Navbar.tsx`** — Fixed navbar: transparent at top, white when scrolled; links Home (logo), Casinos, Games, Bonus, Blog, News; search button opens sliding overlay (calls `GET /api/v1/public/search?q=...`).
- **`src/components/Footer.tsx`** — Footer with Quick Links, Information, Newsletter.
- **`src/components/ThemeRegistry.tsx`** — MUI theme + CssBaseline.
- **Pages** — `/`, `/casinos`, `/games`, `/bonus`, `/blog`, `/news` (placeholders).

## API

Backend base: `http://localhost:3000`. All public routes under `/api/v1/public`. See API doc for endpoints (settings, pages, casinos, games, blogs, news, bonuses, search, newsletter, etc.).
# OceanGames
