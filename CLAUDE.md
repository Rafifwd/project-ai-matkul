# CLAUDE.md — NalarPath AI

## Project Overview

**NalarPath AI** is a bilingual (Indonesian/English) web application for AI-powered career exploration. Users input their hard skills, soft skills, and interests to receive career recommendations from a **Hybrid Scoring Engine** that combines a rule-based knowledge base with a trained ML model (RandomForest or GradientBoosting). Recommendations are accompanied by SHAP-based narrative explanations.

The system operates in two modes: **Discovery** (suggest top-N careers from scratch) and **Validation** (score a user's fit for a specific target career). The backend gracefully degrades to rule-only mode if no ML model has been trained yet.

This is an **academic project** (Universitas Padjadjaran, Informatika). Treat it accordingly — no production hardening required, but code must be clean and consistent.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5, TypeScript 5.2, Tailwind CSS 3.4, React Router 6, Recharts 2, i18next 26 |
| Backend | Python 3.12 (Vercel minimum), FastAPI 0.110+, Uvicorn, Pydantic v1/v2 |
| ML | Scikit-Learn 1.4, SHAP 0.45, Pandas 2.1, NumPy 1.26, Joblib 1.3 |
| Deployment | Vercel — 100% Vercel (frontend: Vite service, backend: Python serverless service) |
| API Client | Axios 1.7 (30 s timeout, `baseURL: VITE_API_URL \|\| ''`) |

---

## Repository Structure

```
project-ai-matkul/
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── api/client.ts   # All Axios calls — single source of truth
│   │   ├── types/api.ts    # Shared TypeScript interfaces
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, Footer
│   │   │   └── ui/         # Reusable: ScoreRing, SkillBar, ShapChart, HybridScoreBadge, Icons
│   │   ├── pages/          # One file per route (HomePage, CareersPage, CareerDetailPage, DiscoverPage, ValidatePage, ModelInfoPage)
│   │   ├── locales/        # en.json, id.json — all UI strings
│   │   └── i18n.ts         # i18next setup (fallback: 'id', detection: localStorage → navigator)
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── main.py             # FastAPI app, all endpoints, training job runner
│   ├── hybrid_engine.py    # Orchestrates rule + ML scoring
│   ├── reasoning_engine_mvp.py # Knowledge base (load_kb) + rule scoring
│   ├── ml_trainer.py       # Model training, evaluation, artifact saving
│   ├── feature_engineering.py  # Feature extraction from UserProfile
│   ├── xai_explainer.py    # SHAP-based narrative generation
│   ├── data/               # Synthetic data generator (O*NET-informed); training_data.csv gitignored
│   ├── models/             # Trained .pkl artifacts — COMMITTED to Git (deployed as static files)
│   ├── pyproject.toml      # Python version pin for Vercel (>=3.12)
│   ├── uv.lock             # Pinned dependency versions for reproducible builds
│   └── run_backend.ps1     # Windows PowerShell runner
├── vercel.json             # Vercel monorepo config
└── README.md
```

---

## Development Workflow

### Backend

```powershell
# From project root (Windows)
.\backend\run_backend.ps1

# Or manually (uv manages the venv):
cd backend
uv sync
.venv\Scripts\activate
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- Swagger UI: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### Frontend

```bash
cd frontend
npm install
npm run dev        # Dev server at http://localhost:5173
npm run build      # tsc && vite build (production bundle)
npm run preview    # Preview production build
```

### ML Model — Local Training Workflow

Model artifacts (`backend/models/*.pkl`) are **committed to Git** and deployed as static files.
Training is a **manual, local-only** process — it does NOT happen on Vercel.

```powershell
# From backend/ with venv active:
python ml_trainer.py                   # Retrain and save artifacts to backend/models/
# Then commit and push:
git add backend/models/
git commit -m "chore: retrain ML model"
git push
```

The `POST /api/train` endpoint remains in the codebase for local use but returns HTTP 403 in
production (Vercel sets `VERCEL`/`VERCEL_ENV` env vars which trigger the guard).

**Why this approach:** retraining is infrequent (knowledge base rarely changes), Vercel's
60-second function timeout makes on-demand training impossible, and committing artifacts keeps
deployment simple and free.

---

## Key Commands

| Command | Description |
|---|---|
| `.\backend\run_backend.ps1` | Start FastAPI dev server (Windows) |
| `npm run dev` | Start Vite frontend dev server |
| `npm run build` | Type-check + production build |
| `uv sync` | Install Python deps (creates `.venv/` automatically) |

---

## Coding Standards

### Frontend (TypeScript / React)

- **All components are functional** — no class components anywhere.
- **TypeScript strict mode** is enabled (`tsconfig.json`). All props and API responses must be typed via `src/types/api.ts`.
- **All API calls go through `src/api/client.ts`** — never call `axios` directly from a component.
- **All UI strings use `useTranslation()`** — never hardcode Indonesian or English text in JSX. Add keys to both `locales/en.json` and `locales/id.json`.
- **`lang` parameter is passed automatically** — `client.ts` reads `i18n.language` and appends it to `POST /api/analyze` and `POST /api/validate` payloads.
- **Career names in URLs must be `encodeURIComponent`-encoded** (e.g., `/careers/Data%20Scientist`). Always use `encodeURIComponent` when building routes and `decodeURIComponent` when reading `:name` params.
- **Tailwind CSS** for all styling — no inline styles or separate CSS modules.
- **Recharts** for all data visualisations — consistent with existing `ShapChart` and `ScoreRing`.

### Backend (Python / FastAPI)

- **Pydantic models in `main.py`** define all request/response schemas. Use `model.model_dump()` (Pydantic v2) with fallback to `model.dict()` via the `to_dict()` helper.
- **`load_kb()`** from `reasoning_engine_mvp.py` is the single source for the career knowledge base — do not replicate it.
- **Training runs in a background `threading.Thread`** — never block the event loop. State is tracked in `_training_state` dict guarded by `_training_lock`.
- **Module-level imports for ML are deferred** inside `_run_training_job` to avoid circular import issues.
- **All endpoints return plain dicts** — FastAPI serialises them. Do not use `JSONResponse` unless needed.
- **CORS reads `ALLOWED_ORIGINS` env var** (comma-separated). Defaults to `http://localhost:5173` for local dev. In production the frontend and backend share the same Vercel origin, so CORS is irrelevant.
- **Error handling**: raise `HTTPException` for 4xx errors. Let unhandled exceptions propagate as 500s (FastAPI default).

---

## Hard Constraints

**ALWAYS:**
- Add new UI strings to **both** `locales/en.json` and `locales/id.json` simultaneously.
- `encodeURIComponent` career names in route links; `decodeURIComponent` when reading URL params.
- Keep all backend Python modules runnable from the `backend/` directory (imports are relative to that CWD).
- Update `src/types/api.ts` when adding or changing API response fields.

**NEVER:**
- Add new Python packages without updating `backend/pyproject.toml` and re-running `uv lock`.
- Add new npm packages without a clear reason (existing stack covers most needs).
- Hardcode `http://127.0.0.1:8000` anywhere — use `VITE_API_URL` env var via `client.ts`.
- Delete or untrack the committed model artifacts in `backend/models/` — they are intentionally versioned.
- Manually edit generated or synthetic data files in `backend/data/`.
- Run `POST /api/train` in production — it is blocked by design (HTTP 403 on Vercel).

---

## Deployment Architecture

### Platform: 100% Vercel (decided — not to be revisited unless training frequency changes)

Both frontend and backend deploy to a **single Vercel project** using the `experimentalServices`
monorepo configuration in `vercel.json`.

| Service | Config | Routing |
|---|---|---|
| Frontend (Vite) | `entrypoint: frontend`, `routePrefix: /` | Catch-all for all non-API paths |
| Backend (FastAPI) | `entrypoint: backend/main.py`, `routePrefix: /api` | All `/api/*` requests |

**Routing behaviour**: Vercel routes `/api/*` to FastAPI before the frontend catch-all. FastAPI
receives the **full path** (e.g., `/api/health`), which matches routes defined as
`@app.get("/api/health")`. No path rewriting needed.

**Same-origin in production**: Frontend and backend share the same Vercel domain. `client.ts`
uses `baseURL: ''` so all Axios calls resolve relative to the page origin. CORS is only needed
for local dev (different ports).

### Vercel Dashboard Setup (one-time, manual)
1. Set **Framework Preset** to **Services**.
2. Set **Root Directory** to the repo root.
3. No env vars need to be set manually — `VERCEL`/`VERCEL_ENV` are injected automatically.
   Optional: set `HYBRID_ALPHA` to override the rule/ML weight ratio (default: 0.5).

### Python Version
Vercel supports Python **3.12** (default), 3.13, 3.14. Python 3.11 is not available on Vercel.
`backend/pyproject.toml` pins `requires-python = ">=3.12"`.

### If training frequency increases in the future
The current model commit workflow breaks down if the knowledge base changes frequently.
In that case, consider migrating the backend to Railway or Render (persistent process, no
timeout limit). The application code requires zero changes — only the deploy target changes.

---

## Testing Requirements

There is no automated test suite at this time. When verifying changes:

1. **Backend**: confirm `GET /api/health` returns `{"status": "ok"}` and `ml_available` reflects model state.
2. **Full flow**: submit a profile via the `/discover` page; confirm score breakdown, SHAP chart, and narrative render correctly.
3. **Bilingual**: toggle the language switcher and verify all strings switch; check the API's `lang` param is forwarded.
4. **Career detail**: navigate to `/careers/<URL-encoded-name>` — verify no 404 and data matches `/api/careers/{name}`.

---

## AI Agent Guidelines

- **Follow existing patterns first.** Before adding a new component, check `src/components/ui/` for reusable primitives (ScoreRing, SkillBar, ShapChart, HybridScoreBadge).
- **Minimal changes.** Do not refactor unrelated code. Scope changes to what the task requires.
- **No unnecessary dependencies.** The stack is intentionally lean.
- **Bilingual is not optional.** Every new user-facing string requires entries in both locale files.
- **Explain architectural tradeoffs** before introducing new patterns (e.g., state management library, new routing strategy).
- **Backend graceful degradation is by design.** Do not make ML availability a hard requirement for endpoints.
- **TypeScript types are the contract.** When the backend response shape changes, update `src/types/api.ts` before touching components.

---

## Important References

- @README.md — setup instructions and project overview
- @backend/main.py — all API endpoints and their signatures
- @frontend/src/types/api.ts — TypeScript interfaces for all API payloads
- @frontend/src/api/client.ts — Axios instance and all API call functions
- @frontend/src/i18n.ts — i18next initialisation and language detection
- @vercel.json — monorepo deployment routing configuration