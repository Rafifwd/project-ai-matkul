export type Lang = 'id' | 'en'

export const SKILL_CATEGORIES = [
  {
    id: 'data_ai',
    label: 'Data & AI',
    labelEn: 'Data & AI',
    skills: [
      { key: 'statistics', label: 'Statistika', labelEn: 'Statistics' },
      { key: 'python', label: 'Python', labelEn: 'Python' },
      { key: 'data_cleaning', label: 'Pembersihan Data', labelEn: 'Data Cleaning' },
      { key: 'machine_learning', label: 'Machine Learning', labelEn: 'Machine Learning' },
      { key: 'model_evaluation', label: 'Evaluasi Model', labelEn: 'Model Evaluation' },
      { key: 'data_visualization', label: 'Visualisasi Data', labelEn: 'Data Visualization' },
      { key: 'research_methodology', label: 'Metodologi Riset', labelEn: 'Research Methodology' },
      { key: 'data_analysis', label: 'Analisis Data', labelEn: 'Data Analysis' },
    ],
  },
  {
    id: 'software_engineering',
    label: 'Rekayasa Perangkat Lunak',
    labelEn: 'Software Engineering',
    skills: [
      { key: 'programming', label: 'Pemrograman Dasar', labelEn: 'Programming Fundamentals' },
      { key: 'data_structures', label: 'Struktur Data', labelEn: 'Data Structures' },
      { key: 'software_design', label: 'Desain Perangkat Lunak', labelEn: 'Software Design' },
      { key: 'database', label: 'Basis Data', labelEn: 'Database' },
      { key: 'software_testing', label: 'Pengujian Perangkat Lunak', labelEn: 'Software Testing' },
      { key: 'git', label: 'Git & Version Control', labelEn: 'Git & Version Control' },
      { key: 'requirements_analysis', label: 'Analisis Kebutuhan', labelEn: 'Requirements Analysis' },
    ],
  },
  {
    id: 'cybersecurity',
    label: 'Keamanan & Sistem',
    labelEn: 'Security & Systems',
    skills: [
      { key: 'networking', label: 'Jaringan Komputer', labelEn: 'Computer Networking' },
      { key: 'security_fundamentals', label: 'Dasar Keamanan', labelEn: 'Security Fundamentals' },
      { key: 'operating_systems', label: 'Sistem Operasi', labelEn: 'Operating Systems' },
      { key: 'linux', label: 'Administrasi Linux', labelEn: 'Linux Administration' },
      { key: 'risk_analysis', label: 'Analisis Risiko', labelEn: 'Risk Analysis' },
      { key: 'log_analysis', label: 'Analisis Log', labelEn: 'Log Analysis' },
      { key: 'security_documentation', label: 'Dokumentasi Keamanan', labelEn: 'Security Documentation' },
      { key: 'systems_analysis', label: 'Analisis Sistem', labelEn: 'Systems Analysis' },
      { key: 'troubleshooting', label: 'Troubleshooting', labelEn: 'Troubleshooting' },
    ],
  },
  {
    id: 'business',
    label: 'Bisnis & Manajemen',
    labelEn: 'Business & Management',
    skills: [
      { key: 'business_understanding', label: 'Pemahaman Bisnis', labelEn: 'Business Understanding' },
      { key: 'process_modeling', label: 'Pemodelan Proses', labelEn: 'Process Modeling' },
      { key: 'report_writing', label: 'Penulisan Laporan', labelEn: 'Report Writing' },
      { key: 'stakeholder_analysis', label: 'Analisis Stakeholder', labelEn: 'Stakeholder Analysis' },
      { key: 'project_planning', label: 'Perencanaan Proyek', labelEn: 'Project Planning' },
      { key: 'stakeholder_communication', label: 'Komunikasi Stakeholder', labelEn: 'Stakeholder Communication' },
      { key: 'risk_management', label: 'Manajemen Risiko', labelEn: 'Risk Management' },
      { key: 'budget_tracking', label: 'Pelacakan Anggaran', labelEn: 'Budget Tracking' },
      { key: 'team_coordination', label: 'Koordinasi Tim', labelEn: 'Team Coordination' },
      { key: 'documentation', label: 'Dokumentasi Teknis', labelEn: 'Technical Documentation' },
      { key: 'project_tools', label: 'Alat Manajemen Proyek', labelEn: 'Project Management Tools' },
      { key: 'marketing_understanding', label: 'Pemahaman Pemasaran', labelEn: 'Marketing Understanding' },
      { key: 'market_analysis', label: 'Analisis Pasar', labelEn: 'Market Analysis' },
      { key: 'survey_design', label: 'Desain Survei', labelEn: 'Survey Design' },
      { key: 'financial_analysis', label: 'Analisis Keuangan', labelEn: 'Financial Analysis' },
      { key: 'accounting', label: 'Akuntansi', labelEn: 'Accounting' },
      { key: 'budgeting', label: 'Penganggaran', labelEn: 'Budgeting' },
      { key: 'presentation', label: 'Presentasi', labelEn: 'Presentation' },
      { key: 'sql', label: 'SQL', labelEn: 'SQL' },
      { key: 'spreadsheet', label: 'Spreadsheet', labelEn: 'Spreadsheet' },
      { key: 'reporting', label: 'Pelaporan Bisnis', labelEn: 'Business Reporting' },
    ],
  },
  {
    id: 'design_ux',
    label: 'Desain & UX',
    labelEn: 'Design & UX',
    skills: [
      { key: 'visual_design', label: 'Desain Visual', labelEn: 'Visual Design' },
      { key: 'layout_design', label: 'Desain Tata Letak', labelEn: 'Layout Design' },
      { key: 'figma', label: 'Figma', labelEn: 'Figma' },
      { key: 'ui_implementation_awareness', label: 'Kesadaran Implementasi UI', labelEn: 'UI Implementation Awareness' },
      { key: 'design_systems', label: 'Sistem Desain', labelEn: 'Design Systems' },
      { key: 'user_empathy', label: 'Empati Pengguna', labelEn: 'User Empathy' },
    ],
  },
] as const

export const SOFT_SKILLS = [
  { key: 'attention_to_detail', label: 'Perhatian pada Detail', labelEn: 'Attention to Detail' },
  { key: 'intellectual_curiosity', label: 'Rasa Ingin Tahu Intelektual', labelEn: 'Intellectual Curiosity' },
  { key: 'innovation', label: 'Inovatif', labelEn: 'Innovation' },
  { key: 'tolerance_for_ambiguity', label: 'Toleransi Ketidakpastian', labelEn: 'Tolerance for Ambiguity' },
  { key: 'critical_thinking', label: 'Berpikir Kritis', labelEn: 'Critical Thinking' },
  { key: 'communication', label: 'Komunikasi', labelEn: 'Communication' },
  { key: 'integrity', label: 'Integritas', labelEn: 'Integrity' },
  { key: 'dependability', label: 'Dapat Diandalkan', labelEn: 'Dependability' },
  { key: 'leadership', label: 'Kepemimpinan', labelEn: 'Leadership' },
  { key: 'cooperation', label: 'Kerja Sama Tim', labelEn: 'Cooperation' },
  { key: 'stress_tolerance', label: 'Tahan Tekanan', labelEn: 'Stress Tolerance' },
  { key: 'adaptability', label: 'Adaptif', labelEn: 'Adaptability' },
  { key: 'curiosity', label: 'Rasa Ingin Tahu', labelEn: 'Curiosity' },
  { key: 'cautiousness', label: 'Kehati-hatian', labelEn: 'Cautiousness' },
  { key: 'perseverance', label: 'Ketekunan', labelEn: 'Perseverance' },
  { key: 'originality', label: 'Orisinalitas', labelEn: 'Originality' },
]

export const INTERESTS = [
  { key: 'mathematics_statistics', label: 'Matematika & Statistika', labelEn: 'Mathematics & Statistics' },
  { key: 'information_technology', label: 'Teknologi Informasi', labelEn: 'Information Technology' },
  { key: 'investigative', label: 'Investigatif', labelEn: 'Investigative' },
  { key: 'conventional', label: 'Terstruktur', labelEn: 'Conventional' },
  { key: 'engineering', label: 'Rekayasa', labelEn: 'Engineering' },
  { key: 'management_administration', label: 'Manajemen & Administrasi', labelEn: 'Management & Administration' },
  { key: 'business_initiatives', label: 'Inisiatif Bisnis', labelEn: 'Business Initiatives' },
  { key: 'enterprising', label: 'Wirausaha', labelEn: 'Enterprising' },
  { key: 'marketing_advertising', label: 'Pemasaran & Periklanan', labelEn: 'Marketing & Advertising' },
  { key: 'finance', label: 'Keuangan', labelEn: 'Finance' },
  { key: 'accounting', label: 'Akuntansi', labelEn: 'Accounting' },
  { key: 'visual_arts', label: 'Seni Visual', labelEn: 'Visual Arts' },
  { key: 'applied_arts_and_design', label: 'Desain Terapan', labelEn: 'Applied Arts & Design' },
  { key: 'media', label: 'Media & Komunikasi', labelEn: 'Media & Communication' },
  { key: 'artistic', label: 'Artistik', labelEn: 'Artistic' },
]

export const MAJORS = [
  { label: 'Ilmu Komputer', labelEn: 'Computer Science' },
  { label: 'Teknik Informatika', labelEn: 'Informatics Engineering' },
  { label: 'Sistem Informasi', labelEn: 'Information Systems' },
  { label: 'Teknik Elektro', labelEn: 'Electrical Engineering' },
  { label: 'Matematika', labelEn: 'Mathematics' },
  { label: 'Statistika', labelEn: 'Statistics' },
  { label: 'Manajemen', labelEn: 'Management' },
  { label: 'Akuntansi', labelEn: 'Accounting' },
  { label: 'Teknik Industri', labelEn: 'Industrial Engineering' },
  { label: 'Desain Komunikasi Visual', labelEn: 'Visual Communication Design' },
  { label: 'Psikologi', labelEn: 'Psychology' },
  { label: 'Ekonomi', labelEn: 'Economics' },
  { label: 'Lainnya', labelEn: 'Other' },
]

const SKILL_LABELS: Record<string, { id: string; en: string }> = {}
for (const cat of SKILL_CATEGORIES) {
  for (const s of cat.skills) SKILL_LABELS[s.key] = { id: s.label, en: s.labelEn }
}
for (const s of SOFT_SKILLS) SKILL_LABELS[s.key] = { id: s.label, en: s.labelEn }
for (const s of INTERESTS) SKILL_LABELS[s.key] = { id: s.label, en: s.labelEn }

export function labelFor(key: string, lang: Lang): string {
  const entry = SKILL_LABELS[key]
  if (entry) return entry[lang]
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function weightTier(weight: number): { id: string; idEn: string } {
  if (weight >= 2.2) return { id: 'Kritikal', idEn: 'Critical' }
  if (weight >= 1.4) return { id: 'Penting', idEn: 'Weighted' }
  return { id: 'Pendukung', idEn: 'Supporting' }
}

export function scoreTone(score: number): 'verify' | 'signal' | 'amber' | 'alert' {
  if (score >= 70) return 'verify'
  if (score >= 50) return 'signal'
  if (score >= 35) return 'amber'
  return 'alert'
}
