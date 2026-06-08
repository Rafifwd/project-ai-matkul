import { useMutation } from '@tanstack/react-query';
import { validateCareer } from '../api/careerApi';
import type { UserProfile } from '../types';

export const useValidation = () => {
  return useMutation({
    mutationFn: ({
      targetCareer,
      profile,
    }: {
      targetCareer: string;
      profile: UserProfile;
    }) => validateCareer(targetCareer, profile),
  });
};