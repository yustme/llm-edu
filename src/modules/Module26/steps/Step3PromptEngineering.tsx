import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PROMPT_COMPONENT_INFO } from "@/data/mock-image-gen";

const STAGGER_DELAY = 0.12;
const ANIMATION_DURATION = 0.4;

const EXAMPLE_PROMPT_PARTS = [
  {
    text: "a majestic lion standing on a cliff edge",
    category: "Subject",
    color: "bg-blue-100 text-blue-700",
  },
  {
    text: "oil painting, impressionist style",
    category: "Style",
    color: "bg-purple-100 text-purple-700",
  },
  {
    text: "wide angle shot, dramatic composition",
    category: "Composition",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    text: "highly detailed, 8k, masterpiece",
    category: "Quality",
    color: "bg-amber-100 text-amber-700",
  },
] as const;

export function Step3PromptEngineering() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Prompt Engineering for Images"
          highlights={["Subject", "Style", "Composition", "Quality", "Negative"]}
        >
          <p>
            Effective image generation starts with a well-structured{" "}
            <strong>prompt</strong>. Unlike text prompts for chat models, image
            prompts benefit from specific visual descriptors organized into clear
            categories.
          </p>
          <p>A strong image prompt typically includes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Subject</strong> - the main content or scene
            </li>
            <li>
              <strong>Style</strong> - artistic medium, rendering technique
            </li>
            <li>
              <strong>Composition</strong> - camera angle, framing, perspective
            </li>
            <li>
              <strong>Quality modifiers</strong> - resolution, detail level
            </li>
            <li>
              <strong>Negative prompts</strong> - what to exclude
            </li>
          </ul>
          <p>
            Each component contributes to the final image. The text encoder
            assigns <strong>attention weights</strong> to different parts of the
            prompt, determining which elements have the most influence on the
            generated output.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Prompt anatomy - colored badges building up */}
          <div>
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              Anatomy of an Effective Prompt
            </p>

            <div className="space-y-3">
              {PROMPT_COMPONENT_INFO.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${component.color}`}
                  >
                    {component.name}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {component.description}
                    </p>
                    <p className="mt-1 text-xs font-mono text-foreground/70">
                      {component.example}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground italic">
                      {component.importance}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Example composed prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + PROMPT_COMPONENT_INFO.length * STAGGER_DELAY + 0.2,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-lg border bg-muted/30 p-4 space-y-3"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide text-center">
              Example: Building a Complete Prompt
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {EXAMPLE_PROMPT_PARTS.map((part, index) => (
                <motion.span
                  key={part.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay:
                      0.4 +
                      PROMPT_COMPONENT_INFO.length * STAGGER_DELAY +
                      index * 0.15,
                    duration: 0.3,
                  }}
                  className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${part.color}`}
                >
                  {part.text}
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground font-mono leading-relaxed">
              {EXAMPLE_PROMPT_PARTS.map((p) => p.text).join(", ")}
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
