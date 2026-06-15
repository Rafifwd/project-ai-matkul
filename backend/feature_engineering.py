"""
feature_engineering.py — NalarPath AI v0.3.0

Profile-level feature engineering module.

Creates a fixed-size feature vector from the user's profile by encoding:
  - 51 hard skill levels (0-100)
  - 16 soft skill flags (0/1)
  - 15 interest flags (0/1)

Total: 82 features.

The ML model learns to map profile characteristics directly to career labels,
which is far more discriminative than per-career match scores.
"""

from __future__ import annotations

from typing import Any, Dict, List


# ─────────────────────────────────────────────
# Canonical feature lists (alphabetically sorted, deterministic)
# ─────────────────────────────────────────────

# All hard skills across 10 careers in career_requirements_mvp.json
HARD_SKILL_FEATURES: List[str] = [
    "accounting",
    "budget_tracking",
    "budgeting",
    "business_understanding",
    "data_analysis",
    "data_cleaning",
    "data_structures",
    "data_visualization",
    "database",
    "design_systems",
    "documentation",
    "figma",
    "financial_analysis",
    "git",
    "layout_design",
    "linux",
    "log_analysis",
    "machine_learning",
    "market_analysis",
    "marketing_understanding",
    "model_evaluation",
    "networking",
    "operating_systems",
    "presentation",
    "process_modeling",
    "programming",
    "project_planning",
    "project_tools",
    "python",
    "report_writing",
    "reporting",
    "requirements_analysis",
    "research_methodology",
    "risk_analysis",
    "risk_management",
    "security_documentation",
    "security_fundamentals",
    "software_design",
    "software_testing",
    "spreadsheet",
    "sql",
    "stakeholder_analysis",
    "stakeholder_communication",
    "statistics",
    "survey_design",
    "systems_analysis",
    "team_coordination",
    "troubleshooting",
    "ui_implementation_awareness",
    "user_empathy",
    "visual_design",
]

SOFT_SKILL_FEATURES: List[str] = [
    "adaptability",
    "attention_to_detail",
    "cautiousness",
    "communication",
    "cooperation",
    "critical_thinking",
    "curiosity",
    "dependability",
    "innovation",
    "integrity",
    "intellectual_curiosity",
    "leadership",
    "originality",
    "perseverance",
    "stress_tolerance",
    "tolerance_for_ambiguity",
]

INTEREST_FEATURES: List[str] = [
    "accounting",
    "applied_arts_and_design",
    "artistic",
    "business_initiatives",
    "conventional",
    "engineering",
    "enterprising",
    "finance",
    "information_technology",
    "investigative",
    "management_administration",
    "marketing_advertising",
    "mathematics_statistics",
    "media",
    "visual_arts",
]

# Combined feature names — this is the canonical order for the ML model
PROFILE_FEATURE_NAMES: List[str] = (
    [f"hs_{s}" for s in HARD_SKILL_FEATURES]
    + [f"ss_{s}" for s in SOFT_SKILL_FEATURES]
    + [f"int_{s}" for s in INTEREST_FEATURES]
)

# Legacy alias for backward compatibility
FEATURE_NAMES = PROFILE_FEATURE_NAMES

# Human-readable Indonesian labels for XAI display
FEATURE_LABELS: Dict[str, str] = {}
_HARD_LABELS = {
    "statistics": "Statistika", "python": "Python", "sql": "SQL",
    "machine_learning": "Machine Learning", "data_visualization": "Visualisasi Data",
    "data_cleaning": "Pembersihan Data", "model_evaluation": "Evaluasi Model",
    "research_methodology": "Metodologi Riset", "spreadsheet": "Spreadsheet",
    "data_analysis": "Analisis Data", "presentation": "Presentasi",
    "programming": "Pemrograman", "git": "Git", "data_structures": "Struktur Data",
    "software_design": "Desain Software", "software_testing": "Testing Software",
    "database": "Database", "networking": "Jaringan", "linux": "Linux",
    "security_fundamentals": "Dasar Keamanan", "log_analysis": "Analisis Log",
    "security_documentation": "Dokumentasi Keamanan", "operating_systems": "Sistem Operasi",
    "troubleshooting": "Troubleshooting", "systems_analysis": "Analisis Sistem",
    "requirements_analysis": "Analisis Kebutuhan", "process_modeling": "Pemodelan Proses",
    "documentation": "Dokumentasi", "business_understanding": "Pemahaman Bisnis",
    "report_writing": "Penulisan Laporan", "project_planning": "Perencanaan Proyek",
    "risk_management": "Manajemen Risiko", "budgeting": "Penganggaran",
    "stakeholder_communication": "Komunikasi Pemangku Kepentingan",
    "project_tools": "Alat Proyek", "team_coordination": "Koordinasi Tim",
    "budget_tracking": "Pelacakan Anggaran", "survey_design": "Desain Survei",
    "market_analysis": "Analisis Pasar", "reporting": "Pelaporan",
    "marketing_understanding": "Pemahaman Pemasaran",
    "financial_analysis": "Analisis Keuangan", "accounting": "Akuntansi",
    "risk_analysis": "Analisis Risiko", "stakeholder_analysis": "Analisis Pemangku Kepentingan",
    "figma": "Figma", "visual_design": "Desain Visual", "layout_design": "Desain Layout",
    "user_empathy": "Empati Pengguna", "design_systems": "Sistem Desain",
    "ui_implementation_awareness": "Kesadaran Implementasi UI",
}
_SOFT_LABELS = {
    "attention_to_detail": "Perhatian Detail", "intellectual_curiosity": "Rasa Ingin Tahu",
    "innovation": "Inovasi", "tolerance_for_ambiguity": "Toleransi Ambiguitas",
    "critical_thinking": "Berpikir Kritis", "communication": "Komunikasi",
    "integrity": "Integritas", "dependability": "Dapat Diandalkan",
    "leadership": "Kepemimpinan", "cooperation": "Kerja Sama",
    "stress_tolerance": "Tahan Tekanan", "adaptability": "Adaptif",
    "curiosity": "Rasa Ingin Tahu", "cautiousness": "Kehati-hatian",
    "perseverance": "Ketekunan", "originality": "Orisinalitas",
}
_INTEREST_LABELS = {
    "mathematics_statistics": "Matematika & Statistika",
    "information_technology": "Teknologi Informasi",
    "investigative": "Investigatif", "conventional": "Terstruktur",
    "engineering": "Rekayasa", "management_administration": "Manajemen",
    "business_initiatives": "Inisiatif Bisnis", "enterprising": "Wirausaha",
    "marketing_advertising": "Pemasaran", "finance": "Keuangan",
    "accounting": "Akuntansi", "visual_arts": "Seni Visual",
    "applied_arts_and_design": "Desain Terapan", "media": "Media",
    "artistic": "Artistik",
}

for _s in HARD_SKILL_FEATURES:
    FEATURE_LABELS[f"hs_{_s}"] = _HARD_LABELS.get(_s, _s.replace("_", " ").title())
for _s in SOFT_SKILL_FEATURES:
    FEATURE_LABELS[f"ss_{_s}"] = _SOFT_LABELS.get(_s, _s.replace("_", " ").title())
for _s in INTEREST_FEATURES:
    FEATURE_LABELS[f"int_{_s}"] = _INTEREST_LABELS.get(_s, _s.replace("_", " ").title())


def extract_profile_features(user_profile: Dict[str, Any]) -> List[float]:
    """
    Extract a fixed-size feature vector from a user profile.

    Parameters
    ----------
    user_profile : dict
        User profile with ``skills`` (dict), ``soft_skills`` (list),
        ``interests`` (list).

    Returns
    -------
    list[float]
        Feature vector of length 82 in ``PROFILE_FEATURE_NAMES`` order.
    """
    user_skills = user_profile.get("skills", {})
    user_soft = set(user_profile.get("soft_skills", []))
    user_interests = set(user_profile.get("interests", []))

    features: List[float] = []

    # Hard skills: 0-100 level (0 if not present)
    for skill in HARD_SKILL_FEATURES:
        features.append(float(user_skills.get(skill, 0)))

    # Soft skills: binary 0/1
    for soft in SOFT_SKILL_FEATURES:
        features.append(1.0 if soft in user_soft else 0.0)

    # Interests: binary 0/1
    for interest in INTEREST_FEATURES:
        features.append(1.0 if interest in user_interests else 0.0)

    return features


def feature_vector_to_dict(features: List[float]) -> Dict[str, float]:
    """Convert a feature vector back to a named dict (for debugging / SHAP)."""
    return dict(zip(PROFILE_FEATURE_NAMES, features))
