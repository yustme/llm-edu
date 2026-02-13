import { useState } from "react";
import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { Button } from "@/components/ui/button";
import { useFullscreenStepper } from "@/hooks/useFullscreenStepper";
import {
  DOCUMENT_EXAMPLES,
  DOCUMENT_PIPELINE_STEPS,
} from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

export function Step3DocumentUnderstanding() {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const doc = DOCUMENT_EXAMPLES[selectedDocIndex];

  useFullscreenStepper(selectedDocIndex, DOCUMENT_EXAMPLES.length, setSelectedDocIndex);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Document Understanding"
          highlights={[
            "Layout Analysis",
            "OCR",
            "Field Extraction",
            "Validation",
          ]}
        >
          <p>
            Document understanding goes beyond simple OCR. Modern multimodal
            models analyze the <strong>visual layout</strong> of a document to
            understand tables, forms, headers, and hierarchical relationships.
          </p>
          <p>The processing pipeline has four stages:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Layout Analysis</strong> -- detect document structure:
              tables, headers, paragraphs, checkboxes
            </li>
            <li>
              <strong>Text Extraction</strong> -- OCR for printed text and
              handwriting recognition for filled forms
            </li>
            <li>
              <strong>Field Mapping</strong> -- use an LLM to map extracted
              text to semantic fields based on context
            </li>
            <li>
              <strong>Validation</strong> -- verify extracted values match
              expected types and formats
            </li>
          </ul>
          <p>
            This enables automated processing of invoices, insurance claims,
            employment forms, and other structured documents at scale.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Document selector */}
          <div className="flex gap-2">
            {DOCUMENT_EXAMPLES.map((d, index) => (
              <Button
                key={d.id}
                size="sm"
                variant={index === selectedDocIndex ? "default" : "outline"}
                onClick={() => setSelectedDocIndex(index)}
              >
                {d.name}
              </Button>
            ))}
          </div>

          {/* Pipeline steps */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Processing Pipeline
            </p>
            <div className="space-y-2">
              {DOCUMENT_PIPELINE_STEPS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                >
                  <ReasoningStep
                    stepNumber={index + 1}
                    title={step.title}
                    content={step.content}
                    status="done"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Before / After comparison */}
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: ANIMATION_DURATION }}
          >
            <ComparisonView
              leftLabel="Raw Document"
              rightLabel="Structured Output"
              leftContent={
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground italic mb-2">
                    {doc.description}
                  </p>
                  <pre className="whitespace-pre-wrap rounded bg-muted/50 p-3 text-xs font-mono leading-relaxed text-foreground">
                    {doc.rawRepresentation}
                  </pre>
                </div>
              }
              rightContent={
                <div className="space-y-1.5">
                  {doc.extractedFields.map((field, index) => (
                    <motion.div
                      key={field.field}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.7 + index * 0.08,
                        duration: 0.3,
                      }}
                      className="flex items-baseline gap-2 text-sm"
                    >
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {field.field}:
                      </span>
                      <span className="font-medium text-foreground">
                        {field.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              }
            />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
