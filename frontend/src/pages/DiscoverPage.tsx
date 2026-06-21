import { useState } from "react";
import { useTranslation } from "react-i18next";
import { analyzeCareer } from "../api/client";
import type {
  UserProfile,
  AnalyzeResponse,
  DiscoveryResult,
} from "../types/api";
import {
  SKILL_CATEGORIES,
  SOFT_SKILLS,
  INTERESTS,
  MAJORS,
  getScoreGradient,
} from "../constants/skills";
import HybridScoreBadge from "../components/ui/HybridScoreBadge";
import ShapChart from "../components/ui/ShapChart";
import SkillBar from "../components/ui/SkillBar";
import { ResourceItem } from "../utils/resources";
import {
  IconCompass,
  IconRefresh,
  IconBarChart,
  IconCheckCircle,
  IconTrendingUp,
  IconMicroscope,
  IconBookOpen,
  IconCreditCard,
  IconLightbulb,
  IconInfo,
  IconCpu,
  IconBrain,
  IconCode,
  IconShield,
  IconPieChart,
  IconPalette,
} from "../components/ui/Icons";

// STEPS are now dynamically translated inside the component
const CATEGORY_ICONS = [IconBrain, IconCode, IconShield, IconPieChart, IconPalette];

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

export default function DiscoverPage() {
  const { t } = useTranslation(['discover', 'skills', 'soft_skills', 'interests', 'majors', 'common']);
  const STEPS = [
    t('discover:step_academic'),
    t('discover:step_hardskills'),
    t('discover:step_softskills'),
    t('discover:step_pref'),
  ];
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(buildEmptyProfile());
  const [topN, setTopN] = useState(3);
  const [activeSkillCat, setActiveSkillCat] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeCareer(profile, topN);
      setResult(res);
      setStep(4);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('discover:error_default');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setProfile(buildEmptyProfile());
    setResult(null);
    setError(null);
    setExpandedCard(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
            <IconCompass size={20} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {t('discover:title')}
          </h1>
        </div>
        <p className="text-slate-500">
          {t('discover:subtitle')}
        </p>
      </div>

      {/* Stepper — only show during form */}
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

      {/* ── STEP 0: Info Akademik ── */}
      {step === 0 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">{t('discover:step_academic')}</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('discover:major_label')}</label>
              <div className="relative">
                <select
                  className="select-field"
                  value={profile.major ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, major: e.target.value || null }))
                  }
                >
                  <option value="">{t('discover:major_placeholder')}</option>
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {t(`majors:${m.toLowerCase().replace(/ /g, '_')}`)}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ▾
                </div>
              </div>
            </div>

            <div>
              <label className="label">{t('discover:semester_label')}</label>
              <input
                type="number"
                min={1}
                max={14}
                className="input-field"
                placeholder={t('discover:semester_placeholder')}
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

          <div>
            <label className="label">{t('discover:exp_label')}</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder={t('discover:exp_placeholder')}
              value={profile.experiences.join("\n")}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  experiences: e.target.value.split("\n").filter(Boolean),
                }))
              }
            />
          </div>

          <div>
            <label className="label">{t('discover:topn_label')}</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setTopN(n)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    topN === n
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Top {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn-primary" onClick={() => setStep(1)}>
              {t('discover:btn_next')}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Hard Skills ── */}
      {step === 1 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('discover:level_hardskills_title')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('discover:level_hardskills_desc')}
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

          {/* Skills sliders */}
          <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
            {SKILL_CATEGORIES[activeSkillCat].skills.map((sk) => {
              const val = profile.skills[sk.key] ?? 0;
              return (
                <div key={sk.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{t(`skills:${sk.key}`)}</span>
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
                    <span>{t('discover:skill_none')}</span>
                    <span>{t('discover:skill_expert')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill count summary */}
          <p className="text-xs text-slate-400">
            {t('discover:skill_filled', { count: Object.values(profile.skills).filter((v) => v > 0).length })}
          </p>

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              {t('discover:btn_prev')}
            </button>
            <button className="btn-primary" onClick={() => setStep(2)}>
              {t('discover:btn_next')}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Soft Skills & Interests ── */}
      {step === 2 && (
        <div className="glass-card p-6 space-y-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">
            {t('discover:softskills_title')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('discover:softskills_desc')}
          </p>

          {/* Soft Skills */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              {t('discover:softskills_label', { count: profile.soft_skills.length })}
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
                    {t(`soft_skills:${sk.key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              {t('discover:interests_label', { count: profile.interests.length })}
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
                    {t(`interests:${int.key}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              {t('discover:btn_prev')}
            </button>
            <button className="btn-primary" onClick={() => setStep(3)}>
              {t('discover:btn_next')}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && (
        <div className="glass-card p-6 space-y-6 animate-slide-up">
          <h2 className="text-lg font-semibold text-slate-900">{t('discover:summary_title')}</h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">{t('discover:summary_major')}</span>
              <p className="text-slate-800 font-medium">{profile.major ? t(`majors:${profile.major.toLowerCase().replace(/ /g, '_')}`) : "—"}</p>
            </div>
            <div>
              <span className="text-slate-400">{t('discover:summary_semester')}</span>
              <p className="text-slate-800 font-medium">{profile.semester ?? "—"}</p>
            </div>
            <div>
              <span className="text-slate-400">{t('discover:summary_hardskills')}</span>
              <p className="text-slate-800 font-medium">
                {t('discover:summary_hardskills_val', { count: Object.values(profile.skills).filter((v) => v > 0).length })}
              </p>
            </div>
            <div>
              <span className="text-slate-400">{t('discover:summary_softskills')}</span>
              <p className="text-slate-800 font-medium">
                {t('discover:summary_softskills_val', { count: profile.soft_skills.length })}
              </p>
            </div>
            <div>
              <span className="text-slate-400">{t('discover:summary_interests')}</span>
              <p className="text-slate-800 font-medium">
                {t('discover:summary_interests_val', { count: profile.interests.length })}
              </p>
            </div>
            <div>
              <span className="text-slate-400">{t('discover:summary_topn')}</span>
              <p className="text-slate-800 font-medium">{t('discover:summary_topn_val', { count: topN })}</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <span className="text-red-500 flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              {t('discover:btn_prev')}
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {t('discover:btn_analyzing')}
                </>
              ) : (
                <>
                  <IconCpu size={16} />
                  {t('discover:btn_analyze')}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {step === 4 && result && (
        <div className="space-y-6 animate-slide-up">
          {/* Header bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('discover:result_title', { count: result.results.length })}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {t('discover:result_engine')}: {result.engine_version}
                {result.model_info.available &&
                  result.model_info.cv_accuracy != null && (
                    <>
                      {" "}
                      · {t('discover:result_ml_acc')}:{" "}
                      {(result.model_info.cv_accuracy * 100).toFixed(1)}%
                    </>
                  )}
              </p>
            </div>
            <button className="btn-secondary" onClick={reset}>
              <IconRefresh size={14} />
              {t('discover:btn_reset')}
            </button>
          </div>

          {/* Ethical notice */}
          <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            <IconInfo size={14} className="flex-shrink-0 mt-0.5" />
            {result.ethical_notice}
          </div>

          {/* Result cards */}
          {result.results.map((r, i) => (
            <ResultCard
              key={r.career}
              result={r}
              rank={i + 1}
              expanded={expandedCard === i}
              onToggle={() => setExpandedCard(expandedCard === i ? null : i)}
              userSkills={profile.skills}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ResultCardProps {
  result: DiscoveryResult;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
  userSkills: Record<string, number>;
  t: any;
}

function ResultCard({
  result,
  rank,
  expanded,
  onToggle,
  userSkills,
  t,
}: ResultCardProps) {
  const grad = getScoreGradient(result.hybrid_score);
  const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];

  return (
    <div className="glass-card overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <button
        className="w-full p-5 text-left hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`text-2xl font-bold font-mono ${rankColors[rank - 1] ?? "text-slate-400"}`}
            >
              #{rank}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {result.career}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {result.confidence_message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Score display */}
            <div className="text-right">
              <div
                className={`text-3xl font-bold font-mono bg-gradient-to-r ${grad} bg-clip-text text-transparent`}
              >
                {result.hybrid_score.toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">/ 100</div>
            </div>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Progress bar preview */}
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700`}
            style={{ width: `${result.hybrid_score}%` }}
          />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-6 animate-fade-in">
          {/* Hybrid Score Badge */}
          <HybridScoreBadge
            ruleScore={result.rule_score}
            mlProbability={result.ml_probability}
            hybridScore={result.hybrid_score}
            engineMode={result.engine_mode}
          />

          {/* Score Breakdown */}
          {result.score_breakdown && (
            <div>
              <h4 className="section-title flex items-center gap-2">
                <IconBarChart size={16} className="text-indigo-500" />
                {t('discover:score_breakdown')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: t('discover:sb_hard'),
                    value: result.score_breakdown.hard_skill_score,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50 border-indigo-100",
                  },
                  {
                    label: t('discover:sb_soft'),
                    value: result.score_breakdown.soft_skill_score,
                    color: "text-violet-600",
                    bg: "bg-violet-50 border-violet-100",
                  },
                  {
                    label: t('discover:sb_interest'),
                    value: result.score_breakdown.interest_score,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 border-emerald-100",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`border rounded-xl p-3 text-center ${item.bg}`}
                  >
                    <div
                      className={`text-xl font-bold font-mono ${item.color}`}
                    >
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
          {result.narrative && (
            <div className="flex items-start gap-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <IconLightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                {result.narrative}
              </p>
            </div>
          )}

          {/* Why Match */}
          {result.why_match.length > 0 && (
            <div>
              <h4 className="section-title flex items-center gap-2">
                <IconCheckCircle size={16} className="text-emerald-500" />
                {t('discover:why_match')}
              </h4>
              <div className="space-y-3">
                {result.why_match.map((item) => (
                  <SkillBar
                    key={item.skill}
                    label={t(`skills:${item.skill}`)}
                    current={userSkills[item.skill] ?? item.current}
                    required={item.required}
                    weight={item.weight}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {result.gaps.length > 0 && (
            <div>
              <h4 className="section-title flex items-center gap-2">
                <IconTrendingUp size={16} className="text-amber-500" />
                {t('discover:gaps')}
              </h4>
              <div className="space-y-3">
                {result.gaps.map((item) => (
                  <SkillBar
                    key={item.skill}
                    label={t(`skills:${item.skill}`)}
                    current={userSkills[item.skill] ?? item.current}
                    required={item.required}
                    weight={item.weight}
                    showGap
                  />
                ))}
              </div>
            </div>
          )}

          {/* SHAP */}
          {result.shap_explanation && (
            <div>
              <h4 className="section-title flex items-center gap-2">
                <IconMicroscope size={16} className="text-indigo-500" />
                {t('discover:xai')}
              </h4>
              <ShapChart shap={result.shap_explanation} />
            </div>
          )}

          {/* Resources */}
          {(result.free_resources.length > 0 ||
            result.paid_resources.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {result.free_resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <IconBookOpen size={14} className="text-indigo-500" />
                    {t('discover:free_resources')}
                  </h4>
                  <ul className="space-y-1.5">
                    {result.free_resources.map((r, i) => (
                      <li key={i} className="text-xs text-indigo-600">
                        <ResourceItem
                          resource={r}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.paid_resources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <IconCreditCard size={14} className="text-amber-500" />
                    {t('discover:paid_resources')}
                  </h4>
                  <ul className="space-y-1.5">
                    {result.paid_resources.map((r, i) => (
                      <li key={i}>
                        <ResourceItem
                          resource={r}
                          className="text-xs text-amber-600 hover:text-amber-700"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
