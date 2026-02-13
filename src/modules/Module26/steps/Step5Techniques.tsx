import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TechniqueGrid } from "@/components/image-gen/TechniqueGrid";

const ANIMATION_DURATION = 0.4;

export function Step5Techniques() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Advanced Techniques"
          highlights={[
            "Inpainting",
            "ControlNet",
            "LoRA",
            "Img2Img",
          ]}
        >
          <p>
            Beyond basic text-to-image generation, modern diffusion models
            support a rich ecosystem of <strong>advanced techniques</strong> that
            provide finer control over the generation process.
          </p>
          <p>Key categories of advanced control:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Editing</strong> - inpainting and outpainting modify
              existing images selectively
            </li>
            <li>
              <strong>Transformation</strong> - img2img and style transfer change
              the look while preserving structure
            </li>
            <li>
              <strong>Structural control</strong> - ControlNet uses edge maps,
              depth maps, and pose skeletons for precise composition
            </li>
            <li>
              <strong>Customization</strong> - LoRA fine-tuning teaches the model
              new styles or subjects with minimal training data
            </li>
          </ul>
          <p>
            These techniques can be <strong>combined</strong>. For example, you
            can use ControlNet for pose guidance, a LoRA for character style, and
            quality prompts for high fidelity - all in a single generation pass.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4" allowFullscreen>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: ANIMATION_DURATION,
            }}
          >
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              Advanced Image Generation Techniques
            </p>
            <TechniqueGrid />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
