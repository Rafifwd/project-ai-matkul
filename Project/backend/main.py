from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from reasoning_engine_mvp import discovery_mode, load_kb, validation_mode


app = FastAPI(
    title="NalarPath AI API",
    description="Career reasoning API for undergraduate career path recommendations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

kb = load_kb()


def to_dict(model):
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


class UserProfile(BaseModel):
    major: Optional[str] = Field(default=None, description="Student major, used only as roadmap context.")
    semester: Optional[int] = Field(default=None, ge=1, le=14)
    skills: Dict[str, int] = Field(
        default_factory=dict,
        description="Skill ratings using 0-100 scale. Example: {'statistics': 80, 'sql': 50}",
    )
    experiences: List[str] = Field(default_factory=list)
    preferences: Dict[str, Any] = Field(default_factory=dict)


class AnalyzeRequest(BaseModel):
    profile: UserProfile
    top_n: int = Field(default=3, ge=1, le=10)


class ValidateRequest(BaseModel):
    target_career: str
    profile: UserProfile


@app.get("/")
def root():
    return {
        "app": "NalarPath AI API",
        "status": "running",
        "message": "Use /api/careers, /api/analyze, or /api/validate.",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "career_count": len(kb),
    }


@app.get("/api/careers")
def get_careers():
    careers = []
    for name, data in kb.items():
        careers.append({
            "name": name,
            "source": data.get("source_basis", {}).get("primary_onet_occupation"),
            "onet_code": data.get("source_basis", {}).get("onet_code"),
            "hard_skills": data.get("hard_skills", {}),
            "soft_skills": data.get("soft_skills", []),
            "related_courses": data.get("related_courses", []),
        })
    return {
        "count": len(careers),
        "careers": careers,
    }


@app.get("/api/careers/{career_name}")
def get_career_detail(career_name: str):
    if career_name not in kb:
        raise HTTPException(status_code=404, detail=f"Career not found: {career_name}")
    return {
        "name": career_name,
        **kb[career_name],
    }


@app.post("/api/analyze")
def analyze_career(request: AnalyzeRequest):
    profile_dict = to_dict(request.profile)
    results = discovery_mode(profile_dict, kb, top_n=request.top_n)
    return {
        "mode": "discovery",
        "profile": profile_dict,
        "results": results,
        "ethical_notice": "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. Jurusan hanya digunakan sebagai konteks awal roadmap.",
    }


@app.post("/api/validate")
def validate_target_career(request: ValidateRequest):
    profile_dict = to_dict(request.profile)
    try:
        result = validation_mode(request.target_career, profile_dict, kb)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return {
        "mode": "validation",
        "profile": profile_dict,
        "result": result,
    }
