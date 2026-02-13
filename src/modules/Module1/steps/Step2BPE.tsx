import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { BpeMergeAnimation } from "@/components/tokenization/BpeMergeAnimation";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const BPE_ALGORITHM_STEPS = [
  { step: 1, text: "Start with all characters as individual tokens" },
  { step: 2, text: "Count all adjacent token pairs in the training corpus" },
  { step: 3, text: "Merge the most frequent pair into a new token" },
  { step: 4, text: "Repeat until desired vocabulary size is reached" },
] as const;

export function Step2BPE() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Byte Pair Encoding"
          highlights={["BPE", "Subwords", "Merge Rules"]}
        >
          <p>
            <strong>Byte Pair Encoding (BPE)</strong> is the most common
            tokenization algorithm used by modern LLMs (GPT, Claude, Llama).
          </p>
          <p>
            BPE starts with individual characters and iteratively merges the
            most frequent adjacent pairs:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            {BPE_ALGORITHM_STEPS.map((item) => (
              <li key={item.step}>{item.text}</li>
            ))}
          </ol>
          <p>
            This produces a vocabulary of <strong>subword units</strong> that
            balances between character-level and word-level tokenization.
            Common words stay whole, while rare words are split into meaningful
            subparts.
          </p>
          <p>
            For example, <strong>&quot;unhappiness&quot;</strong> might be
            split into <em>&quot;un&quot; + &quot;happi&quot; + &quot;ness&quot;</em>,
            preserving morphological structure.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
          >
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              BPE Merge Animation
            </p>
            <BpeMergeAnimation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + STAGGER_DELAY, duration: ANIMATION_DURATION }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              BPE vocabularies typically contain{" "}
              <strong>30,000 to 100,000 tokens</strong>. GPT-4 uses ~100k
              tokens, Claude uses a similar range. The vocabulary is trained
              once and then fixed for all future use.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
