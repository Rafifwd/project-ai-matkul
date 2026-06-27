# NalarPath AI - Career Reasoning System

An AI-powered web application for career reasoning and discovery using a Hybrid Rule-Based + Machine Learning scoring engine. Built with React + Vite (Frontend) and FastAPI + Scikit-Learn (Backend).

## Authors
- Muhammad Andri Firmansyah (140810240009)
- Dhaifan Ramadhani Juliawan (140810240015)
- Muhammad Rafif Widyadhana (140810240083)

## Features
- **Discovery Mode:** Suggests careers based on user profile (hard skills, soft skills, interests, and major).
- **Validation Mode:** Validates the user's fit for a specific target career.
- **Hybrid Scoring Engine:** Combines Rule-Based logic (dynamic per-career skill weights) and Machine Learning probability.
- **Explainable AI (SHAP):** Automatically generates narrative explanations for each prediction to explain why a career was recommended.
- **Dynamic Training:** Features endpoints to trigger synthetic data generation (O*NET-informed) and model retraining (RandomForest vs GradientBoosting).
- **Comprehensive Profiles:** Evaluates composite scores considering 70% hard skills, 20% soft skills, and 10% interests.

## Tech Stack
| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Recharts |
| Backend | Python 3.11+, FastAPI |
| Machine Learning | Scikit-Learn, SHAP, Pandas, NumPy, Joblib |

## AI Architecture
The underlying system uses a Hybrid approach:
- **Rule-Based Engine:** Uses predefined knowledge bases with dynamic weights for hard skills, soft skills, and interests.
- **Machine Learning Layer:** Trains models (RandomForest / GradientBoosting) on synthetic, O*NET-informed data to output prediction probabilities.
- **XAI Explainer:** Utilizes SHAP (SHapley Additive exPlanations) to interpret ML predictions and provide human-readable narratives.
- **Composite Score:** Integrates the rule score and ML probability to generate a final hybrid score for recommendations.

## Project Structure
```text
project-ai-matkul/
├── frontend/               # React 18 (Vite)
│   ├── src/                # UI components, pages, hooks
│   ├── package.json        # Dependencies & scripts
│   └── vite.config.ts      # Vite configuration
├── backend/                # FastAPI
│   ├── main.py             # API endpoints, app setup, background jobs
│   ├── hybrid_engine.py    # Hybrid discovery and validation logic
│   ├── ml_trainer.py       # ML model training and evaluation
│   ├── reasoning_engine_mvp.py # Rule-based knowledge base and scoring
│   ├── feature_engineering.py # Data preprocessing and feature extraction
│   ├── xai_explainer.py    # SHAP explanation generation
│   ├── data/               # Synthetic data generation logic
│   ├── models/             # Trained ML models (.pkl)
│   ├── pyproject.toml      # Python version pin and dependencies
│   └── uv.lock             # Pinned dependency versions
└── README.md               # This file
```

## Local Setup & Development

### Prerequisites
- **Frontend:** Node.js 18+
- **Backend:** Python 3.12+ (required by `pyproject.toml`), `uv` for dependency management

### Backend Setup
```bash
cd backend

# Install Dependencies (uv creates and manages .venv/ automatically)
uv sync

# Run Server (Available at http://localhost:8000)
uvicorn main:app --reload --port 8000
```
*Note: Make sure to check the available endpoints (`/api/health`, `/api/careers`, `/api/train`, etc.) via the FastAPI Swagger UI at `http://localhost:8000/docs`.*

### Frontend Setup
```bash
cd frontend
npm install

# Run Development Server (Available at http://localhost:5173)
npm run dev
```

## Disclaimer
**Academic Use Only.** This application is developed as an academic project and is designed to provide career exploration insights. It should not be used as the sole determinant for career decisions.