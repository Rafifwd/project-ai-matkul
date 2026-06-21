// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  major: string | null;
  semester: number | null;
  skills: Record<string, number>;
  soft_skills: string[];
  interests: string[];
  experiences: string[];
  preferences: Record<string, unknown>;
}

// ─── Shared ──────────────────────────────────────────────────────────────────

export type Resource = string | { title: string; url: string };

// ─── Career Catalog ───────────────────────────────────────────────────────────

export interface CareerListItem {
  name: string;
  source: string | null;
  onet_code: string | null;
  hard_skills: Record<string, number>;
  skill_weights: Record<string, number>;
  soft_skills: string[];
  interests: string[];
  related_courses: string[];
}

export interface CareerDetail {
  name: string;
  source_basis?: {
    primary_onet_occupation?: string;
    onet_code?: string;
    source_url?: string;
    notebook_data_note?: string;
  };
  hard_skills: Record<string, number>;
  skill_weights?: Record<string, number>;
  soft_skills: string[];
  interests: string[];
  related_courses: string[];
  portfolio?: string[];
  learning_path?: Array<{ skill: string; reason?: string } | string>;
  resources?: {
    free?: Resource[];
    paid?: Resource[];
  };
  onet_evidence?: {
    top_work_styles?: string[];
    top_interest_areas?: string[];
    representative_tasks?: string[];
  } | string;
}

// ─── Analysis Results ─────────────────────────────────────────────────────────

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

export interface ScoreBreakdown {
  hard_skill_score: number;
  soft_skill_score: number;
  interest_score: number;
}

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap?: number;
  weight?: number;
}

export interface LearningStep {
  skill: string;
  reason: string;
}

// ─── Discovery Mode ───────────────────────────────────────────────────────────

export interface DiscoveryResult {
  career: string;
  score: number;
  rule_score: number;
  ml_probability: number | null;
  hybrid_score: number;
  engine_mode: string;
  confidence_message: string;
  why_match: SkillGap[];
  gaps: SkillGap[];
  score_breakdown: ScoreBreakdown;
  narrative: string;
  shap_explanation: ShapExplanation | null;
  free_resources: Resource[];
  paid_resources: Resource[];
}

export interface AnalyzeResponse {
  mode: "discovery";
  engine_version: string;
  profile: UserProfile;
  results: DiscoveryResult[];
  model_info: {
    available: boolean;
    model_type: string | null;
    cv_accuracy: number | null;
  };
  ethical_notice: string;
}

// ─── Validation Mode ──────────────────────────────────────────────────────────

export interface ValidationResult {
  target_career: string;
  score: number;
  rule_score: number;
  ml_probability: number | null;
  hybrid_score: number;
  engine_mode: string;
  confidence_message: string;
  fulfilled_strengths: SkillGap[];
  critical_gaps: SkillGap[];
  recommended_learning_order: LearningStep[];
  portfolio: string[];
  free_resources: Resource[];
  paid_resources: Resource[];
  ethical_notice?: string;
  score_breakdown?: ScoreBreakdown;
  narrative?: string;
  shap_explanation?: ShapExplanation | null;
}

export interface ValidateResponse {
  mode: "validation";
  profile: UserProfile;
  result: ValidationResult;
  model_info: {
    available: boolean;
    model_type: string | null;
    cv_accuracy: number | null;
  };
}

// ─── Model Info ───────────────────────────────────────────────────────────────

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

export interface TrainingStatus {
  status:
    | "idle"
    | "started"
    | "generating_data"
    | "training"
    | "completed"
    | "failed";
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

export interface HealthCheck {
  status: string;
  career_count: number;
  engine_version: string;
  ml_available: boolean;
}
