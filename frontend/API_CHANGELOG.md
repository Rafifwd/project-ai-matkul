# NalarPath AI — API Changelog untuk Frontend Developer

Dokumen ini mencatat perubahan API Backend yang **berdampak langsung pada implementasi Frontend**.
Selalu cek file ini setiap ada update dari tim Backend sebelum mengintegrasikan fitur baru.

---

## 🧠 Arsitektur & Konteks Backend (Wajib Baca untuk Frontend)

Agar lebih mudah menyatukan API dengan komponen UI, berikut adalah **konteks utama** bagaimana backend NalarPath AI bekerja saat ini:

1. **Sistem Hybrid (Rule-Based + Machine Learning)**
   - Backend tidak lagi hanya mengandalkan rule-based (pencocokan manual). Kami menggunakan **Hybrid Scoring**.
   - **Rule-Based**: Mengecek kelayakan dasar (syarat hard skill minimum, dsb).
   - **ML (Machine Learning)**: Menganalisis 82 fitur pengguna (Hard Skills, Soft Skills, Interests) sekaligus untuk memprediksi probabilitas kecocokan di suatu karier.
   - Keduanya digabung secara proporsional menjadi `hybrid_score`.

2. **Alur Data (Data Flow)**
   - **Input dari Frontend**: User mengisi profil (`UserProfile`) mencakup `skills` (nilai 0-100), `soft_skills` (array checklist), dan `interests` (array checklist).
   - **Proses di Backend**: Backend mengekstrak input menjadi vektor numerik -> diproses oleh model Machine Learning (Random Forest/Gradient Boosting) -> menghasilkan *probability score* dan *SHAP values* (penjelasan AI).
   - **Output ke Frontend**: Frontend menerima `hybrid_score`, `score_breakdown` (detail persentase skor hard/soft/interest), dan `shap_explanation` (penjelasan *mengapa* AI merekomendasikan karier tersebut untuk UI Explainable AI).

3. **Status ML & Fitur Live Training (`/api/train`)**
   - Backend bisa berjalan tanpa ML (fallback ke rule-based) jika model belum dilatih. Cek status aktif model di `/api/model/info` atau di field `model_info.available` pada setiap response.
   - Terdapat fitur *Live Retraining* untuk demonstrasi. Frontend dapat men-trigger `/api/train` dan mem-polling `/api/train/status` untuk menampilkan *progress bar* saat model sedang belajar ulang.

4. **Dua Mode Analisis Utama**
   - **`/api/analyze` (Discovery Mode)**: User tidak tahu target kariernya. Backend mengembalikan **Top N** karier terbaik berdasarkan `hybrid_score`.
   - **`/api/validate` (Validation Mode)**: User punya target spesifik (misal: "Data Analyst"). Backend mengecek kecocokan user **khusus** terhadap target tersebut dan mengembalikan *roadmap* / *learning order*.

---

## [v0.3.0] — 2026-06-08

### 🆕 Yang Berubah — Hybrid Rule-Based + ML Engine

---

#### 1. Engine Baru: Hybrid Scoring

Backend sekarang menggunakan **Hybrid Rule-Based + ML** scoring:
```
hybrid_score = 0.5 × rule_score + 0.5 × ml_probability × 100
```

Semua endpoint `/api/analyze` dan `/api/validate` sekarang mengembalikan field baru:

```typescript
// Field baru di setiap item results[] (discovery) dan result (validation):

rule_score: number;        // Skor murni dari rule engine (0-100)
ml_probability: number | null;  // Probabilitas ML (0.0-1.0), null jika ML belum aktif
hybrid_score: number;      // Skor gabungan (0-100)
engine_mode: string;       // "hybrid" | "rule-only"

shap_explanation: {
  top_positive_features: Array<{
    feature: string;       // Nama fitur (e.g. "hard_score")
    shap_value: number;    // Kontribusi SHAP (+)
    label: string;         // Label Indonesia (e.g. "Skor Hard Skill")
    feature_value: number; // Nilai fitur aktual
  }>;
  top_negative_features: Array<{
    feature: string;
    shap_value: number;    // Kontribusi SHAP (-)
    label: string;
    feature_value: number;
  }>;
  shap_narrative: string;  // Narasi penjelasan Indonesia
  raw_shap_values: Record<string, number>;  // Semua SHAP values per fitur
} | null;  // null jika ML belum aktif
```

> [!IMPORTANT]
> Field `score` masih ada dan sekarang berisi `hybrid_score`. Backward compatible.

---

#### 2. Endpoint Baru

##### `GET /api/model/info`
Mengembalikan informasi model ML yang aktif.

```typescript
interface ModelInfo {
  available: boolean;
  model_type?: string;        // "RandomForest" | "GradientBoosting"
  cv_accuracy?: number;       // Akurasi cross-validation (0.0-1.0)
  cv_f1_macro?: number;       // F1-score macro
  training_date?: string;     // ISO datetime
  sample_count?: number;      // Jumlah data training
  class_count?: number;       // Jumlah kelas karier
  class_names?: string[];     // Daftar nama karier
  feature_names?: string[];   // Daftar fitur ML
}
```

##### `POST /api/train`
Trigger retraining model ML (untuk demo live).

```typescript
// Response:
{
  status: "started" | "already_running";
  job_id: string;
  message: string;
}
```

##### `GET /api/train/status`
Cek status training yang sedang/sudah berjalan.

```typescript
// Response:
{
  status: "idle" | "started" | "generating_data" | "training" | "completed" | "failed";
  job_id: string | null;
  started_at: string | null;    // ISO datetime
  completed_at: string | null;  // ISO datetime
  error: string | null;
  result: {
    model_type: string;
    cv_accuracy: number;
    cv_f1_macro: number;
    sample_count: number;
  } | null;
}
```

---

#### 3. Response `/api/analyze` — Tambahan field level atas

```typescript
// Tambahan di response level atas:
{
  mode: "discovery";
  engine_version: "0.3.0-hybrid";  // BARU
  profile: { ... };
  results: [ ... ];
  model_info: {                     // BARU
    available: boolean;
    model_type: string | null;
    cv_accuracy: number | null;
  };
  ethical_notice: string;
}
```

---

#### 4. Response `/api/validate` — Tambahan field

```typescript
// Tambahan di response level atas:
{
  mode: "validation";
  profile: { ... };
  result: {
    // ... semua field lama masih ada ...
    rule_score: number;              // BARU
    ml_probability: number | null;   // BARU
    hybrid_score: number;            // BARU
    shap_explanation: { ... } | null; // BARU
    engine_mode: string;             // BARU
  };
  model_info: { ... };               // BARU
}
```

---

#### 5. Contoh Kode Integrasi Baru

```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Ambil info model ML yang aktif
export const getModelInfo = async () => {
  const response = await API.get('/api/model/info');
  return response.data;
};

// Trigger training ulang (untuk demo)
export const triggerTraining = async () => {
  const response = await API.post('/api/train');
  return response.data; // { job_id, status: "started" }
};

// Cek status training
export const getTrainingStatus = async () => {
  const response = await API.get('/api/train/status');
  return response.data;
};
```

---

#### 6. Saran Komponen Visual Baru

**Hybrid Score Badge:**
```
┌────────────────────────────────────┐
│  Rule Score: 67.4    ML Prob: 82%  │
│  ════════════════════════════════  │
│  HYBRID SCORE:  74.7  ████████░░   │
└────────────────────────────────────┘
```

**SHAP Feature Importance Bar Chart:**
```
Faktor yang mendukung prediksi ini:
  Skor Hard Skill    ████████████  +9.2
  Soft Skill Cocok   ████░░░░░░░░  +4.1

Faktor yang mengurangi skor:
  Jumlah Skill Kurang  ████████  -5.1
  Gap Skill Kritis     █████░░░  -3.8
```

**Model Info Badge** (di footer/header kecil):
```
⚡ Hybrid AI v0.3.0 | RF Model | Accuracy: 89.2% | Data: 1,640 samples
```

**Live Training Demo Panel** (untuk presentasi):
```
[🔄 Retrain Model] → progress bar → [✅ Model Updated!]
```

---

#### 7. Versi API

| | Nilai |
| :--- | :--- |
| Versi sebelumnya | `0.2.0` |
| Versi sekarang | `0.3.0` |
| Engine | `hybrid-rule-ml` |
| Root endpoint | `GET /` mengembalikan `version`, `engine`, `ml_available`, `changelog` |

---

## [v0.2.0] — 2026-06-07

### 🆕 Yang Berubah

---

#### 1. `UserProfile` — 2 Field Baru (Opsional)

Field baru ini **opsional**. Jika tidak dikirim, backend tetap berjalan normal menggunakan skor netral (50) sehingga user tidak dihukum karena tidak mengisinya.

```typescript
// SEBELUM (v0.1.0)
interface UserProfile {
  major: string | null;
  semester: number | null;
  skills: { [key: string]: number };
  experiences: string[];
  preferences: { [key: string]: any };
}

// SESUDAH (v0.2.0)
interface UserProfile {
  major: string | null;
  semester: number | null;
  skills: { [key: string]: number };
  soft_skills: string[];              // BARU — opsional, kirim [] jika tidak ada
  interests: string[];                // BARU — opsional, kirim [] jika tidak ada
  experiences: string[];
  preferences: { [key: string]: any };
}
```

**Nilai valid untuk `soft_skills`** (gunakan key ini persis):
| Key | Label UI Saran |
| :--- | :--- |
| `attention_to_detail` | Perhatian terhadap Detail |
| `intellectual_curiosity` | Rasa Ingin Tahu Intelektual |
| `innovation` | Inovatif |
| `tolerance_for_ambiguity` | Toleransi Ketidakpastian |
| `critical_thinking` | Berpikir Kritis |
| `communication` | Komunikasi |
| `integrity` | Integritas |
| `dependability` | Dapat Diandalkan |
| `leadership` | Kepemimpinan |
| `cooperation` | Kerja Sama Tim |
| `stress_tolerance` | Tahan Tekanan |
| `adaptability` | Adaptif |
| `curiosity` | Rasa Ingin Tahu |
| `cautiousness` | Kehati-hatian |
| `perseverance` | Ketekunan |
| `originality` | Orisinalitas / Kreativitas |

**Nilai valid untuk `interests`** (gunakan key ini persis):
| Key | Label UI Saran |
| :--- | :--- |
| `mathematics_statistics` | Matematika & Statistika |
| `information_technology` | Teknologi Informasi |
| `investigative` | Investigatif / Analitis |
| `conventional` | Terstruktur / Prosedural |
| `engineering` | Rekayasa / Engineering |
| `management_administration` | Manajemen & Administrasi |
| `business_initiatives` | Inisiatif Bisnis |
| `enterprising` | Wirausaha / Enterprising |
| `marketing_advertising` | Pemasaran & Periklanan |
| `finance` | Keuangan |
| `accounting` | Akuntansi |
| `visual_arts` | Seni Visual |
| `applied_arts_and_design` | Desain & Seni Terapan |
| `media` | Media & Komunikasi |
| `artistic` | Artistik / Kreatif |

> [!TIP]
> Di UI, tampilkan `soft_skills` dan `interests` sebagai **checklist multi-pilih** (bukan slider angka). Pengguna cukup mencentang karakter yang relevan dengan dirinya.

---

#### 2. Response `/api/analyze` & `/api/validate` — 2 Field Baru

Setiap item hasil analisis sekarang memiliki field tambahan:

```typescript
// Tambahan di setiap item results[] (discovery) dan result (validation):

score_breakdown: {
  hard_skill_score: number;  // Skor khusus hard skills saja (0–100)
  soft_skill_score: number;  // Skor khusus soft skills (0–100), atau 50 jika tidak diisi
  interest_score: number;    // Skor khusus interests (0–100), atau 50 jika tidak diisi
};

narrative: string;
// Contoh:
// "Ada potensi yang bisa dikembangkan untuk karier Data Analyst.
//  Keahlianmu di bidang Statistika dan Spreadsheet sudah memenuhi standar...
//  Prioritaskan pengembangan di: Visualisasi Data dan SQL."
```

**Saran UI untuk field baru ini:**
- `score_breakdown` → Tampilkan sebagai **donut/breakdown chart kecil** di samping score utama (misal: 3 segmen: hard skill, soft skill, interest).
- `narrative` → Tampilkan sebagai **kartu penjelasan AI** di bawah score, dengan ikon 💡 atau "✨ Insight dari NalarPath AI:".

---

#### 3. Field `gaps` & `why_match` — Tambahan `weight`

Setiap item dalam array `gaps` dan `why_match` / `fulfilled_strengths` sekarang memiliki field `weight`:

```typescript
// SEBELUM
{ skill: string; current: number; required: number; gap: number }

// SESUDAH
{ skill: string; current: number; required: number; gap: number; weight: number }
// weight: bobot prioritas skill ini untuk karier tersebut (1.0 = standar, 3.0 = kritikal)
```

**Saran UI:** Gunakan `weight` untuk memberi **badge/label** pada gap yang paling kritis. Contoh:
- `weight >= 2.5` → badge merah 🔴 "Kritikal"
- `weight >= 1.5` → badge kuning 🟡 "Penting"
- `weight < 1.5` → badge abu-abu ⚪ "Standar"

---

#### 4. `GET /api/careers` — 2 Field Baru per Karier

```typescript
// Tambahan di setiap item careers[]:
skill_weights: { [skill: string]: number };  // Bobot per skill (1.0–3.0)
interests: string[];                          // Daftar interest karier
```

---

#### 5. Versi API

| | Nilai |
| :--- | :--- |
| Versi sebelumnya | `0.1.0` |
| Versi sekarang | `0.2.0` |
| Root endpoint | `GET /` sekarang mengembalikan field `version` dan `changelog` |

---

## [v0.1.0] — Versi Awal

Versi awal. Lihat [`README.md`](./README.md) untuk dokumentasi lengkap endpoint dan skema data dasar.

---

> Dokumen ini dikelola oleh tim Backend. Setiap perubahan API yang berdampak ke Frontend akan dicatat di sini.
