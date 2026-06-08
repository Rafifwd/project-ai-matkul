"""
hybrid_engine.py — NalarPath AI v0.3.0

Combines Rule-Based Engine + ML Layer into a unified hybrid scoring system.
hybrid_score = alpha * rule_score + (1 - alpha) * ml_probability * 100

Architecture: ML uses profile-level features (82-dim) and predicts
career probabilities in a SINGLE inference pass.

Default alpha = 0.5 (configurable via HYBRID_ALPHA env variable).
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

from feature_engineering import PROFILE_FEATURE_NAMES, extract_profile_features
from ml_trainer import load_trained_model, reset_loaded_model
from reasoning_engine_mvp import analyze_career_full, load_kb
from xai_explainer import explain_prediction, is_explainer_loaded, load_explainer

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
HYBRID_ALPHA = float(os.environ.get("HYBRID_ALPHA", "0.5"))

# ─────────────────────────────────────────────
# Module state
# ─────────────────────────────────────────────
_model = None
_scaler = None
_encoder = None
_report = None
_ml_available = False


def init_ml_layer(models_dir: Optional[Path] = None) -> bool:
    """
    Load the trained ML model, scaler, encoder, and initialize SHAP.
    Returns True if ML is available, False otherwise (graceful fallback).
    """
    global _model, _scaler, _encoder, _report, _ml_available

    try:
        _model, _scaler, _encoder, _report = load_trained_model(models_dir)

        # Initialize SHAP explainer with a small background sample
        n_features = len(_scaler.mean_)
        background = np.zeros((1, n_features))
        load_explainer(_model, background)

        _ml_available = True
        logger.info("ML layer initialized successfully (model: %s)", _report.get("model_type"))
        return True

    except FileNotFoundError as e:
        logger.warning("ML layer not available: %s", e)
        _ml_available = False
        return False
    except Exception as e:
        logger.error("Failed to initialize ML layer: %s", e)
        _ml_available = False
        return False


def reload_ml_layer(models_dir: Optional[Path] = None) -> bool:
    """Force-reload the ML model (e.g. after retraining)."""
    global _ml_available
    reset_loaded_model()
    _ml_available = False
    return init_ml_layer(models_dir)


def get_model_info() -> Dict[str, Any]:
    """Return info about the currently loaded ML model."""
    if not _ml_available or _report is None:
        return {
            "available": False,
            "message": "Model ML belum dilatih. Jalankan training terlebih dahulu.",
        }

    return {
        "available": True,
        "model_type": _report.get("model_type", "Unknown"),
        "cv_accuracy": _report.get("cv_accuracy", 0.0),
        "cv_f1_macro": _report.get("cv_f1_macro", 0.0),
        "training_date": _report.get("training_date", "Unknown"),
        "sample_count": _report.get("sample_count", 0),
        "class_count": _report.get("class_count", 0),
        "class_names": _report.get("class_names", []),
        "feature_names": _report.get("feature_names", []),
    }


def _compute_ml_probabilities(
    user_profile: Dict[str, Any],
) -> Dict[str, float]:
    """
    Compute ML probabilities for ALL careers in a single inference pass.
    Returns dict of {career_name: probability}.
    """
    if not _ml_available:
        return {}

    features = extract_profile_features(user_profile)
    X = np.array(features).reshape(1, -1)
    X_scaled = _scaler.transform(X)

    proba = _model.predict_proba(X_scaled)[0]
    class_names = list(_encoder.classes_)

    return {name: float(prob) for name, prob in zip(class_names, proba)}


def _compute_shap_explanation(
    user_profile: Dict[str, Any],
    career_name: str,
    career_idx: int,
) -> Optional[Dict[str, Any]]:
    """Compute SHAP explanation for a specific career prediction."""
    if not is_explainer_loaded():
        return None

    try:
        features = extract_profile_features(user_profile)
        return explain_prediction(features, career_name, career_idx, _scaler)
    except Exception as e:
        logger.warning("SHAP explanation failed for %s: %s", career_name, e)
        return None


def hybrid_analyze_career(
    career_name: str,
    career_data: Dict[str, Any],
    user_profile: Dict[str, Any],
    ml_probs: Optional[Dict[str, float]] = None,
) -> Dict[str, Any]:
    """
    Run hybrid analysis for a single career:
    1. Rule-Based scoring
    2. ML probability (from pre-computed probabilities)
    3. SHAP explanation
    4. Hybrid score computation
    """
    # Step 1: Rule-Based analysis
    rule_result = analyze_career_full(career_name, career_data, user_profile)
    rule_score = rule_result["score"]

    # If ML not available, return rule-only result
    if not _ml_available or ml_probs is None:
        return {
            **rule_result,
            "rule_score": rule_score,
            "ml_probability": None,
            "hybrid_score": rule_score,
            "shap_explanation": None,
            "engine_mode": "rule-only",
        }

    # Step 2: ML probability (pre-computed)
    ml_prob = ml_probs.get(career_name, 0.0)

    # Step 3: SHAP explanation
    class_names = list(_encoder.classes_)
    career_idx = class_names.index(career_name) if career_name in class_names else 0
    shap_result = _compute_shap_explanation(user_profile, career_name, career_idx)

    # Step 4: Hybrid score
    hybrid_score = round(
        HYBRID_ALPHA * rule_score + (1 - HYBRID_ALPHA) * ml_prob * 100,
        2,
    )

    return {
        **rule_result,
        "rule_score": rule_score,
        "ml_probability": round(ml_prob, 4),
        "hybrid_score": hybrid_score,
        "shap_explanation": shap_result,
        "engine_mode": "hybrid",
    }


def hybrid_discovery_mode(
    user_profile: Dict[str, Any],
    kb: Dict[str, Any],
    top_n: int = 3,
) -> List[Dict[str, Any]]:
    """
    Discovery mode using hybrid scoring.
    ML probabilities are computed ONCE for all careers.
    Returns top_n careers sorted by hybrid_score.
    """
    # Single ML inference for all career probabilities
    ml_probs = _compute_ml_probabilities(user_profile)

    results = []
    for career_name, career_data in kb.items():
        analysis = hybrid_analyze_career(
            career_name, career_data, user_profile, ml_probs,
        )

        results.append({
            "career":             career_name,
            "rule_score":         analysis.get("rule_score", analysis.get("score", 0)),
            "ml_probability":     analysis.get("ml_probability"),
            "hybrid_score":       analysis.get("hybrid_score", analysis.get("score", 0)),
            "score":              analysis.get("hybrid_score", analysis.get("score", 0)),
            "score_breakdown":    analysis.get("score_breakdown", {}),
            "confidence_message": analysis.get("confidence_message", ""),
            "narrative":          analysis.get("narrative", ""),
            "shap_explanation":   analysis.get("shap_explanation"),
            "engine_mode":        analysis.get("engine_mode", "rule-only"),
            "why_match":          analysis.get("strengths", []),
            "strengths":          analysis.get("strengths", []),
            "gaps":               analysis.get("gaps", []),
            "free_resources":     career_data.get("resources", {}).get("free", []),
            "paid_resources":     career_data.get("resources", {}).get("paid", []),
        })

    results.sort(key=lambda x: x["hybrid_score"], reverse=True)
    return results[:top_n]


def hybrid_validation_mode(
    target_career: str,
    user_profile: Dict[str, Any],
    kb: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Validation mode using hybrid scoring for a specific target career.
    """
    if target_career not in kb:
        raise ValueError(f"Career tidak ditemukan: {target_career}")

    # Single ML inference
    ml_probs = _compute_ml_probabilities(user_profile)

    career_data = kb[target_career]
    analysis = hybrid_analyze_career(
        target_career, career_data, user_profile, ml_probs,
    )

    learning_order = [
        {
            "skill":  item["skill"],
            "reason": (
                f"Gap {item['gap']} poin dari level minimal {item['required']}. "
                f"Bobot prioritas skill ini: {item.get('weight', 1.0)}x."
            ),
        }
        for item in analysis.get("gaps", [])
    ]

    return {
        "target_career":              target_career,
        "rule_score":                 analysis.get("rule_score", analysis.get("score", 0)),
        "ml_probability":             analysis.get("ml_probability"),
        "hybrid_score":               analysis.get("hybrid_score", analysis.get("score", 0)),
        "score":                      analysis.get("hybrid_score", analysis.get("score", 0)),
        "score_breakdown":            analysis.get("score_breakdown", {}),
        "confidence_message":         analysis.get("confidence_message", ""),
        "narrative":                  analysis.get("narrative", ""),
        "shap_explanation":           analysis.get("shap_explanation"),
        "engine_mode":                analysis.get("engine_mode", "rule-only"),
        "fulfilled_strengths":        analysis.get("strengths", []),
        "critical_gaps":              analysis.get("gaps", []),
        "recommended_learning_order": learning_order,
        "portfolio":                  career_data.get("portfolio", []),
        "free_resources":             career_data.get("resources", {}).get("free", []),
        "paid_resources":             career_data.get("resources", {}).get("paid", []),
        "ethical_notice": (
            "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. "
            "Jurusan hanya digunakan sebagai konteks awal roadmap."
        ),
    }
