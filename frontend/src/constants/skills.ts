// ─── Hard Skills by Category ─────────────────────────────────────────────────

export const SKILL_CATEGORIES = [
  {
    id: 'data_ai',
    label: 'Data & AI',
    skills: [
      { key: 'statistics', label: 'Statistika' },
      { key: 'python', label: 'Python Programming' },
      { key: 'data_cleaning', label: 'Pembersihan Data' },
      { key: 'machine_learning', label: 'Machine Learning' },
      { key: 'model_evaluation', label: 'Evaluasi Model' },
      { key: 'data_visualization', label: 'Visualisasi Data' },
      { key: 'research_methodology', label: 'Metodologi Penelitian' },
      { key: 'data_analysis', label: 'Analisis Data' },
    ],
  },
  {
    id: 'software_engineering',
    label: 'Software Engineering',
    skills: [
      { key: 'programming', label: 'Pemrograman Dasar' },
      { key: 'data_structures', label: 'Struktur Data & Algoritma' },
      { key: 'software_design', label: 'Desain Perangkat Lunak' },
      { key: 'database', label: 'Administrasi Basis Data' },
      { key: 'software_testing', label: 'Pengujian Perangkat Lunak' },
      { key: 'git', label: 'Git & Version Control' },
      { key: 'requirements_analysis', label: 'Analisis Kebutuhan' },
    ],
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity & Systems',
    skills: [
      { key: 'networking', label: 'Jaringan Komputer' },
      { key: 'security_fundamentals', label: 'Dasar-Dasar Keamanan' },
      { key: 'operating_systems', label: 'Sistem Operasi' },
      { key: 'linux', label: 'Administrasi Linux' },
      { key: 'risk_analysis', label: 'Analisis Risiko' },
      { key: 'log_analysis', label: 'Analisis Log Keamanan' },
      { key: 'security_documentation', label: 'Dokumentasi Keamanan' },
      { key: 'systems_analysis', label: 'Analisis Sistem' },
      { key: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Management',
    skills: [
      { key: 'business_understanding', label: 'Pemahaman Bisnis' },
      { key: 'process_modeling', label: 'Pemodelan Proses Bisnis' },
      { key: 'report_writing', label: 'Penulisan Laporan Bisnis' },
      { key: 'stakeholder_analysis', label: 'Analisis Stakeholder' },
      { key: 'project_planning', label: 'Perencanaan Proyek' },
      { key: 'stakeholder_communication', label: 'Komunikasi Stakeholder' },
      { key: 'risk_management', label: 'Manajemen Risiko Proyek' },
      { key: 'budget_tracking', label: 'Pelacakan Anggaran' },
      { key: 'team_coordination', label: 'Koordinasi Tim' },
      { key: 'documentation', label: 'Dokumentasi Teknis' },
      { key: 'project_tools', label: 'Alat Manajemen Proyek' },
      { key: 'marketing_understanding', label: 'Pemahaman Pemasaran' },
      { key: 'market_analysis', label: 'Analisis Pasar' },
      { key: 'survey_design', label: 'Desain Survei' },
      { key: 'financial_analysis', label: 'Analisis Keuangan' },
      { key: 'accounting', label: 'Akuntansi' },
      { key: 'budgeting', label: 'Penganggaran Keuangan' },
      { key: 'presentation', label: 'Kemampuan Presentasi' },
      { key: 'sql', label: 'SQL' },
      { key: 'spreadsheet', label: 'Spreadsheet (Excel/GSheets)' },
      { key: 'reporting', label: 'Pelaporan Bisnis' },
    ],
  },
  {
    id: 'design_ux',
    label: 'Design & UX',
    skills: [
      { key: 'visual_design', label: 'Desain Visual' },
      { key: 'layout_design', label: 'Desain Tata Letak' },
      { key: 'figma', label: 'Figma' },
      { key: 'ui_implementation_awareness', label: 'Kesadaran Implementasi UI' },
      { key: 'design_systems', label: 'Sistem Desain' },
      { key: 'user_empathy', label: 'Empati Pengguna (UX)' },
    ],
  },
]

// ─── Soft Skills ─────────────────────────────────────────────────────────────

export const SOFT_SKILLS = [
  { key: 'attention_to_detail', label: 'Perhatian terhadap Detail' },
  { key: 'intellectual_curiosity', label: 'Rasa Ingin Tahu Intelektual' },
  { key: 'innovation', label: 'Inovatif' },
  { key: 'tolerance_for_ambiguity', label: 'Toleransi Ketidakpastian' },
  { key: 'critical_thinking', label: 'Berpikir Kritis' },
  { key: 'communication', label: 'Komunikasi' },
  { key: 'integrity', label: 'Integritas' },
  { key: 'dependability', label: 'Dapat Diandalkan' },
  { key: 'leadership', label: 'Kepemimpinan' },
  { key: 'cooperation', label: 'Kerja Sama Tim' },
  { key: 'stress_tolerance', label: 'Tahan Tekanan' },
  { key: 'adaptability', label: 'Adaptif' },
  { key: 'curiosity', label: 'Rasa Ingin Tahu' },
  { key: 'cautiousness', label: 'Kehati-hatian' },
  { key: 'perseverance', label: 'Ketekunan' },
  { key: 'originality', label: 'Orisinalitas / Kreativitas' },
]

// ─── Interests ────────────────────────────────────────────────────────────────

export const INTERESTS = [
  { key: 'mathematics_statistics', label: 'Matematika & Statistika' },
  { key: 'information_technology', label: 'Teknologi Informasi' },
  { key: 'investigative', label: 'Investigatif / Analitis' },
  { key: 'conventional', label: 'Terstruktur / Prosedural' },
  { key: 'engineering', label: 'Rekayasa / Engineering' },
  { key: 'management_administration', label: 'Manajemen & Administrasi' },
  { key: 'business_initiatives', label: 'Inisiatif Bisnis' },
  { key: 'enterprising', label: 'Wirausaha / Enterprising' },
  { key: 'marketing_advertising', label: 'Pemasaran & Periklanan' },
  { key: 'finance', label: 'Keuangan' },
  { key: 'accounting', label: 'Akuntansi' },
  { key: 'visual_arts', label: 'Seni Visual' },
  { key: 'applied_arts_and_design', label: 'Desain & Seni Terapan' },
  { key: 'media', label: 'Media & Komunikasi' },
  { key: 'artistic', label: 'Artistik / Kreatif' },
]

// ─── Majors (Jurusan) ─────────────────────────────────────────────────────────

export const MAJORS = [
  'Ilmu Komputer',
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Matematika',
  'Statistika',
  'Manajemen',
  'Akuntansi',
  'Teknik Industri',
  'Desain Komunikasi Visual',
  'Psikologi',
  'Ekonomi',
  'Lainnya',
]

// ─── Confidence color mapping ─────────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 55) return 'text-sky-400'
  if (score >= 35) return 'text-amber-400'
  return 'text-red-400'
}

export function getScoreGradient(score: number): string {
  if (score >= 75) return 'from-emerald-500 to-teal-500'
  if (score >= 55) return 'from-sky-500 to-blue-500'
  if (score >= 35) return 'from-amber-500 to-orange-500'
  return 'from-red-500 to-rose-500'
}

export function getWeightBadge(weight: number): string {
  if (weight >= 2.5) return 'badge-critical'
  if (weight >= 1.5) return 'badge-important'
  return 'badge-standard'
}

export function getWeightLabel(weight: number): string {
  if (weight >= 2.5) return 'Kritikal'
  if (weight >= 1.5) return 'Penting'
  return 'Standar'
}

// ─── Skill label lookup ───────────────────────────────────────────────────────

const _allSkills: Record<string, string> = {}
for (const cat of SKILL_CATEGORIES) {
  for (const sk of cat.skills) {
    _allSkills[sk.key] = sk.label
  }
}

export function getSkillLabel(key: string): string {
  return _allSkills[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
