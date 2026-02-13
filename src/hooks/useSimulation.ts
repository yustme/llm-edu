import { useCallback, useEffect, useRef } from "react";
import { SimulationEngine } from "@/lib/simulation-engine";
import { useSimulationStore } from "@/stores/simulation.store";
import type { SimulationStep } from "@/types/agent.types";
import type { SpeedMultiplier } from "@/config/simulation.config";

/**
 * React hook that creates and manages a SimulationEngine instance,
 * syncing its state with the simulation Zustand store.
 *
 * Uses selectors and getState() to avoid subscribing to the entire
 * store object, which would cause infinite re-render loops when
 * actions update state.
 */
export function useSimulation(steps: SimulationStep[]) {
  const engineRef = useRef<SimulationEngine | null>(null);

  // Subscribe only to the values we need for rendering
  const visibleSteps = useSimulationStore((s) => s.visibleSteps);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const currentStepIndex = useSimulationStore((s) => s.currentStepIndex);
  const storeSteps = useSimulationStore((s) => s.steps);
  const speed = useSimulationStore((s) => s.speed);

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
    useSimulationStore.getState().setSteps(steps);

    return () => {
      engine.destroy();
      useSimulationStore.getState().setSteps([]);
    };
  }, [steps]);

  const play = useCallback(() => {
    engineRef.current?.play();
    useSimulationStore.getState().play();
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    useSimulationStore.getState().pause();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
    useSimulationStore.getState().reset();
  }, []);

  const nextStep = useCallback(() => {
    engineRef.current?.nextStep();
  }, []);

  const prevStep = useCallback(() => {
    engineRef.current?.prevStep();
  }, []);

  const setSpeed = useCallback((multiplier: SpeedMultiplier) => {
    engineRef.current?.setSpeed(multiplier);
    useSimulationStore.getState().setSpeed(multiplier);
  }, []);

  return {
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setSpeed,
    currentStep:
      currentStepIndex >= 0
        ? storeSteps[currentStepIndex] ?? null
        : null,
    visibleSteps,
    isPlaying,
    isComplete:
      currentStepIndex >= 0 &&
      currentStepIndex >= storeSteps.length - 1,
    speed,
  };
}
