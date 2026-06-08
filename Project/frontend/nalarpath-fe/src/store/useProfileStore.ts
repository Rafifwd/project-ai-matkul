import { create } from 'zustand';
import type { UserProfile } from '../types';

interface ProfileStore {
  profile: UserProfile;
  setProfile: (partial: Partial<UserProfile>) => void;
  setSkill: (key: string, value: number) => void;
  toggleSoftSkill: (key: string) => void;
  toggleInterest: (key: string) => void;
  addExperience: (exp: string) => void;
  removeExperience: (index: number) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  major: null,
  semester: null,
  skills: {},
  soft_skills: [],   // v0.2
  interests: [],     // v0.2
  experiences: [],
  preferences: {},
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: defaultProfile,

  setProfile: (partial) =>
    set((state) => ({ profile: { ...state.profile, ...partial } })),

  setSkill: (key, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        skills: { ...state.profile.skills, [key]: value },
      },
    })),

  /** Toggle satu item di soft_skills (centang/hapus centang) */
  toggleSoftSkill: (key) =>
    set((state) => {
      const current = state.profile.soft_skills;
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { profile: { ...state.profile, soft_skills: next } };
    }),

  /** Toggle satu item di interests (centang/hapus centang) */
  toggleInterest: (key) =>
    set((state) => {
      const current = state.profile.interests;
      const next = current.includes(key)
        ? current.filter((k) => k !== key)
        : [...current, key];
      return { profile: { ...state.profile, interests: next } };
    }),

  addExperience: (exp) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experiences: [...state.profile.experiences, exp],
      },
    })),

  removeExperience: (index) =>
    set((state) => ({
      profile: {
        ...state.profile,
        experiences: state.profile.experiences.filter((_, i) => i !== index),
      },
    })),

  resetProfile: () => set({ profile: defaultProfile }),
}));
