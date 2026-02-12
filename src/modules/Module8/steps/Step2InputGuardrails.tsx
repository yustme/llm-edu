import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Button } from "@/components/ui/button";
import {
  ValidationPipeline,
  type ValidationCheck,
} from "@/components/guardrails/ValidationPipeline";
import { INPUT_EXAMPLES, type ValidationExample } from "@/data/mock-guardrails";

const CHECK_NAMES = [
  "Prompt Injection Check",
  "PII Scanner",
  "Content Policy",
] as const;

/** Delay between check animations in milliseconds */
const CHECK_ANIMATION_DELAY_MS = 600;

/** Build the initial pending checks array */
function buildPendingChecks(): ValidationCheck[] {
  return CHECK_NAMES.map((name) => ({ name, status: "pending" as const }));
}

/** Determine which checks fail for a given example */
function getFailingCheckIndex(example: ValidationExample): number {
  switch (example.category) {
    case "prompt-injection":
      return 0; // Prompt Injection Check
    case "pii":
      return 1; // PII Scanner
    case "harmful":
      return 2; // Content Policy
    default:
      return -1; // none fail
  }
}

export function Step2InputGuardrails() {
  const [selected, setSelected] = useState<ValidationExample>(INPUT_EXAMPLES[0]);
  const [checks, setChecks] = useState<ValidationCheck[]>(buildPendingChecks);
  const [verdict, setVerdict] = useState<"pass" | "fail" | "pending">("pending");
  const [isAnimating, setIsAnimating] = useState(false);

  const runValidation = useCallback(
    (example: ValidationExample) => {
      setChecks(buildPendingChecks());
      setVerdict("pending");
      setIsAnimating(true);

      const failIndex = getFailingCheckIndex(example);

      CHECK_NAMES.forEach((_, i) => {
        // Set to "checking"
        setTimeout(() => {
          setChecks((prev) =>
            prev.map((c, idx) =>
              idx === i ? { ...c, status: "checking" as const } : c,
            ),
          );
        }, i * CHECK_ANIMATION_DELAY_MS);

        // Set to "pass" or "fail"
        setTimeout(() => {
          const status = i === failIndex ? ("fail" as const) : ("pass" as const);
          setChecks((prev) =>
            prev.map((c, idx) => (idx === i ? { ...c, status } : c)),
          );

          // If this check failed, stop and set verdict
          if (i === failIndex) {
            setVerdict("fail");
            setIsAnimating(false);
          }

          // If this is the last check and nothing failed, pass
          if (i === CHECK_NAMES.length - 1 && failIndex === -1) {
            setVerdict("pass");
            setIsAnimating(false);
          }
        }, i * CHECK_ANIMATION_DELAY_MS + CHECK_ANIMATION_DELAY_MS / 2);
      });
    },
    [],
  );

  // Run validation on selection change
  useEffect(() => {
    runValidation(selected);
  }, [selected, runValidation]);

  const handleSelect = useCallback(
    (example: ValidationExample) => {
      if (isAnimating) return;
      setSelected(example);
    },
    [isAnimating],
  );

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Input Guardrails"
          highlights={[
            "Prompt Injection",
            "PII Filtering",
            "Content Moderation",
          ]}
        >
          <p>
            Input guardrails validate user messages{" "}
            <strong>before they reach the LLM</strong>. This is your first line
            of defense against malicious or unsafe inputs.
          </p>
          <p>Common input validation checks include:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">Prompt injection detection</span> -
              Identifies attempts to override system instructions
            </li>
            <li>
              <span className="font-medium">PII filtering</span> - Catches
              personally identifiable information like SSNs and credit card
              numbers
            </li>
            <li>
              <span className="font-medium">Content moderation</span> - Blocks
              requests with harmful or unethical intent
            </li>
          </ul>
          <p>
            Select an example below to see how each type of input is processed
            through the validation pipeline.
          </p>

          {/* Example selector */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">
              Select an input example:
            </p>
            <div className="flex flex-col gap-2">
              {INPUT_EXAMPLES.map((example) => (
                <Button
                  key={example.id}
                  variant={selected.id === example.id ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => handleSelect(example)}
                  disabled={isAnimating}
                >
                  {example.label}
                </Button>
              ))}
            </div>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-4 text-center text-sm font-medium text-muted-foreground"
          >
            Input Validation Pipeline
          </motion.p>

          <ValidationPipeline
            input={selected.content}
            checks={checks}
            verdict={verdict}
          />

          {/* Reason display */}
          {verdict !== "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-lg border bg-muted/50 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Reason
              </p>
              <p className="text-sm">{selected.reason}</p>
            </motion.div>
          )}
        </InteractiveArea>
      </div>
    </div>
  );
}
