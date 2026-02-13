import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Play,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VALIDATION_PIPELINE_STEPS } from "@/data/mock-structured-output";

/** Delay between automatic step transitions in milliseconds */
const STEP_ADVANCE_DELAY_MS = 900;

type FlowMode = "success" | "error";

interface StepState {
  status: "pending" | "active" | "success" | "error";
}

/**
 * Animated validation pipeline that shows the parse -> validate -> accept/retry flow.
 * Supports both a success path and an error-with-retry path.
 */
export function ValidationFlow() {
  const [, setMode] = useState<FlowMode>("success");
  const [stepStates, setStepStates] = useState<StepState[]>(
    VALIDATION_PIPELINE_STEPS.map(() => ({ status: "pending" })),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [retryComplete, setRetryComplete] = useState(false);

  const resetAll = useCallback(() => {
    setStepStates(VALIDATION_PIPELINE_STEPS.map(() => ({ status: "pending" })));
    setIsAnimating(false);
    setShowRetry(false);
    setRetryComplete(false);
  }, []);

  const runAnimation = useCallback(
    (flowMode: FlowMode) => {
      resetAll();
      setMode(flowMode);
      setIsAnimating(true);

      const totalSteps = VALIDATION_PIPELINE_STEPS.length;
      let currentStep = 0;

      const advance = () => {
        if (currentStep >= totalSteps) {
          // Animation complete
          if (flowMode === "error") {
            // Show retry after a pause
            setTimeout(() => {
              setShowRetry(true);
              // Animate the retry pass (success this time)
              setTimeout(() => {
                setStepStates(
                  VALIDATION_PIPELINE_STEPS.map(() => ({ status: "success" })),
                );
                setRetryComplete(true);
                setIsAnimating(false);
              }, STEP_ADVANCE_DELAY_MS * 2);
            }, STEP_ADVANCE_DELAY_MS);
          } else {
            setIsAnimating(false);
          }
          return;
        }

        setStepStates((prev) => {
          const next = [...prev];
          // Mark current step as active
          next[currentStep] = { status: "active" };
          return next;
        });

        setTimeout(() => {
          setStepStates((prev) => {
            const next = [...prev];
            if (flowMode === "error" && currentStep === 2) {
              // Schema validate fails in error mode
              next[currentStep] = { status: "error" };
            } else if (flowMode === "error" && currentStep === 3) {
              // Result step shows retry in error mode
              next[currentStep] = { status: "error" };
            } else {
              next[currentStep] = { status: "success" };
            }
            return next;
          });

          currentStep++;
          setTimeout(advance, STEP_ADVANCE_DELAY_MS);
        }, STEP_ADVANCE_DELAY_MS);
      };

      // Start the animation
      setTimeout(advance, 300);
    },
    [resetAll],
  );

  const allPending = stepStates.every((s) => s.status === "pending");

  return (
    <div className="space-y-5">
      {/* Pipeline diagram */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {VALIDATION_PIPELINE_STEPS.map((step, index) => {
          const state = stepStates[index];
          const isError = state.status === "error";
          const isSuccess = state.status === "success";
          const isActive = state.status === "active";

          const colorClass = isError
            ? step.errorColor
            : isSuccess || isActive
              ? step.successColor
              : "bg-muted border-border text-muted-foreground";

          return (
            <div key={step.id} className="flex items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.08 : 1,
                  opacity: state.status === "pending" ? 0.5 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative rounded-lg border-2 px-4 py-3 text-center min-w-[110px]",
                  colorClass,
                )}
              >
                <p className="text-sm font-bold">{step.label}</p>
                <p className="text-[10px] opacity-80">{step.description.slice(0, 40)}...</p>

                {/* Status icon overlay */}
                {(isSuccess || isError) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full",
                      isSuccess ? "bg-green-500" : "bg-red-500",
                    )}
                  >
                    {isSuccess ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <X className="h-3 w-3 text-white" />
                    )}
                  </motion.div>
                )}

                {/* Active pulse ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 0.3, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                )}
              </motion.div>

              {index < VALIDATION_PIPELINE_STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Retry indicator */}
      <AnimatePresence>
        {showRetry && !retryComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 text-sm text-amber-600"
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>
              Validation failed - sending error back to LLM for retry...
            </span>
          </motion.div>
        )}
        {retryComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700"
          >
            <Check className="h-4 w-4" />
            <span>
              Retry succeeded - LLM corrected its output and passed validation.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description of current active step */}
      <AnimatePresence mode="wait">
        {stepStates.map(
          (state, index) =>
            state.status === "active" && (
              <motion.div
                key={VALIDATION_PIPELINE_STEPS[index].id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-muted/50 px-4 py-3 text-center text-sm"
              >
                <span className="font-semibold text-foreground">
                  {VALIDATION_PIPELINE_STEPS[index].label}:
                </span>{" "}
                <span className="text-muted-foreground">
                  {VALIDATION_PIPELINE_STEPS[index].description}
                </span>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        {allPending && !isAnimating && (
          <>
            <Button size="sm" onClick={() => runAnimation("success")}>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Run (Success Path)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => runAnimation("error")}
            >
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Run (Error + Retry)
            </Button>
          </>
        )}
        {(!allPending || isAnimating) && (
          <Button
            size="sm"
            variant="outline"
            onClick={resetAll}
            disabled={isAnimating}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
