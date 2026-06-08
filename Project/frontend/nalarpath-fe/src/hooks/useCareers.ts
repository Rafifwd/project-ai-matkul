import { useQuery } from '@tanstack/react-query';
import { getCareers } from '../api/careerApi';

export const useCareers = () => {
  return useQuery({
    queryKey: ['careers'],
    queryFn: getCareers,
    staleTime: 5 * 60 * 1000,
  });
};