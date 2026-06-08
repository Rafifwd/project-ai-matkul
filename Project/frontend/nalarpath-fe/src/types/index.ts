// ──────────────────────────────────────────────
// NalarPath — Type Definitions (v0.3.0)
// ──────────────────────────────────────────────

export interface UserProfile {
  major: string | null;
  semester: number | null;
  skills: Record<string, number>;
  soft_skills: string[];         // v0.2 — checklist, kirim [] jika kosong
  interests: string[];           // v0.2 — checklist, kirim [] jika kosong
  experiences: string[];
  preferences: Record<string, any>;
}

// ── Catalog ──────────────────────────────────

export interface CareerSummary {
  name: string;
  source: string;
  onet_code: string;
  hard_skills: Record<string, number>;
  skill_weights: Record<string, number>; // v0.2
  soft_skills: string[];
  interests: string[];                   // v0.2
  related_courses: string[];
}

export interface CareerDetail extends CareerSummary {
  source_basis: {
    primary_onet_occupation: string;
    onet_code: string;
    source_url: string;
  };
  portfolio: string[];
  learning_path: string[];
  resources: {
    free: string[];
    paid: string[];
  };
}

// ── Shared result pieces ──────────────────────

export interface SkillGapItem {
  skill: string;
  current: number;
  required: number;
  gap?: number;
  weight?: number; // v0.2 — bobot prioritas (1.0 = standar, 3.0 = kritikal)
}

/** v0.2 — breakdown skor per dimensi */
export interface ScoreBreakdown {
  hard_skill_score: number;
  soft_skill_score: number;
  interest_score: number;
}

/** v0.3 — penjelasan SHAP dari ML layer */
export interface ShapFeature {
  feature: string;
  shap_value: number;
  label: string;
  feature_value: number;
}

export interface ShapExplanation {
  top_positive_features: ShapFeature[];
  top_negative_features: ShapFeature[];
  shap_narrative: string;
  raw_shap_values: Record<string, number>;
}

// ── Discovery ─────────────────────────────────

export interface DiscoveryResult {
  career: string;
  score: number;               // = hybrid_score (backward-compatible)
  rule_score: number;          // v0.3
  ml_probability: number | null; // v0.3 — 0.0-1.0, null jika ML belum aktif
  hybrid_score: number;        // v0.3
  engine_mode: 'hybrid' | 'rule-only'; // v0.3
  confidence_message: string;
  score_breakdown: ScoreBreakdown;   // v0.2
  narrative: string;                 // v0.2
  shap_explanation: ShapExplanation | null; // v0.3
  why_match: SkillGapItem[];
  gaps: SkillGapItem[];
  free_resources: string[];
  paid_resources: string[];
}

export interface ModelInfoSummary {
  available: boolean;
  model_type: string | null;
  cv_accuracy: number | null;
}

export interface DiscoveryResponse {
  mode: 'discovery';
  engine_version: string;      // v0.3
  profile: UserProfile;
  results: DiscoveryResult[];
  model_info: ModelInfoSummary; // v0.3
  ethical_notice: string;
}

// ── Validation ────────────────────────────────

export interface LearningStep {
  skill: string;
  reason: string;
}

export interface ValidationResult {
  target_career: string;
  score: number;               // = hybrid_score
  rule_score: number;          // v0.3
  ml_probability: number | null; // v0.3
  hybrid_score: number;        // v0.3
  engine_mode: 'hybrid' | 'rule-only'; // v0.3
  confidence_message: string;
  score_breakdown: ScoreBreakdown;   // v0.2
  narrative: string;                 // v0.2
  shap_explanation: ShapExplanation | null; // v0.3
  fulfilled_strengths: SkillGapItem[];
  critical_gaps: SkillGapItem[];
  recommended_learning_order: LearningStep[];
  portfolio: string[];
  free_resources: string[];
  paid_resources: string[];
  ethical_notice: string;
}

export interface ValidationResponse {
  mode: 'validation';
  profile: UserProfile;
  result: ValidationResult;
  model_info: ModelInfoSummary; // v0.3
}

// ── Model / Training (v0.3) ───────────────────

export interface ModelInfo {
  available: boolean;
  model_type?: string;
  cv_accuracy?: number;
  cv_f1_macro?: number;
  training_date?: string;
  sample_count?: number;
  class_count?: number;
  class_names?: string[];
  feature_names?: string[];
}

export type TrainingStatus =
  | 'idle'
  | 'started'
  | 'generating_data'
  | 'training'
  | 'completed'
  | 'failed';

export interface TrainingState {
  status: TrainingStatus;
  job_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  error: string | null;
  result: {
    model_type: string;
    cv_accuracy: number;
    cv_f1_macro: number;
    sample_count: number;
  } | null;
}

export interface TriggerTrainingResponse {
  status: 'started' | 'already_running';
  job_id: string;
  message: string;
}
