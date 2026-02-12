import { motion } from "framer-motion";
import { Check, X, Users, ArrowRight, Brain, Database, BarChart3 } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PROS_AND_CONS } from "../data";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 0.4;
const STAGGER_DELAY = 0.15;

/** Mini agent node for the summary diagram */
function MiniAgent({
  Icon,
  label,
  colorBg,
  colorText,
  delay,
}: {
  Icon: typeof Brain;
  label: string;
  colorBg: string;
  colorText: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: ANIMATION_DURATION }}
      className="flex flex-col items-center gap-1"
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border-2",
          colorBg,
          colorText,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </motion.div>
  );
}

/** Summary architecture diagram */
function SummaryDiagram() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: ANIMATION_DURATION }}
        className="text-sm font-medium text-muted-foreground"
      >
        Multi-Agent Architecture
      </motion.p>

      <div className="flex items-center gap-3">
        <MiniAgent
          Icon={Users}
          label="User"
          colorBg="bg-blue-100 border-blue-300"
          colorText="text-blue-600"
          delay={0.2}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: ANIMATION_DURATION }}
        >
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <MiniAgent
          Icon={Brain}
          label="Analyst"
          colorBg="bg-purple-100 border-purple-300"
          colorText="text-purple-600"
          delay={0.5}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: ANIMATION_DURATION }}
        >
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <MiniAgent
          Icon={Database}
          label="Engineer"
          colorBg="bg-green-100 border-green-300"
          colorText="text-green-600"
          delay={0.8}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: ANIMATION_DURATION }}
        >
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
        <MiniAgent
          Icon={BarChart3}
          label="Reporter"
          colorBg="bg-amber-100 border-amber-300"
          colorText="text-amber-600"
          delay={1.1}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="text-xs text-muted-foreground text-center max-w-sm"
      >
        Each agent specializes in one domain and communicates
        via structured messages, creating a robust pipeline.
      </motion.p>
    </div>
  );
}

export function Step6Summary() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Key Takeaways"
          highlights={["Multi-Agent", "Specialization", "Trade-offs"]}
        >
          <p>
            Multi-agent systems enable complex task solving by breaking work
            into specialized roles. Each agent focuses on what it does best,
            and they communicate through well-defined interfaces.
          </p>

          {/* Pros */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-green-700">Advantages</h3>
            <ul className="space-y-1">
              {PROS_AND_CONS.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-red-700">Challenges</h3>
            <ul className="space-y-1">
              {PROS_AND_CONS.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <SummaryDiagram />

          {/* Recap cards */}
          <div className="mt-6 grid grid-cols-3 gap-3 px-4">
            {[
              {
                title: "Data Analyst",
                desc: "Translates questions into requirements and interprets results",
                color: "border-purple-300 bg-purple-50",
              },
              {
                title: "Data Engineer",
                desc: "Writes SQL, manages data pipelines, optimizes performance",
                color: "border-green-300 bg-green-50",
              },
              {
                title: "Reporting Agent",
                desc: "Creates charts, formats reports, generates summaries",
                color: "border-amber-300 bg-amber-50",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.6 + i * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className={cn(
                  "rounded-lg border p-3 text-center",
                  card.color,
                )}
              >
                <h4 className="text-xs font-semibold">{card.title}</h4>
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
