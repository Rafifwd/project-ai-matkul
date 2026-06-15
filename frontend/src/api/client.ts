import axios from 'axios'
import type {
  UserProfile,
  AnalyzeResponse,
  ValidateResponse,
  CareerListItem,
  CareerDetail,
  ModelInfo,
  TrainingStatus,
  HealthCheck,
} from '../types/api'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

export const checkApiHealth = async (): Promise<HealthCheck> => {
  const response = await API.get('/api/health')
  return response.data
}

export const getCareers = async (): Promise<CareerListItem[]> => {
  const response = await API.get('/api/careers')
  return response.data.careers
}

export const getCareerDetail = async (careerName: string): Promise<CareerDetail> => {
  const response = await API.get(`/api/careers/${encodeURIComponent(careerName)}`)
  return response.data
}

export const analyzeCareer = async (
  profile: UserProfile,
  topN: number = 3,
): Promise<AnalyzeResponse> => {
  const response = await API.post('/api/analyze', { profile, top_n: topN })
  return response.data
}

export const validateTargetCareer = async (
  targetCareer: string,
  profile: UserProfile,
): Promise<ValidateResponse> => {
  const response = await API.post('/api/validate', {
    target_career: targetCareer,
    profile,
  })
  return response.data
}

export const getModelInfo = async (): Promise<ModelInfo> => {
  const response = await API.get('/api/model/info')
  return response.data
}

export const triggerTraining = async (): Promise<{
  status: string
  job_id: string
  message: string
}> => {
  const response = await API.post('/api/train')
  return response.data
}

export const getTrainingStatus = async (): Promise<TrainingStatus> => {
  const response = await API.get('/api/train/status')
  return response.data
}

export default API
