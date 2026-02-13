import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.4;

const BEST_PRACTICES = [
  {
    id: "start-elt",
    label: "Prefer ELT for modern warehouses",
    description: "Load raw data first, transform inside the warehouse using SQL. Keeps raw data for future reprocessing.",
  },
  {
    id: "ai-mapping",
    label: "Use AI for initial schema mapping",
    description: "Let the agent propose mappings, then review and approve. Much faster than manual analysis.",
  },
  {
    id: "validate-always",
    label: "Validate at every stage",
    description: "Run data quality checks after extraction, after transformation, and after loading to catch issues early.",
  },
  {
    id: "version-transforms",
    label: "Version control transformations",
    description: "Store generated SQL transformations in git. Treat them as code that can be reviewed and rolled back.",
  },
] as const;

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["AI-Assisted", "Schema Aware", "Validated"]}
        >
          <p>
            AI agents transform ETL/ELT from a manual, brittle process into an{" "}
            <strong>intelligent, adaptive</strong> workflow.
          </p>
          <p>Key principles:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Prefer ELT</strong> for modern cloud warehouses
            </li>
            <li>
              <strong>Use AI for schema mapping</strong> - semantic matching
              beats manual analysis
            </li>
            <li>
              <strong>Validate at every stage</strong> - integrate with quality
              agents (Module 12)
            </li>
            <li>
              <strong>Keep humans in the loop</strong> - AI proposes, humans
              approve
            </li>
          </ul>
          <p>
            Combined with <strong>Data Quality Agents</strong> (Module 12) and{" "}
            <strong>Text-to-SQL</strong> (Module 11), AI-assisted ETL creates a
            complete automated data pipeline.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <ComparisonView
            leftLabel="Traditional ETL"
            rightLabel="AI-Assisted ETL"
            leftContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Manual column mapping for each source</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Breaks on schema changes</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>No built-in validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <span>Days to onboard new source</span>
                </div>
              </div>
            }
            rightContent={
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Auto schema mapping with confidence</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Adapts to schema changes automatically</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Integrated quality validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>Hours to onboard new source</span>
                </div>
              </div>
            }
          />

          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              Best Practices
            </p>
            <div className="space-y-2">
              {BEST_PRACTICES.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="flex items-start gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
