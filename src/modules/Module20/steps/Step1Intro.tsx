import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";

const ANIMATION_STAGGER = 0.4;
const ANIMATION_DURATION = 0.5;

/** The three defense layers in the guardrail architecture */
const DEFENSE_LAYERS = [
  {
    label: "Input Guardrails",
    description: "Validate and filter user inputs before they reach the LLM",
    icon: ShieldAlert,
    color: "bg-amber-100 border-amber-300 text-amber-700",
    iconColor: "text-amber-600",
  },
  {
    label: "Agent / LLM Processing",
    description: "The language model processes the validated request",
    icon: Shield,
    color: "bg-blue-100 border-blue-300 text-blue-700",
    iconColor: "text-blue-600",
  },
  {
    label: "Output Guardrails",
    description: "Check and filter agent outputs before delivery to the user",
    icon: ShieldCheck,
    color: "bg-green-100 border-green-300 text-green-700",
    iconColor: "text-green-600",
  },
] as const;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Guardrails Matter"
          highlights={["Input Validation", "Output Filtering", "Safety"]}
        >
          <p>
            AI agents are powerful, but without proper safety measures they are
            vulnerable to <strong>prompt injection</strong>, accidental{" "}
            <strong>data leaks</strong>, and{" "}
            <strong>harmful or unreliable outputs</strong>.
          </p>
          <p>
            Guardrails form a <strong>3-layer defense</strong> around your
            agent:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <span className="font-medium">Input guardrails</span> - Validate
              user messages before they reach the LLM
            </li>
            <li>
              <span className="font-medium">LLM processing</span> - The model
              handles the validated request
            </li>
            <li>
              <span className="font-medium">Output guardrails</span> - Check
              the response before it is sent to the user
            </li>
          </ol>
          <p>
            Together, these layers ensure that malicious inputs are blocked
            early and unsafe outputs are filtered before they cause harm.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8 text-center text-sm font-medium text-muted-foreground"
          >
            3-Layer Defense Architecture
          </motion.p>

          <div className="flex w-full max-w-md flex-col items-center gap-4">
            {DEFENSE_LAYERS.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <div key={layer.label} className="flex w-full flex-col items-center gap-4">
                  {/* Arrow connector above (except first) */}
                  {index > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.2 + (index - 0.5) * ANIMATION_STAGGER,
                        duration: 0.3,
                      }}
                      className="flex flex-col items-center origin-top"
                    >
                      <div className="h-6 w-px bg-border" />
                      <div className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-border" />
                    </motion.div>
                  )}

                  {/* Layer card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * ANIMATION_STAGGER,
                      duration: ANIMATION_DURATION,
                      ease: "easeOut",
                    }}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 px-5 py-4 ${layer.color}`}
                  >
                    <Icon className={`h-6 w-6 shrink-0 ${layer.iconColor}`} />
                    <div>
                      <span className="text-sm font-bold">{layer.label}</span>
                      <p className="text-xs opacity-80 mt-0.5">
                        {layer.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.3 + DEFENSE_LAYERS.length * ANIMATION_STAGGER + 0.3,
              duration: 0.4,
            }}
            className="mt-8 flex w-full max-w-md items-center justify-between text-xs text-muted-foreground"
          >
            <span>User Input</span>
            <div className="mx-4 h-px flex-1 bg-border" />
            <span>Safe Output</span>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
