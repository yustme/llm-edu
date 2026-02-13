import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { OUTPUT_APPROACHES } from "@/data/mock-structured-output";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const TABLE_HEADER_STYLE =
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL_STYLE = "px-3 py-2 text-sm";

const KEY_TAKEAWAYS = [
  {
    id: "always-validate",
    label: "Always validate LLM output",
    description:
      "Never trust raw LLM output in production. Parse, validate against a schema, and implement retry logic for malformed responses.",
  },
  {
    id: "function-calling-preferred",
    label: "Prefer function calling for reliability",
    description:
      "Function calling (tool use) provides the most reliable structured output because the API enforces schema conformance.",
  },
  {
    id: "schema-is-documentation",
    label: "Schema serves as documentation",
    description:
      "A JSON Schema not only constrains output but also documents the expected data format for both the LLM and downstream consumers.",
  },
  {
    id: "retry-with-feedback",
    label: "Include error details in retry prompts",
    description:
      "When output fails validation, include the specific error message in the retry prompt so the LLM can understand and correct its mistake.",
  },
] as const;

const WHEN_TO_USE = [
  {
    approach: "JSON Mode",
    scenario: "Quick prototyping, simple key-value extraction where schema flexibility is acceptable",
  },
  {
    approach: "Function Calling",
    scenario: "Production APIs, tool integrations, complex nested data extraction, anything requiring high reliability",
  },
  {
    approach: "Prompt-Based",
    scenario: "Non-JSON formats (CSV, XML, YAML), creative output with some structure, when API does not support structured modes",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Validation", "Function Calling", "Schema"]}
        >
          <p>
            Structured output transforms LLMs from conversational tools into{" "}
            <strong>reliable building blocks</strong> for software systems.
          </p>
          <p>Design principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Define schemas first</strong> - start with the data
              contract before writing prompts or code
            </li>
            <li>
              <strong>Use function calling</strong> when reliability matters -
              it provides schema validation at the API level
            </li>
            <li>
              <strong>Always validate</strong> - even with structured output
              modes, parse and validate every response
            </li>
            <li>
              <strong>Implement retry logic</strong> - feed validation errors
              back to the LLM for self-correction (typically 1-2 retries)
            </li>
            <li>
              <strong>Keep schemas focused</strong> - smaller, well-defined
              schemas produce more reliable output than large, complex ones
            </li>
          </ul>
          <p>
            Combined with <strong>Guardrails</strong> (Module 8) and{" "}
            <strong>Self-Healing</strong> (Module 16), structured output creates
            a robust foundation for production AI applications.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Structured Output Approaches Compared
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className={TABLE_HEADER_STYLE}>Approach</th>
                    <th className={TABLE_HEADER_STYLE}>Mechanism</th>
                    <th className={TABLE_HEADER_STYLE}>Reliability</th>
                    <th className={TABLE_HEADER_STYLE}>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {OUTPUT_APPROACHES.map((approach, rowIndex) => (
                    <motion.tr
                      key={approach.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3 + rowIndex * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <td className={`${TABLE_CELL_STYLE} font-medium`}>
                        {approach.name}
                      </td>
                      <td className={`${TABLE_CELL_STYLE} text-xs text-muted-foreground`}>
                        {approach.mechanism}
                      </td>
                      <td className={`${TABLE_CELL_STYLE} text-xs`}>
                        {approach.reliability}
                      </td>
                      <td className={`${TABLE_CELL_STYLE} text-xs text-muted-foreground`}>
                        {approach.bestFor}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* When to use each */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              When to Use Each Approach
            </p>
            <div className="space-y-2">
              {WHEN_TO_USE.map((item, index) => (
                <motion.div
                  key={item.approach}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.6 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card px-4 py-2.5"
                >
                  <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {item.approach}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.scenario}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key takeaways */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Key Takeaways
            </p>
            <div className="space-y-2">
              {KEY_TAKEAWAYS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 1.0 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
