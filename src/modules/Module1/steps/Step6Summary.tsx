import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { TOKENIZATION_APPROACHES } from "../data";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const TABLE_HEADER_STYLE =
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
const TABLE_CELL_STYLE = "px-3 py-2 text-sm";

const KEY_TAKEAWAYS = [
  {
    id: "tokenization-first",
    label: "Tokenization is the first step",
    description:
      "Every LLM converts text to token IDs before any processing happens. The tokenizer defines what the model can see.",
  },
  {
    id: "bpe-standard",
    label: "BPE is the industry standard",
    description:
      "Byte Pair Encoding balances vocabulary size with sequence length. Most modern models use BPE or its variants.",
  },
  {
    id: "embeddings-semantic",
    label: "Embeddings capture meaning",
    description:
      "Dense vectors learned during training encode semantic relationships. Similar words have similar vectors.",
  },
  {
    id: "cost-impact",
    label: "Tokens directly affect cost",
    description:
      "API pricing is per-token. Efficient tokenization (fewer tokens for the same content) reduces both cost and latency.",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["BPE", "Embeddings", "Cost"]}
        >
          <p>
            Tokenization and vectorization form the{" "}
            <strong>foundation layer</strong> of every language model. Understanding
            them helps you:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Estimate costs</strong> - know how many tokens your
              prompts consume
            </li>
            <li>
              <strong>Debug behavior</strong> - understand why the model
              struggles with certain inputs (e.g. rare languages, long numbers)
            </li>
            <li>
              <strong>Optimize context</strong> - fit more information into the
              context window
            </li>
            <li>
              <strong>Build RAG systems</strong> - embedding similarity powers
              retrieval (Module 5)
            </li>
          </ul>
          <p>
            The table on the right compares the three main tokenization
            approaches. Modern LLMs use <strong>subword (BPE)</strong> because
            it offers the best trade-off.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Comparison table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Tokenization Approaches Compared
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className={TABLE_HEADER_STYLE}>Approach</th>
                    <th className={TABLE_HEADER_STYLE}>Example</th>
                    <th className={TABLE_HEADER_STYLE}>Vocab</th>
                    <th className={TABLE_HEADER_STYLE}>Pros</th>
                    <th className={TABLE_HEADER_STYLE}>Cons</th>
                  </tr>
                </thead>
                <tbody>
                  {TOKENIZATION_APPROACHES.map((approach, rowIndex) => (
                    <motion.tr
                      key={approach.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.3 + rowIndex * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <td className={`${TABLE_CELL_STYLE} font-medium`}>
                        {approach.name}
                      </td>
                      <td
                        className={`${TABLE_CELL_STYLE} font-mono text-xs text-muted-foreground`}
                      >
                        {approach.example}
                      </td>
                      <td className={`${TABLE_CELL_STYLE} text-xs`}>
                        {approach.vocabSize}
                      </td>
                      <td className={TABLE_CELL_STYLE}>
                        <ul className="space-y-0.5">
                          {approach.pros.map((pro) => (
                            <li
                              key={pro}
                              className="flex items-start gap-1 text-xs"
                            >
                              <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className={TABLE_CELL_STYLE}>
                        <ul className="space-y-0.5">
                          {approach.cons.map((con) => (
                            <li
                              key={con}
                              className="flex items-start gap-1 text-xs"
                            >
                              <X className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key takeaways */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Key Takeaways
            </p>
            <div className="space-y-2">
              {KEY_TAKEAWAYS.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.8 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
