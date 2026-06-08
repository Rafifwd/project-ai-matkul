import apiClient from './apiClient';
import type {
  CareerSummary,
  CareerDetail,
  UserProfile,
  DiscoveryResponse,
  ValidationResponse,
  ModelInfo,
  TrainingState,
  TriggerTrainingResponse,
} from '../types';

// ── Health ────────────────────────────────────

export const checkHealth = async () => {
  const res = await apiClient.get('/api/health');
  return res.data as { status: string; career_count: number; ml_available: boolean };
};

// ── Catalog ───────────────────────────────────

export const getCareers = async (): Promise<CareerSummary[]> => {
  const res = await apiClient.get('/api/careers');
  return res.data.careers;
};

export const getCareerDetail = async (careerName: string): Promise<CareerDetail> => {
  const res = await apiClient.get(`/api/careers/${encodeURIComponent(careerName)}`);
  return res.data;
};

// ── Analysis ──────────────────────────────────

export const analyzeCareer = async (
  profile: UserProfile,
  topN = 3
): Promise<DiscoveryResponse> => {
  const res = await apiClient.post('/api/analyze', { profile, top_n: topN });
  return res.data;
};

export const validateCareer = async (
  targetCareer: string,
  profile: UserProfile
): Promise<ValidationResponse> => {
  const res = await apiClient.post('/api/validate', {
    target_career: targetCareer,
    profile,
  });
  return res.data;
};

// ── Model & Training (v0.3) ───────────────────

/** Ambil info model ML yang sedang aktif */
export const getModelInfo = async (): Promise<ModelInfo> => {
  const res = await apiClient.get('/api/model/info');
  return res.data;
};

/** Trigger retraining model (background job) */
export const triggerTraining = async (): Promise<TriggerTrainingResponse> => {
  const res = await apiClient.post('/api/train');
  return res.data;
};

/** Cek status training job yang sedang/sudah berjalan */
export const getTrainingStatus = async (): Promise<TrainingState> => {
  const res = await apiClient.get('/api/train/status');
  return res.data;
};
