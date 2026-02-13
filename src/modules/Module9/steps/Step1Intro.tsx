import { motion } from "framer-motion";
import { User, Frown, Users, ArrowRight } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { MULTI_AGENT_BENEFITS } from "../data";

const ANIMATION_DELAY_BASE = 0.3;
const ANIMATION_DELAY_STEP = 0.4;
const ANIMATION_DURATION = 0.5;

/** Animated "one person overwhelmed" figure */
function OverwhelmedFigure() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: ANIMATION_DELAY_BASE, duration: ANIMATION_DURATION }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-300 bg-red-50">
        <User className="h-8 w-8 text-red-500" />
        <Frown className="absolute -bottom-1 -right-1 h-6 w-6 text-red-400" />
      </div>
      <span className="text-sm font-medium text-red-600">One does everything</span>
      <div className="mt-1 flex flex-wrap justify-center gap-1">
        {["Analyze", "Query", "Report", "Chart"].map((task) => (
          <span
            key={task}
            className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-600"
          >
            {task}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/** Animated "team of specialists" figures */
function TeamFigures() {
  const specialists = [
    { color: "purple", label: "Analyst" },
    { color: "green", label: "Engineer" },
    { color: "amber", label: "Reporter" },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: ANIMATION_DELAY_BASE + ANIMATION_DELAY_STEP * 3,
        duration: ANIMATION_DURATION,
      }}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex gap-3">
        {specialists.map((spec, i) => {
          const colors = colorMap[spec.color];
          return (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay:
                  ANIMATION_DELAY_BASE +
                  ANIMATION_DELAY_STEP * 3 +
                  i * 0.2,
                duration: ANIMATION_DURATION,
              }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${colors.bg} ${colors.border}`}
              >
                <Users className={`h-6 w-6 ${colors.text}`} />
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors.badge}`}
              >
                {spec.label}
              </span>
            </motion.div>
          );
        })}
      </div>
      <span className="text-sm font-medium text-green-600">
        Team of specialists
      </span>
    </motion.div>
  );
}

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Why Multiple Agents?"
          highlights={["Specialization", "Scalability", "Collaboration"]}
        >
          <p>
            A single AI agent can handle simple tasks, but complex real-world
            problems often require different types of expertise. Just like a
            company has specialized teams, we can create specialized agents.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {MULTI_AGENT_BENEFITS.map((benefit) => (
              <li key={benefit.title}>
                <span className="font-medium text-foreground">
                  {benefit.title}:
                </span>{" "}
                {benefit.description}
              </li>
            ))}
          </ul>
          <p>
            In this module, we will see how three specialized agents collaborate
            to answer a complex data question that would overwhelm a single
            agent.
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
            Single agent vs. team of specialists
          </motion.p>

          <div className="flex items-center gap-8">
            <OverwhelmedFigure />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: ANIMATION_DELAY_BASE + ANIMATION_DELAY_STEP * 2,
                duration: ANIMATION_DURATION,
              }}
            >
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </motion.div>

            <TeamFigures />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.6 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Breaking complex tasks into specialized roles
            <br />
            improves quality, speed, and maintainability.
          </motion.p>
        </InteractiveArea>
      </div>
    </div>
  );
}
