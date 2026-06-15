# NalarPath AI — Frontend Setup

## Prasyarat

- **Node.js** v18 atau lebih baru — unduh dari https://nodejs.org
- **Backend** berjalan di `http://127.0.0.1:8000`

## Cara Menjalankan

```bash
# 1. Masuk ke folder frontend
cd Project/frontend

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka browser di **http://localhost:5173**

## Cara Build untuk Produksi

```bash
npm run build
npm run preview   # preview hasil build
```

## Struktur Folder

```
frontend/
├── src/
│   ├── api/            # Axios client & API functions
│   ├── components/
│   │   ├── layout/     # Navbar, Footer
│   │   └── ui/         # ScoreRing, SkillBar, ShapChart, HybridScoreBadge
│   ├── constants/      # Skill categories, soft skills, interests, helpers
│   ├── pages/          # HomePage, CareersPage, CareerDetailPage, DiscoverPage, ValidatePage, ModelInfoPage
│   ├── types/          # TypeScript interfaces (api.ts)
│   ├── App.tsx         # Router setup
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind + custom styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Tech Stack

| Library | Versi | Fungsi |
| --- | --- | --- |
| React | 18 | UI Framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router DOM | 6 | Client-side routing |
| Axios | 1.7 | HTTP client |
| Recharts | 2.12 | Radar chart di halaman detail karier |

## Halaman

| Route | Deskripsi |
| --- | --- |
| `/` | Landing page |
| `/careers` | Katalog semua karier |
| `/careers/:name` | Detail karier (radar chart, skills, roadmap) |
| `/discover` | Discovery Mode — rekomendasi Top N |
| `/validate` | Validation Mode — validasi karier target |
| `/model` | Info model ML + live retraining demo |
