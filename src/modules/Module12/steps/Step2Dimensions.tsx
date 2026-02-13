import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { QUALITY_DIMENSIONS } from "../data";
import { cn } from "@/lib/utils";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

function scoreColor(score: number): string {
  if (score > 90) return "bg-green-500";
  if (score > 75) return "bg-amber-500";
  return "bg-red-500";
}

export function Step2Dimensions() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Five Quality Dimensions"
          highlights={["Completeness", "Accuracy", "Consistency"]}
        >
          <p>
            Data quality is measured across five key dimensions. Each provides a
            different lens for evaluating whether your data is fit for purpose.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Completeness</strong> - Are all required fields filled?
            </li>
            <li>
              <strong>Accuracy</strong> - Do values reflect reality?
            </li>
            <li>
              <strong>Consistency</strong> - Are values uniform across records?
            </li>
            <li>
              <strong>Timeliness</strong> - Is data current and up-to-date?
            </li>
            <li>
              <strong>Uniqueness</strong> - Are duplicates eliminated?
            </li>
          </ul>
          <p>
            Each dimension is scored 0-100 based on automated checks against
            the TechShop dataset.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Quality Dimensions Scorecard
          </p>
          <div className="space-y-3">
            {QUALITY_DIMENSIONS.map((dim, index) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="rounded-lg border bg-card p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">
                    {dim.name}
                  </p>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {dim.score}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {dim.description}
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", scoreColor(dim.score))}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{
                      delay: 0.4 + index * STAGGER_DELAY,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground italic">
                  {dim.example}
                </p>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
