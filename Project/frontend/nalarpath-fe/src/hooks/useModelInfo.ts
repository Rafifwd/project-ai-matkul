// src/hooks/useModelInfo.ts
import { useQuery } from '@tanstack/react-query';
import { getModelInfo } from '../api/careerApi';

export const useModelInfo = () => {
  return useQuery({
    queryKey: ['modelInfo'],
    queryFn: getModelInfo,
    staleTime: 60 * 1000, // refresh tiap 1 menit
  });
};
