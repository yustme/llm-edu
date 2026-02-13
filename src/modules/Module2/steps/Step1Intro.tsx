import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const CONTEXT_PARTS = [
  {
    label: "System Prompt",
    description: "Instructions, persona, tool definitions",
    color: "bg-violet-100 border-violet-300 text-violet-800",
    tokens: "~500-2000",
  },
  {
    label: "Conversation History",
    description: "Previous user/assistant messages",
    color: "bg-blue-100 border-blue-300 text-blue-800",
    tokens: "Variable",
  },
  {
    label: "Retrieved Context (RAG)",
    description: "Documents, chunks, tool results",
    color: "bg-emerald-100 border-emerald-300 text-emerald-800",
    tokens: "~1000-5000",
  },
  {
    label: "Current User Message",
    description: "The latest query or instruction",
    color: "bg-sky-100 border-sky-300 text-sky-800",
    tokens: "~50-500",
  },
  {
    label: "Response (Output)",
    description: "Tokens the model generates",
    color: "bg-amber-100 border-amber-300 text-amber-800",
    tokens: "~100-4096",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is a Context Window?"
          highlights={["Token Limit", "Working Memory", "Input + Output"]}
        >
          <p>
            The <strong>context window</strong> is the maximum number of tokens
            an LLM can process in a single request. Think of it as the
            model&apos;s <strong>working memory</strong> -- everything it can
            &quot;see&quot; at once.
          </p>
          <p>
            Every piece of information sent to the model counts against this
            limit: the system prompt, conversation history, retrieved documents,
            the user&apos;s message, and the model&apos;s own response.
          </p>
          <p>
            <strong>Tokens</strong> are the basic units of text that LLMs work
            with. A token is roughly 3/4 of a word in English -- so 1000 tokens
            is approximately 750 words.
          </p>
          <p>
            If the total input plus the desired output exceeds the context
            window, the request will either fail or require an{" "}
            <strong>overflow strategy</strong> to manage.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Anatomy of a Context Window
          </p>

          {/* Visual context window diagram */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="space-y-3">
              {CONTEXT_PARTS.map((part, index) => (
                <motion.div
                  key={part.label}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 ${part.color}`}
                >
                  <div>
                    <p className="text-sm font-semibold">{part.label}</p>
                    <p className="text-xs opacity-80">{part.description}</p>
                  </div>
                  <span className="text-xs font-medium tabular-nums">
                    {part.tokens}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Total bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: CONTEXT_PARTS.length * STAGGER_DELAY + 0.2,
                duration: ANIMATION_DURATION,
              }}
              className="mt-4 flex items-center justify-between rounded-md border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3"
            >
              <span className="text-sm font-semibold text-primary">
                Total Context Window
              </span>
              <span className="text-sm font-bold tabular-nums text-primary">
                = All of the above must fit
              </span>
            </motion.div>
          </div>

          {/* Analogy note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: CONTEXT_PARTS.length * STAGGER_DELAY + 0.5,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              Analogy: The context window is like a desk.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              You can only spread out so many documents at once. If you need
              more, you have to put some away -- or summarize them on a sticky
              note.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
