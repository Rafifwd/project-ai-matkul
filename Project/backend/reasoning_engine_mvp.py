import json
from pathlib import Path


# ─────────────────────────────────────────────
# Constants — tweak these to adjust the formula
# ─────────────────────────────────────────────
HARD_SKILL_WEIGHT = 0.70   # 70% contribution to composite score
SOFT_SKILL_WEIGHT = 0.20   # 20% contribution
INTEREST_WEIGHT   = 0.10   # 10% contribution
NEUTRAL_SCORE     = 50.0   # Score used when user provides no soft_skills / interests

BASE_DIR = Path(__file__).resolve().parent
KB_PATH  = BASE_DIR / "data" / "career_requirements_mvp.json"


# ─────────────────────────────────────────────
# Knowledge Base Loader
# ─────────────────────────────────────────────

def load_kb(path=KB_PATH):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ─────────────────────────────────────────────
# Scoring Functions
# ─────────────────────────────────────────────

def score_hard_skills(career_data: dict, user_profile: dict) -> dict:
    """
    Weighted hard-skill scoring.
    Formula:
        weighted_match = Σ min(user_skill, required_skill) × weight
        weighted_total = Σ required_skill × weight
        hard_score     = weighted_match / weighted_total × 100
    Falls back to uniform weight = 1.0 if 'skill_weights' is absent.
    """
    required   = career_data["hard_skills"]
    weights    = career_data.get("skill_weights", {})
    user_skills = user_profile.get("skills", {})

    weighted_total = 0.0
    weighted_match = 0.0
    strengths  = []
    gaps       = []

    for skill, required_level in required.items():
        w             = weights.get(skill, 1.0)
        current_level = user_skills.get(skill, 0)
        contribution  = min(current_level, required_level)

        weighted_total += required_level * w
        weighted_match += contribution   * w

        if current_level >= required_level:
            strengths.append({
                "skill":    skill,
                "current":  current_level,
                "required": required_level,
                "weight":   w,
            })
        else:
            gaps.append({
                "skill":    skill,
                "current":  current_level,
                "required": required_level,
                "gap":      required_level - current_level,
                "weight":   w,
            })

    score = round((weighted_match / weighted_total) * 100, 2) if weighted_total > 0 else 0.0

    # Sort by weighted gap impact (gap × weight) so the most impactful gaps surface first
    gaps.sort(key=lambda x: x["gap"] * x["weight"], reverse=True)
    strengths.sort(key=lambda x: x["weight"], reverse=True)

    return {
        "score":     score,
        "strengths": strengths[:3],
        "gaps":      gaps[:3],
        "all_gaps":  gaps,
    }


def score_soft_skills(career_data: dict, user_profile: dict) -> float:
    """
    Soft-skill match score (0–100).
    If the user provides no soft_skills list, returns NEUTRAL_SCORE.
    Uses soft_skill_weights for weighted intersection.
    """
    user_soft  = set(user_profile.get("soft_skills", []))
    career_soft = career_data.get("soft_skills", [])
    sw          = career_data.get("soft_skill_weights", {})

    if not user_soft:
        return NEUTRAL_SCORE

    total_weight   = sum(sw.get(s, 1.0) for s in career_soft)
    matched_weight = sum(sw.get(s, 1.0) for s in career_soft if s in user_soft)

    return round((matched_weight / total_weight) * 100, 2) if total_weight > 0 else 0.0


def score_interests(career_data: dict, user_profile: dict) -> float:
    """
    Interest alignment score (0–100).
    If the user provides no interests list, returns NEUTRAL_SCORE.
    All interests are treated with equal weight (simple intersection ratio).
    """
    user_interests   = set(user_profile.get("interests", []))
    career_interests = career_data.get("interests", [])

    if not user_interests:
        return NEUTRAL_SCORE

    if not career_interests:
        return NEUTRAL_SCORE

    matched = len(user_interests & set(career_interests))
    return round((matched / len(career_interests)) * 100, 2)


def composite_score(hard: float, soft: float, interest: float) -> float:
    """
    Weighted composite score from three dimensions.
    Default: 70% hard skills + 20% soft skills + 10% interests.
    """
    return round(
        HARD_SKILL_WEIGHT * hard +
        SOFT_SKILL_WEIGHT * soft +
        INTEREST_WEIGHT   * interest,
        2,
    )


# ─────────────────────────────────────────────
# Confidence Message
# ─────────────────────────────────────────────

def confidence_message(score: float) -> str:
    if score < 40:
        return (
            "Data profil belum cukup kuat untuk memberi rekomendasi tunggal. "
            "Lengkapi skill dan pengalaman terlebih dahulu."
        )
    if score < 65:
        return (
            "Confidence sedang. Sistem menyarankan eksplorasi beberapa karier, "
            "bukan memilih satu saja."
        )
    return "Confidence cukup baik untuk rekomendasi awal."


# ─────────────────────────────────────────────
# Explainable AI — Narrative Generator
# ─────────────────────────────────────────────

_SKILL_LABELS = {
    # Data & AI
    "statistics":           "Statistika",
    "python":               "Python",
    "data_cleaning":        "Pembersihan Data",
    "machine_learning":     "Machine Learning",
    "model_evaluation":     "Evaluasi Model",
    "data_visualization":   "Visualisasi Data",
    "research_methodology": "Metodologi Penelitian",
    "data_analysis":        "Analisis Data",
    # Software Engineering
    "programming":          "Pemrograman",
    "data_structures":      "Struktur Data & Algoritma",
    "software_design":      "Desain Perangkat Lunak",
    "database":             "Basis Data",
    "software_testing":     "Pengujian Perangkat Lunak",
    "git":                  "Git & Version Control",
    "requirements_analysis":"Analisis Kebutuhan",
    # Cybersecurity & Systems
    "networking":           "Jaringan Komputer",
    "security_fundamentals":"Dasar Keamanan",
    "operating_systems":    "Sistem Operasi",
    "linux":                "Linux",
    "risk_analysis":        "Analisis Risiko",
    "log_analysis":         "Analisis Log",
    "security_documentation":"Dokumentasi Keamanan",
    "systems_analysis":     "Analisis Sistem",
    "troubleshooting":      "Troubleshooting",
    # Business & Management
    "business_understanding":    "Pemahaman Bisnis",
    "process_modeling":          "Pemodelan Proses",
    "report_writing":            "Penulisan Laporan",
    "stakeholder_analysis":      "Analisis Stakeholder",
    "project_planning":          "Perencanaan Proyek",
    "stakeholder_communication": "Komunikasi Stakeholder",
    "risk_management":           "Manajemen Risiko",
    "budget_tracking":           "Pelacakan Anggaran",
    "team_coordination":         "Koordinasi Tim",
    "documentation":             "Dokumentasi Teknis",
    "project_tools":             "Alat Manajemen Proyek",
    "marketing_understanding":   "Pemahaman Pemasaran",
    "market_analysis":           "Analisis Pasar",
    "survey_design":             "Desain Survei",
    "financial_analysis":        "Analisis Keuangan",
    "accounting":                "Akuntansi",
    "budgeting":                 "Penganggaran",
    "presentation":              "Presentasi",
    # Design & UX
    "visual_design":             "Desain Visual",
    "layout_design":             "Desain Tata Letak",
    "figma":                     "Figma",
    "ui_implementation_awareness":"Kesadaran Implementasi UI",
    "design_systems":            "Sistem Desain",
    "user_empathy":              "Empati Pengguna",
    # Other
    "sql":                       "SQL",
    "spreadsheet":               "Spreadsheet",
    "reporting":                 "Pelaporan",
}

_SOFT_LABELS = {
    "attention_to_detail":    "perhatian terhadap detail",
    "intellectual_curiosity": "rasa ingin tahu intelektual",
    "innovation":             "inovasi",
    "tolerance_for_ambiguity":"toleransi terhadap ketidakpastian",
    "critical_thinking":      "berpikir kritis",
    "communication":          "komunikasi",
    "integrity":              "integritas",
    "dependability":          "keandalan",
    "leadership":             "kepemimpinan",
    "cooperation":            "kerja sama",
    "stress_tolerance":       "ketahanan terhadap tekanan",
    "adaptability":           "adaptabilitas",
    "curiosity":              "rasa ingin tahu",
    "cautiousness":           "kehati-hatian",
    "perseverance":           "ketekunan",
    "originality":            "orisinalitas",
}


def _label(skill: str) -> str:
    """Return human-readable Indonesian label for a skill key."""
    return _SKILL_LABELS.get(skill, skill.replace("_", " ").title())


def _soft_label(skill: str) -> str:
    return _SOFT_LABELS.get(skill, skill.replace("_", " "))


def generate_narrative(
    career_name: str,
    career_data: dict,
    user_profile: dict,
    hard_analysis: dict,
    soft_score: float,
    interest_score: float,
    final_score: float,
) -> str:
    """
    Generate an Indonesian-language explanatory narrative for a career match.
    """
    strengths = hard_analysis.get("strengths", [])
    gaps      = hard_analysis.get("all_gaps", [])
    user_soft = set(user_profile.get("soft_skills", []))

    # ── Opening sentence based on final score ──────────────────────────────────
    if final_score >= 65:
        opening = (
            f"Kamu menunjukkan fondasi yang kuat untuk menjadi seorang {career_name}."
        )
    elif final_score >= 40:
        opening = (
            f"Ada potensi yang bisa dikembangkan untuk karier {career_name}."
        )
    else:
        opening = (
            f"Karier {career_name} membutuhkan pengembangan lebih lanjut dari profilmu saat ini."
        )

    parts = [opening]

    # ── Strength highlights ────────────────────────────────────────────────────
    if strengths:
        top_str = [_label(s["skill"]) for s in strengths[:2]]
        if len(top_str) == 1:
            parts.append(
                f"Keahlianmu di bidang {top_str[0]} sudah memenuhi standar yang dibutuhkan."
            )
        else:
            parts.append(
                f"Keahlianmu di bidang {' dan '.join(top_str)} sudah memenuhi atau melampaui "
                f"standar yang dibutuhkan—ini menjadi modal penting."
            )

    # ── Critical gap highlights ────────────────────────────────────────────────
    if gaps:
        top_gap = [_label(g["skill"]) for g in gaps[:2]]
        if len(top_gap) == 1:
            parts.append(
                f"Area yang perlu diperkuat: {top_gap[0]} "
                f"(gap {gaps[0]['gap']} poin dari standar {gaps[0]['required']})."
            )
        else:
            parts.append(
                f"Prioritaskan pengembangan di: {' dan '.join(top_gap)} "
                f"untuk mempercepat kesiapanmu memasuki bidang ini."
            )

    # ── Soft skill comment ─────────────────────────────────────────────────────
    career_soft = set(career_data.get("soft_skills", []))
    if user_soft:
        matched_soft = user_soft & career_soft
        if matched_soft:
            examples = [_soft_label(s) for s in list(matched_soft)[:2]]
            parts.append(
                f"Karakter {' dan '.join(examples)} yang kamu miliki selaras dengan "
                f"apa yang dibutuhkan di posisi ini."
            )
        elif soft_score < 40:
            parts.append(
                "Soft skill yang kamu masukkan belum banyak beririsan dengan profil karier ini; "
                "pertimbangkan untuk mengembangkan karakter yang relevan."
            )

    # ── Interest comment ───────────────────────────────────────────────────────
    if interest_score == NEUTRAL_SCORE:
        pass  # user did not provide interests — stay silent
    elif interest_score >= 66:
        parts.append(
            "Minat dan ketertarikanmu sangat selaras dengan bidang kerja karier ini."
        )
    elif interest_score < 33:
        parts.append(
            "Minatmu belum banyak beririsan dengan area ini—pastikan ini memang jalur "
            "yang ingin kamu tekuni jangka panjang."
        )

    # ── Closing call-to-action ─────────────────────────────────────────────────
    if final_score >= 65:
        parts.append(
            "Lanjutkan dengan membangun portofolio konkret dan perkuat skill yang masih kurang."
        )
    elif final_score >= 40:
        parts.append(
            "Fokus pada gap terbesar terlebih dahulu, dan mulai eksplorasi proyek kecil "
            "di bidang ini untuk membangun pengalaman nyata."
        )
    else:
        parts.append(
            "Mulai dari dasar-dasarnya secara bertahap; ikuti learning path yang disarankan "
            "untuk membangun fondasi yang solid."
        )

    return " ".join(parts)


# ─────────────────────────────────────────────
# Mode Functions
# ─────────────────────────────────────────────

def analyze_career_full(career_name: str, career_data: dict, user_profile: dict) -> dict:
    """Run all scoring dimensions and return a full analysis dict."""
    hard    = score_hard_skills(career_data, user_profile)
    soft    = score_soft_skills(career_data, user_profile)
    intrest = score_interests(career_data, user_profile)
    final   = composite_score(hard["score"], soft, intrest)

    narrative = generate_narrative(
        career_name, career_data, user_profile,
        hard, soft, intrest, final,
    )

    return {
        "score":              final,
        "score_breakdown": {
            "hard_skill_score":  hard["score"],
            "soft_skill_score":  soft,
            "interest_score":    intrest,
        },
        "confidence_message": confidence_message(final),
        "narrative":          narrative,
        "strengths":          hard["strengths"],
        "gaps":               hard["gaps"],
    }


def discovery_mode(user_profile: dict, kb: dict, top_n: int = 3) -> list:
    results = []
    for career_name, career_data in kb.items():
        analysis = analyze_career_full(career_name, career_data, user_profile)
        results.append({
            "career":             career_name,
            "score":              analysis["score"],
            "score_breakdown":    analysis["score_breakdown"],
            "confidence_message": analysis["confidence_message"],
            "narrative":          analysis["narrative"],
            "why_match":          analysis["strengths"],
            "gaps":               analysis["gaps"],
            "free_resources":     career_data["resources"]["free"],
            "paid_resources":     career_data["resources"]["paid"],
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_n]


def validation_mode(target_career: str, user_profile: dict, kb: dict) -> dict:
    if target_career not in kb:
        raise ValueError(f"Career tidak ditemukan: {target_career}")

    career_data = kb[target_career]
    analysis    = analyze_career_full(target_career, career_data, user_profile)

    learning_order = [
        {
            "skill":  item["skill"],
            "reason": (
                f"Gap {item['gap']} poin dari level minimal {item['required']}. "
                f"Bobot prioritas skill ini: {item['weight']}x."
            ),
        }
        for item in analysis["gaps"]
    ]

    return {
        "target_career":              target_career,
        "score":                      analysis["score"],
        "score_breakdown":            analysis["score_breakdown"],
        "confidence_message":         analysis["confidence_message"],
        "narrative":                  analysis["narrative"],
        "fulfilled_strengths":        analysis["strengths"],
        "critical_gaps":              analysis["gaps"],
        "recommended_learning_order": learning_order,
        "portfolio":                  career_data["portfolio"],
        "free_resources":             career_data["resources"]["free"],
        "paid_resources":             career_data["resources"]["paid"],
        "ethical_notice": (
            "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. "
            "Jurusan hanya digunakan sebagai konteks awal roadmap."
        ),
    }


# ─────────────────────────────────────────────
# Manual Test Entry Point
# ─────────────────────────────────────────────

if __name__ == "__main__":
    kb = load_kb()

    # Sample user WITH soft_skills and interests provided
    sample_user = {
        "major":    "Manajemen",
        "semester": 5,
        "skills": {
            "statistics":           80,
            "sql":                  40,
            "spreadsheet":          75,
            "python":               55,
            "business_understanding": 70,
            "communication":        80,
            "user_research":        50,
            "programming":          45,
        },
        "soft_skills": ["attention_to_detail", "critical_thinking", "communication"],
        "interests":   ["mathematics_statistics", "information_technology", "investigative"],
        "experiences": ["Asisten Praktikum Statistika"],
        "preferences": {},
    }

    print("=== DISCOVERY MODE (top 3) ===")
    for result in discovery_mode(sample_user, kb):
        print(json.dumps(result, indent=2, ensure_ascii=False))

    print("\n=== VALIDATION MODE: Data Analyst ===")
    print(json.dumps(
        validation_mode("Data Analyst", sample_user, kb),
        indent=2,
        ensure_ascii=False,
    ))
