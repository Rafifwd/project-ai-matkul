import { useMutation } from '@tanstack/react-query';
import { analyzeCareer } from '../api/careerApi';
import type { UserProfile } from '../types';

export const useDiscovery = () => {
  return useMutation({
    mutationFn: ({
      profile,
      topN,
    }: {
      profile: UserProfile;
      topN?: number;
    }) => analyzeCareer(profile, topN),
  });
};