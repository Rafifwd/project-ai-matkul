export interface SkillMeta {
  key: string;
  label: string;
  category: string;
}

export const SKILL_DICTIONARY: SkillMeta[] = [
  // Data & AI
  { key: 'statistics', label: 'Statistika', category: 'Data & AI' },
  { key: 'python', label: 'Python Programming', category: 'Data & AI' },
  { key: 'data_cleaning', label: 'Pembersihan Data', category: 'Data & AI' },
  { key: 'machine_learning', label: 'Machine Learning', category: 'Data & AI' },
  { key: 'model_evaluation', label: 'Evaluasi Model', category: 'Data & AI' },
  { key: 'data_visualization', label: 'Visualisasi Data', category: 'Data & AI' },
  { key: 'research_methodology', label: 'Metodologi Penelitian', category: 'Data & AI' },
  { key: 'data_analysis', label: 'Analisis Data', category: 'Data & AI' },
  // Software Engineering
  { key: 'programming', label: 'Pemrograman Dasar', category: 'Software Engineering' },
  { key: 'data_structures', label: 'Struktur Data & Algoritma', category: 'Software Engineering' },
  { key: 'software_design', label: 'Desain Perangkat Lunak', category: 'Software Engineering' },
  { key: 'database', label: 'Administrasi Basis Data', category: 'Software Engineering' },
  { key: 'software_testing', label: 'Pengujian Perangkat Lunak', category: 'Software Engineering' },
  { key: 'git', label: 'Git & Version Control', category: 'Software Engineering' },
  { key: 'requirements_analysis', label: 'Analisis Kebutuhan', category: 'Software Engineering' },
  // Cybersecurity & Systems
  { key: 'networking', label: 'Jaringan Komputer', category: 'Cybersecurity & Systems' },
  { key: 'security_fundamentals', label: 'Dasar-Dasar Keamanan', category: 'Cybersecurity & Systems' },
  { key: 'operating_systems', label: 'Sistem Operasi', category: 'Cybersecurity & Systems' },
  { key: 'linux', label: 'Administrasi Linux', category: 'Cybersecurity & Systems' },
  { key: 'risk_analysis', label: 'Analisis Risiko', category: 'Cybersecurity & Systems' },
  { key: 'log_analysis', label: 'Analisis Log Keamanan', category: 'Cybersecurity & Systems' },
  { key: 'security_documentation', label: 'Dokumentasi Keamanan', category: 'Cybersecurity & Systems' },
  { key: 'systems_analysis', label: 'Analisis Sistem', category: 'Cybersecurity & Systems' },
  { key: 'troubleshooting', label: 'Troubleshooting', category: 'Cybersecurity & Systems' },
  // Business & Management
  { key: 'business_understanding', label: 'Pemahaman Bisnis', category: 'Business & Management' },
  { key: 'process_modeling', label: 'Pemodelan Proses Bisnis', category: 'Business & Management' },
  { key: 'report_writing', label: 'Penulisan Laporan Bisnis', category: 'Business & Management' },
  { key: 'stakeholder_analysis', label: 'Analisis Stakeholder', category: 'Business & Management' },
  { key: 'project_planning', label: 'Perencanaan Proyek', category: 'Business & Management' },
  { key: 'financial_analysis', label: 'Analisis Keuangan', category: 'Business & Management' },
  { key: 'accounting', label: 'Akuntansi', category: 'Business & Management' },
  { key: 'budgeting', label: 'Penganggaran Keuangan', category: 'Business & Management' },
  { key: 'presentation', label: 'Kemampuan Presentasi', category: 'Business & Management' },
  { key: 'market_analysis', label: 'Analisis Pasar', category: 'Business & Management' },
  // Design & UX
  { key: 'visual_design', label: 'Desain Visual', category: 'Design & UX' },
  { key: 'layout_design', label: 'Desain Tata Letak', category: 'Design & UX' },
  { key: 'figma', label: 'Figma', category: 'Design & UX' },
  { key: 'user_empathy', label: 'Empati Pengguna (UX)', category: 'Design & UX' },
  { key: 'design_systems', label: 'Design Systems', category: 'Design & UX' },
];

export const getSkillsByCategory = () => {
  return SKILL_DICTIONARY.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillMeta[]>);
};