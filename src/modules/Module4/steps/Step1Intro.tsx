import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { USE_CASES } from "@/data/mock-structured-output";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const FREE_TEXT_PROBLEMS = [
  "Unpredictable format - different every time",
  "Cannot be reliably parsed by code",
  "Requires complex regex or heuristics",
  "Breaks downstream pipelines silently",
] as const;

const STRUCTURED_BENEFITS = [
  "Consistent, machine-readable JSON",
  "Validated against a schema",
  "Parseable with standard tools",
  "Reliable integration with any system",
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Structured Output?"
          highlights={["JSON Schema", "Validation", "Reliability"]}
        >
          <p>
            By default, LLMs produce <strong>free-form text</strong>. This is
            great for conversation but terrible for automation. When you need to
            extract data, call APIs, or feed results into a pipeline, you need{" "}
            <strong>structured output</strong>.
          </p>
          <p>
            Structured output means the LLM returns data in a{" "}
            <strong>predefined format</strong> (usually JSON) that matches a
            schema. This makes the output:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Parseable</strong> - standard JSON parsing, no regex needed
            </li>
            <li>
              <strong>Validated</strong> - check against a schema for correctness
            </li>
            <li>
              <strong>Consistent</strong> - same shape every time, reliable
              integration
            </li>
            <li>
              <strong>Type-safe</strong> - correct data types for every field
            </li>
          </ul>
          <p>
            This is essential for building <strong>production-grade</strong> AI
            applications that other systems can depend on.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Comparison: free text vs structured */}
          <ComparisonView
            leftLabel="Free Text Output"
            rightLabel="Structured Output"
            leftContent={
              <div className="space-y-2.5 text-sm">
                {FREE_TEXT_PROBLEMS.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}

                {/* Example free text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: ANIMATION_DURATION }}
                  className="mt-3 rounded border bg-muted/50 p-2 font-mono text-xs text-muted-foreground"
                >
                  The customer Alice Johnson can be reached at alice@example.com
                  or by phone at +1-555-0142. She works as an Engineering Manager
                  at Acme Corp.
                </motion.div>
              </div>
            }
            rightContent={
              <div className="space-y-2.5 text-sm">
                {STRUCTURED_BENEFITS.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}

                {/* Example structured output */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: ANIMATION_DURATION }}
                  className="mt-3 rounded border bg-muted/50 p-2 font-mono text-xs text-muted-foreground"
                >
                  {`{ "name": "Alice Johnson",`}
                  <br />
                  {`  "email": "alice@example.com",`}
                  <br />
                  {`  "phone": "+1-555-0142",`}
                  <br />
                  {`  "company": "Acme Corp",`}
                  <br />
                  {`  "role": "Engineering Manager" }`}
                </motion.div>
              </div>
            }
          />

          {/* Use cases */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Real-World Use Cases
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {USE_CASES.map((useCase, index) => (
                <motion.div
                  key={useCase.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 1.0 + index * 0.1,
                    duration: ANIMATION_DURATION,
                  }}
                  className="rounded-lg border bg-card px-3 py-2 text-center"
                >
                  <p className="text-xs font-medium text-foreground">
                    {useCase.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground max-w-[140px]">
                    {useCase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
