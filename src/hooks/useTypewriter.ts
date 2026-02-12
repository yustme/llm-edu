import { useEffect, useState } from "react";
import { SIMULATION } from "@/config/simulation.config";

interface UseTypewriterOptions {
  /** Milliseconds per character (default from simulation config) */
  speed?: number;
  /** Whether to start the animation immediately */
  enabled?: boolean;
}

interface UseTypewriterReturn {
  /** The currently visible portion of the text */
  displayText: string;
  /** Whether the full text has been revealed */
  isComplete: boolean;
}

/**
 * Animates text character by character with configurable speed.
 * Returns the visible portion and completion status.
 */
export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {},
): UseTypewriterReturn {
  const {
    speed = SIMULATION.typingSpeedMs,
    enabled = true,
  } = options;

  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setCharIndex(0);
  }, [text]);

  useEffect(() => {
    if (!enabled || charIndex >= text.length) return;

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, text.length, speed, enabled]);

  return {
    displayText: text.slice(0, charIndex),
    isComplete: !enabled || charIndex >= text.length,
  };
}
