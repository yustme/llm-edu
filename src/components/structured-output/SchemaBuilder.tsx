import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { Button } from "@/components/ui/button";
import { SCHEMA_TEMPLATES } from "@/data/mock-structured-output";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";

const ANIMATION_DURATION = 0.35;

/**
 * Interactive schema builder that lets the user pick a schema template,
 * view its JSON Schema definition, and toggle between valid / invalid output.
 */
export function SchemaBuilder() {
  const [selectedId, setSelectedId] = useState(SCHEMA_TEMPLATES[0].id);
  const [showValid, setShowValid] = useState(true);

  const selected = SCHEMA_TEMPLATES.find((t) => t.id === selectedId) ?? SCHEMA_TEMPLATES[0];

  const tabIndex = SCHEMA_TEMPLATES.findIndex((t) => t.id === selectedId);
  const setTabByIndex = useCallback(
    (i: number) => {
      setSelectedId(SCHEMA_TEMPLATES[i].id);
      setShowValid(true);
    },
    [],
  );
  useFullscreenStepper(tabIndex, SCHEMA_TEMPLATES.length, setTabByIndex);

  return (
    <div className="space-y-4">
      {/* Template selector bar */}
      <div className="flex flex-wrap gap-2">
        {SCHEMA_TEMPLATES.map((template) => (
          <Button
            key={template.id}
            size="sm"
            variant={template.id === selectedId ? "default" : "outline"}
            onClick={() => {
              setSelectedId(template.id);
              setShowValid(true);
            }}
          >
            {template.name}
          </Button>
        ))}
      </div>

      {/* Template description */}
      <p className="text-sm text-muted-foreground">{selected.description}</p>

      {/* Two-column: schema + output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: ANIMATION_DURATION }}
          className="grid gap-4 lg:grid-cols-2"
        >
          {/* Left: JSON Schema */}
          <div>
            <CodeBlock
              code={selected.schema}
              language="json"
              title="JSON Schema Definition"
              showLineNumbers
            />
          </div>

          {/* Right: Output */}
          <div className="space-y-3">
            {/* Toggle button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                LLM Output
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowValid((v) => !v)}
                className="gap-1.5"
              >
                {showValid ? (
                  <ToggleRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-red-500" />
                )}
                {showValid ? "Valid" : "Invalid"}
              </Button>
            </div>

            {/* Output code block */}
            <AnimatePresence mode="wait">
              <motion.div
                key={showValid ? "valid" : "invalid"}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <CodeBlock
                  code={showValid ? selected.validOutput : selected.invalidOutput}
                  language="json"
                  title={showValid ? "Conforming Output" : "Non-Conforming Output"}
                  showLineNumbers
                />
              </motion.div>
            </AnimatePresence>

            {/* Status badge */}
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                showValid
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              {showValid ? (
                <>
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Output matches the schema - all required fields present with correct types.</span>
                </>
              ) : (
                <>
                  <X className="h-4 w-4 shrink-0" />
                  <span>Output violates the schema - wrong field names, missing required fields, or incorrect types.</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
