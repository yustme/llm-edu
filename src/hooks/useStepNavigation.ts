import { useCallback } from "react";
import { usePresentationStore } from "@/stores/presentation.store";

/**
 * Wraps the presentation store to provide within-module step navigation.
 * Returns navigation helpers and current state.
 */
export function useStepNavigation() {
  const store = usePresentationStore();

  const goToStep = useCallback(
    (step: number) => {
      store.setStep(step);
    },
    [store],
  );

  const nextStep = useCallback(() => {
    store.nextStep();
  }, [store]);

  const prevStep = useCallback(() => {
    store.prevStep();
  }, [store]);

  return {
    currentStep: store.currentStep,
    totalSteps: store.totalSteps,
    goToStep,
    nextStep,
    prevStep,
    canGoNext: store.currentStep < store.totalSteps,
    canGoPrev: store.currentStep > 1,
  };
}
