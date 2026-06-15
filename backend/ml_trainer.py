"""
ml_trainer.py — NalarPath AI v0.3.0

ML training pipeline using scikit-learn.
Trains RandomForestClassifier and GradientBoostingClassifier,
compares performance, and saves the best model.

Usage:
    python ml_trainer.py                # Train from CLI
    from ml_trainer import train_model  # Call from API
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler

# ─────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────
BACKEND_DIR  = Path(__file__).resolve().parent
DATA_PATH    = BACKEND_DIR / "data" / "training_data.csv"
MODELS_DIR   = BACKEND_DIR / "models"
MODEL_PATH   = MODELS_DIR / "career_classifier.pkl"
SCALER_PATH  = MODELS_DIR / "scaler.pkl"
ENCODER_PATH = MODELS_DIR / "label_encoder.pkl"
FEATURES_PATH = MODELS_DIR / "feature_names.json"
REPORT_PATH  = MODELS_DIR / "training_report.json"

# Feature names — read dynamically from CSV columns
# (all columns except 'career_label' are features)
FEATURE_NAMES = None  # Set during training from CSV


def train_model(
    data_path: Optional[Path] = None,
    models_dir: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Full training pipeline:
    1. Load training_data.csv
    2. Feature scaling (StandardScaler)
    3. Label encoding (LabelEncoder)
    4. Stratified K-Fold CV (k=5)
    5. Train RandomForestClassifier
    6. Train GradientBoostingClassifier
    7. Compare accuracy + F1 macro
    8. Save best model + scaler + encoder
    9. Generate training_report.json

    Returns
    -------
    dict
        Training report with metrics and model info.
    """
    global FEATURE_NAMES

    data_path = data_path or DATA_PATH
    models_dir = models_dir or MODELS_DIR
    models_dir.mkdir(parents=True, exist_ok=True)

    # ── 1. Load data ──
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"  Loaded {len(df)} samples, {df['career_label'].nunique()} classes")

    # Dynamically detect feature columns (everything except career_label)
    FEATURE_NAMES = [c for c in df.columns if c != "career_label"]
    print(f"  Features: {len(FEATURE_NAMES)} dimensions")

    X = df[FEATURE_NAMES].values
    y_raw = df["career_label"].values

    # ── 2. Feature scaling ──
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # ── 3. Label encoding ──
    encoder = LabelEncoder()
    y = encoder.fit_transform(y_raw)
    class_names = list(encoder.classes_)
    print(f"  Classes: {class_names}")

    # ── 4. Stratified K-Fold setup ──
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # ── 5. Train RandomForest ──
    print("\nTraining RandomForestClassifier...")
    rf = RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42,
        min_samples_leaf=3,
        n_jobs=-1,
    )
    rf_cv_scores = cross_val_score(rf, X_scaled, y, cv=skf, scoring="accuracy")
    rf_cv_f1 = cross_val_score(rf, X_scaled, y, cv=skf, scoring="f1_macro")
    rf.fit(X_scaled, y)
    rf_train_pred = rf.predict(X_scaled)
    rf_train_acc = accuracy_score(y, rf_train_pred)
    rf_train_f1 = f1_score(y, rf_train_pred, average="macro")

    print(f"  RF CV Accuracy:  {rf_cv_scores.mean():.4f} ± {rf_cv_scores.std():.4f}")
    print(f"  RF CV F1-macro:  {rf_cv_f1.mean():.4f} ± {rf_cv_f1.std():.4f}")
    print(f"  RF Train Acc:    {rf_train_acc:.4f}")

    # ── 6. Train GradientBoosting ──
    print("\nTraining GradientBoostingClassifier...")
    gb = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        min_samples_leaf=5,
        random_state=42,
    )
    gb_cv_scores = cross_val_score(gb, X_scaled, y, cv=skf, scoring="accuracy")
    gb_cv_f1 = cross_val_score(gb, X_scaled, y, cv=skf, scoring="f1_macro")
    gb.fit(X_scaled, y)
    gb_train_pred = gb.predict(X_scaled)
    gb_train_acc = accuracy_score(y, gb_train_pred)
    gb_train_f1 = f1_score(y, gb_train_pred, average="macro")

    print(f"  GB CV Accuracy:  {gb_cv_scores.mean():.4f} ± {gb_cv_scores.std():.4f}")
    print(f"  GB CV F1-macro:  {gb_cv_f1.mean():.4f} ± {gb_cv_f1.std():.4f}")
    print(f"  GB Train Acc:    {gb_train_acc:.4f}")

    # ── 7. Compare and select best ──
    # Primary: CV F1-macro, Tiebreaker: CV accuracy
    rf_metric = (rf_cv_f1.mean(), rf_cv_scores.mean())
    gb_metric = (gb_cv_f1.mean(), gb_cv_scores.mean())

    if rf_metric >= gb_metric:
        best_model = rf
        best_name = "RandomForest"
        best_cv_acc = rf_cv_scores.mean()
        best_cv_acc_std = rf_cv_scores.std()
        best_cv_f1 = rf_cv_f1.mean()
        best_cv_f1_std = rf_cv_f1.std()
        best_train_pred = rf_train_pred
    else:
        best_model = gb
        best_name = "GradientBoosting"
        best_cv_acc = gb_cv_scores.mean()
        best_cv_acc_std = gb_cv_scores.std()
        best_cv_f1 = gb_cv_f1.mean()
        best_cv_f1_std = gb_cv_f1.std()
        best_train_pred = gb_train_pred

    print(f"\n{'='*50}")
    print(f"Best model: {best_name}")
    print(f"  CV Accuracy: {best_cv_acc:.4f} ± {best_cv_acc_std:.4f}")
    print(f"  CV F1-macro: {best_cv_f1:.4f} ± {best_cv_f1_std:.4f}")
    print(f"{'='*50}")

    # ── 8. Save artifacts ──
    model_path = models_dir / "career_classifier.pkl"
    scaler_path = models_dir / "scaler.pkl"
    encoder_path = models_dir / "label_encoder.pkl"
    features_path = models_dir / "feature_names.json"
    report_path = models_dir / "training_report.json"

    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(encoder, encoder_path)

    with open(features_path, "w", encoding="utf-8") as f:
        json.dump(FEATURE_NAMES, f, indent=2)

    # ── 9. Generate report ──
    conf_matrix = confusion_matrix(y, best_train_pred).tolist()
    class_report = classification_report(y, best_train_pred,
                                         target_names=class_names,
                                         output_dict=True)

    report = {
        "model_type": best_name,
        "training_date": datetime.now(timezone.utc).isoformat(),
        "sample_count": len(df),
        "class_count": len(class_names),
        "class_names": class_names,
        "cv_accuracy": round(best_cv_acc, 4),
        "cv_accuracy_std": round(best_cv_acc_std, 4),
        "cv_f1_macro": round(best_cv_f1, 4),
        "cv_f1_macro_std": round(best_cv_f1_std, 4),
        "train_accuracy": round(accuracy_score(y, best_train_pred), 4),
        "confusion_matrix": conf_matrix,
        "classification_report": class_report,
        "comparison": {
            "RandomForest": {
                "cv_accuracy": round(rf_cv_scores.mean(), 4),
                "cv_f1_macro": round(rf_cv_f1.mean(), 4),
            },
            "GradientBoosting": {
                "cv_accuracy": round(gb_cv_scores.mean(), 4),
                "cv_f1_macro": round(gb_cv_f1.mean(), 4),
            },
        },
        "feature_names": FEATURE_NAMES,
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\nSaved:")
    print(f"  Model:   {model_path}")
    print(f"  Scaler:  {scaler_path}")
    print(f"  Encoder: {encoder_path}")
    print(f"  Features:{features_path}")
    print(f"  Report:  {report_path}")

    return report


# ─────────────────────────────────────────────
# Model Loader (used by hybrid_engine)
# ─────────────────────────────────────────────
_loaded_model = None
_loaded_scaler = None
_loaded_encoder = None
_loaded_report = None


def load_trained_model(
    models_dir: Optional[Path] = None,
) -> Tuple[Any, StandardScaler, LabelEncoder, Dict]:
    """
    Load the trained model, scaler, encoder, and report.
    Caches in module-level variables for reuse.
    """
    global _loaded_model, _loaded_scaler, _loaded_encoder, _loaded_report

    if _loaded_model is not None:
        return _loaded_model, _loaded_scaler, _loaded_encoder, _loaded_report

    models_dir = models_dir or MODELS_DIR
    model_path = models_dir / "career_classifier.pkl"
    scaler_path = models_dir / "scaler.pkl"
    encoder_path = models_dir / "label_encoder.pkl"
    report_path = models_dir / "training_report.json"

    if not model_path.exists():
        raise FileNotFoundError(
            f"No trained model found at {model_path}. "
            "Run `python ml_trainer.py` first."
        )

    _loaded_model = joblib.load(model_path)
    _loaded_scaler = joblib.load(scaler_path)
    _loaded_encoder = joblib.load(encoder_path)

    with open(report_path, "r", encoding="utf-8") as f:
        _loaded_report = json.load(f)

    return _loaded_model, _loaded_scaler, _loaded_encoder, _loaded_report


def reset_loaded_model():
    """Force reload on next call to load_trained_model()."""
    global _loaded_model, _loaded_scaler, _loaded_encoder, _loaded_report
    _loaded_model = None
    _loaded_scaler = None
    _loaded_encoder = None
    _loaded_report = None


if __name__ == "__main__":
    report = train_model()
    print(f"\n Training complete!")
    print(f"   Best model: {report['model_type']}")
    print(f"   CV Accuracy: {report['cv_accuracy']}")
    print(f"   CV F1-macro: {report['cv_f1_macro']}")
