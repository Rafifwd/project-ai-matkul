"""
NalarPath AI API — v0.3.0 (Hybrid Rule-Based + ML)

Endpoints:
    GET  /                       → App info
    GET  /api/health             → Health check
    GET  /api/careers            → Career catalog
    GET  /api/careers/{name}     → Career detail
    POST /api/analyze            → Discovery mode (hybrid)
    POST /api/validate           → Validation mode (hybrid)
    GET  /api/model/info         → ML model info
    POST /api/train              → Trigger retraining
    GET  /api/train/status       → Training job status
"""

from __future__ import annotations

import asyncio
import logging
import os
import threading
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from hybrid_engine import (
    get_model_info,
    hybrid_discovery_mode,
    hybrid_validation_mode,
    init_ml_layer,
    reload_ml_layer,
)
from reasoning_engine_mvp import load_kb

# ─────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# App
# ─────────────────────────────────────────────
app = FastAPI(
    title="NalarPath AI API",
    description="Career reasoning API with Hybrid Rule-Based + ML scoring.",
    version="0.3.0",
)

_raw_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173")
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────
kb = load_kb()

# Try to init ML layer (graceful if model not trained yet)
ml_ready = init_ml_layer()
if ml_ready:
    logger.info("✅ ML layer loaded successfully")
else:
    logger.warning("⚠️ ML layer not available — running in rule-only mode")


# ─────────────────────────────────────────────
# Training Job State
# ─────────────────────────────────────────────
_training_state: Dict[str, Any] = {
    "status": "idle",
    "job_id": None,
    "started_at": None,
    "completed_at": None,
    "error": None,
    "result": None,
}
_training_lock = threading.Lock()


def _run_training_job(job_id: str):
    """Background training job runner."""
    global _training_state

    try:
        # Import here to avoid circular imports at module level
        from data.synthetic_data_generator import main as generate_data
        from ml_trainer import train_model

        with _training_lock:
            _training_state["status"] = "generating_data"

        logger.info("[Job %s] Generating synthetic training data...", job_id)
        generate_data()

        with _training_lock:
            _training_state["status"] = "training"

        logger.info("[Job %s] Training ML model...", job_id)
        report = train_model()

        # Reload the model
        reload_ml_layer()

        with _training_lock:
            _training_state["status"] = "completed"
            _training_state["completed_at"] = datetime.now(timezone.utc).isoformat()
            _training_state["result"] = {
                "model_type": report.get("model_type"),
                "cv_accuracy": report.get("cv_accuracy"),
                "cv_f1_macro": report.get("cv_f1_macro"),
                "sample_count": report.get("sample_count"),
            }
            _training_state["error"] = None

        logger.info("[Job %s] Training completed: %s", job_id, report.get("model_type"))

    except Exception as e:
        logger.error("[Job %s] Training failed: %s", job_id, e)
        with _training_lock:
            _training_state["status"] = "failed"
            _training_state["completed_at"] = datetime.now(timezone.utc).isoformat()
            _training_state["error"] = str(e)


# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

def to_dict(model):
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


class UserProfile(BaseModel):
    major: Optional[str] = Field(
        default=None,
        description="Student major, used only as roadmap context.",
    )
    semester: Optional[int] = Field(default=None, ge=1, le=14)
    skills: Dict[str, int] = Field(
        default_factory=dict,
        description="Hard skill ratings on a 0-100 scale. Example: {'statistics': 80, 'sql': 50}",
    )
    soft_skills: List[str] = Field(
        default_factory=list,
        description=(
            "Optional. List of soft skill keys the user identifies with. "
            "If omitted, a neutral score (50) is used so no penalty is applied. "
            "Example: ['attention_to_detail', 'communication', 'critical_thinking']"
        ),
    )
    interests: List[str] = Field(
        default_factory=list,
        description=(
            "Optional. List of interest/domain keys the user aligns with. "
            "If omitted, a neutral score (50) is used. "
            "Example: ['mathematics_statistics', 'information_technology', 'investigative']"
        ),
    )
    experiences: List[str] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class AnalyzeRequest(BaseModel):
    profile: UserProfile
    top_n: int = Field(default=3, ge=1, le=10)
    lang: Literal["id", "en"] = "id"


class ValidateRequest(BaseModel):
    target_career: str
    profile: UserProfile
    lang: Literal["id", "en"] = "id"


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get("/")
def root():
    model_info = get_model_info()
    return {
        "app": "NalarPath AI API",
        "version": "0.3.0",
        "engine": "hybrid-rule-ml",
        "status": "running",
        "ml_available": model_info.get("available", False),
        "message": "Use /api/careers, /api/analyze, /api/validate, /api/model/info, or /api/train.",
        "changelog": {
            "0.3.0": [
                "Hybrid Rule-Based + ML scoring engine",
                "SHAP-based XAI explanations per prediction",
                "New fields: rule_score, ml_probability, hybrid_score, shap_explanation",
                "New endpoints: /api/model/info, /api/train, /api/train/status",
                "O*NET-informed synthetic data generation for ML training",
                "RandomForest + GradientBoosting model comparison",
            ],
            "0.2.0": [
                "Dynamic per-career skill weights in scoring",
                "Composite score: 70% hard skills + 20% soft skills + 10% interests",
                "score_breakdown field in all analysis responses",
                "Explainable AI narrative field in all analysis responses",
                "UserProfile extended with optional soft_skills and interests lists",
            ],
        },
    }


@app.get("/health")
def health_check():
    model_info = get_model_info()
    return {
        "status": "ok",
        "career_count": len(kb),
        "engine_version": "0.3.0-hybrid",
        "ml_available": model_info.get("available", False),
    }


@app.get("/careers")
def get_careers():
    careers = []
    for name, data in kb.items():
        careers.append({
            "name":            name,
            "source":          data.get("source_basis", {}).get("primary_onet_occupation"),
            "onet_code":       data.get("source_basis", {}).get("onet_code"),
            "hard_skills":     data.get("hard_skills", {}),
            "skill_weights":   data.get("skill_weights", {}),
            "soft_skills":     data.get("soft_skills", []),
            "interests":       data.get("interests", []),
            "related_courses": data.get("related_courses", []),
        })
    return {
        "count":   len(careers),
        "careers": careers,
    }


@app.get("/careers/{career_name}")
def get_career_detail(career_name: str):
    if career_name not in kb:
        raise HTTPException(status_code=404, detail=f"Career not found: {career_name}")
    return {
        "name": career_name,
        **kb[career_name],
    }


@app.post("/analyze")
def analyze_career(request: AnalyzeRequest):
    profile_dict = to_dict(request.profile)
    results = hybrid_discovery_mode(profile_dict, kb, top_n=request.top_n, lang=request.lang)

    model_info = get_model_info()

    return {
        "mode":            "discovery",
        "engine_version":  "0.3.0-hybrid",
        "profile":         profile_dict,
        "results":         results,
        "model_info": {
            "available":   model_info.get("available", False),
            "model_type":  model_info.get("model_type"),
            "cv_accuracy": model_info.get("cv_accuracy"),
        },
        "ethical_notice": (
            "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. "
            "Jurusan hanya digunakan sebagai konteks awal roadmap."
            if request.lang == "id" else
            "This recommendation does not limit opportunities based on major. "
            "The major is only used as initial roadmap context."
        ),
    }


@app.post("/validate")
def validate_target_career(request: ValidateRequest):
    profile_dict = to_dict(request.profile)
    try:
        result = hybrid_validation_mode(request.target_career, profile_dict, kb, lang=request.lang)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    model_info = get_model_info()

    return {
        "mode":    "validation",
        "profile": profile_dict,
        "result":  result,
        "model_info": {
            "available":   model_info.get("available", False),
            "model_type":  model_info.get("model_type"),
            "cv_accuracy": model_info.get("cv_accuracy"),
        },
    }


# ─────────────────────────────────────────────
# NEW Endpoints — v0.3.0
# ─────────────────────────────────────────────

@app.get("/model/info")
def model_info():
    """Return info about the currently active ML model."""
    info = get_model_info()
    return info


def _is_production() -> bool:
    """True when running inside Vercel (env vars set automatically by the platform)."""
    return bool(os.environ.get("VERCEL") or os.environ.get("VERCEL_ENV"))


@app.post("/train")
def trigger_training(lang: Literal["id", "en"] = "id"):
    """
    Trigger model retraining (async background job).
    Returns immediately with job ID and status.
    Only available in local development — blocked on Vercel.
    """
    if _is_production():
        raise HTTPException(
            status_code=403,
            detail=(
                "Training tidak tersedia di production. "
                "Jalankan 'python ml_trainer.py' secara lokal, lalu commit artefak model ke Git."
                if lang == "id" else
                "Training is not available in production. "
                "Run 'python ml_trainer.py' locally, then commit the model artifacts to Git."
            ),
        )

    global _training_state

    with _training_lock:
        if _training_state["status"] in ("generating_data", "training"):
            return {
                "status": "already_running",
                "job_id": _training_state["job_id"],
                "message": (
                    "Training sudah berjalan. Cek /api/train/status."
                    if lang == "id" else
                    "Training is already running. Check /api/train/status."
                ),
            }

        job_id = str(uuid.uuid4())[:8]
        _training_state = {
            "status": "started",
            "job_id": job_id,
            "started_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "error": None,
            "result": None,
        }

    # Start training in background thread
    thread = threading.Thread(
        target=_run_training_job,
        args=(job_id,),
        daemon=True,
    )
    thread.start()

    return {
        "status": "started",
        "job_id": job_id,
        "message": (
            "Training dimulai. Gunakan GET /api/train/status untuk memantau."
            if lang == "id" else
            "Training started. Use GET /api/train/status to monitor."
        ),
    }


@app.get("/train/status")
def training_status():
    """Check status of the current/last training job."""
    with _training_lock:
        return dict(_training_state)
