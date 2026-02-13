import { useEffect, useRef } from "react";
import { usePresentationStore } from "@/stores/presentation.store";
import type { FullscreenStepper } from "@/stores/presentation.store";

/**
 * Hook that registers a fullscreen stepper so arrow keys can control
 * interactive content (sequential reveals, tab selectors, etc.) when
 * the interactive area is in fullscreen mode.
 *
 * @param index - current position (0-based)
 * @param count - total number of positions
 * @param setIndex - setter to change position
 */
export function useFullscreenStepper(
  index: number,
  count: number,
  setIndex: (index: number) => void,
): void {
  const registerStepper = usePresentationStore((s) => s.registerStepper);
  const unregisterStepper = usePresentationStore((s) => s.unregisterStepper);

  // Use refs to avoid re-registering on every state change
  const indexRef = useRef(index);
  const countRef = useRef(count);
  const setIndexRef = useRef(setIndex);

  indexRef.current = index;
  countRef.current = count;
  setIndexRef.current = setIndex;

  const stepper = useRef<FullscreenStepper>({
    next: () => {
      if (indexRef.current < countRef.current - 1) {
        setIndexRef.current(indexRef.current + 1);
        return true;
      }
      return false;
    },
    prev: () => {
      if (indexRef.current > 0) {
        setIndexRef.current(indexRef.current - 1);
        return true;
      }
      return false;
    },
  });

  useEffect(() => {
    registerStepper(stepper.current);
    return () => unregisterStepper();
  }, [registerStepper, unregisterStepper]);
}

/**
 * Hook that registers a raw FullscreenStepper with custom next/prev logic.
 * Useful for components with non-linear navigation.
 */
export function useFullscreenStepperRaw(
  next: () => boolean,
  prev: () => boolean,
): void {
  const registerStepper = usePresentationStore((s) => s.registerStepper);
  const unregisterStepper = usePresentationStore((s) => s.unregisterStepper);

  const nextRef = useRef(next);
  const prevRef = useRef(prev);
  nextRef.current = next;
  prevRef.current = prev;

  const stepper = useRef<FullscreenStepper>({
    next: () => nextRef.current(),
    prev: () => prevRef.current(),
  });

  useEffect(() => {
    registerStepper(stepper.current);
    return () => unregisterStepper();
  }, [registerStepper, unregisterStepper]);
}
