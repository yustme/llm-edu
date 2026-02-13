import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { IMAGE_PIPELINE_STAGES } from "@/data/mock-image-gen";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;
const LIGHT_UP_INTERVAL_MS = 1200;

export function Step1Pipeline() {
  const [activeStage, setActiveStage] = useState(-1);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Sequentially light up pipeline stages
  useEffect(() => {
    if (animationComplete) return;

    const timer = setTimeout(
      () => {
        if (activeStage < IMAGE_PIPELINE_STAGES.length - 1) {
          setActiveStage((prev) => prev + 1);
        } else {
          setAnimationComplete(true);
        }
      },
      activeStage === -1 ? 800 : LIGHT_UP_INTERVAL_MS,
    );

    return () => clearTimeout(timer);
  }, [activeStage, animationComplete]);

  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Text-to-Image Pipeline"
          highlights={["CLIP Encoder", "Latent Space", "Diffusion", "VAE"]}
        >
          <p>
            Modern image generation models like DALL-E, Stable Diffusion, and
            Midjourney follow a common pipeline architecture that transforms{" "}
            <strong>natural language descriptions</strong> into pixel images.
          </p>
          <p>The pipeline consists of these key stages:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Text Encoder</strong> - a CLIP or T5 model converts the
              prompt into dense embedding vectors
            </li>
            <li>
              <strong>Latent Space</strong> - generation happens in a compressed
              representation, not directly in pixel space
            </li>
            <li>
              <strong>Diffusion Model</strong> - iteratively denoises a random
              latent, guided by the text embeddings
            </li>
            <li>
              <strong>VAE Decoder</strong> - converts the cleaned latent back
              into a full-resolution pixel image
            </li>
          </ul>
          <p>
            Working in <strong>latent space</strong> (64x64 instead of 512x512)
            makes diffusion dramatically faster and more memory-efficient than
            operating directly on pixels.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Text-to-Image Generation Pipeline
          </p>

          {/* Pipeline stages with sequential lighting */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {IMAGE_PIPELINE_STAGES.map((stage, index) => {
              const isActive =
                animationComplete || index <= activeStage;
              const isCurrentlyLighting =
                !animationComplete && index === activeStage;

              return (
                <div key={stage.id} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      scale: isCurrentlyLighting ? 1.05 : 1,
                    }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      isActive
                        ? stage.color
                        : "border-gray-200 bg-gray-50 text-gray-400"
                    } ${isCurrentlyLighting ? "shadow-md ring-2 ring-primary/30" : ""}`}
                  >
                    <p className="text-sm font-bold">{stage.label}</p>
                    <p className="text-[10px] opacity-80 max-w-24">
                      {stage.description}
                    </p>
                  </motion.div>
                  {index < IMAGE_PIPELINE_STAGES.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: index < activeStage ? 1 : 0.2,
                      }}
                      transition={{
                        delay: 0.3 + index * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active stage description */}
          <AnimatePresence mode="wait">
            {activeStage >= 0 && (
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-muted/30 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Stage {activeStage + 1} of{" "}
                  {IMAGE_PIPELINE_STAGES.length}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {IMAGE_PIPELINE_STAGES[activeStage]?.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {IMAGE_PIPELINE_STAGES[activeStage]?.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              The entire pipeline runs in <strong>seconds</strong> thanks to
              latent-space diffusion. Stable Diffusion generates a 512x512 image
              in about 2-5 seconds on a modern GPU. Higher resolutions and more
              denoising steps increase quality but also increase compute time.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
