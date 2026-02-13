import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ETL_STAGES, ELT_STAGES } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

const ETL_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-purple-100 border-purple-300 text-purple-700",
  "bg-green-100 border-green-300 text-green-700",
];

const ELT_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-green-100 border-green-300 text-green-700",
  "bg-purple-100 border-purple-300 text-purple-700",
];

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is ETL/ELT?"
          highlights={["Extract", "Transform", "Load"]}
        >
          <p>
            <strong>ETL</strong> (Extract, Transform, Load) and <strong>ELT</strong>{" "}
            (Extract, Load, Transform) are data integration patterns for moving
            data between systems.
          </p>
          <p>
            <strong>ETL</strong> transforms data before loading it into the
            target. Best for:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Complex transformations requiring external processing</li>
            <li>Sensitive data that needs masking before storage</li>
            <li>Legacy systems with limited compute power</li>
          </ul>
          <p>
            <strong>ELT</strong> loads raw data first, then transforms inside
            the warehouse. Best for:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Modern cloud warehouses (BigQuery, Snowflake)</li>
            <li>When you want to keep raw data for future use</li>
            <li>SQL-based transformations using dbt or similar</li>
          </ul>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          {/* ETL Flow */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              ETL (Extract → Transform → Load)
            </p>
            <div className="flex items-center justify-center gap-2">
              {ETL_STAGES.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`rounded-lg border-2 px-4 py-3 text-center ${ETL_COLORS[index]}`}
                  >
                    <p className="text-sm font-bold">{stage.label}</p>
                    <p className="text-[10px] opacity-80 max-w-24">{stage.description}</p>
                  </motion.div>
                  {index < ETL_STAGES.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * STAGGER_DELAY, duration: 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ELT Flow */}
          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              ELT (Extract → Load → Transform)
            </p>
            <div className="flex items-center justify-center gap-2">
              {ELT_STAGES.map((stage, index) => (
                <div key={`elt-${stage.id}`} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`rounded-lg border-2 px-4 py-3 text-center ${ELT_COLORS[index]}`}
                  >
                    <p className="text-sm font-bold">{stage.label}</p>
                    <p className="text-[10px] opacity-80 max-w-24">{stage.description}</p>
                  </motion.div>
                  {index < ELT_STAGES.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + index * STAGGER_DELAY, duration: 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              The key difference: <strong>ETL transforms before loading</strong>,{" "}
              <strong>ELT transforms after loading</strong>. Modern cloud
              warehouses favor ELT because they have the compute power for
              in-warehouse transformations.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
