import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getCareerDetail } from "../api/client";
import type { CareerDetail } from "../types/api";
import { ResourceItem } from "../utils/resources";
import {
  IconCompass,
  IconCheckCircle,
  IconClipboard,
  IconBriefcase,
  IconBookOpen,
  IconCreditCard,
  IconLink,
  IconGraduationCap,
  IconAlertTriangle,
} from "../components/ui/Icons";

export default function CareerDetailPage() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation(['skills', 'soft_skills']);
  const [career, setCareer] = useState<CareerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    getCareerDetail(decodeURIComponent(name))
      .then(setCareer)
      .catch((e) =>
        setError(
          e.response?.data?.detail ?? e.message ?? "Gagal memuat detail",
        ),
      )
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-slate-500">Memuat detail karier…</p>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
          <IconAlertTriangle size={18} />
          <span>{error ?? "Karier tidak ditemukan"}</span>
        </div>
        <Link to="/careers" className="btn-secondary">
          ← Kembali ke Katalog
        </Link>
      </div>
    );
  }

  // Radar chart data (top 6 skills)
  const radarData = Object.entries(career.hard_skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([skill, level]) => ({
      skill: t(`skills:${skill}`),
      required: level,
      fullMark: 100,
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link to="/careers" className="hover:text-indigo-600 transition-colors">
          Katalog Karier
        </Link>
        <span>/</span>
        <span className="text-slate-700">{career.name}</span>
      </div>

      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {career.name}
            </h1>
            {career.source_basis?.primary_onet_occupation && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <IconClipboard size={14} className="text-slate-400" />
                O*NET: {career.source_basis.primary_onet_occupation}
              </div>
            )}
            {career.source_basis?.onet_code && (
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Code: {career.source_basis.onet_code}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link to="/discover" className="btn-primary whitespace-nowrap">
              <IconCompass size={16} />
              Cek Kecocokan
            </Link>
            <Link
              to={`/validate?target=${encodeURIComponent(career.name)}`}
              className="btn-outline whitespace-nowrap"
            >
              <IconCheckCircle size={16} />
              Validasi
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-card p-6">
          <h2 className="section-title">Kebutuhan Skill Utama</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart
              data={radarData}
              margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
              />
              <Radar
                name="Dibutuhkan"
                dataKey="required"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                dot={{ fill: "#6366f1", r: 3 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#1e293b",
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* All Hard Skills */}
        <div className="glass-card p-6">
          <h2 className="section-title">Semua Hard Skills</h2>
          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {Object.entries(career.hard_skills)
              .sort(([, a], [, b]) => b - a)
              .map(([skill, level]) => {
                const weight = career.skill_weights?.[skill] ?? 1.0;
                const badgeClass =
                  weight >= 2.5
                    ? "bg-red-100 text-red-700 border-red-200"
                    : weight >= 1.5
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200";
                return (
                  <div key={skill} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-36 flex-shrink-0">
                      {t(`skills:${skill}`)}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${level}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-6 text-right">
                      {level}
                    </span>
                    {weight > 1.0 && (
                      <span className={`badge border text-xs ${badgeClass}`}>
                        ×{weight}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Soft Skills */}
        {career.soft_skills.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="section-title">Soft Skills</h2>
            <div className="flex flex-wrap gap-2">
              {career.soft_skills.map((sk) => (
                <span key={sk} className="badge-info">
                  {t(`soft_skills:${sk}`)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Courses */}
        {career.related_courses.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="section-title flex items-center gap-2">
              <IconGraduationCap size={16} className="text-indigo-500" />
              Mata Kuliah Relevan
            </h2>
            <div className="flex flex-wrap gap-2">
              {career.related_courses.map((course) => (
                <span key={course} className="badge badge-standard">
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio */}
      {career.portfolio && career.portfolio.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="section-title flex items-center gap-2">
            <IconBriefcase size={16} className="text-indigo-500" />
            Saran Portofolio
          </h2>
          <ul className="space-y-2">
            {career.portfolio.map((item, i) => (
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Free Resources */}
        {career.resources?.free && career.resources.free.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="section-title flex items-center gap-2">
              <IconBookOpen size={16} className="text-indigo-500" />
              Sumber Belajar Gratis
            </h2>
            <ul className="space-y-2">
              {career.resources.free.map((r, i) => (
                <li key={i}>
                  <ResourceItem
                    resource={r}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Paid Resources */}
        {career.resources?.paid && career.resources.paid.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="section-title flex items-center gap-2">
              <IconCreditCard size={16} className="text-amber-500" />
              Sumber Belajar Berbayar
            </h2>
            <ul className="space-y-2">
              {career.resources.paid.map((r, i) => (
                <li key={i}>
                  <ResourceItem
                    resource={r}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* O*NET evidence */}
      {career.onet_evidence && (
        <div className="glass-card p-6">
          <h2 className="section-title flex items-center gap-2">
            <IconLink size={16} className="text-indigo-500" />
            Referensi O*NET
          </h2>
          {typeof career.onet_evidence === 'string' ? (
            <p className="text-sm text-slate-600">{career.onet_evidence}</p>
          ) : (
            <div className="space-y-4">
              {career.onet_evidence.top_work_styles && career.onet_evidence.top_work_styles.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Work Styles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.onet_evidence.top_work_styles.map((s, i) => (
                      <span key={i} className="badge-info text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {career.onet_evidence.top_interest_areas && career.onet_evidence.top_interest_areas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Interest Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.onet_evidence.top_interest_areas.map((s, i) => (
                      <span key={i} className="badge text-xs bg-violet-100 text-violet-700 border-violet-200">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {career.onet_evidence.representative_tasks && career.onet_evidence.representative_tasks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Representative Tasks</p>
                  <ul className="space-y-1.5">
                    {career.onet_evidence.representative_tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                        {task}
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
