import { motion } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import {
  MODEL_COMPARISON,
  ETHICAL_CONSIDERATIONS,
  BEST_PRACTICES,
} from "@/data/mock-image-gen";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const TABLE_HEADER_STYLE =
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL_STYLE = "px-3 py-2 text-xs";

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Summary and Considerations"
          highlights={["DALL-E", "Stable Diffusion", "Midjourney", "Ethics"]}
        >
          <p>
            Image generation has rapidly evolved from research curiosity to
            production tool. The three major platforms each serve different needs
            and use cases.
          </p>
          <p>Key takeaways from this module:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Pipeline architecture</strong> - text encoder, latent
              diffusion, and VAE decoder work together
            </li>
            <li>
              <strong>Prompt engineering</strong> - structured prompts with
              subject, style, mood, and quality modifiers produce better results
            </li>
            <li>
              <strong>Advanced control</strong> - ControlNet, LoRA, and
              inpainting enable fine-grained creative direction
            </li>
            <li>
              <strong>Ethical responsibility</strong> - generated content
              requires careful consideration of copyright, consent, and bias
            </li>
          </ul>
          <p>
            As models continue to improve, the focus shifts from{" "}
            <strong>what is possible</strong> to{" "}
            <strong>how to use it responsibly</strong> and effectively.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Model comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Model Comparison
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className={TABLE_HEADER_STYLE}>Feature</th>
                    <th className={TABLE_HEADER_STYLE}>DALL-E 3</th>
                    <th className={TABLE_HEADER_STYLE}>Stable Diffusion</th>
                    <th className={TABLE_HEADER_STYLE}>Midjourney</th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_COMPARISON.map((row, rowIndex) => (
                    <motion.tr
                      key={row.feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3 + rowIndex * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <td className={`${TABLE_CELL_STYLE} font-medium`}>
                        {row.feature}
                      </td>
                      <td className={TABLE_CELL_STYLE}>{row.dalleValue}</td>
                      <td className={TABLE_CELL_STYLE}>{row.sdValue}</td>
                      <td className={TABLE_CELL_STYLE}>
                        {row.midjourneyValue}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ethical considerations */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Ethical Considerations
            </p>
            <div className="space-y-2">
              {ETHICAL_CONSIDERATIONS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay:
                      0.3 +
                      MODEL_COMPARISON.length * STAGGER_DELAY +
                      0.2 +
                      index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Best practices */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay:
                      0.3 +
                      (MODEL_COMPARISON.length +
                        ETHICAL_CONSIDERATIONS.length) *
                        STAGGER_DELAY +
                      0.4 +
                      index * STAGGER_DELAY,
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
