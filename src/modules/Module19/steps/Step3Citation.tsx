import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CitationView } from "@/components/grounding/CitationView";
import { GroundingPipeline } from "@/components/grounding/GroundingPipeline";
import { EXAMPLE_GROUNDED_RESPONSE } from "@/data/mock-grounding";

const ANIMATION_DURATION = 0.4;

export function Step3Citation() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Citation & Attribution"
          highlights={[
            "Inline Citations",
            "Source Cards",
            "Traceability",
          ]}
        >
          <p>
            Citation generation forces the LLM to explicitly link each factual
            claim to a specific source document. This makes every statement in
            the response <strong>verifiable</strong> by the reader.
          </p>
          <p>
            A well-cited response includes:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Inline markers</strong> like [1], [2], [3] placed
              immediately after the claim they support
            </li>
            <li>
              <strong>A source list</strong> at the end mapping each marker to
              its full reference (title, URL, excerpt)
            </li>
            <li>
              <strong>Faithful attribution</strong> -- the claim must actually
              appear in the cited source, not just be topically related
            </li>
          </ul>
          <p>
            To implement citation generation, instruct the model in the system
            prompt:{" "}
            <em>
              &quot;Every factual claim must include an inline citation [N]
              referencing the source documents provided. Do not make claims
              that cannot be attributed to the given sources.&quot;
            </em>
          </p>
          <p>
            Hover over a citation marker in the example to see which source
            it references. The source card will be highlighted.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* Pipeline overview */}
          <GroundingPipeline />

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: ANIMATION_DURATION }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              User Question
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {EXAMPLE_GROUNDED_RESPONSE.question}
            </p>
          </motion.div>

          {/* Cited response and sources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: ANIMATION_DURATION }}
          >
            <CitationView
              response={EXAMPLE_GROUNDED_RESPONSE.response}
              sources={EXAMPLE_GROUNDED_RESPONSE.sources}
            />
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
