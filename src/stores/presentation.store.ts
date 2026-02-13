import { create } from "zustand";
import { FONT_SCALE_LEVELS } from "@/config/theme.config";
import type { FontScaleLevel } from "@/config/theme.config";

/** Callbacks for arrow-key control of interactive content in fullscreen */
export interface FullscreenStepper {
  /** Advance to next state. Returns true if advanced, false if already at end. */
  next: () => boolean;
  /** Go to previous state. Returns true if went back, false if already at start. */
  prev: () => boolean;
}

interface PresentationState {
  currentModuleId: number | null;
  currentStep: number;
  totalSteps: number;
  isFullscreen: boolean;
  fontScale: FontScaleLevel;
  queryIndex: number;
  queryCount: number;
  /** True when the user has reached the boundary (end/start) in fullscreen and needs one more press to leave */
  fullscreenBoundaryReached: boolean;
  /** Registered stepper for arrow-key control of interactive content */
  fullscreenStepper: FullscreenStepper | null;

  setModule: (moduleId: number, totalSteps: number) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  registerQueries: (count: number) => void;
  setQueryIndex: (index: number) => void;
  nextQuery: () => boolean;
  prevQuery: () => boolean;
  registerStepper: (stepper: FullscreenStepper) => void;
  unregisterStepper: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  currentModuleId: null,
  currentStep: 1,
  totalSteps: 0,
  isFullscreen: false,
  fontScale: 100 as FontScaleLevel,
  queryIndex: 0,
  queryCount: 0,
  fullscreenBoundaryReached: false,
  fullscreenStepper: null,

  setModule: (moduleId, totalSteps) =>
    set({ currentModuleId: moduleId, currentStep: 1, totalSteps, isFullscreen: false, queryIndex: 0, queryCount: 0, fullscreenBoundaryReached: false, fullscreenStepper: null }),

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

  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen, fullscreenBoundaryReached: false })),
  setFullscreen: (value) => set({ isFullscreen: value, fullscreenBoundaryReached: false }),

  registerQueries: (count) => set({ queryCount: count, queryIndex: 0, fullscreenBoundaryReached: false }),
  setQueryIndex: (index) => set({ queryIndex: index, fullscreenBoundaryReached: false }),
  nextQuery: () => {
    const { queryIndex, queryCount } = get();
    if (queryIndex < queryCount - 1) {
      set({ queryIndex: queryIndex + 1 });
      return true;
    }
    return false;
  },
  prevQuery: () => {
    const { queryIndex } = get();
    if (queryIndex > 0) {
      set({ queryIndex: queryIndex - 1 });
      return true;
    }
    return false;
  },

  registerStepper: (stepper) => set({ fullscreenStepper: stepper }),
  unregisterStepper: () => set({ fullscreenStepper: null }),

  increaseFontScale: () => {
    const { fontScale } = get();
    const idx = FONT_SCALE_LEVELS.indexOf(fontScale);
    if (idx < FONT_SCALE_LEVELS.length - 1) {
      set({ fontScale: FONT_SCALE_LEVELS[idx + 1] });
    }
  },
  decreaseFontScale: () => {
    const { fontScale } = get();
    const idx = FONT_SCALE_LEVELS.indexOf(fontScale);
    if (idx > 0) {
      set({ fontScale: FONT_SCALE_LEVELS[idx - 1] });
    }
  },
}));
