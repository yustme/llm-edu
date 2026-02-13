import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const BEST_PRACTICES = [
  "Know your model's context limit before building prompts",
  "Reserve tokens for the response (set max_tokens explicitly)",
  "Monitor token usage in production with logging",
  "Use summarization for long conversations, not just truncation",
  "Compress system prompts -- remove filler words and redundancy",
  "Select few-shot examples dynamically based on query similarity",
  "Cache static prompt prefixes to reduce cost and latency",
  "Retrieve small document chunks, not entire documents",
  "Trim tool results to only the fields the model needs",
  "Test with 'lost in the middle' scenarios for long contexts",
] as const;

const MODEL_GUIDE = [
  {
    useCase: "Simple chat / Q&A",
    recommended: "GPT-4o Mini / Claude Haiku",
    reasoning: "Low cost, fast, 128-200K is more than enough",
  },
  {
    useCase: "RAG with many documents",
    recommended: "Claude 3.5 Sonnet / GPT-4o",
    reasoning: "Strong reasoning over retrieved context",
  },
  {
    useCase: "Full codebase analysis",
    recommended: "Gemini 1.5 Pro",
    reasoning: "2M token window fits large repositories",
  },
  {
    useCase: "Cost-sensitive production",
    recommended: "GPT-4o Mini + Caching",
    reasoning: "Lowest cost with context caching enabled",
  },
  {
    useCase: "Multi-turn agent tasks",
    recommended: "Claude 3.5 Sonnet",
    reasoning: "200K window + strong tool use + summarization",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={[
            "Budget Tokens",
            "Optimize Context",
            "Choose the Right Model",
          ]}
        >
          <p>
            The context window is a fundamental constraint that shapes how you
            build LLM applications. Understanding and optimizing token usage is
            essential for production systems.
          </p>
          <p>Core principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Budget your tokens</strong> -- allocate space for system
              prompt, user input, context, and response before building
            </li>
            <li>
              <strong>Less is more</strong> -- focused, relevant context
              outperforms dumping everything into the prompt
            </li>
            <li>
              <strong>Plan for overflow</strong> -- implement a strategy
              (sliding window + summarization) before conversations grow long
            </li>
            <li>
              <strong>Match model to task</strong> -- use large context windows
              only when needed, smaller models for simple tasks
            </li>
            <li>
              <strong>Measure and optimize</strong> -- log token usage, identify
              waste, and compress iteratively
            </li>
          </ul>
          <p>
            Combined with <strong>Cost & Latency</strong> optimization (Module
            10) and <strong>RAG</strong> (Module 5), context window management
            is a key pillar of production LLM engineering.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Best practices checklist */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices Checklist
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-xs text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Model selection guide table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Model Selection Guide
            </p>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Use Case
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Recommended
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_GUIDE.map((row, index) => (
                    <motion.tr
                      key={row.useCase}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: BEST_PRACTICES.length * STAGGER_DELAY + index * 0.08,
                        duration: ANIMATION_DURATION,
                      }}
                      className="border-b last:border-0"
                    >
                      <td className="px-3 py-2 font-medium text-foreground">
                        {row.useCase}
                      </td>
                      <td className="px-3 py-2 text-primary font-medium">
                        {row.recommended}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {row.reasoning}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
