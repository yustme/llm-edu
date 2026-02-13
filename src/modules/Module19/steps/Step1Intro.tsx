import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import {
  GROUNDING_COMPARISONS,
  HALLUCINATION_CONSEQUENCES,
} from "@/data/mock-grounding";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is Grounding?"
          highlights={["Source Attribution", "Verifiability", "Trust"]}
        >
          <p>
            <strong>Grounding</strong> means anchoring an LLM&apos;s output in
            factual, verifiable information rather than relying solely on its
            parametric memory. A grounded response can be traced back to
            specific, authoritative sources.
          </p>
          <p>
            Without grounding, LLMs confidently generate plausible-sounding but
            potentially fabricated content -- a phenomenon known as{" "}
            <strong>hallucination</strong>. The model has no inherent mechanism
            to distinguish between things it &quot;knows&quot; accurately and
            things it is inventing.
          </p>
          <p>
            The <strong>trust problem</strong>: users cannot tell whether an
            LLM&apos;s output is factual or hallucinated without independently
            verifying each claim. Grounding shifts the burden of proof from the
            reader to the system.
          </p>
          <p>
            In high-stakes domains -- legal, medical, financial -- ungrounded
            outputs can cause real harm. Grounding is not optional; it is an
            engineering requirement for responsible AI deployment.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Ungrounded vs Grounded comparison */}
          <ComparisonView
            leftLabel="Ungrounded LLM"
            rightLabel="Grounded LLM"
            leftContent={
              <div className="space-y-3">
                {GROUNDING_COMPARISONS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </p>
                    <div className="mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800">
                      {item.ungrounded}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: GROUNDING_COMPARISONS.length * STAGGER_DELAY + 0.2,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-2 text-xs text-red-600"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>No sources, may be fabricated</span>
                </motion.div>
              </div>
            }
            rightContent={
              <div className="space-y-3">
                {GROUNDING_COMPARISONS.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * STAGGER_DELAY + 0.1,
                      duration: ANIMATION_DURATION,
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </p>
                    <div className="mt-1 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs leading-relaxed text-green-800">
                      {item.grounded}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: GROUNDING_COMPARISONS.length * STAGGER_DELAY + 0.3,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-center gap-2 text-xs text-green-600"
                >
                  <span className="inline-block h-3.5 w-3.5 rounded-full bg-green-500" />
                  <span>Sources cited, verifiable claims</span>
                </motion.div>
              </div>
            }
          />

          {/* Hallucination consequences */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Real-World Consequences of Hallucination
            </p>
            <div className="grid grid-cols-2 gap-3">
              {HALLUCINATION_CONSEQUENCES.map((item, index) => (
                <motion.div
                  key={item.domain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay:
                      GROUNDING_COMPARISONS.length * STAGGER_DELAY +
                      0.4 +
                      index * 0.1,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-lg border px-3 py-2.5 ${item.color}`}
                >
                  <p className="text-xs font-bold">{item.domain}</p>
                  <p className="mt-1 text-[10px] leading-relaxed">
                    {item.example}
                  </p>
                  <p className="mt-1 text-[10px] font-medium opacity-80">
                    Impact: {item.impact}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
