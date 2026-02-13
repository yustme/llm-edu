import { motion } from "framer-motion";
import { BookOpen, Wrench, RefreshCw, Quote } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { GROUNDING_TECHNIQUES } from "@/data/mock-grounding";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen,
  Wrench,
  RefreshCw,
  Quote,
};

const CARD_COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badgeBg: "bg-violet-100 text-violet-700",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100 text-amber-700",
  },
] as const;

export function Step2Techniques() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Grounding Techniques"
          highlights={["RAG", "Tool-Use", "Self-Consistency", "Citations"]}
        >
          <p>
            There is no single grounding strategy that fits every use case. The
            right approach depends on what data sources are available, how
            critical accuracy is, and how much latency you can tolerate.
          </p>
          <p>Four primary techniques:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>RAG-based grounding</strong> -- retrieve documents first,
              then generate answers from them
            </li>
            <li>
              <strong>Tool-use grounding</strong> -- call live APIs or databases
              to fetch real-time facts
            </li>
            <li>
              <strong>Self-consistency</strong> -- generate multiple answers and
              check if they agree
            </li>
            <li>
              <strong>Citation generation</strong> -- force the model to
              attribute every claim to a source
            </li>
          </ul>
          <p>
            In practice, production systems often <strong>combine</strong>{" "}
            multiple techniques. For example, RAG retrieves the documents, the
            model generates a cited response, and a post-processing step
            verifies each citation.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Four Approaches to Grounding
          </p>

          <div className="grid grid-cols-2 gap-4">
            {GROUNDING_TECHNIQUES.map((technique, index) => {
              const TechIcon = ICON_MAP[technique.icon] ?? BookOpen;
              const colors = CARD_COLORS[index % CARD_COLORS.length];

              return (
                <motion.div
                  key={technique.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={`rounded-xl border ${colors.border} ${colors.bg} p-4`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}
                    >
                      <TechIcon className={`h-5 w-5 ${colors.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {technique.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {technique.description}
                  </p>

                  {/* When to use */}
                  <div className="mt-3 rounded-md border bg-white/50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      When to use
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground">
                      {technique.whenToUse}
                    </p>
                  </div>

                  {/* Strengths */}
                  <div className="mt-3 space-y-1">
                    {technique.strengths.map((strength) => (
                      <div
                        key={strength}
                        className="flex items-start gap-1.5"
                      >
                        <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-40" />
                        <span className="text-[10px] leading-relaxed text-muted-foreground">
                          {strength}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
