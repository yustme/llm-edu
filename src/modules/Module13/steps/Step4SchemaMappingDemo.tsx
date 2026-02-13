import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ReasoningStep } from "@/components/simulation/ReasoningStep";
import { SchemaMapping } from "@/components/etl/SchemaMapping";
import { SOURCE_SCHEMA, TARGET_SCHEMA, COLUMN_MAPPINGS } from "@/data/mock-etl";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const REASONING_STEPS = [
  { title: "Analyzing Source Schema", content: "Profiling 8 source columns: cust_nm, ord_dt, prd_id, ord_amt, dsc_pct, tx_amt, sts, eml_addr" },
  { title: "Matching by Semantic Similarity", content: "Using NLP to match abbreviated source names to descriptive target names (e.g., cust_nm → customer_name)" },
  { title: "Detecting Type Conversions", content: "Found 2 columns requiring conversion: ord_dt (TEXT→DATE), sts (code→name mapping)" },
  { title: "Assigning Confidence Scores", content: "All mappings scored above 75% confidence. Lowest: sts→status (75%) due to code-to-name conversion." },
] as const;

export function Step4SchemaMappingDemo() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Schema Mapping Demo"
          highlights={["Automatic", "Confidence", "Semantic"]}
        >
          <p>
            The AI agent automatically maps source columns to target columns
            using <strong>semantic understanding</strong> rather than exact
            name matching.
          </p>
          <p>
            Each mapping gets a <strong>confidence score</strong>:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <span className="text-green-600 font-medium">&gt;90%</span> - High
              confidence, apply automatically
            </li>
            <li>
              <span className="text-amber-600 font-medium">70-90%</span> - Medium
              confidence, suggest for review
            </li>
            <li>
              <span className="text-red-600 font-medium">&lt;70%</span> - Low
              confidence, requires human decision
            </li>
          </ul>
          <p>
            The agent also detects when <strong>type conversions</strong> are
            needed (e.g., text dates to DATE type, status codes to names).
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Column Mapping
          </p>

          <SchemaMapping
            sourceColumns={SOURCE_SCHEMA.map((c) => c.name)}
            targetColumns={TARGET_SCHEMA.map((c) => c.name)}
            mappings={COLUMN_MAPPINGS}
          />

          <p className="text-center text-sm font-medium text-muted-foreground mt-4">
            Agent Reasoning
          </p>

          <div className="space-y-2">
            {REASONING_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 1.5 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
              >
                <ReasoningStep
                  stepNumber={index + 1}
                  title={step.title}
                  content={step.content}
                  status="done"
                />
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
