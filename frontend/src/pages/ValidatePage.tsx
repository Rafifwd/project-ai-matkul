import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { validateTargetCareer, getCareers } from "../api/client";
import type { UserProfile, ValidateResponse } from "../types/api";
import {
  SKILL_CATEGORIES,
  SOFT_SKILLS,
  INTERESTS,
  MAJORS,
  getSkillLabel,
  getScoreGradient,
} from "../constants/skills";
import HybridScoreBadge from "../components/ui/HybridScoreBadge";
import ShapChart from "../components/ui/ShapChart";
import SkillBar from "../components/ui/SkillBar";
import { ResourceItem } from "../utils/resources";
import {
  IconCheckCircle,
  IconRefresh,
  IconSearch,
  IconTarget,
  IconBarChart,
  IconLightbulb,
  IconTrendingUp,
  IconAlertTriangle,
  IconMicroscope,
  IconBookOpen,
  IconCreditCard,
  IconBriefcase,
  IconMap,
  IconInfo,
  IconBrain,
  IconCode,
  IconShield,
  IconPieChart,
  IconPalette,
} from "../components/ui/Icons";

function buildEmptyProfile(): UserProfile {
  return {
    major: null,
    semester: null,
    skills: {},
    soft_skills: [],
    interests: [],
    experiences: [],
    preferences: {},
  };
}

const STEPS = ["Pilih Karier", "Hard Skills", "Soft Skills & Minat", "Review"];
const CATEGORY_ICONS = [IconBrain, IconCode, IconShield, IconPieChart, IconPalette];

export default function ValidatePage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [targetCareer, setTargetCareer] = useState(
    searchParams.get("target") ?? "",
  );
  const [careerOptions, setCareerOptions] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(buildEmptyProfile());
  const [activeSkillCat, setActiveSkillCat] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValidateResponse | null>(null);

  useEffect(() => {
    getCareers()
      .then((careers) => setCareerOptions(careers.map((c) => c.name)))
      .catch(() => {});
  }, []);

  // If target was pre-set from URL, advance to step 1
  useEffect(() => {
    if (searchParams.get("target")) {
      setStep(1);
    }
  }, []);

  function setSkill(key: string, val: number) {
    setProfile((p) => ({ ...p, skills: { ...p.skills, [key]: val } }));
  }

  function toggleSoftSkill(key: string) {
    setProfile((p) => ({
      ...p,
      soft_skills: p.soft_skills.includes(key)
        ? p.soft_skills.filter((s) => s !== key)
        : [...p.soft_skills, key],
    }));
  }

  function toggleInterest(key: string) {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(key)
        ? p.interests.filter((i) => i !== key)
        : [...p.interests, key],
    }));
  }

  async function handleSubmit() {
    if (!targetCareer) {
      setError("Pilih target karier terlebih dahulu");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await validateTargetCareer(targetCareer, profile);
      setResult(res);
      setStep(4);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { detail?: string } };
        message?: string;
      };
      setError(
        err.response?.data?.detail ?? err.message ?? "Terjadi kesalahan",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setTargetCareer("");
    setProfile(buildEmptyProfile());
    setResult(null);
    setError(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <IconCheckCircle size={20} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Validasi Karier
          </h1>
        </div>
        <p className="text-slate-500">
          Punya target karier? Ukur kesiapanmu dan dapatkan roadmap belajar yang
          dipersonalisasi.
        </p>
      </div>

      {/* Stepper */}
      {step < 4 && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  i === step
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : i < step
                      ? "text-emerald-600 cursor-pointer hover:bg-slate-100"
                      : "text-slate-400 cursor-default"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === step
                      ? "bg-indigo-500 text-white"
                      : i < step
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {label}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-6 h-px ${i < step ? "bg-emerald-400" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 0: Pilih Karier ── */}
      {step === 0 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">
            Pilih Target Karier
          </h2>
          <p className="text-sm text-slate-500">
            Karier mana yang ingin kamu validasi kesiapannya?
          </p>

          <div>
            <label className="label">Target Karier</label>
            <div className="relative">
              <select
                className="select-field"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
              >
                <option value="">Pilih karier target…</option>
                {careerOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </div>
            </div>
          </div>

          {targetCareer && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-800">
              <IconTarget size={16} className="text-indigo-500 flex-shrink-0" />
              Target: <strong>{targetCareer}</strong>
            </div>
          )}

          <div>
            <label className="label">Jurusan (opsional)</label>
            <div className="relative">
              <select
                className="select-field"
                value={profile.major ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, major: e.target.value || null }))
                }
              >
                <option value="">Pilih jurusan…</option>
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Semester</label>
              <input
                type="number"
                min={1}
                max={14}
                className="input-field"
                placeholder="Contoh: 6"
                value={profile.semester ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    semester: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="btn-primary"
              onClick={() => setStep(1)}
              disabled={!targetCareer}
            >
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Hard Skills ── */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Level Hard Skills
            </h2>
            <span className="badge-info">{targetCareer}</span>
          </div>
          <p className="text-sm text-slate-500">
            Isi sesuai kemampuan sekarang. Sistem akan mengidentifikasi gap yang
            perlu ditutup.
          </p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat, i) => {
              const CatIcon = CATEGORY_ICONS[i];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSkillCat(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSkillCat === i
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <CatIcon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {SKILL_CATEGORIES[activeSkillCat].skills.map((sk) => {
              const val = profile.skills[sk.key] ?? 0;
              return (
                <div key={sk.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{sk.label}</span>
                    <span className="text-sm font-mono font-semibold text-indigo-600 w-8 text-right">
                      {val}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={val}
                    onChange={(e) => setSkill(sk.key, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Tidak bisa</span>
                    <span>Ahli</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              ← Kembali
            </button>
            <button className="btn-primary" onClick={() => setStep(2)}>
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Soft Skills & Interests ── */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">
            Soft Skills & Minat
          </h2>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Soft Skills ({profile.soft_skills.length} dipilih)
            </h3>
            <div className="flex flex-wrap gap-2">
              {SOFT_SKILLS.map((sk) => {
                const selected = profile.soft_skills.includes(sk.key);
                return (
                  <button
                    key={sk.key}
                    onClick={() => toggleSoftSkill(sk.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selected
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800"
                    }`}
                  >
                    {sk.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Minat ({profile.interests.length} dipilih)
            </h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((int) => {
                const selected = profile.interests.includes(int.key);
                return (
                  <button
                    key={int.key}
                    onClick={() => toggleInterest(int.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      selected
                        ? "bg-violet-100 text-violet-700 border border-violet-300 shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800"
                    }`}
                  >
                    {int.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              ← Kembali
            </button>
            <button className="btn-primary" onClick={() => setStep(3)}>
              Lanjut →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review ── */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">Siap Divalidasi</h2>

          <div className="flex items-center gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <IconTarget size={16} className="text-indigo-500 flex-shrink-0" />
            <p className="text-sm text-indigo-800">
              Target Karier:{" "}
              <strong className="text-indigo-900">{targetCareer}</strong>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Hard Skills Terisi</span>
              <p className="text-slate-800 font-medium">
                {Object.values(profile.skills).filter((v) => v > 0).length}{" "}
                skill
              </p>
            </div>
            <div>
              <span className="text-slate-400">Soft Skills</span>
              <p className="text-slate-800 font-medium">
                {profile.soft_skills.length} dipilih
              </p>
            </div>
            <div>
              <span className="text-slate-400">Minat</span>
              <p className="text-slate-800 font-medium">
                {profile.interests.length} dipilih
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <IconAlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              ← Kembali
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memvalidasi…
                </>
              ) : (
                <>
                  <IconSearch size={16} />
                  Validasi Sekarang
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {step === 4 && result && (
        <ValidationResult
          result={result}
          onReset={reset}
          userSkills={profile.skills}
        />
      )}
    </div>
  );
}

function ValidationResult({
  result,
  onReset,
  userSkills,
}: {
  result: ValidateResponse;
  onReset: () => void;
  userSkills: Record<string, number>;
}) {
  const r = result.result;
  const grad = getScoreGradient(r.hybrid_score);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Hasil Validasi: {r.target_career}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {r.confidence_message}
          </p>
        </div>
        <button className="btn-secondary" onClick={onReset}>
          <IconRefresh size={14} />
          Validasi Ulang
        </button>
      </div>

      {/* Score hero */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Big score */}
          <div className="text-center">
            <div
              className={`text-6xl font-black font-mono bg-gradient-to-r ${grad} bg-clip-text text-transparent`}
            >
              {r.hybrid_score.toFixed(0)}
            </div>
            <div className="text-sm text-slate-400">Hybrid Score / 100</div>
            <div className="mt-2 w-32 h-2 bg-slate-100 rounded-full overflow-hidden mx-auto">
              <div
                className={`h-full bg-gradient-to-r ${grad} rounded-full`}
                style={{ width: `${r.hybrid_score}%` }}
              />
            </div>
          </div>

          {/* Hybrid badge */}
          <div className="flex-1 w-full">
            <HybridScoreBadge
              ruleScore={r.rule_score}
              mlProbability={r.ml_probability}
              hybridScore={r.hybrid_score}
              engineMode={r.engine_mode}
            />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {r.score_breakdown && (
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <IconBarChart size={16} className="text-indigo-500" />
            Rincian Skor
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Hard Skills",
                value: r.score_breakdown.hard_skill_score,
                color: "text-indigo-600",
                bg: "bg-indigo-50 border-indigo-100",
              },
              {
                label: "Soft Skills",
                value: r.score_breakdown.soft_skill_score,
                color: "text-violet-600",
                bg: "bg-violet-50 border-violet-100",
              },
              {
                label: "Minat",
                value: r.score_breakdown.interest_score,
                color: "text-emerald-600",
                bg: "bg-emerald-50 border-emerald-100",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`border rounded-xl p-4 text-center ${item.bg}`}
              >
                <div className={`text-2xl font-bold font-mono ${item.color}`}>
                  {item.value.toFixed(0)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Narrative */}
      {r.narrative && (
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <IconLightbulb size={16} className="text-amber-500" />
            Insight AI
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {r.narrative}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fulfilled Strengths */}
        {r.fulfilled_strengths.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center gap-2">
              <IconCheckCircle size={16} className="text-emerald-500" />
              Kekuatan yang Terpenuhi
            </h3>
            <div className="space-y-3">
              {r.fulfilled_strengths.map((item) => (
                <SkillBar
                  key={item.skill}
                  label={getSkillLabel(item.skill)}
                  current={userSkills[item.skill] ?? item.current}
                  required={item.required}
                  weight={item.weight}
                />
              ))}
            </div>
          </div>
        )}

        {/* Critical Gaps */}
        {r.critical_gaps.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center gap-2">
              <IconAlertTriangle size={16} className="text-red-500" />
              Kesenjangan Kritis
            </h3>
            <div className="space-y-3">
              {r.critical_gaps.map((item) => (
                <SkillBar
                  key={item.skill}
                  label={getSkillLabel(item.skill)}
                  current={userSkills[item.skill] ?? item.current}
                  required={item.required}
                  weight={item.weight}
                  showGap
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Learning Roadmap Timeline */}
      {r.recommended_learning_order.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <IconMap size={16} className="text-indigo-500" />
            Roadmap Belajar yang Disarankan
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-slate-200" />
            <div className="space-y-4">
              {r.recommended_learning_order.map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Step dot */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 border-2 ${
                      i === 0
                        ? "bg-indigo-500 border-indigo-400 text-white"
                        : "bg-white border-slate-300 text-slate-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <p className="font-semibold text-slate-800 text-sm">
                      {getSkillLabel(step.skill)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {step.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio */}
      {r.portfolio.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <IconBriefcase size={16} className="text-indigo-500" />
            Saran Portofolio
          </h3>
          <ul className="space-y-2">
            {r.portfolio.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="text-indigo-500 mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SHAP */}
      {r.shap_explanation && (
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <IconMicroscope size={16} className="text-indigo-500" />
            Explainable AI (SHAP)
          </h3>
          <ShapChart shap={r.shap_explanation} />
        </div>
      )}

      {/* Resources */}
      {(r.free_resources.length > 0 || r.paid_resources.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-6">
          {r.free_resources.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="section-title flex items-center gap-2">
                <IconBookOpen size={16} className="text-indigo-500" />
                Sumber Belajar Gratis
              </h3>
              <ul className="space-y-2">
                {r.free_resources.map((res, i) => (
                  <li key={i}>
                    <ResourceItem
                      resource={res}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {r.paid_resources.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="section-title flex items-center gap-2">
                <IconCreditCard size={16} className="text-amber-500" />
                Kursus Berbayar
              </h3>
              <ul className="space-y-2">
                {r.paid_resources.map((res, i) => (
                  <li key={i}>
                    <ResourceItem
                      resource={res}
                      className="text-sm text-amber-600 hover:text-amber-700"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Ethical notice */}
      {r.ethical_notice && (
        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
          <IconInfo size={14} className="flex-shrink-0 mt-0.5" />
          {r.ethical_notice}
        </div>
      )}
    </div>
  );
}
