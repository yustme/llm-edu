import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValidationCheck {
  name: string;
  status: "pending" | "checking" | "pass" | "fail";
}

export interface ValidationPipelineProps {
  input: string;
  checks: ValidationCheck[];
  verdict: "pass" | "fail" | "pending";
  className?: string;
}

const ANIMATION_DURATION = 0.3;
const CHECK_STAGGER = 0.15;

/** Status icon for each check state */
function CheckStatusIcon({ status }: { status: ValidationCheck["status"] }) {
  switch (status) {
    case "pending":
      return <Circle className="h-4 w-4 text-gray-400" />;
    case "checking":
      return (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Circle className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </motion.div>
      );
    case "pass":
      return <Check className="h-4 w-4 text-green-600" />;
    case "fail":
      return <X className="h-4 w-4 text-red-600" />;
  }
}

/** Background color for each check state */
function checkBgColor(status: ValidationCheck["status"]): string {
  switch (status) {
    case "pending":
      return "border-gray-200 bg-gray-50";
    case "checking":
      return "border-yellow-300 bg-yellow-50";
    case "pass":
      return "border-green-300 bg-green-50";
    case "fail":
      return "border-red-300 bg-red-50";
  }
}

/**
 * Visual pipeline component showing input flowing through validation checks.
 *
 * Renders vertically:
 * 1. Input box at top (showing the text)
 * 2. A series of check boxes, each with name + animated status icon
 * 3. Result box at bottom (green "Passed" or red "Blocked")
 */
export function ValidationPipeline({
  input,
  checks,
  verdict,
  className,
}: ValidationPipelineProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Input box */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_DURATION }}
        className="w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
          Input
        </p>
        <p className="text-sm text-blue-900 leading-relaxed">{input}</p>
      </motion.div>

      {/* Connector line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="h-4 w-px bg-border origin-top"
      />

      {/* Validation checks */}
      {checks.map((check, index) => (
        <div key={check.name} className="flex w-full flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: ANIMATION_DURATION,
              delay: 0.2 + index * CHECK_STAGGER,
            }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-4 py-3 transition-colors duration-300",
              checkBgColor(check.status),
            )}
          >
            <span className="text-sm font-medium">{check.name}</span>
            <CheckStatusIcon status={check.status} />
          </motion.div>

          {/* Connector line between checks */}
          {index < checks.length - 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.15,
                delay: 0.3 + index * CHECK_STAGGER,
              }}
              className="h-3 w-px bg-border origin-top"
            />
          )}
        </div>
      ))}

      {/* Connector line to result */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.2, delay: 0.2 + checks.length * CHECK_STAGGER }}
        className="h-4 w-px bg-border origin-top"
      />

      {/* Result box */}
      <AnimatePresence mode="wait">
        {verdict !== "pending" && (
          <motion.div
            key={verdict}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION }}
            className={cn(
              "w-full rounded-lg border-2 px-4 py-3 text-center font-semibold",
              verdict === "pass"
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-red-400 bg-red-50 text-red-700",
            )}
          >
            {verdict === "pass" ? "Passed" : "Blocked"}
          </motion.div>
        )}

        {verdict === "pending" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-center font-semibold text-gray-400"
          >
            Waiting...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
