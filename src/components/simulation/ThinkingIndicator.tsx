import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  /** Text to display alongside the dots (default: "Thinking...") */
  text?: string;
  /** Controls visibility with enter/exit animations */
  isVisible: boolean;
  className?: string;
}

const DOT_COUNT = 3;
const DOT_TRANSITION_DURATION = 0.4;
const DOT_STAGGER = 0.15;

/**
 * Animated "thinking..." display with three bouncing dots.
 * Uses Framer Motion for the bouncing animation and
 * AnimatePresence for fade in/out.
 */
export function ThinkingIndicator({
  text = "Thinking...",
  isVisible,
  className,
}: ThinkingIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            className,
          )}
        >
          <span>{text}</span>
          <span className="flex gap-1">
            {Array.from({ length: DOT_COUNT }, (_, i) => (
              <motion.span
                key={i}
                className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: DOT_TRANSITION_DURATION,
                  repeat: Infinity,
                  delay: i * DOT_STAGGER,
                  ease: "easeInOut",
                }}
              />
            ))}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
