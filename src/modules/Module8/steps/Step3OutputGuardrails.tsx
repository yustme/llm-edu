import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Button } from "@/components/ui/button";
import {
  ValidationPipeline,
  type ValidationCheck,
} from "@/components/guardrails/ValidationPipeline";
import { OUTPUT_EXAMPLES, type ValidationExample } from "@/data/mock-guardrails";

const CHECK_NAMES = [
  "PII Redaction",
  "Factuality Check",
  "Topic Relevance",
] as const;

/** Delay between check animations in milliseconds */
const CHECK_ANIMATION_DELAY_MS = 600;

/** Build the initial pending checks array */
function buildPendingChecks(): ValidationCheck[] {
  return CHECK_NAMES.map((name) => ({ name, status: "pending" as const }));
}

/** Determine which checks fail for a given output example */
function getFailingCheckIndex(example: ValidationExample): number {
  switch (example.category) {
    case "pii-leak":
      return 0; // PII Redaction
    case "hallucination":
      return 1; // Factuality Check
    case "off-topic":
      return 2; // Topic Relevance
    default:
      return -1; // none fail
  }
}

export function Step3OutputGuardrails() {
  const [selected, setSelected] = useState<ValidationExample>(OUTPUT_EXAMPLES[0]);
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
          title="Output Guardrails"
          highlights={[
            "PII Redaction",
            "Factuality",
            "Topic Relevance",
          ]}
        >
          <p>
            Output guardrails check the agent's response{" "}
            <strong>before it is delivered to the user</strong>. Even if the
            input was safe, the model might generate problematic outputs.
          </p>
          <p>Common output validation checks include:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium">PII redaction</span> - Detects and
              removes personal data the model might have included in its response
            </li>
            <li>
              <span className="font-medium">Factuality check</span> - Flags
              ungrounded predictions or claims not supported by source data
            </li>
            <li>
              <span className="font-medium">Topic relevance</span> - Ensures the
              response actually addresses the user's query
            </li>
          </ul>
          <p>
            Select an output example to see how each type is processed through
            the output validation pipeline.
          </p>

          {/* Example selector */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-foreground">
              Select an output example:
            </p>
            <div className="flex flex-col gap-2">
              {OUTPUT_EXAMPLES.map((example) => (
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
            Output Validation Pipeline
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
