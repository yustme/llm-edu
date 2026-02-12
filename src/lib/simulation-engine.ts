import type { SimulationStep } from "@/types/agent.types";
import { SIMULATION } from "@/config/simulation.config";

export interface SimulationEngineCallbacks {
  onStepChange?: (step: SimulationStep, index: number) => void;
  onComplete?: () => void;
  onReset?: () => void;
}

/**
 * Core simulation engine that manages step-by-step progression
 * through a sequence of SimulationSteps with configurable speed.
 */
export class SimulationEngine {
  private steps: SimulationStep[];
  private callbacks: SimulationEngineCallbacks;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private _currentStepIndex = -1;
  private _isPlaying = false;
  private _speed: number;

  constructor(
    steps: SimulationStep[],
    callbacks: SimulationEngineCallbacks = {},
  ) {
    this.steps = steps;
    this.callbacks = callbacks;
    this._speed = SIMULATION.speedMultipliers[SIMULATION.defaultSpeedMultiplierIndex];
  }

  /** Current step index (-1 means no step has been shown yet) */
  get currentStepIndex(): number {
    return this._currentStepIndex;
  }

  /** The current step object, or null if no step is active */
  get currentStep(): SimulationStep | null {
    if (this._currentStepIndex < 0 || this._currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this._currentStepIndex];
  }

  /** All steps up to and including the current step */
  get visibleSteps(): SimulationStep[] {
    if (this._currentStepIndex < 0) return [];
    return this.steps.slice(0, this._currentStepIndex + 1);
  }

  /** Whether the engine is currently auto-playing */
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  /** Whether all steps have been shown */
  get isComplete(): boolean {
    if (this.steps.length === 0) return false;
    return this._currentStepIndex >= this.steps.length - 1;
  }

  /** Current speed multiplier */
  get speed(): number {
    return this._speed;
  }

  /** Total number of steps */
  get totalSteps(): number {
    return this.steps.length;
  }

  /** Start auto-playing through steps */
  play(): void {
    if (this.isComplete) return;
    this._isPlaying = true;
    this.scheduleNext();
  }

  /** Pause auto-play */
  pause(): void {
    this._isPlaying = false;
    this.clearTimer();
  }

  /** Reset to the beginning */
  reset(): void {
    this.pause();
    this._currentStepIndex = -1;
    this.callbacks.onReset?.();
  }

  /** Advance to the next step manually */
  nextStep(): void {
    const nextIndex = this._currentStepIndex + 1;
    if (nextIndex < this.steps.length) {
      this._currentStepIndex = nextIndex;
      this.callbacks.onStepChange?.(this.steps[nextIndex], nextIndex);

      if (this.isComplete) {
        this._isPlaying = false;
        this.clearTimer();
        this.callbacks.onComplete?.();
      }
    }
  }

  /** Go back to the previous step */
  prevStep(): void {
    if (this._currentStepIndex > 0) {
      this._currentStepIndex -= 1;
      this.callbacks.onStepChange?.(
        this.steps[this._currentStepIndex],
        this._currentStepIndex,
      );
    }
  }

  /** Set the speed multiplier */
  setSpeed(multiplier: number): void {
    this._speed = multiplier;
  }

  /** Calculate the effective delay for a step considering the speed multiplier */
  private getEffectiveDelay(step: SimulationStep): number {
    const rawDelay = step.delayMs / this._speed;
    return Math.max(rawDelay, SIMULATION.minStepDelayMs);
  }

  /** Schedule the next step to play after the appropriate delay */
  private scheduleNext(): void {
    this.clearTimer();
    if (!this._isPlaying || this.isComplete) return;

    // Determine the delay: use the next step's delay
    const nextIndex = this._currentStepIndex + 1;
    if (nextIndex >= this.steps.length) return;

    const nextStep = this.steps[nextIndex];
    const delay = this.getEffectiveDelay(nextStep);

    this.timerId = setTimeout(() => {
      if (!this._isPlaying) return;
      this.nextStep();
      if (this._isPlaying && !this.isComplete) {
        this.scheduleNext();
      }
    }, delay);
  }

  /** Clear any pending timer */
  private clearTimer(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /** Clean up resources */
  destroy(): void {
    this.pause();
    this.clearTimer();
  }
}
