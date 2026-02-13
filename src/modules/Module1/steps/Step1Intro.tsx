import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PIPELINE_STAGES } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Tokenization?"
          highlights={["Tokens", "Embeddings", "Subwords"]}
        >
          <p>
            Language models do not understand text directly. They operate on{" "}
            <strong>numbers</strong>. Tokenization is the process of converting
            raw text into a sequence of numerical token IDs that the model can
            process.
          </p>
          <p>The full pipeline works in stages:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Raw text</strong> is split into subword tokens by a
              tokenizer (e.g. BPE)
            </li>
            <li>
              Each token is mapped to a <strong>token ID</strong> via a fixed
              vocabulary
            </li>
            <li>
              Token IDs are converted to <strong>embedding vectors</strong> -
              dense numerical representations
            </li>
            <li>
              The <strong>Transformer model</strong> processes these vectors to
              generate output
            </li>
          </ul>
          <p>
            The choice of tokenizer affects everything downstream: context
            window usage, multilingual performance, and even cost (since
            pricing is per-token).
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Text-to-Numbers Pipeline
          </p>

          {/* Pipeline stages */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {PIPELINE_STAGES.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-lg border-2 px-4 py-3 text-center ${stage.color}`}
                >
                  <p className="text-sm font-bold">{stage.label}</p>
                  <p className="text-[10px] opacity-80 max-w-24">
                    {stage.content}
                  </p>
                </motion.div>
                {index < PIPELINE_STAGES.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.3 + index * STAGGER_DELAY,
                      duration: 0.3,
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Detailed example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: ANIMATION_DURATION }}
            className="rounded-lg border bg-muted/30 p-4 space-y-3"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide text-center">
              Concrete Example
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.3 }}
                className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded"
              >
                &quot;Hello world&quot;
              </motion.span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.3 }}
                className="font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded"
              >
                [&quot;Hello&quot;, &quot; world&quot;]
              </motion.span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.3 }}
                className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded"
              >
                [15496, 995]
              </motion.span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.3 }}
                className="font-mono bg-amber-100 text-amber-700 px-2 py-1 rounded"
              >
                [[0.12, -0.34, ...], [0.56, 0.78, ...]]
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.4 }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Every LLM - GPT, Claude, Llama - starts by tokenizing input text.
              The tokenizer is the <strong>first and last</strong> component in
              the pipeline, converting text to tokens and tokens back to text.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
