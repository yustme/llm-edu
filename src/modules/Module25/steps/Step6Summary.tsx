import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import {
  MODALITY_COMPARISONS,
  MULTIMODAL_GUIDELINES,
  MULTIMODAL_LIMITATIONS,
} from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={[
            "Start with Text",
            "Pre-process Inputs",
            "Validate Outputs",
          ]}
        >
          <p>
            Multimodal AI extends language models beyond text to process
            images, audio, and video. This enables powerful applications but
            comes with important trade-offs.
          </p>
          <p>When to use multimodal:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Document processing</strong> -- when layout and visual
              structure carry meaning (invoices, forms, charts)
            </li>
            <li>
              <strong>Meeting analysis</strong> -- when you need transcription
              plus speaker identification
            </li>
            <li>
              <strong>Visual Q&A</strong> -- when users need to ask questions
              about images or screenshots
            </li>
            <li>
              <strong>Content moderation</strong> -- when analyzing images or
              video for policy violations
            </li>
          </ul>
          <p>
            The guiding principle: <strong>start with text-only</strong> and
            add modalities only when they provide clear value. Each additional
            modality increases cost, latency, and complexity.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Modality comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Modality Comparison
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Modality
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Input Types
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Latency
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Limitation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MODALITY_COMPARISONS.map((row, index) => (
                    <motion.tr
                      key={row.modality}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-2.5 font-semibold">
                        {row.modality}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.inputTypes}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.latency}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {row.limitation}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two-column: Guidelines + Limitations */}
          <div className="grid grid-cols-2 gap-4">
            {/* Guidelines */}
            <div>
              <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
                Guidelines
              </p>
              <div className="space-y-1.5">
                {MULTIMODAL_GUIDELINES.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2 rounded-md border bg-card px-3 py-2"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                    <span className="text-xs text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div>
              <p className="mb-2 text-center text-sm font-medium text-muted-foreground">
                Limitations
              </p>
              <div className="space-y-1.5">
                {MULTIMODAL_LIMITATIONS.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2 rounded-md border bg-card px-3 py-2"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="text-xs text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
