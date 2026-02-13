import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TokenizerDemo } from "@/components/tokenization/TokenizerDemo";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step4InteractiveDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Try It Yourself"
          highlights={["Interactive", "BPE", "Token Count"]}
        >
          <p>
            Type any text into the input area to see how a simplified BPE
            tokenizer splits it into subword tokens. Each token gets a distinct
            color.
          </p>
          <p>Things to try:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>English text</strong> - common words stay whole, rare
              words are split
            </li>
            <li>
              <strong>Czech text</strong> - notice how non-English languages
              require more tokens for the same content
            </li>
            <li>
              <strong>Code snippets</strong> - keywords like{" "}
              <code className="rounded bg-muted px-1 text-xs">const</code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1 text-xs">function</code>{" "}
              are single tokens
            </li>
            <li>
              <strong>Numbers and punctuation</strong> - often tokenized as
              individual characters
            </li>
          </ul>
          <p>
            Watch the <strong>compression ratio</strong> (characters per token)
            change depending on the language and content type.
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
            <TokenizerDemo />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
