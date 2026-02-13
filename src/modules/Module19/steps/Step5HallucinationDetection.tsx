import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { HallucinationDetector } from "@/components/grounding/HallucinationDetector";
import { HALLUCINATION_DETECTION_EXAMPLE } from "@/data/mock-grounding";

const ANIMATION_DURATION = 0.4;

const DETECTION_TECHNIQUES = [
  {
    name: "Claim Extraction",
    description:
      "Break the LLM response into individual atomic claims that can be independently verified.",
    color: "bg-sky-100 border-sky-200 text-sky-800",
  },
  {
    name: "Source Verification",
    description:
      "Check each extracted claim against the source documents. A claim is verified only if the source explicitly supports it.",
    color: "bg-blue-100 border-blue-200 text-blue-800",
  },
  {
    name: "Confidence Scoring",
    description:
      "Assign a confidence score based on source coverage: full support = verified, partial support = partial, no support = hallucinated.",
    color: "bg-violet-100 border-violet-200 text-violet-800",
  },
] as const;

export function Step5HallucinationDetection() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Hallucination Detection"
          highlights={[
            "Claim Extraction",
            "Source Verification",
            "Confidence Scoring",
          ]}
        >
          <p>
            Even with grounding techniques in place, LLMs can still
            hallucinate. A robust system includes a <strong>detection
            layer</strong> that analyzes each claim in the response and
            verifies it against available evidence.
          </p>
          <p>The three-stage detection pipeline:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Claim extraction</strong> -- decompose the response into
              individual factual assertions
            </li>
            <li>
              <strong>Source verification</strong> -- check each claim against
              the retrieved source documents
            </li>
            <li>
              <strong>Confidence scoring</strong> -- classify each claim as
              verified (green), partially verified (amber), or hallucinated
              (red)
            </li>
          </ol>
          <p>
            Click on any claim in the example to see the verification details.
            Note how the last two claims are flagged -- one gets a date wrong,
            the other fabricates a statistic that was never disclosed.
          </p>
          <p>
            This pattern can be automated using a second LLM call
            (&quot;LLM-as-judge&quot;) or rule-based NLI (natural language
            inference) models.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Detection technique cards */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Detection Pipeline
            </p>
            <div className="flex gap-3">
              {DETECTION_TECHNIQUES.map((technique, index) => (
                <motion.div
                  key={technique.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2.5 ${technique.color}`}
                >
                  <p className="text-xs font-bold">
                    {index + 1}. {technique.name}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed opacity-80">
                    {technique.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Question context */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: ANIMATION_DURATION }}
            className="rounded-lg border bg-muted/30 px-4 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Question
            </p>
            <p className="mt-1 text-sm text-foreground">
              {HALLUCINATION_DETECTION_EXAMPLE.question}
            </p>
          </motion.div>

          {/* Hallucination detector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: ANIMATION_DURATION }}
          >
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Claim-by-Claim Verification
            </p>
            <HallucinationDetector
              claims={HALLUCINATION_DETECTION_EXAMPLE.claims}
            />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
