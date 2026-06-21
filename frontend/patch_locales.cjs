const fs = require('fs');

const idJsonPath = 'src/locales/id.json';
const enJsonPath = 'src/locales/en.json';

const idData = JSON.parse(fs.readFileSync(idJsonPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Interests
idData.interests = {
  "mathematics_statistics": "Matematika & Statistika",
  "information_technology": "Teknologi Informasi",
  "investigative": "Investigatif / Analitis",
  "conventional": "Terstruktur / Prosedural",
  "engineering": "Rekayasa / Engineering",
  "management_administration": "Manajemen & Administrasi",
  "business_initiatives": "Inisiatif Bisnis",
  "enterprising": "Wirausaha / Enterprising",
  "marketing_advertising": "Pemasaran & Periklanan",
  "finance": "Keuangan",
  "accounting": "Akuntansi",
  "visual_arts": "Seni Visual",
  "applied_arts_and_design": "Desain & Seni Terapan",
  "media": "Media & Komunikasi",
  "artistic": "Artistik / Kreatif"
};

enData.interests = {
  "mathematics_statistics": "Mathematics & Statistics",
  "information_technology": "Information Technology",
  "investigative": "Investigative / Analytical",
  "conventional": "Structured / Procedural",
  "engineering": "Engineering",
  "management_administration": "Management & Administration",
  "business_initiatives": "Business Initiatives",
  "enterprising": "Enterprising",
  "marketing_advertising": "Marketing & Advertising",
  "finance": "Finance",
  "accounting": "Accounting",
  "visual_arts": "Visual Arts",
  "applied_arts_and_design": "Applied Arts & Design",
  "media": "Media & Communication",
  "artistic": "Artistic / Creative"
};

// Majors
idData.majors = {
  "Ilmu Komputer": "Ilmu Komputer",
  "Teknik Informatika": "Teknik Informatika",
  "Sistem Informasi": "Sistem Informasi",
  "Teknik Elektro": "Teknik Elektro",
  "Matematika": "Matematika",
  "Statistika": "Statistika",
  "Manajemen": "Manajemen",
  "Akuntansi": "Akuntansi",
  "Teknik Industri": "Teknik Industri",
  "Desain Komunikasi Visual": "Desain Komunikasi Visual",
  "Psikologi": "Psikologi",
  "Ekonomi": "Ekonomi",
  "Lainnya": "Lainnya"
};

enData.majors = {
  "Ilmu Komputer": "Computer Science",
  "Teknik Informatika": "Informatics Engineering",
  "Sistem Informasi": "Information Systems",
  "Teknik Elektro": "Electrical Engineering",
  "Matematika": "Mathematics",
  "Statistika": "Statistics",
  "Manajemen": "Management",
  "Akuntansi": "Accounting",
  "Teknik Industri": "Industrial Engineering",
  "Desain Komunikasi Visual": "Visual Communication Design",
  "Psikologi": "Psychology",
  "Ekonomi": "Economics",
  "Lainnya": "Others"
};

// Discover UI
idData.discover = {
  "title": "Temukan Karier",
  "subtitle": "Isi profil skill-mu dan AI hybrid kami akan merekomendasikan karier terbaik.",
  "step_academic": "Info Akademik",
  "step_hardskills": "Hard Skills",
  "step_softskills": "Soft Skills & Minat",
  "step_pref": "Preferensi",
  "major_label": "Jurusan",
  "major_placeholder": "Pilih jurusan…",
  "semester_label": "Semester (1–14)",
  "semester_placeholder": "Contoh: 6",
  "exp_label": "Pengalaman (opsional)",
  "exp_placeholder": "Contoh: Magang di perusahaan IT, Organisasi BEM, Proyek freelance… (satu per baris)",
  "topn_label": "Top N Rekomendasi",
  "btn_next": "Lanjut →",
  "btn_prev": "← Kembali",
  "btn_analyze": "Analisis Sekarang",
  "btn_analyzing": "Menganalisis…",
  "btn_reset": "Isi Ulang",
  "level_hardskills_title": "Level Hard Skills",
  "level_hardskills_desc": "Geser slider untuk mengisi level keahlianmu (0 = tidak bisa, 100 = ahli). Lewati skill yang belum dikuasai.",
  "skill_none": "Tidak bisa",
  "skill_expert": "Ahli",
  "skill_filled": "{{count}} skill telah diisi",
  "softskills_title": "Soft Skills & Minat",
  "softskills_desc": "Pilih yang menggambarkan dirimu. Semua opsional — jika dilewati, skor netral (50) akan digunakan.",
  "softskills_label": "Soft Skills ({{count}} dipilih)",
  "interests_label": "Minat / Bidang ({{count}} dipilih)",
  "summary_title": "Ringkasan Profil",
  "summary_major": "Jurusan",
  "summary_semester": "Semester",
  "summary_hardskills": "Hard Skills Terisi",
  "summary_hardskills_val": "{{count}} skill",
  "summary_softskills": "Soft Skills",
  "summary_softskills_val": "{{count}} dipilih",
  "summary_interests": "Minat",
  "summary_interests_val": "{{count}} dipilih",
  "summary_topn": "Top N",
  "summary_topn_val": "Top {{count}} karier",
  "result_title": "Top {{count}} Rekomendasi Kariermu",
  "result_engine": "Engine",
  "result_ml_acc": "ML Accuracy",
  "score_breakdown": "Rincian Skor",
  "sb_hard": "Hard Skills",
  "sb_soft": "Soft Skills",
  "sb_interest": "Minat",
  "why_match": "Kekuatan Kamu",
  "gaps": "Area Pengembangan",
  "xai": "Explainable AI (SHAP)",
  "free_resources": "Belajar Gratis",
  "paid_resources": "Kursus Berbayar",
  "error_default": "Terjadi kesalahan"
};

enData.discover = {
  "title": "Discover Career",
  "subtitle": "Fill in your skill profile and our hybrid AI will recommend the best careers.",
  "step_academic": "Academic Info",
  "step_hardskills": "Hard Skills",
  "step_softskills": "Soft Skills & Interests",
  "step_pref": "Preferences",
  "major_label": "Major",
  "major_placeholder": "Select major…",
  "semester_label": "Semester (1–14)",
  "semester_placeholder": "Example: 6",
  "exp_label": "Experience (optional)",
  "exp_placeholder": "Example: IT internship, Student org, Freelance projects… (one per line)",
  "topn_label": "Top N Recommendations",
  "btn_next": "Next →",
  "btn_prev": "← Back",
  "btn_analyze": "Analyze Now",
  "btn_analyzing": "Analyzing…",
  "btn_reset": "Reset",
  "level_hardskills_title": "Hard Skills Level",
  "level_hardskills_desc": "Slide to fill your expertise level (0 = none, 100 = expert). Skip skills you haven't mastered.",
  "skill_none": "None",
  "skill_expert": "Expert",
  "skill_filled": "{{count}} skills filled",
  "softskills_title": "Soft Skills & Interests",
  "softskills_desc": "Select what describes you. All are optional — if skipped, a neutral score (50) will be used.",
  "softskills_label": "Soft Skills ({{count}} selected)",
  "interests_label": "Interests / Fields ({{count}} selected)",
  "summary_title": "Profile Summary",
  "summary_major": "Major",
  "summary_semester": "Semester",
  "summary_hardskills": "Hard Skills Filled",
  "summary_hardskills_val": "{{count}} skills",
  "summary_softskills": "Soft Skills",
  "summary_softskills_val": "{{count}} selected",
  "summary_interests": "Interests",
  "summary_interests_val": "{{count}} selected",
  "summary_topn": "Top N",
  "summary_topn_val": "Top {{count}} careers",
  "result_title": "Top {{count}} Career Recommendations",
  "result_engine": "Engine",
  "result_ml_acc": "ML Accuracy",
  "score_breakdown": "Score Breakdown",
  "sb_hard": "Hard Skills",
  "sb_soft": "Soft Skills",
  "sb_interest": "Interests",
  "why_match": "Your Strengths",
  "gaps": "Areas for Development",
  "xai": "Explainable AI (SHAP)",
  "free_resources": "Free Learning",
  "paid_resources": "Paid Courses",
  "error_default": "An error occurred"
};

// Validate UI
idData.validate = {
  "title": "Validasi Target Karier",
  "subtitle": "Sudah punya karier incaran? Analisis gap skill-mu dan dapatkan learning roadmap yang dipersonalisasi.",
  "target_label": "Karier Incaran",
  "target_placeholder": "Pilih karier...",
  "btn_validate": "Validasi Sekarang",
  "btn_validating": "Memvalidasi...",
  "result_title": "Hasil Validasi: {{career}}",
  "learning_roadmap": "Rekomendasi Learning Roadmap",
  "portfolio": "Saran Portofolio",
  "not_found": "Karier tidak ditemukan"
};

enData.validate = {
  "title": "Validate Target Career",
  "subtitle": "Already have a target career? Analyze your skill gaps and get a personalized learning roadmap.",
  "target_label": "Target Career",
  "target_placeholder": "Select career...",
  "btn_validate": "Validate Now",
  "btn_validating": "Validating...",
  "result_title": "Validation Result: {{career}}",
  "learning_roadmap": "Recommended Learning Roadmap",
  "portfolio": "Portfolio Suggestions",
  "not_found": "Career not found"
};

// Model Info UI
idData.model = {
  "title": "Status Engine & ML Model",
  "subtitle": "Transparansi dan pemantauan sistem rekomendasi NalarPath AI.",
  "engine_status": "Status Engine Utama",
  "engine_rule": "Rule-Based Engine",
  "engine_rule_desc": "Menggunakan data terkurasi O*NET",
  "engine_ml": "Machine Learning Layer",
  "engine_ml_desc": "Klasifikasi profil secara probabilistik",
  "model_details": "Detail Model ML Aktif",
  "model_type": "Tipe Model",
  "accuracy": "Cross-Val Accuracy",
  "f1_score": "F1-Score (Macro)",
  "training_date": "Tanggal Training",
  "trained_samples": "Sampel Dilatih",
  "supported_classes": "Kelas Didukung",
  "features_used": "Fitur Digunakan",
  "unavailable": "Model ML belum dilatih atau tidak tersedia. Silakan jalankan proses training.",
  "training_control": "Kontrol Training Model",
  "training_control_desc": "Proses training akan men-generate data sintetis baru dari knowledge base dan melatih ulang model.",
  "btn_train": "Mulai Training Ulang",
  "btn_training": "Proses Training Berjalan...",
  "status_idle": "Idle",
  "status_gen": "Generating Data...",
  "status_train": "Training Model...",
  "status_done": "Selesai",
  "status_fail": "Gagal",
  "last_updated": "Terakhir diperbarui",
  "loading": "Memuat informasi model...",
  "error": "Gagal terhubung ke backend"
};

enData.model = {
  "title": "Engine & ML Model Status",
  "subtitle": "Transparency and monitoring of the NalarPath AI recommendation system.",
  "engine_status": "Main Engine Status",
  "engine_rule": "Rule-Based Engine",
  "engine_rule_desc": "Using curated O*NET data",
  "engine_ml": "Machine Learning Layer",
  "engine_ml_desc": "Probabilistic profile classification",
  "model_details": "Active ML Model Details",
  "model_type": "Model Type",
  "accuracy": "Cross-Val Accuracy",
  "f1_score": "F1-Score (Macro)",
  "training_date": "Training Date",
  "trained_samples": "Trained Samples",
  "supported_classes": "Supported Classes",
  "features_used": "Features Used",
  "unavailable": "ML Model is not trained or unavailable. Please run the training process.",
  "training_control": "Model Training Control",
  "training_control_desc": "The training process will generate new synthetic data from the knowledge base and retrain the model.",
  "btn_train": "Start Retraining",
  "btn_training": "Training in Progress...",
  "status_idle": "Idle",
  "status_gen": "Generating Data...",
  "status_train": "Training Model...",
  "status_done": "Completed",
  "status_fail": "Failed",
  "last_updated": "Last updated",
  "loading": "Loading model info...",
  "error": "Failed to connect to backend"
};

fs.writeFileSync(idJsonPath, JSON.stringify(idData, null, 2));
fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2));
console.log('Locales updated successfully');
