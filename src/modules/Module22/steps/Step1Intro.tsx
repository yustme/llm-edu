import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Brain, Sparkles } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { AutonomySpectrum } from "@/components/human-loop/AutonomySpectrum";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const WHEN_HUMANS_ESSENTIAL = [
  {
    icon: AlertTriangle,
    label: "High-Stakes Decisions",
    description:
      "Deleting data, financial transactions, or actions that cannot be easily undone.",
    color: "text-red-600 bg-red-100",
  },
  {
    icon: Brain,
    label: "Novel Situations",
    description:
      "Scenarios the model has never seen before, where hallucination risk is high.",
    color: "text-purple-600 bg-purple-100",
  },
  {
    icon: ShieldCheck,
    label: "Ethical Concerns",
    description:
      "Decisions involving fairness, bias, privacy, or legal compliance.",
    color: "text-amber-600 bg-amber-100",
  },
  {
    icon: Sparkles,
    label: "Ambiguous Requirements",
    description:
      "When the user's intent is unclear and multiple valid interpretations exist.",
    color: "text-blue-600 bg-blue-100",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Human Oversight?"
          highlights={[
            "Autonomy Spectrum",
            "Risk Management",
            "Trust Building",
          ]}
        >
          <p>
            AI agents can operate at different levels of autonomy, from fully
            manual to fully autonomous. The key question is:{" "}
            <strong>how much control should we give the agent?</strong>
          </p>
          <p>
            More autonomy means faster execution but higher risk. Less autonomy
            means safer operations but slower throughput. The right balance
            depends on the <strong>stakes</strong>, the{" "}
            <strong>confidence</strong> of the model, and the{" "}
            <strong>reversibility</strong> of actions.
          </p>
          <p>
            Human-in-the-loop (HITL) design ensures that humans remain in
            control of critical decisions while letting agents handle routine
            work efficiently.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-6">
          <div>
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
              The Autonomy Spectrum
            </p>
            <AutonomySpectrum />
          </div>

          <div>
            <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
              When Humans Are Essential
            </p>
            <div className="grid grid-cols-2 gap-3">
              {WHEN_HUMANS_ESSENTIAL.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.8 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className="flex gap-3 rounded-lg border bg-card p-3"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
