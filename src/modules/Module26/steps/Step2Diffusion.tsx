import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { DiffusionAnimation } from "@/components/image-gen/DiffusionAnimation";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const DIFFUSION_STEPS = [
  {
    step: 1,
    text: "Start with pure random noise sampled from a Gaussian distribution",
  },
  {
    step: 2,
    text: "At each timestep, predict the noise component using a neural network (UNet or DiT)",
  },
  {
    step: 3,
    text: "Subtract the predicted noise, conditioned on the text embedding",
  },
  {
    step: 4,
    text: "Repeat for N steps (typically 20-50) until a clean latent emerges",
  },
] as const;

export function Step2Diffusion() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Diffusion Process"
          highlights={["Denoising", "Gaussian Noise", "UNet", "CFG"]}
        >
          <p>
            Diffusion models generate images by <strong>reversing</strong> a
            noise-addition process. During training, the model learns to predict
            and remove noise at various levels. During generation, it starts from
            pure noise and iteratively cleans it.
          </p>
          <p>The denoising loop works as follows:</p>
          <ol className="list-decimal space-y-1 pl-5">
            {DIFFUSION_STEPS.map((item) => (
              <li key={item.step}>{item.text}</li>
            ))}
          </ol>
          <p>
            <strong>Classifier-Free Guidance (CFG)</strong> controls how strongly
            the model follows the text prompt. A higher CFG scale means more
            prompt-adherent but potentially less diverse outputs.
          </p>
          <p>
            The grid on the right shows how an 8x8 representation progresses
            from random noise to a structured pattern across 6 denoising stages.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: ANIMATION_DURATION,
            }}
          >
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              Denoising Progression (Noise to Structure)
            </p>
            <DiffusionAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 2.2 + STAGGER_DELAY,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Modern schedulers like <strong>DDPM</strong>,{" "}
              <strong>DDIM</strong>, and <strong>DPM-Solver</strong> optimize the
              denoising schedule to produce high-quality results in fewer steps.
              DDIM allows as few as 10-20 steps compared to the original 1000+
              steps of DDPM.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
