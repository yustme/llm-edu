import { motion } from "framer-motion";
import { Bot, User, RefreshCw, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import {
  FEEDBACK_CYCLE_STEPS,
  FEEDBACK_SIGNALS,
} from "@/data/mock-human-loop";
import type { FeedbackCycleStep, FeedbackSignal } from "@/data/mock-human-loop";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

const CYCLE_ICONS: Record<FeedbackCycleStep["icon"], typeof Bot> = {
  bot: Bot,
  user: User,
  refresh: RefreshCw,
  "trending-up": TrendingUp,
};

const CYCLE_COLORS: Record<FeedbackCycleStep["icon"], string> = {
  bot: "bg-blue-100 text-blue-600 border-blue-200",
  user: "bg-amber-100 text-amber-600 border-amber-200",
  refresh: "bg-purple-100 text-purple-600 border-purple-200",
  "trending-up": "bg-green-100 text-green-600 border-green-200",
};

const SIGNAL_STRENGTH_STYLES: Record<FeedbackSignal["strength"], string> = {
  weak: "bg-gray-100 text-gray-600",
  medium: "bg-amber-100 text-amber-700",
  strong: "bg-green-100 text-green-700",
};

export function Step3Feedback() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Feedback & Learning"
          highlights={["RLHF", "Preference Signals", "Active Learning"]}
        >
          <p>
            Human feedback is not just a safety mechanism -- it is a{" "}
            <strong>training signal</strong>. Reinforcement Learning from Human
            Feedback (RLHF) is the core technique behind aligning modern LLMs
            with human preferences.
          </p>
          <p>The feedback loop works in a continuous cycle:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              The <strong>agent acts</strong> on a request and produces output
            </li>
            <li>
              A <strong>human evaluates</strong> the output, providing a signal
              (rating, correction, or preference)
            </li>
            <li>
              The feedback is <strong>aggregated</strong> into training data or
              prompt refinements
            </li>
            <li>
              The model <strong>improves</strong>, producing better outputs on
              similar future tasks
            </li>
          </ol>
          <p>
            Different feedback signals have different{" "}
            <strong>information density</strong>. A simple thumbs-up is quick
            but vague; a detailed correction is slow but highly informative.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Feedback cycle diagram */}
          <div>
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
              The RLHF Learning Cycle
            </p>
            <div className="flex items-center justify-center gap-2">
              {FEEDBACK_CYCLE_STEPS.map((step, index) => {
                const Icon = CYCLE_ICONS[step.icon];
                return (
                  <div key={step.id} className="flex items-center gap-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border-2",
                          CYCLE_COLORS[step.icon],
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="max-w-[110px] text-center">
                        <p className="text-xs font-semibold">{step.label}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Arrow */}
                    {index < FEEDBACK_CYCLE_STEPS.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{
                          delay: index * STAGGER_DELAY + 0.1,
                          duration: 0.3,
                        }}
                        style={{ transformOrigin: "left" }}
                      >
                        <svg
                          width="32"
                          height="16"
                          viewBox="0 0 32 16"
                          className="text-muted-foreground"
                        >
                          <line
                            x1="0"
                            y1="8"
                            x2="22"
                            y2="8"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <polygon
                            points="22,3 32,8 22,13"
                            fill="currentColor"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Cycle-back arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: FEEDBACK_CYCLE_STEPS.length * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="ml-1"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="text-muted-foreground"
                >
                  <path
                    d="M 20 12 A 8 8 0 1 1 12 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polygon points="12,0 16,4 12,8" fill="currentColor" />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Feedback signals table */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Feedback Signal Types
            </p>
            <div className="space-y-2">
              {FEEDBACK_SIGNALS.map((signal, index) => (
                <motion.div
                  key={signal.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.8 + index * 0.1,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{signal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {signal.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase",
                      SIGNAL_STRENGTH_STYLES[signal.strength],
                    )}
                  >
                    {signal.strength}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
