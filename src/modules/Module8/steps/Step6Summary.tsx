import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import {
  GUARDRAIL_BEST_PRACTICES,
  GUARDRAIL_COMPARISON_TABLE,
} from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Defense in Depth", "Fail Securely", "Iterate"]}
        >
          <ul className="list-none space-y-4 pl-0">
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            >
              <span className="font-semibold text-foreground">
                Always use both input and output guardrails.
              </span>{" "}
              Input guardrails catch malicious requests early, while output
              guardrails act as a safety net for anything the model generates
              on its own.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                Guardrails should fail securely.
              </span>{" "}
              When a check blocks a request, return a safe, generic response.
              Never reveal internal system details or the reason for blocking
              in a way that helps an attacker refine their approach.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY * 2,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                Log and review blocked attempts.
              </span>{" "}
              Every blocked request is valuable data. Analyze patterns in
              blocked inputs to identify new attack vectors and continuously
              improve your guardrail rules.
            </motion.li>

            <motion.li
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2 + STAGGER_DELAY * 3,
                duration: ANIMATION_DURATION,
              }}
            >
              <span className="font-semibold text-foreground">
                Keep guardrails up to date.
              </span>{" "}
              Attack techniques evolve constantly. Regularly update injection
              detection patterns, PII regexes, and content policy rules to
              stay ahead of emerging threats.
            </motion.li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          {/* Comparison view */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ComparisonView
              leftLabel="Without Guardrails"
              rightLabel="With Guardrails"
              leftContent={
                <div className="space-y-3">
                  {GUARDRAIL_COMPARISON_TABLE.map((row, index) => (
                    <motion.div
                      key={row.aspect}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + index * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="flex items-start gap-2"
                    >
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {row.aspect}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.unguarded}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              }
              rightContent={
                <div className="space-y-3">
                  {GUARDRAIL_COMPARISON_TABLE.map((row, index) => (
                    <motion.div
                      key={row.aspect}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + index * STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                      }}
                      className="flex items-start gap-2"
                    >
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {row.aspect}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.guarded}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              }
            />
          </motion.div>

          {/* Best practices */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4 + GUARDRAIL_COMPARISON_TABLE.length * STAGGER_DELAY + 0.2,
              duration: 0.3,
            }}
            className="mt-6 mb-3 text-sm font-medium text-muted-foreground"
          >
            Best Practices
          </motion.p>

          <div className="grid grid-cols-2 gap-3">
            {GUARDRAIL_BEST_PRACTICES.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:
                    0.6 +
                    GUARDRAIL_COMPARISON_TABLE.length * STAGGER_DELAY +
                    index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                  ease: "easeOut",
                }}
                className="rounded-lg border bg-card p-4"
              >
                <p className="text-sm font-semibold text-foreground mb-1">
                  {practice.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {practice.description}
                </p>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
