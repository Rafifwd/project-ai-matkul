import { useState } from 'react';
import StepAcademic from './StepAcademic';
import StepSkills from './StepSkills';
import StepSoftSkills from './StepSoftSkills';
import StepExperience from './StepExperience';
import { useProfileStore } from '../../../store/useProfileStore';

interface ProfileFormStepperProps {
  onSubmit: () => void;
  isLoading: boolean;
}

// v0.2: Tambah step "Karakter & Minat" sebelum Pengalaman
const steps = ['Info Akademik', 'Level Keahlian', 'Karakter & Minat', 'Pengalaman'];

export default function ProfileFormStepper({ onSubmit, isLoading }: ProfileFormStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { profile } = useProfileStore();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return profile.major && profile.major.trim() !== '' && profile.semester !== null;
    }
    // Step lain (skills, soft skills, experience) opsional — selalu bisa lanjut
    return true;
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  index < currentStep
                    ? 'bg-secondary text-on-secondary'
                    : index === currentStep
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  index === currentStep ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                  index < currentStep ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {currentStep === 0 && <StepAcademic />}
        {currentStep === 1 && <StepSkills />}
        {currentStep === 2 && <StepSoftSkills />}
        {currentStep === 3 && <StepExperience />}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-outline-variant">
        <button
          onClick={handleBack}
          disabled={isFirstStep}
          className="px-5 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Kembali
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Menganalisis...
            </>
          ) : isLastStep ? (
            'Analisis Sekarang'
          ) : (
            'Lanjut'
          )}
        </button>
      </div>
    </div>
  );
}