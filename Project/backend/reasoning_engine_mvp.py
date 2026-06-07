import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
KB_PATH = BASE_DIR / "data" / "career_requirements_mvp.json"


def load_kb(path=KB_PATH):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def score_career(career_data, user_profile):
    required = career_data["hard_skills"]
    total_weight = sum(required.values())
    matched_weight = 0
    positive = []
    gaps = []

    for skill, required_level in required.items():
        current_level = user_profile.get("skills", {}).get(skill, 0)
        contribution = min(current_level, required_level)
        matched_weight += contribution

        if current_level >= required_level:
            positive.append({
                "skill": skill,
                "current": current_level,
                "required": required_level
            })
        else:
            gaps.append({
                "skill": skill,
                "current": current_level,
                "required": required_level,
                "gap": required_level - current_level
            })

    score = round((matched_weight / total_weight) * 100, 2)
    gaps.sort(key=lambda item: item["gap"], reverse=True)

    return {
        "score": score,
        "positive": positive[:3],
        "gaps": gaps[:3]
    }


def confidence_message(score):
    if score < 40:
        return "Data profil belum cukup kuat untuk memberi rekomendasi tunggal. Lengkapi skill dan pengalaman terlebih dahulu."
    if score < 65:
        return "Confidence sedang. Sistem menyarankan eksplorasi beberapa karier, bukan memilih satu saja."
    return "Confidence cukup baik untuk rekomendasi awal."


def discovery_mode(user_profile, kb, top_n=3):
    results = []
    for career_name, career_data in kb.items():
        analysis = score_career(career_data, user_profile)
        results.append({
            "career": career_name,
            "score": analysis["score"],
            "confidence_message": confidence_message(analysis["score"]),
            "why_match": analysis["positive"],
            "gaps": analysis["gaps"],
            "free_resources": career_data["resources"]["free"],
            "paid_resources": career_data["resources"]["paid"]
        })

    results.sort(key=lambda item: item["score"], reverse=True)
    return results[:top_n]


def validation_mode(target_career, user_profile, kb):
    if target_career not in kb:
        raise ValueError(f"Career tidak ditemukan: {target_career}")

    career_data = kb[target_career]
    analysis = score_career(career_data, user_profile)

    learning_order = [
        {
            "skill": item["skill"],
            "reason": f"Gap {item['gap']} poin dari level minimal {item['required']}."
        }
        for item in analysis["gaps"]
    ]

    return {
        "target_career": target_career,
        "score": analysis["score"],
        "confidence_message": confidence_message(analysis["score"]),
        "fulfilled_strengths": analysis["positive"],
        "critical_gaps": analysis["gaps"],
        "recommended_learning_order": learning_order,
        "portfolio": career_data["portfolio"],
        "free_resources": career_data["resources"]["free"],
        "paid_resources": career_data["resources"]["paid"],
        "ethical_notice": "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. Jurusan hanya digunakan sebagai konteks awal roadmap."
    }


if __name__ == "__main__":
    kb = load_kb()

    sample_user = {
        "major": "Manajemen",
        "semester": 5,
        "skills": {
            "statistics": 80,
            "sql": 40,
            "spreadsheet": 75,
            "python": 55,
            "business_understanding": 70,
            "communication": 80,
            "user_research": 50,
            "programming": 45
        }
    }

    print("=== DISCOVERY MODE ===")
    for result in discovery_mode(sample_user, kb):
        print(json.dumps(result, indent=2, ensure_ascii=False))

    print("\n=== VALIDATION MODE: Data Analyst ===")
    print(json.dumps(
        validation_mode("Data Analyst", sample_user, kb),
        indent=2,
        ensure_ascii=False
    ))
