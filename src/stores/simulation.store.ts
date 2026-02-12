import { create } from "zustand";
import { SIMULATION } from "@/config/simulation.config";
import type { SimulationStep } from "@/types/agent.types";
import type { SpeedMultiplier } from "@/config/simulation.config";

interface SimulationState {
  isPlaying: boolean;
  speed: SpeedMultiplier;
  currentStepIndex: number;
  steps: SimulationStep[];
  visibleSteps: SimulationStep[];

  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;
  setSteps: (steps: SimulationStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isPlaying: false,
  speed: SIMULATION.speedMultipliers[SIMULATION.defaultSpeedMultiplierIndex],
  currentStepIndex: -1,
  steps: [],
  visibleSteps: [],

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () =>
    set({
      isPlaying: false,
      currentStepIndex: -1,
      visibleSteps: [],
    }),

  setSpeed: (speed) => set({ speed }),

  setSteps: (steps) =>
    set({
      steps,
      currentStepIndex: -1,
      visibleSteps: [],
      isPlaying: false,
    }),

  nextStep: () => {
    const { currentStepIndex, steps } = get();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      set({
        currentStepIndex: nextIndex,
        visibleSteps: steps.slice(0, nextIndex + 1),
      });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      set({
        currentStepIndex: prevIndex,
        visibleSteps: steps.slice(0, prevIndex + 1),
      });
    }
  },
}));
