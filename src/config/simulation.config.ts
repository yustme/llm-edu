export const SIMULATION = {
  /** Default delay between simulation steps in milliseconds */
  defaultStepDelayMs: 1500,

  /** Typing speed for typewriter effect in milliseconds per character */
  typingSpeedMs: 30,

  /** Speed multiplier options available to the user */
  speedMultipliers: [0.5, 1, 2] as const,

  /** Default speed multiplier index (1x) */
  defaultSpeedMultiplierIndex: 1,

  /** Delay before showing tool call results in milliseconds */
  toolCallResultDelayMs: 800,

  /** Delay for thinking indicator in milliseconds */
  thinkingDelayMs: 2000,

  /** Minimum delay between steps regardless of speed in milliseconds */
  minStepDelayMs: 200,
} as const;

export type SpeedMultiplier = (typeof SIMULATION.speedMultipliers)[number];
