import { motion } from "framer-motion";
import { Brain, Clock, DollarSign, Zap } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { Badge } from "@/components/ui/badge";
import { REASONING_MODELS } from "@/data/mock-reasoning";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step5Models() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Reasoning Models"
          highlights={["o1/o3", "DeepSeek-R1", "Claude", "Gemini"]}
        >
          <p>
            A new generation of "reasoning models" has been specifically trained
            or designed to produce extended thinking chains before answering.
            Unlike prompt-based CoT, these models have reasoning baked into their
            architecture or training process.
          </p>
          <p>Key tradeoffs to consider:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Accuracy vs. cost</strong> -- reasoning tokens improve
              accuracy but increase the total token count (and thus cost).
            </li>
            <li>
              <strong>Latency vs. depth</strong> -- more thinking tokens mean
              longer time-to-first-token, which can be problematic for
              real-time applications.
            </li>
            <li>
              <strong>Transparency</strong> -- some models show reasoning traces
              (DeepSeek-R1, Claude extended thinking), while others hide them
              (o1).
            </li>
          </ul>
          <p>
            The right choice depends on your use case, budget, and latency
            requirements. For simple tasks, adding reasoning is wasteful. For
            hard problems, the accuracy gains are substantial.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area */}
      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Reasoning Model Comparison
          </p>

          {/* Model cards */}
          <div className="grid grid-cols-2 gap-4">
            {REASONING_MODELS.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className={`rounded-xl border ${model.color} p-4`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-foreground" />
                    <h3 className="text-sm font-bold text-foreground">
                      {model.name}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {model.provider}
                  </Badge>
                </div>

                {/* Approach */}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {model.approach}
                </p>

                {/* Latency & Cost */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Latency:</strong>{" "}
                      {model.latencyNote}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      <strong className="text-foreground">Cost:</strong>{" "}
                      {model.costNote}
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mt-3 space-y-1">
                  {model.strengths.map((strength) => (
                    <div
                      key={strength}
                      className="flex items-start gap-1.5"
                    >
                      <Zap className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                      <span className="text-[10px] leading-relaxed text-muted-foreground">
                        {strength}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: REASONING_MODELS.length * STAGGER_DELAY + 0.2,
              duration: ANIMATION_DURATION,
            }}
            className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center"
          >
            <p className="text-xs font-medium text-amber-800">
              Reasoning tokens typically cost 2-5x the price of standard output
              tokens, but can improve accuracy by 20-40% on hard problems.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
