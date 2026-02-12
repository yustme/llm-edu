import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideContainerProps {
  children: React.ReactNode;
  /** Slide direction for the animation */
  direction?: "left" | "right";
  className?: string;
  /** Unique key to trigger re-animation on content change */
  animationKey: string;
}

const SLIDE_OFFSET = 60;

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? SLIDE_OFFSET : -SLIDE_OFFSET,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -SLIDE_OFFSET : SLIDE_OFFSET,
    opacity: 0,
  }),
};

const TRANSITION = {
  x: { type: "spring" as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

/**
 * Framer Motion wrapper that animates content with a fade + slide
 * transition. Provide a unique `animationKey` to trigger re-animation.
 */
export function SlideContainer({
  children,
  direction = "right",
  className,
  animationKey,
}: SlideContainerProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={animationKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={TRANSITION}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
