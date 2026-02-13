import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ModalityDiagram } from "@/components/multimodal/ModalityDiagram";
import { MODALITIES } from "@/data/mock-multimodal";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is Multimodal AI?"
          highlights={["Text", "Image", "Audio", "Video"]}
        >
          <p>
            Traditional LLMs work exclusively with text. <strong>Multimodal
            AI</strong> extends this by accepting multiple types of input --
            images, audio, video, and text -- through a single model.
          </p>
          <p>
            Instead of building separate systems for each data type, multimodal
            models can reason across modalities simultaneously. This enables
            powerful capabilities like:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Describing what is in an image using natural language</li>
            <li>Extracting structured data from scanned documents</li>
            <li>Transcribing and summarizing audio recordings</li>
            <li>Understanding video content and temporal sequences</li>
          </ul>
          <p>
            The key insight is <strong>convergence</strong>: all modalities
            are converted into the same internal representation, allowing the
            model to reason about them together.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Convergence diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Modality Convergence
            </p>
            <ModalityDiagram />
          </motion.div>

          {/* Use cases grid */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Modality Use Cases
            </p>
            <div className="grid grid-cols-2 gap-3">
              {MODALITIES.map((modality, index) => (
                <motion.div
                  key={modality.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-lg border-2 p-3 ${modality.borderColor}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold font-mono ${modality.color}`}
                    >
                      {modality.iconLabel}
                    </span>
                    <span className="text-sm font-semibold">
                      {modality.name}
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {modality.useCases.map((useCase) => (
                      <li
                        key={useCase}
                        className="text-xs text-muted-foreground"
                      >
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
