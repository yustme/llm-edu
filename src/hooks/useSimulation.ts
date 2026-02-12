import { useCallback, useEffect, useRef } from "react";
import { SimulationEngine } from "@/lib/simulation-engine";
import { useSimulationStore } from "@/stores/simulation.store";
import type { SimulationStep } from "@/types/agent.types";
import type { SpeedMultiplier } from "@/config/simulation.config";

/**
 * React hook that creates and manages a SimulationEngine instance,
 * syncing its state with the simulation Zustand store.
 */
export function useSimulation(steps: SimulationStep[]) {
  const store = useSimulationStore();
  const engineRef = useRef<SimulationEngine | null>(null);

  // Initialize engine and sync steps to store
  useEffect(() => {
    const engine = new SimulationEngine(steps, {
      onStepChange: (_step, index) => {
        const state = useSimulationStore.getState();
        useSimulationStore.setState({
          currentStepIndex: index,
          visibleSteps: state.steps.slice(0, index + 1),
        });
      },
      onComplete: () => {
        useSimulationStore.setState({ isPlaying: false });
      },
      onReset: () => {
        useSimulationStore.setState({
          currentStepIndex: -1,
          visibleSteps: [],
          isPlaying: false,
        });
      },
    });

    engineRef.current = engine;
    store.setSteps(steps);

    return () => {
      engine.destroy();
    };
    // Only re-create engine when steps array reference changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  const play = useCallback(() => {
    engineRef.current?.play();
    store.play();
  }, [store]);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    store.pause();
  }, [store]);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    store.reset();
  }, [store]);

  const nextStep = useCallback(() => {
    engineRef.current?.nextStep();
    // Store is synced via onStepChange callback
  }, []);

  const prevStep = useCallback(() => {
    engineRef.current?.prevStep();
    // Store is synced via onStepChange callback
  }, []);

  const setSpeed = useCallback(
    (multiplier: SpeedMultiplier) => {
      engineRef.current?.setSpeed(multiplier);
      store.setSpeed(multiplier);
    },
    [store],
  );

  return {
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setSpeed,
    currentStep:
      store.currentStepIndex >= 0
        ? store.steps[store.currentStepIndex] ?? null
        : null,
    visibleSteps: store.visibleSteps,
    isPlaying: store.isPlaying,
    isComplete:
      store.currentStepIndex >= 0 &&
      store.currentStepIndex >= store.steps.length - 1,
    speed: store.speed,
  };
}
