import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, DollarSign, Clock } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ComparisonView } from "@/components/presentation/ComparisonView";

const ANIMATION_DURATION = 0.5;
const STAGGER_DELAY = 0.2;

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

function StatCard({ label, value, icon: Icon, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: ANIMATION_DURATION, ease: "easeOut" }}
      className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 ${color}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs opacity-80">{label}</p>
      </div>
    </motion.div>
  );
}

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Optimize Cost & Latency?"
          highlights={["Production", "Cost Reduction", "Speed"]}
        >
          <p>
            Building an AI agent that works is just the beginning. In
            production, <strong>cost and latency</strong> become critical
            factors that determine whether your agent is viable at scale.
          </p>
          <p>
            An unoptimized agent can cost <strong>10x more</strong> and
            respond <strong>3x slower</strong> than a well-tuned one, while
            delivering the same quality answers.
          </p>
          <p>
            Common optimization areas include:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-medium">Model selection</span> - Use the
              right model for each task
            </li>
            <li>
              <span className="font-medium">Caching</span> - Avoid redundant
              LLM calls
            </li>
            <li>
              <span className="font-medium">Prompt engineering</span> - Reduce
              token volume
            </li>
            <li>
              <span className="font-medium">Parallel execution</span> - Run
              independent calls simultaneously
            </li>
          </ol>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-4 text-center text-sm font-medium text-muted-foreground"
          >
            Unoptimized vs Optimized Agent
          </motion.p>

          <ComparisonView
            leftLabel="Unoptimized"
            rightLabel="Optimized"
            leftContent={
              <div className="space-y-3">
                <StatCard
                  label="Cost per query"
                  value="$0.12"
                  icon={DollarSign}
                  color="bg-red-50 border-red-200 text-red-700"
                  delay={0.3}
                />
                <StatCard
                  label="Avg latency"
                  value="4.2s"
                  icon={Clock}
                  color="bg-red-50 border-red-200 text-red-700"
                  delay={0.3 + STAGGER_DELAY}
                />
                <StatCard
                  label="Monthly cost (10k queries)"
                  value="$1,200"
                  icon={TrendingUp}
                  color="bg-red-50 border-red-200 text-red-700"
                  delay={0.3 + STAGGER_DELAY * 2}
                />
              </div>
            }
            rightContent={
              <div className="space-y-3">
                <StatCard
                  label="Cost per query"
                  value="$0.03"
                  icon={DollarSign}
                  color="bg-green-50 border-green-200 text-green-700"
                  delay={0.5}
                />
                <StatCard
                  label="Avg latency"
                  value="1.8s"
                  icon={Clock}
                  color="bg-green-50 border-green-200 text-green-700"
                  delay={0.5 + STAGGER_DELAY}
                />
                <StatCard
                  label="Monthly cost (10k queries)"
                  value="$300"
                  icon={TrendingDown}
                  color="bg-green-50 border-green-200 text-green-700"
                  delay={0.5 + STAGGER_DELAY * 2}
                />
              </div>
            }
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3 text-center"
          >
            <p className="text-sm font-medium text-primary">
              75% cost reduction with the same quality output
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
