import { useQuery } from '@tanstack/react-query';
import { getCareerDetail } from '../api/careerApi';

export const useCareerDetail = (careerName: string) => {
  return useQuery({
    queryKey: ['career', careerName],
    queryFn: () => getCareerDetail(careerName),
    enabled: !!careerName,
  });
};