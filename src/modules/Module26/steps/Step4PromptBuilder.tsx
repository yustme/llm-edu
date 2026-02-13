import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PromptBuilder } from "@/components/image-gen/PromptBuilder";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step4PromptBuilder() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Interactive Prompt Builder"
          highlights={["Presets", "Weights", "Composition"]}
        >
          <p>
            Use the interactive builder on the right to compose an image
            generation prompt. Select options from each category or apply a{" "}
            <strong>style preset</strong> for quick configuration.
          </p>
          <p>Things to explore:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Subject</strong> - type a custom subject or use the default
            </li>
            <li>
              <strong>Style presets</strong> - Photorealistic, Anime, Oil
              Painting, etc. auto-fill style, mood, and quality
            </li>
            <li>
              <strong>Individual selectors</strong> - mix and match style, mood,
              and quality independently
            </li>
            <li>
              <strong>Model View</strong> - see the prompt as colored spans with
              attention weights
            </li>
          </ul>
          <p>
            The <strong>Model View</strong> shows how the text encoder interprets
            different parts of the prompt. Higher weights (1.2-1.4) mean the
            model pays more attention to those tokens during generation:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Quality modifiers often get the highest weights (1.3-1.4) to ensure
              output fidelity
            </li>
            <li>
              Style keywords receive elevated weights (1.1-1.2) to enforce
              artistic direction
            </li>
            <li>
              Mood descriptors use moderate weights (0.8-1.0) for subtle
              influence
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4" allowFullscreen>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
          >
            <PromptBuilder />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
