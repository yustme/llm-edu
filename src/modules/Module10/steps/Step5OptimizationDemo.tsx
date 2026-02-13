import { motion } from "framer-motion";
import { DollarSign, Clock, Cpu, AlertCircle } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";
import { NAIVE_STEPS, OPTIMIZED_STEPS } from "@/data/mock-optimization";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const naiveFinal = NAIVE_STEPS.find((s) => s.type === "final-response");
const optimizedFinal = OPTIMIZED_STEPS.find((s) => s.type === "final-response");

interface MetricBadgeProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

function MetricBadge({ label, value, icon: Icon, color, delay }: MetricBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: ANIMATION_DURATION }}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${color}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs text-opacity-80">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

export function Step5OptimizationDemo() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Naive vs Optimized"
          highlights={["Same Quality", "Lower Cost", "Faster Response"]}
        >
          <p>
            Both agents answer the exact same question:{" "}
            <strong>&ldquo;What&apos;s our Q4 revenue by region?&rdquo;</strong>
          </p>
          <p>
            The <strong>naive agent</strong> uses GPT-4o for everything and
            makes two sequential SQL queries. The{" "}
            <strong>optimized agent</strong> uses Haiku for routing, Sonnet for
            generation, and a single optimized query.
          </p>
          <p>
            The result is the same quality answer at 75% lower cost and 57%
            lower latency.
          </p>
          <p>
            Key optimizations applied:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Model routing (Haiku for classification)</li>
            <li>Single optimized SQL query instead of two</li>
            <li>Concise prompt reducing token count</li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <ComparisonView
            leftLabel="Naive Agent"
            rightLabel="Optimized Agent"
            leftContent={
              <div className="space-y-3">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <MetricBadge
                    label="Cost"
                    value={String(naiveFinal?.metadata?.cost ?? "$0.12")}
                    icon={DollarSign}
                    color="bg-red-50 border-red-200 text-red-700"
                    delay={0.2}
                  />
                  <MetricBadge
                    label="Latency"
                    value={String(naiveFinal?.metadata?.latency ?? "4.2s")}
                    icon={Clock}
                    color="bg-red-50 border-red-200 text-red-700"
                    delay={0.2 + STAGGER_DELAY}
                  />
                  <MetricBadge
                    label="Model"
                    value={String(naiveFinal?.metadata?.model ?? "GPT-4o")}
                    icon={Cpu}
                    color="bg-red-50 border-red-200 text-red-700"
                    delay={0.2 + STAGGER_DELAY * 2}
                  />
                  <MetricBadge
                    label="Tool Calls"
                    value={String(naiveFinal?.metadata?.toolCalls ?? "2")}
                    icon={AlertCircle}
                    color="bg-red-50 border-red-200 text-red-700"
                    delay={0.2 + STAGGER_DELAY * 3}
                  />
                </div>

                {/* Response */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="rounded-lg bg-muted p-3"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Response
                  </p>
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {naiveFinal?.content ?? ""}
                  </p>
                </motion.div>
              </div>
            }
            rightContent={
              <div className="space-y-3">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <MetricBadge
                    label="Cost"
                    value={String(optimizedFinal?.metadata?.cost ?? "$0.03")}
                    icon={DollarSign}
                    color="bg-green-50 border-green-200 text-green-700"
                    delay={0.4}
                  />
                  <MetricBadge
                    label="Latency"
                    value={String(optimizedFinal?.metadata?.latency ?? "1.8s")}
                    icon={Clock}
                    color="bg-green-50 border-green-200 text-green-700"
                    delay={0.4 + STAGGER_DELAY}
                  />
                  <MetricBadge
                    label="Model"
                    value="Haiku + Sonnet"
                    icon={Cpu}
                    color="bg-green-50 border-green-200 text-green-700"
                    delay={0.4 + STAGGER_DELAY * 2}
                  />
                  <MetricBadge
                    label="Tool Calls"
                    value={String(optimizedFinal?.metadata?.toolCalls ?? "1")}
                    icon={AlertCircle}
                    color="bg-green-50 border-green-200 text-green-700"
                    delay={0.4 + STAGGER_DELAY * 3}
                  />
                </div>

                {/* Response */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="rounded-lg bg-muted p-3"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Response
                  </p>
                  <p className="text-xs leading-relaxed whitespace-pre-line">
                    {optimizedFinal?.content ?? ""}
                  </p>
                </motion.div>
              </div>
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-4 rounded-lg border-2 border-green-300 bg-green-50 p-3 text-center"
          >
            <p className="text-sm font-semibold text-green-700">
              {String(optimizedFinal?.metadata?.annotation ?? "75% cost reduction, 57% latency reduction with same quality")}
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
