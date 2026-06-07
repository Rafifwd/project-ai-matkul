# Panduan Integrasi Frontend - NalarPath AI

Dokumen ini ditujukan untuk Frontend (FE) Developer untuk memahami konteks bisnis, arsitektur, daftar endpoint, skema data, serta panduan integrasi dengan Backend (BE) NalarPath AI yang sudah berjalan.

---

## 1. Ikhtisar Proyek (Project Overview)
**NalarPath AI** adalah aplikasi berbasis AI/Reasoning Engine yang membantu mahasiswa tingkat sarjana dalam merekomendasikan dan memvalidasi jalur karier mereka secara realistis dan beretika. Sistem ini mencocokkan profil pengguna (jurusan, semester, tingkat keahlian saat ini, pengalaman, dan preferensi) dengan data persyaratan karier terkurasi (berbasis data riil O*NET).

### Arsitektur Integrasi
- **Backend Tech Stack**: FastAPI (Python), Uvicorn, Pydantic.
- **Backend Server URL**: `http://127.0.0.1:8000` (atau port lokal lain jika disesuaikan).
- **CORS**: Sudah diaktifkan untuk semua origin (`allow_origins=["*"]`), metode, dan header. Frontend dapat langsung memanggil API tanpa hambatan CORS di lokal.
- **Data Store**: Menggunakan basis data pengetahuan karier lokal (`career_requirements_mvp.json`).

---

## 2. Halaman & Fitur yang Perlu Dibuat (UI/UX Scope)

Frontend sebaiknya terdiri dari 3 fitur utama:

### A. Fitur 1: Penjelajah Karier (Career Catalog)
Halaman untuk melihat katalog daftar karier yang didukung oleh sistem.
- **Alur UI**:
  1. Halaman utama menampilkan daftar kartu karier (ada 10 pilihan karier).
  2. Saat kartu diklik, tampilkan halaman detail karier tersebut.
- **Komponen Visual**:
  - Grafik radar (Radar Chart) atau grafik batang (Bar Chart) untuk menampilkan kebutuhan minimal keahlian (*hard skills*).
  - Tampilan O*NET source metadata, daftar *soft skills*, mata kuliah relevan (*related courses*), dan saran portofolio.

### B. Fitur 2: Rekomendasi Jalur Karier (Discovery Mode)
Fitur untuk membantu mahasiswa mengeksplorasi karier apa yang paling cocok berdasarkan profil mereka saat ini.
- **Alur UI**:
  1. Pengguna mengisi formulir profil (Jurusan, Semester, Keahlian saat ini dalam skala 0-100, Pengalaman, dan Preferensi).
  2. Sistem mengirimkan data ke BE dan mengembalikan $N$ rekomendasi teratas (misalnya top 3).
  3. Menampilkan daftar rekomendasi beserta skor kecocokan (dalam %).
- **Komponen Visual**:
  - **Match Score Indicator**: Gunakan progress bar melingkar (radial) atau badge berwarna.
  - **Confidence Message Banner**: Menampilkan tingkat kepercayaan rekomendasi berdasarkan skor (kuning untuk kurang yakin, biru untuk sedang, hijau untuk sangat yakin).
  - **Strength & Gap Comparison**: Tunjukkan keahlian apa saja yang sudah memenuhi syarat (*Why Match*) dan apa saja yang masih kurang (*Gaps*) lengkap dengan visualisasi selisih nilai.

### C. Fitur 3: Validasi Karier Pilihan (Validation Mode)
Fitur untuk menguji kelayakan/kesiapan mahasiswa pada satu karier spesifik yang ia incar.
- **Alur UI**:
  1. Pengguna memilih karier target (misal: "Data Analyst").
  2. Pengguna mengisi formulir profilnya.
  3. Sistem memproses kesenjangan keahlian (*skill gaps*) secara mendalam dan mengembalikan visualisasi roadmap belajar yang dipersonalisasi.
- **Komponen Visual**:
  - **Timeline Roadmap**: Visual langkah demi langkah urutan belajar (*recommended learning order*) dari keahlian yang paling kritis hingga yang opsional.
  - **Saran Portofolio & Sumber Daya**: Tampilkan daftar proyek portofolio yang disarankan serta tautan materi pembelajaran gratis dan berbayar.

---

## 3. Kamus Keahlian (Hard Skills Dictionary)
Untuk mempermudah input slider keahlian di frontend, berikut adalah daftar keahlian (*hard skills*) yang dikenali backend, dikelompokkan berdasarkan bidangnya. 

> [!TIP]
> Di UI formulir profil, Anda dapat membuat grup kategori ini menggunakan tab/accordion agar slider keahlian lebih rapi dan terorganisir.

| Kategori | Nama Keahlian di DB (API Key) | Nama Label untuk UI |
| :--- | :--- | :--- |
| **Data & AI** | `statistics` | Statistika |
| | `python` | Python Programming |
| | `data_cleaning` | Pembersihan Data (Data Cleaning) |
| | `machine_learning` | Machine Learning |
| | `model_evaluation` | Evaluasi Model |
| | `data_visualization` | Visualisasi Data |
| | `research_methodology` | Metodologi Penelitian |
| | `data_analysis` | Analisis Data |
| **Software Engineering**| `programming` | Pemrograman Dasar |
| | `data_structures` | Struktur Data & Algoritma |
| | `software_design` | Desain Perangkat Lunak |
| | `database` | Administrasi Basis Data |
| | `software_testing` | Pengujian Perangkat Lunak |
| | `git` | Git & Version Control |
| | `requirements_analysis`| Analisis Kebutuhan |
| **Cybersecurity & Systems**| `networking` | Jaringan Komputer |
| | `security_fundamentals`| Dasar-Dasar Keamanan |
| | `operating_systems` | Sistem Operasi |
| | `linux` | Administrasi Linux |
| | `risk_analysis` | Analisis Risiko |
| | `log_analysis` | Analisis Log Keamanan |
| | `security_documentation`| Dokumentasi Keamanan |
| | `systems_analysis` | Analisis Sistem |
| | `troubleshooting` | Troubleshooting |
| **Business & Management**| `business_understanding`| Pemahaman Bisnis |
| | `process_modeling` | Pemodelan Proses Bisnis |
| | `report_writing` | Penulisan Laporan Bisnis |
| | `stakeholder_analysis` | Analisis Stakeholder |
| | `project_planning` | Perencanaan Proyek |
| | `stakeholder_communication`| Komunikasi Stakeholder |
| | `risk_management` | Manajemen Risiko Proyek |
| | `budget_tracking` | Pelacakan Anggaran |
| | `team_coordination` | Koordinasi Tim |
| | `documentation` | Dokumentasi Teknis |
| | `project_tools` | Alat Manajemen Proyek |
| | `marketing_understanding`| Pemahaman Pemasaran |
| | `market_analysis` | Analisis Pasar |
| | `survey_design` | Desain Survei |
| | `financial_analysis` | Analisis Keuangan |
| | `accounting` | Akuntansi |
| | `budgeting` | Penganggaran Keuangan |
| | `presentation` | Kemampuan Presentasi |
| **Design & UX** | `visual_design` | Desain Visual |
| | `layout_design` | Desain Tata Letak (Layout) |
| | `figma` | Figma |
| | `ui_implementation_awareness`| Kesadaran Implementasi UI |
| | `design_systems` | Sistem Desain (Design Systems) |
| | `user_empathy` | Empati Pengguna (UX) |

---

## 4. Referensi Endpoint API & Integrasi Kode

Setiap request ke backend yang membutuhkan profil pengguna harus mengikuti struktur objek `UserProfile` berikut:

```typescript
interface UserProfile {
  major: string | null;      // Jurusan kuliah
  semester: number | null;   // Semester (1 - 14)
  skills: {                  // Key: nama keahlian (string), Value: level 0-100 (number)
    [key: string]: number;
  };
  experiences: string[];     // Daftar pengalaman mahasiswa
  preferences: {             // Informasi preferensi tambahan
    [key: string]: any;
  };
}
```

Berikut adalah detail endpoint beserta contoh integrasi menggunakan `fetch`/`axios`:

### 1. Cek Status API (Health Check)
- **Method & URL**: `GET /api/health`
- **Tujuan**: Memastikan backend hidup dan mengetahui jumlah karier terdaftar.
- **Response**:
  ```json
  {
    "status": "ok",
    "career_count": 10
  }
  ```

---

### 2. Mengambil Semua Katalog Karier
- **Method & URL**: `GET /api/careers`
- **Tujuan**: Menampilkan ringkasan katalog karier untuk halaman utama Explorer.
- **Response**:
  ```json
  {
    "count": 10,
    "careers": [
      {
        "name": "Data Scientist",
        "source": "Data Scientists",
        "onet_code": "15-2051.00",
        "hard_skills": {
          "statistics": 85,
          "python": 80,
          "data_cleaning": 80,
          "machine_learning": 80,
          "model_evaluation": 75,
          "data_visualization": 75,
          "research_methodology": 70
        },
        "soft_skills": [
          "attention_to_detail",
          "intellectual_curiosity",
          "innovation",
          "tolerance_for_ambiguity"
        ],
        "related_courses": [
          "Statistika",
          "Aljabar Linear",
          "Pemrograman",
          "Kecerdasan Buatan",
          "Data Mining"
        ]
      }
      // ... 9 karier lainnya
    ]
  }
  ```

---

### 3. Mengambil Detail Satu Karier
- **Method & URL**: `GET /api/careers/{career_name}`
- **Contoh URL**: `GET /api/careers/Data Analyst`
- **Tujuan**: Menampilkan detail lengkap suatu karier (termasuk roadmap standar, saran portofolio, dan bahan belajar).
- **Response**:
  ```json
  {
    "name": "Data Analyst",
    "source_basis": {
      "primary_onet_occupation": "Business Intelligence Analysts",
      "onet_code": "15-2051.01",
      "source_url": "https://www.onetonline.org/link/summary/15-2051.01",
      "notebook_data_note": "..."
    },
    "hard_skills": {
      "statistics": 75,
      "sql": 80,
      "spreadsheet": 75,
      "data_visualization": 80,
      "business_understanding": 70,
      "reporting": 75,
      "python": 65
    },
    "soft_skills": ["attention_to_detail", "critical_thinking", "communication", "integrity"],
    "interests": ["information_technology", "mathematics_statistics", "conventional", "investigative"],
    "related_courses": ["Statistika", "Basis Data", "Pemrograman", "Sistem Informasi Manajemen", "Analisis Bisnis"],
    "portfolio": [
      "Business dashboard with SQL-backed dataset",
      "Public dataset analysis report with charts and recommendations"
    ],
    "learning_path": [
      "Spreadsheet and basic statistics",
      "SQL querying",
      "Dashboard and data visualization",
      "Business interpretation",
      "Python for analysis"
    ],
    "resources": {
      "free": [
        "Mode SQL Tutorial",
        "Kaggle Learn",
        "Microsoft Power BI learning path"
      ],
      "paid": [
        "Google Data Analytics Certificate",
        "Udemy SQL and Data Analytics course"
      ]
    },
    "onet_evidence": { ... }
  }
  ```

---

### 4. Analisis Rekomendasi Karier (Discovery Mode)
- **Method & URL**: `POST /api/analyze`
- **Tujuan**: Mengirim profil user dan mendapatkan daftar $N$ karier terbaik.
- **Request Body**:
  ```json
  {
    "profile": {
      "major": "Informatika",
      "semester": 6,
      "skills": {
        "programming": 80,
        "sql": 70,
        "spreadsheet": 50,
        "statistics": 30
      },
      "experiences": [
        "Juara 3 Hackathon tingkat kampus",
        "Asisten Praktikum Pemrograman Dasar"
      ],
      "preferences": {
        "field_interest": "Software Development"
      }
    },
    "top_n": 3
  }
  ```
- **Response**:
  ```json
  {
    "mode": "discovery",
    "profile": { ... },
    "results": [
      {
        "career": "Software Developer",
        "score": 67.43,
        "confidence_message": "Confidence cukup baik untuk rekomendasi awal.",
        "why_match": [
          {
            "skill": "programming",
            "current": 80,
            "required": 85
          }
        ],
        "gaps": [
          {
            "skill": "data_structures",
            "current": 0,
            "required": 75,
            "gap": 75
          },
          {
            "skill": "software_design",
            "current": 0,
            "required": 75,
            "gap": 75
          }
        ],
        "free_resources": [
          "freeCodeCamp",
          "roadmap.sh",
          "MDN Web Docs"
        ],
        "paid_resources": [
          "Dicoding developer learning path",
          "Udemy Software Development course"
        ]
      }
      // ... 2 rekomendasi lainnya
    ],
    "ethical_notice": "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. Jurusan hanya digunakan sebagai konteks awal roadmap."
  }
  ```

---

### 5. Validasi Jalur Karier Pilihan (Validation Mode)
- **Method & URL**: `POST /api/validate`
- **Tujuan**: Menganalisis kesiapan pengguna untuk karier target tertentu secara mendalam.
- **Request Body**:
  ```json
  {
    "target_career": "Data Analyst",
    "profile": {
      "major": "Manajemen",
      "semester": 5,
      "skills": {
        "spreadsheet": 70,
        "business_understanding": 80,
        "sql": 30
      },
      "experiences": [],
      "preferences": {}
    }
  }
  ```
- **Response**:
  ```json
  {
    "mode": "validation",
    "profile": { ... },
    "result": {
      "target_career": "Data Analyst",
      "score": 34.62,
      "confidence_message": "Data profil belum cukup kuat untuk memberi rekomendasi tunggal. Lengkapi skill dan pengalaman terlebih dahulu.",
      "fulfilled_strengths": [
        {
          "skill": "business_understanding",
          "current": 80,
          "required": 70
        }
      ],
      "critical_gaps": [
        {
          "skill": "sql",
          "current": 30,
          "required": 80,
          "gap": 50
        },
        {
          "skill": "data_visualization",
          "current": 0,
          "required": 80,
          "gap": 80
        },
        {
          "skill": "statistics",
          "current": 0,
          "required": 75,
          "gap": 75
        }
      ],
      "recommended_learning_order": [
        {
          "skill": "data_visualization",
          "reason": "Gap 80 poin dari level minimal 80."
        },
        {
          "skill": "statistics",
          "reason": "Gap 75 poin dari level minimal 75."
        },
        {
          "skill": "sql",
          "reason": "Gap 50 poin dari level minimal 80."
        }
      ],
      "portfolio": [
        "Business dashboard with SQL-backed dataset",
        "Public dataset analysis report with charts and recommendations"
      ],
      "free_resources": [
        "Mode SQL Tutorial",
        "Kaggle Learn",
        "Microsoft Power BI learning path"
      ],
      "paid_resources": [
        "Google Data Analytics Certificate",
        "Udemy SQL and Data Analytics course"
      ],
      "ethical_notice": "Rekomendasi ini tidak membatasi peluang berdasarkan jurusan. Jurusan hanya digunakan sebagai konteks awal roadmap."
    }
  }
  ```

---

## 5. Contoh Kode Integrasi (React / TypeScript / Axios)

Berikut adalah contoh fungsi utilitas API client yang siap digunakan di Frontend:

```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserProfile {
  major: string | null;
  semester: number | null;
  skills: Record<string, number>;
  experiences: string[];
  preferences: Record<string, any>;
}

// 1. Cek kesehatan server
export const checkApiHealth = async () => {
  const response = await API.get('/api/health');
  return response.data; // { status: "ok", career_count: number }
};

// 2. Ambil katalog karier
export const getCareers = async () => {
  const response = await API.get('/api/careers');
  return response.data.careers;
};

// 3. Ambil detail karier spesifik
export const getCareerDetail = async (careerName: string) => {
  const response = await API.get(`/api/careers/${encodeURIComponent(careerName)}`);
  return response.data;
};

// 4. Kirim analisis Discovery Mode
export const analyzeCareer = async (profile: UserProfile, topN: number = 3) => {
  const response = await API.post('/api/analyze', { profile, top_n: topN });
  return response.data;
};

// 5. Kirim analisis Validation Mode
export const validateTargetCareer = async (targetCareer: string, profile: UserProfile) => {
  const response = await API.post('/api/validate', {
    target_career: targetCareer,
    profile,
  });
  return response.data;
};
```

---

## 6. Tips Implementasi Frontend yang Menarik (Aesthetic & UX Tips)

Agar tampilan aplikasi terasa sangat premium dan memukau:
1. **Tema & Palette**: Gunakan tema **Dark Mode** modern dengan warna dasar gelap (seperti Slate `#0f172a` atau Zinc `#09090b`) dipadukan dengan aksen gradasi neon (misal: Indigo ke Violet, atau Emerald ke Cyan) untuk menggambarkan nuansa futuristik AI.
2. **Chart Radar**: Di halaman detail karier, buatlah visualisasi Radar Chart menggunakan library seperti `Recharts` atau `ApexCharts` untuk membandingkan tingkat keahlian minimum yang dibutuhkan VS tingkat keahlian yang saat ini dimiliki mahasiswa.
3. **Stepper Form**: UI input profil sebaiknya dibagi dalam format *Step-by-Step* (contoh: Step 1: Info Akademik -> Step 2: Level Keahlian [Slider] -> Step 3: Pengalaman & Preferensi) agar tidak mengintimidasi pengguna dengan formulir yang terlalu panjang.
4. **Timeline Roadmap**: Visualisasikan `recommended_learning_order` dalam bentuk vertikal atau horizontal timeline yang menarik dengan ikon centang/belajar untuk memberikan kesan jalur petualangan (*gamified pathway*).
5. **Micro-animations**: Gunakan library seperti `Framer Motion` untuk transisi antar halaman dan animasi kemunculan card rekomendasi.

wowowowo