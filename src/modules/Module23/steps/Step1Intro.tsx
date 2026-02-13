import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const TRADITIONAL_FAILURES = [
  "Crashes on unexpected input",
  "Shows raw error to user",
  "Requires manual restart",
  "No learning from failures",
] as const;

const SELF_HEALING_CAPABILITIES = [
  "Detects and classifies errors",
  "Analyzes root cause automatically",
  "Generates corrected approach",
  "Retries with improved strategy",
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is Self-Healing?"
          highlights={["Error Recovery", "Autonomous Retry", "Adaptive"]}
        >
          <p>
            Traditional programs crash when they encounter errors.
            A <strong>self-healing agent</strong> can detect errors, analyze
            what went wrong, fix its approach, and retry automatically.
          </p>
          <p>
            This is one of the key advantages of agentic systems over static
            programs: the ability to <strong>reason about failures</strong> and
            adapt in real time.
          </p>
          <p>The self-healing loop follows a simple pattern:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Detect</strong> - recognize that an error occurred
            </li>
            <li>
              <strong>Analyze</strong> - understand the root cause from the
              error message and context
            </li>
            <li>
              <strong>Fix</strong> - generate a corrected approach based on the
              analysis
            </li>
            <li>
              <strong>Retry</strong> - execute the corrected approach and
              verify success
            </li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Traditional Program"
            rightLabel="Self-Healing Agent"
            leftContent={
              <div className="space-y-2.5 text-sm">
                {TRADITIONAL_FAILURES.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            }
            rightContent={
              <div className="space-y-2.5 text-sm">
                {SELF_HEALING_CAPABILITIES.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex items-start gap-2"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            }
          />
        </InteractiveArea>
      </div>
    </div>
  );
}
