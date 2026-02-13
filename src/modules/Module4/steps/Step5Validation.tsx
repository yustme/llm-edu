import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { Button } from "@/components/ui/button";
import { ValidationFlow } from "@/components/structured-output/ValidationFlow";
import { VALIDATION_SCENARIOS } from "@/data/mock-structured-output";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

export function Step5Validation() {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const setScenarioByIndex = useCallback(
    (i: number) => setSelectedScenario(i),
    [],
  );
  useFullscreenStepper(selectedScenario, VALIDATION_SCENARIOS.length, setScenarioByIndex);

  const scenario = VALIDATION_SCENARIOS[selectedScenario];

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Validation & Error Recovery"
          highlights={["Parse", "Validate", "Retry", "Error Feedback"]}
        >
          <p>
            Even with structured output modes, LLMs can produce{" "}
            <strong>malformed output</strong>. A robust pipeline always includes
            a validation layer.
          </p>
          <p>The validation pipeline:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Parse</strong> - attempt to parse the raw response as JSON.
              If it fails (e.g. markdown wrapping, extra text), extract the JSON
              portion or retry.
            </li>
            <li>
              <strong>Validate</strong> - check the parsed JSON against the
              schema. Verify types, required fields, enum values, and
              constraints.
            </li>
            <li>
              <strong>Accept or Retry</strong> - if valid, use the output. If
              invalid, send the error message back to the LLM and request a
              corrected response.
            </li>
          </ol>
          <p>
            The <strong>error feedback loop</strong> is key: by including the
            specific validation error in the retry prompt, the LLM can
            understand and fix its mistake. Typically 1-2 retries are enough.
          </p>
          <p>
            Below you can see the animated pipeline and browse common error
            scenarios with their before/after corrections.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Animated validation pipeline */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Validation Pipeline
            </p>
            <ValidationFlow />
          </div>

          {/* Error scenario browser */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Common Error Scenarios (Before / After)
            </p>

            {/* Scenario tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {VALIDATION_SCENARIOS.map((s, index) => (
                <Button
                  key={s.id}
                  size="sm"
                  variant={index === selectedScenario ? "default" : "outline"}
                  onClick={() => setSelectedScenario(index)}
                >
                  {s.errorType}
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Error message */}
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 font-mono">
                  {scenario.errorMessage}
                </div>

                {/* Before -> After */}
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
                  <CodeBlock
                    code={scenario.malformedOutput}
                    language="json"
                    title="Malformed Output"
                  />
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <CodeBlock
                    code={scenario.correctedOutput}
                    language="json"
                    title="Corrected Output"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
