"""
synthetic_data_generator.py — NalarPath AI v0.3.0

Generates O*NET-informed synthetic training data for the ML classifier.
Labels are produced by running the rule-based engine on each synthetic
profile, so the ML learns to *replicate and improve* the rule engine.

Architecture: Profile-level features (82-dim) → career label.
Each profile produces ONE row with features encoding the user's skills,
soft skills, and interests directly.

Usage:
    python data/synthetic_data_generator.py
"""

from __future__ import annotations

import csv
import json
import os
import random
import sys
from pathlib import Path
from typing import Any, Dict, List

# Ensure backend root is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

import numpy as np

from feature_engineering import (
    HARD_SKILL_FEATURES,
    INTEREST_FEATURES,
    PROFILE_FEATURE_NAMES,
    SOFT_SKILL_FEATURES,
    extract_profile_features,
)
from reasoning_engine_mvp import discovery_mode, load_kb

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
MATCH_PROFILES_PER_CAREER = 150    # Strong-match profiles per career
PARTIAL_PROFILES_PER_CAREER = 80   # Partial-match profiles per career
WEAK_PROFILES_PER_CAREER = 40      # Weak-match (exploratory) profiles
NOISE_STD = 12                     # Gaussian noise sigma
RANDOM_SEED = 42
OUTPUT_PATH = Path(__file__).resolve().parent / "training_data.csv"

# Load the rich O*NET profiles for work-style-informed generation
_PROFILES_PATH = Path(__file__).resolve().parent / "career_profiles_filtered.json"
_ONET_PROFILES: Dict[str, Any] = {}
if _PROFILES_PATH.exists():
    with open(_PROFILES_PATH, "r", encoding="utf-8") as _f:
        _ONET_PROFILES = json.load(_f)

# Map from MVP career names → O*NET occupation names
_CAREER_TO_ONET = {
    "Data Scientist":         "Data Scientists",
    "Data Analyst":           "Business Intelligence Analysts",
    "Software Developer":     "Software Developers",
    "Cybersecurity Analyst":  "Information Security Analysts",
    "Systems Analyst":        "Computer Systems Analysts",
    "Business Analyst":       "Management Analysts",
    "Project Manager":        "Project Management Specialists",
    "Market Research Analyst":"Market Research Analysts and Marketing Specialists",
    "Financial Analyst":      "Financial Managers",
    "UI Designer":            "Graphic Designers",
}


def _get_onet_work_styles(career_name: str) -> List[Dict[str, Any]]:
    """Get structured work_styles from career_profiles_filtered.json."""
    onet_name = _CAREER_TO_ONET.get(career_name, "")
    if onet_name in _ONET_PROFILES:
        return _ONET_PROFILES[onet_name].get("required_skills", {}).get("work_styles", [])
    return []


# Map O*NET work-style normalized keys → our soft skill keys
_STYLE_TO_SOFT = {
    "attention_to_detail":    "attention_to_detail",
    "intellectual_curiosity": "intellectual_curiosity",
    "innovation":             "innovation",
    "dependability":          "dependability",
    "integrity":              "integrity",
    "leadership_orientation": "leadership",
    "cooperation":            "cooperation",
    "stress_tolerance":       "stress_tolerance",
    "adaptability":           "adaptability",
    "cautiousness":           "cautiousness",
    "perseverance":           "perseverance",
    "originality":            "originality",
    "achievement_orientation":"perseverance",
    "tolerance_for_ambiguity":"tolerance_for_ambiguity",
    "critical_thinking":      "critical_thinking",
    "initiative":             "innovation",
    "self_confidence":        "leadership",
    "self_control":           "stress_tolerance",
    "social_orientation":     "communication",
    "empathy":                "communication",
    "sincerity":              "integrity",
    "humility":               "cooperation",
    "optimism":               "adaptability",
}


def _get_dominant_soft_skills(career_name: str, career_data: Dict[str, Any]) -> List[str]:
    """
    Get soft skills that should dominate for this career,
    using rich O*NET profiles when available.
    """
    dominant = []

    # Try rich O*NET profiles first
    work_styles = _get_onet_work_styles(career_name)
    if work_styles:
        # Sort by importance, take top styles
        sorted_styles = sorted(work_styles, key=lambda x: x.get("importance", 0), reverse=True)
        for ws in sorted_styles:
            normalized = ws.get("normalized", "")
            importance = ws.get("importance", 0)
            soft_key = _STYLE_TO_SOFT.get(normalized)
            if soft_key and soft_key in SOFT_SKILL_FEATURES and importance >= 50:
                if soft_key not in dominant:
                    dominant.append(soft_key)

    # Also include the career's explicit soft_skills from KB
    for s in career_data.get("soft_skills", []):
        if s in SOFT_SKILL_FEATURES and s not in dominant:
            dominant.append(s)

    return dominant


def generate_match_profile(
    career_name: str,
    career_data: Dict[str, Any],
    rng: np.random.Generator,
) -> Dict[str, Any]:
    """
    Generate a user profile that is a plausible match for the given career.
    Skills are set to >=80% of requirement with Gaussian noise.
    """
    required_skills = career_data["hard_skills"]
    weights = career_data.get("skill_weights", {})

    skills = {}
    for skill, req_level in required_skills.items():
        w = weights.get(skill, 1.0)
        base = req_level * (0.8 + 0.2 * min(w / 3.0, 1.0))
        noisy = base + rng.normal(0, NOISE_STD)
        skills[skill] = int(np.clip(noisy, 10, 100))

    # Add 0-2 random "extra" skills at low levels (realistic noise)
    extra_count = int(rng.integers(0, 3))
    available_extras = [s for s in HARD_SKILL_FEATURES if s not in skills]
    if available_extras and extra_count > 0:
        extras = rng.choice(available_extras, size=min(extra_count, len(available_extras)), replace=False)
        for s in extras:
            skills[s] = int(rng.integers(10, 45))

    # Soft skills: pick career-dominant + maybe 1 random
    dominant_soft = _get_dominant_soft_skills(career_name, career_data)
    n_pick = min(len(dominant_soft), max(2, int(rng.integers(2, len(dominant_soft) + 1))))
    soft_skills = list(rng.choice(dominant_soft, size=n_pick, replace=False))

    if rng.random() > 0.6:
        random_soft = [s for s in SOFT_SKILL_FEATURES if s not in soft_skills]
        if random_soft:
            soft_skills.append(str(rng.choice(random_soft)))

    # Interests: pick from career's interests + maybe 1 random
    career_interests = career_data.get("interests", [])
    valid_interests = [i for i in career_interests if i in INTEREST_FEATURES]
    n_interest = min(len(valid_interests), max(1, int(rng.integers(1, len(valid_interests) + 1))))
    interests = list(rng.choice(valid_interests, size=n_interest, replace=False)) if valid_interests else []

    if rng.random() > 0.7:
        extras = [i for i in INTEREST_FEATURES if i not in interests]
        if extras:
            interests.append(str(rng.choice(extras)))

    return {
        "major": None,
        "semester": int(rng.integers(4, 9)),
        "skills": skills,
        "soft_skills": list(soft_skills),
        "interests": list(interests),
        "experiences": [],
        "preferences": {},
    }


def generate_partial_profile(
    career_name: str,
    career_data: Dict[str, Any],
    rng: np.random.Generator,
) -> Dict[str, Any]:
    """
    Generate a profile that partially matches — some skills present,
    some missing, lower levels. Creates more varied training data.
    """
    required_skills = career_data["hard_skills"]
    skill_list = list(required_skills.items())

    skills = {}
    # Only include 40-70% of required skills
    n_include = max(2, int(len(skill_list) * rng.uniform(0.4, 0.7)))
    included = rng.choice(len(skill_list), size=n_include, replace=False)

    for idx in included:
        skill, req_level = skill_list[idx]
        base = req_level * rng.uniform(0.4, 0.8)
        noisy = base + rng.normal(0, NOISE_STD * 1.5)
        skills[skill] = int(np.clip(noisy, 5, 90))

    # Add 1-3 random extra skills (creates cross-career noise)
    extra_count = int(rng.integers(1, 4))
    available_extras = [s for s in HARD_SKILL_FEATURES if s not in skills]
    if available_extras:
        extras = rng.choice(available_extras, size=min(extra_count, len(available_extras)), replace=False)
        for s in extras:
            skills[s] = int(rng.integers(15, 55))

    # Soft skills: mix of career-relevant and random
    dominant_soft = _get_dominant_soft_skills(career_name, career_data)
    n_dominant = int(rng.integers(0, min(3, len(dominant_soft) + 1)))
    soft_skills = list(rng.choice(dominant_soft, size=n_dominant, replace=False)) if n_dominant > 0 else []

    n_random = int(rng.integers(0, 3))
    random_soft = [s for s in SOFT_SKILL_FEATURES if s not in soft_skills]
    if random_soft and n_random > 0:
        soft_skills.extend(list(rng.choice(random_soft, size=min(n_random, len(random_soft)), replace=False)))

    # Interests: some career-relevant, some random
    career_interests = [i for i in career_data.get("interests", []) if i in INTEREST_FEATURES]
    n_career_int = int(rng.integers(0, min(2, len(career_interests) + 1)))
    interests = list(rng.choice(career_interests, size=n_career_int, replace=False)) if n_career_int > 0 else []

    if rng.random() > 0.5:
        random_int = [i for i in INTEREST_FEATURES if i not in interests]
        if random_int:
            interests.append(str(rng.choice(random_int)))

    return {
        "major": None,
        "semester": int(rng.integers(3, 10)),
        "skills": skills,
        "soft_skills": list(soft_skills),
        "interests": list(interests),
        "experiences": [],
        "preferences": {},
    }


def generate_weak_profile(
    career_name: str,
    career_data: Dict[str, Any],
    rng: np.random.Generator,
) -> Dict[str, Any]:
    """
    Generate a weak/exploratory profile — mostly random skills with
    very little overlap with the target career. This adds diversity.
    """
    skills = {}
    # Pick 3-6 random skills from the full list
    n_skills = int(rng.integers(3, 7))
    chosen = rng.choice(HARD_SKILL_FEATURES, size=n_skills, replace=False)
    for s in chosen:
        skills[s] = int(rng.integers(20, 70))

    # Random soft skills (1-4)
    n_soft = int(rng.integers(1, 5))
    soft_skills = list(rng.choice(SOFT_SKILL_FEATURES, size=n_soft, replace=False))

    # Random interests (0-3)
    n_int = int(rng.integers(0, 4))
    interests = list(rng.choice(INTEREST_FEATURES, size=n_int, replace=False)) if n_int > 0 else []

    return {
        "major": None,
        "semester": int(rng.integers(2, 12)),
        "skills": skills,
        "soft_skills": list(soft_skills),
        "interests": list(interests),
        "experiences": [],
        "preferences": {},
    }


def main():
    print("=" * 60)
    print("NalarPath AI -- Synthetic Data Generator v0.3.0")
    print("Architecture: Profile-level features (82-dim)")
    print("=" * 60)

    rng = np.random.default_rng(RANDOM_SEED)
    kb = load_kb()
    career_names = list(kb.keys())
    print(f"Loaded {len(career_names)} careers from KB")
    print(f"Feature dimensions: {len(PROFILE_FEATURE_NAMES)}")

    all_profiles: List[Dict[str, Any]] = []

    # ── Step 1: Generate profiles ──
    print("\n--- Step 1: Generating profiles ---")
    for idx, career_name in enumerate(career_names):
        career_data = kb[career_name]
        print(f"  [{idx+1}/{len(career_names)}] {career_name}: "
              f"{MATCH_PROFILES_PER_CAREER}m + {PARTIAL_PROFILES_PER_CAREER}p + "
              f"{WEAK_PROFILES_PER_CAREER}w")

        for _ in range(MATCH_PROFILES_PER_CAREER):
            all_profiles.append(generate_match_profile(career_name, career_data, rng))

        for _ in range(PARTIAL_PROFILES_PER_CAREER):
            all_profiles.append(generate_partial_profile(career_name, career_data, rng))

        for _ in range(WEAK_PROFILES_PER_CAREER):
            all_profiles.append(generate_weak_profile(career_name, career_data, rng))

    print(f"\n  Total profiles: {len(all_profiles)}")

    # ── Step 2: Extract features and label each profile ──
    print("\n--- Step 2: Extracting features + labeling ---")
    rows: List[Dict[str, Any]] = []

    for p_idx, profile in enumerate(all_profiles):
        if (p_idx + 1) % 500 == 0:
            print(f"  Processing profile {p_idx+1}/{len(all_profiles)}...")

        # Profile-level features (82-dim)
        features = extract_profile_features(profile)

        # Label = what the rule engine recommends as best career
        discovery_results = discovery_mode(profile, kb, top_n=1)
        best_career = discovery_results[0]["career"] if discovery_results else career_names[0]

        row = dict(zip(PROFILE_FEATURE_NAMES, features))
        row["career_label"] = best_career
        rows.append(row)

    # ── Step 3: De-duplicate ──
    unique_rows = []
    seen = set()
    for row in rows:
        key = tuple(round(row[f], 1) for f in PROFILE_FEATURE_NAMES) + (row["career_label"],)
        if key not in seen:
            seen.add(key)
            unique_rows.append(row)

    print(f"\n{'=' * 60}")
    print(f"Total raw:    {len(rows)}")
    print(f"After dedup:  {len(unique_rows)}")

    # ── Step 4: Write CSV ──
    fieldnames = PROFILE_FEATURE_NAMES + ["career_label"]
    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(unique_rows)

    print(f"Saved to: {OUTPUT_PATH}")
    print(f"{'=' * 60}")

    # ── Distribution summary ──
    from collections import Counter
    label_counts = Counter(r["career_label"] for r in unique_rows)
    print("\nLabel distribution:")
    for label, count in sorted(label_counts.items(), key=lambda x: -x[1]):
        print(f"  {label:30s} -> {count:5d} samples")

    print(f"\nFeature count: {len(PROFILE_FEATURE_NAMES)}")
    print(f"  Hard skills: {len(HARD_SKILL_FEATURES)}")
    print(f"  Soft skills: {len(SOFT_SKILL_FEATURES)}")
    print(f"  Interests:   {len(INTEREST_FEATURES)}")


if __name__ == "__main__":
    main()
