import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ChunkingDemo } from "@/components/chunking/ChunkingDemo";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step4ChunkingDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Try It Yourself"
          highlights={["Interactive", "Real Algorithms", "Compare Strategies"]}
        >
          <p>
            Use the interactive chunker to see how different strategies
            split the same text. The sample text is pre-filled, but you
            can <strong>edit or paste your own</strong>.
          </p>
          <p>Things to experiment with:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Switch strategies</strong> - compare how Fixed, Sentence,
              Paragraph, and Recursive handle the same text
            </li>
            <li>
              <strong>Adjust chunk size</strong> - observe how smaller chunks
              lose context while larger chunks include more noise
            </li>
            <li>
              <strong>Add overlap</strong> - see how overlap duplicates text
              at boundaries to preserve continuity
            </li>
            <li>
              <strong>Check the stats</strong> - watch chunk count, average
              size, min/max sizes change in real time
            </li>
          </ul>
          <p>
            Notice that <strong>Fixed Size</strong> breaks mid-sentence, while{" "}
            <strong>Recursive</strong> tries paragraphs first, then falls back
            to sentences for oversized chunks.
          </p>
          <p>
            The color-coded chunks below the controls show exactly where each
            split occurs.
          </p>
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
            <ChunkingDemo />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
