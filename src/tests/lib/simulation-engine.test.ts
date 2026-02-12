import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SimulationEngine } from "@/lib/simulation-engine";
import type { SimulationStep } from "@/types/agent.types";

function createSteps(count: number, delayMs = 1000): SimulationStep[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${i}`,
    type: "agent-message" as const,
    actor: "test-agent",
    content: `Step ${i} content`,
    delayMs,
  }));
}

describe("SimulationEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("starts with no visible steps and not playing", () => {
      const engine = new SimulationEngine(createSteps(3));

      expect(engine.currentStepIndex).toBe(-1);
      expect(engine.currentStep).toBeNull();
      expect(engine.visibleSteps).toEqual([]);
      expect(engine.isPlaying).toBe(false);
      expect(engine.isComplete).toBe(false);
    });

    it("reports correct total steps", () => {
      const engine = new SimulationEngine(createSteps(5));
      expect(engine.totalSteps).toBe(5);
    });
  });

  describe("play / step progression", () => {
    it("advances through steps when playing", () => {
      const onStepChange = vi.fn();
      const steps = createSteps(3, 500);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.play();
      expect(engine.isPlaying).toBe(true);

      // Advance past first step delay
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(0);
      expect(onStepChange).toHaveBeenCalledWith(steps[0], 0);

      // Advance past second step delay
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(1);
      expect(onStepChange).toHaveBeenCalledWith(steps[1], 1);

      // Advance past third step delay
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(2);
      expect(engine.isComplete).toBe(true);
      expect(engine.isPlaying).toBe(false);

      engine.destroy();
    });

    it("does not restart play if already complete", () => {
      const steps = createSteps(1, 500);
      const engine = new SimulationEngine(steps);

      engine.play();
      vi.advanceTimersByTime(500);
      expect(engine.isComplete).toBe(true);

      engine.play();
      expect(engine.isPlaying).toBe(false);

      engine.destroy();
    });
  });

  describe("pause", () => {
    it("stops progression when paused", () => {
      const steps = createSteps(5, 500);
      const engine = new SimulationEngine(steps);

      engine.play();

      // Advance one step
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(0);

      engine.pause();
      expect(engine.isPlaying).toBe(false);

      // Advance more time - should NOT progress
      vi.advanceTimersByTime(2000);
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });
  });

  describe("reset", () => {
    it("returns to the beginning", () => {
      const onReset = vi.fn();
      const steps = createSteps(3, 500);
      const engine = new SimulationEngine(steps, { onReset });

      engine.play();
      vi.advanceTimersByTime(1000);
      expect(engine.currentStepIndex).toBe(1);

      engine.reset();
      expect(engine.currentStepIndex).toBe(-1);
      expect(engine.visibleSteps).toEqual([]);
      expect(engine.isPlaying).toBe(false);
      expect(onReset).toHaveBeenCalledOnce();

      engine.destroy();
    });
  });

  describe("nextStep / prevStep (manual navigation)", () => {
    it("nextStep advances one step", () => {
      const onStepChange = vi.fn();
      const steps = createSteps(3);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.nextStep();
      expect(engine.currentStepIndex).toBe(0);
      expect(engine.currentStep).toEqual(steps[0]);
      expect(onStepChange).toHaveBeenCalledWith(steps[0], 0);

      engine.nextStep();
      expect(engine.currentStepIndex).toBe(1);
      expect(engine.currentStep).toEqual(steps[1]);

      engine.destroy();
    });

    it("prevStep goes back one step", () => {
      const onStepChange = vi.fn();
      const steps = createSteps(3);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.nextStep(); // index 0
      engine.nextStep(); // index 1
      engine.nextStep(); // index 2

      engine.prevStep();
      expect(engine.currentStepIndex).toBe(1);
      expect(engine.currentStep).toEqual(steps[1]);

      engine.destroy();
    });

    it("nextStep does nothing at the end", () => {
      const steps = createSteps(2);
      const engine = new SimulationEngine(steps);

      engine.nextStep(); // 0
      engine.nextStep(); // 1 (last)
      engine.nextStep(); // should be no-op

      expect(engine.currentStepIndex).toBe(1);
      expect(engine.isComplete).toBe(true);

      engine.destroy();
    });

    it("prevStep does nothing at the beginning", () => {
      const steps = createSteps(3);
      const engine = new SimulationEngine(steps);

      engine.nextStep(); // index 0

      engine.prevStep(); // should stay at 0 (cannot go below 0)
      // Engine prevents going below index 0
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });
  });

  describe("speed multiplier", () => {
    it("affects timing - faster speed means shorter delays", () => {
      const onStepChange = vi.fn();
      const steps = createSteps(3, 1000);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.setSpeed(2);
      expect(engine.speed).toBe(2);

      engine.play();

      // At 2x speed, 1000ms delay becomes 500ms
      vi.advanceTimersByTime(499);
      expect(engine.currentStepIndex).toBe(-1);

      vi.advanceTimersByTime(1);
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });

    it("slower speed means longer delays", () => {
      const onStepChange = vi.fn();
      const steps = createSteps(3, 1000);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.setSpeed(0.5);

      engine.play();

      // At 0.5x speed, 1000ms delay becomes 2000ms
      vi.advanceTimersByTime(1999);
      expect(engine.currentStepIndex).toBe(-1);

      vi.advanceTimersByTime(1);
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });

    it("respects minimum delay", () => {
      const onStepChange = vi.fn();
      // Very short delay with high speed multiplier
      const steps = createSteps(2, 100);
      const engine = new SimulationEngine(steps, { onStepChange });

      engine.setSpeed(2);
      engine.play();

      // 100ms / 2 = 50ms, but minStepDelayMs is 200ms
      vi.advanceTimersByTime(199);
      expect(engine.currentStepIndex).toBe(-1);

      vi.advanceTimersByTime(1);
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });
  });

  describe("completion callback", () => {
    it("fires onComplete when the last step is reached via play", () => {
      const onComplete = vi.fn();
      const steps = createSteps(2, 500);
      const engine = new SimulationEngine(steps, { onComplete });

      engine.play();

      // First step
      vi.advanceTimersByTime(500);
      expect(onComplete).not.toHaveBeenCalled();

      // Second (last) step
      vi.advanceTimersByTime(500);
      expect(onComplete).toHaveBeenCalledOnce();

      engine.destroy();
    });

    it("fires onComplete when last step reached via manual nextStep", () => {
      const onComplete = vi.fn();
      const steps = createSteps(2);
      const engine = new SimulationEngine(steps, { onComplete });

      engine.nextStep(); // 0
      expect(onComplete).not.toHaveBeenCalled();

      engine.nextStep(); // 1 (last)
      expect(onComplete).toHaveBeenCalledOnce();

      engine.destroy();
    });
  });

  describe("visibleSteps accumulation", () => {
    it("accumulates all steps up to current", () => {
      const steps = createSteps(4);
      const engine = new SimulationEngine(steps);

      expect(engine.visibleSteps).toEqual([]);

      engine.nextStep(); // 0
      expect(engine.visibleSteps).toEqual([steps[0]]);

      engine.nextStep(); // 1
      expect(engine.visibleSteps).toEqual([steps[0], steps[1]]);

      engine.nextStep(); // 2
      expect(engine.visibleSteps).toEqual([steps[0], steps[1], steps[2]]);

      engine.destroy();
    });

    it("shrinks visibleSteps when going back", () => {
      const steps = createSteps(4);
      const engine = new SimulationEngine(steps);

      engine.nextStep(); // 0
      engine.nextStep(); // 1
      engine.nextStep(); // 2

      expect(engine.visibleSteps).toHaveLength(3);

      engine.prevStep(); // back to 1
      expect(engine.visibleSteps).toHaveLength(2);
      expect(engine.visibleSteps).toEqual([steps[0], steps[1]]);

      engine.destroy();
    });

    it("clears visibleSteps on reset", () => {
      const steps = createSteps(3);
      const engine = new SimulationEngine(steps);

      engine.nextStep();
      engine.nextStep();
      expect(engine.visibleSteps).toHaveLength(2);

      engine.reset();
      expect(engine.visibleSteps).toEqual([]);

      engine.destroy();
    });
  });

  describe("boundary conditions", () => {
    it("handles empty steps array", () => {
      const engine = new SimulationEngine([]);

      expect(engine.totalSteps).toBe(0);
      expect(engine.isComplete).toBe(false);
      expect(engine.currentStep).toBeNull();

      engine.nextStep(); // should be no-op
      expect(engine.currentStepIndex).toBe(-1);

      engine.destroy();
    });

    it("handles single step", () => {
      const onComplete = vi.fn();
      const steps = createSteps(1, 500);
      const engine = new SimulationEngine(steps, { onComplete });

      engine.play();
      vi.advanceTimersByTime(500);

      expect(engine.currentStepIndex).toBe(0);
      expect(engine.isComplete).toBe(true);
      expect(onComplete).toHaveBeenCalledOnce();

      engine.destroy();
    });

    it("prevStep at start does nothing", () => {
      const steps = createSteps(3);
      const engine = new SimulationEngine(steps);

      // Before any step
      engine.prevStep();
      expect(engine.currentStepIndex).toBe(-1);

      engine.destroy();
    });

    it("can resume play after pause", () => {
      const steps = createSteps(3, 500);
      const engine = new SimulationEngine(steps);

      engine.play();
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(0);

      engine.pause();
      vi.advanceTimersByTime(2000);
      expect(engine.currentStepIndex).toBe(0);

      engine.play();
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(1);

      engine.destroy();
    });

    it("can play after reset", () => {
      const steps = createSteps(3, 500);
      const engine = new SimulationEngine(steps);

      engine.play();
      vi.advanceTimersByTime(1500);
      expect(engine.isComplete).toBe(true);

      engine.reset();
      expect(engine.currentStepIndex).toBe(-1);
      expect(engine.isComplete).toBe(false);

      engine.play();
      vi.advanceTimersByTime(500);
      expect(engine.currentStepIndex).toBe(0);

      engine.destroy();
    });
  });
});
