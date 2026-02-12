import { create } from "zustand";

interface PresentationState {
  currentModuleId: number | null;
  currentStep: number;
  totalSteps: number;

  setModule: (moduleId: number, totalSteps: number) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentModuleId: null,
  currentStep: 1,
  totalSteps: 0,

  setModule: (moduleId, totalSteps) =>
    set({ currentModuleId: moduleId, currentStep: 1, totalSteps }),

  setStep: (step) => {
    const { totalSteps } = get();
    if (step >= 1 && step <= totalSteps) {
      set({ currentStep: step });
    }
  },

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  reset: () => set({ currentStep: 1 }),
}));
