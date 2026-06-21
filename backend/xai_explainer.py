"""
xai_explainer.py — NalarPath AI v0.3.0

XAI (Explainable AI) layer using SHAP TreeExplainer.
Provides per-prediction explanations with Indonesian-language narratives.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import numpy as np

from feature_engineering import FEATURE_LABELS, FEATURE_NAMES

# Module-level cache
_explainer = None
_expected_value = None

NARRATIVES = {
    "id": {
        "shap_unloaded": "Model SHAP belum di-load. Jalankan training terlebih dahulu.",
        "shap_pos_contrib": "{label} ({feat_val:.1f}) berkontribusi +{shap_val:.1f}",
        "shap_pos_summary": "ML model menaikkan prediksi untuk {career_name} karena: {parts}.",
        "shap_neg_contrib": "{label} ({feat_val:.1f}) menurunkan {shap_val:.1f}",
        "shap_neg_summary": "Namun, model menurunkan skor karena: {parts}.",
        "shap_neutral": "Model ML memberikan prediksi netral untuk {career_name}."
    },
    "en": {
        "shap_unloaded": "SHAP model is not loaded. Please run training first.",
        "shap_pos_contrib": "{label} ({feat_val:.1f}) contributes +{shap_val:.1f}",
        "shap_pos_summary": "ML model increased prediction for {career_name} because: {parts}.",
        "shap_neg_contrib": "{label} ({feat_val:.1f}) decreases {shap_val:.1f}",
        "shap_neg_summary": "However, the model decreased the score because: {parts}.",
        "shap_neutral": "ML model gave a neutral prediction for {career_name}."
    }
}

def get_text(lang: str, key: str) -> str:
    return NARRATIVES.get(lang, {}).get(key) or NARRATIVES["id"][key]


def load_explainer(model: Any, X_train: np.ndarray) -> None:
    """
    Initialize the SHAP TreeExplainer.
    Should be called once at startup after model is loaded.

    Parameters
    ----------
    model : sklearn estimator
        The trained tree-based model (RandomForest or GradientBoosting).
    X_train : np.ndarray
        A representative sample of training data (scaled) for background.
        Can be a subsample (e.g., 100-200 rows) for speed.
    """
    global _explainer, _expected_value

    import shap
    _explainer = shap.TreeExplainer(model, X_train)
    _expected_value = _explainer.expected_value


def explain_prediction(
    feature_vector: List[float],
    career_name: str,
    career_idx: int,
    scaler: Any,
    lang: str = "id",
) -> Dict[str, Any]:
    """
    Generate SHAP explanation for a single prediction.

    Parameters
    ----------
    feature_vector : list[float]
        Raw (unscaled) 10-element feature vector.
    career_name : str
        Name of the career being explained.
    career_idx : int
        Index of the career class in the label encoder.
    scaler : StandardScaler
        The fitted scaler to transform features.

    Returns
    -------
    dict with keys:
        - top_positive_features: list of dicts
        - top_negative_features: list of dicts
        - shap_narrative: str (Indonesian)
        - raw_shap_values: dict mapping feature name → SHAP value
    """
    if _explainer is None:
        return {
            "top_positive_features": [],
            "top_negative_features": [],
            "shap_narrative": get_text(lang, "shap_unloaded"),
            "raw_shap_values": {},
        }

    # Scale the feature vector
    X = np.array(feature_vector).reshape(1, -1)
    X_scaled = scaler.transform(X)

    # Compute SHAP values
    shap_values = _explainer.shap_values(X_scaled)

    # shap_values shape depends on model type:
    # - RandomForest multiclass: list of arrays [n_classes][n_samples, n_features]
    #   OR ndarray [n_samples, n_features, n_classes]
    # - GradientBoosting: array [n_samples, n_features] for binary,
    #   list for multiclass
    try:
        if isinstance(shap_values, list):
            # Multi-class as list: pick the class we're interested in
            if career_idx < len(shap_values):
                sv = np.asarray(shap_values[career_idx]).flatten()
                # If flattened is just 1 element, it's wrong; try reshaping
                if len(sv) == 1:
                    sv = np.asarray(shap_values[career_idx])[0]
            else:
                sv = np.asarray(shap_values[0]).flatten()
        elif isinstance(shap_values, np.ndarray):
            if shap_values.ndim == 3:
                # Shape: [n_samples, n_features, n_classes]
                sv = shap_values[0, :, career_idx]
            elif shap_values.ndim == 2:
                sv = shap_values[0]
            else:
                sv = shap_values.flatten()
        else:
            sv = np.asarray(shap_values).flatten()

        # Ensure sv has the right length
        n_features = len(FEATURE_NAMES)
        if len(sv) != n_features:
            # Try to extract correctly from raw shape
            raw = np.asarray(shap_values)
            if raw.ndim == 3 and raw.shape[2] > career_idx:
                sv = raw[0, :, career_idx]
            elif raw.ndim == 3:
                sv = raw[0, :, 0]
            else:
                sv = np.zeros(n_features)
    except Exception:
        sv = np.zeros(len(FEATURE_NAMES))

    # Build feature → SHAP value mapping
    raw_shap = {}
    positive_features = []
    negative_features = []

    for i, fname in enumerate(FEATURE_NAMES):
        val = float(sv[i])
        raw_shap[fname] = round(val, 4)
        label = FEATURE_LABELS.get(fname, fname)

        entry = {
            "feature": fname,
            "shap_value": round(val, 2),
            "label": label,
            "feature_value": round(feature_vector[i], 2),
        }

        if val > 0.01:
            positive_features.append(entry)
        elif val < -0.01:
            negative_features.append(entry)

    # Sort by absolute magnitude
    positive_features.sort(key=lambda x: x["shap_value"], reverse=True)
    negative_features.sort(key=lambda x: x["shap_value"])

    # Keep top 3 each
    top_pos = positive_features[:3]
    top_neg = negative_features[:3]

    # Generate narrative
    narrative = format_shap_narrative(
        top_pos, top_neg, feature_vector, career_name, lang=lang
    )

    return {
        "top_positive_features": top_pos,
        "top_negative_features": top_neg,
        "shap_narrative": narrative,
        "raw_shap_values": raw_shap,
    }


def format_shap_narrative(
    top_positive: List[Dict],
    top_negative: List[Dict],
    feature_vector: List[float],
    career_name: str,
    lang: str = "id",
) -> str:
    """
    Generate an Indonesian-language SHAP narrative explaining why the
    ML model gave a certain prediction.
    """
    parts = []

    if top_positive:
        pos_parts = []
        for feat in top_positive[:2]:
            label = feat["label"]
            shap_val = feat["shap_value"]
            feat_val = feat["feature_value"]
            pos_parts.append(
                get_text(lang, "shap_pos_contrib").format(label=label, feat_val=feat_val, shap_val=shap_val)
            )
        parts.append(
            get_text(lang, "shap_pos_summary").format(career_name=career_name, parts="; ".join(pos_parts))
        )

    if top_negative:
        neg_parts = []
        for feat in top_negative[:2]:
            label = feat["label"]
            shap_val = feat["shap_value"]
            feat_val = feat["feature_value"]
            neg_parts.append(
                get_text(lang, "shap_neg_contrib").format(label=label, feat_val=feat_val, shap_val=shap_val)
            )
        parts.append(
            get_text(lang, "shap_neg_summary").format(parts="; ".join(neg_parts))
        )

    if not parts:
        parts.append(
            get_text(lang, "shap_neutral").format(career_name=career_name)
        )

    return " ".join(parts)


def is_explainer_loaded() -> bool:
    """Check if the SHAP explainer has been initialized."""
    return _explainer is not None
