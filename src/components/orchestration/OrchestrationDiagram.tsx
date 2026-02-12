import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { OrchestrationAgent } from "@/data/mock-orchestration";

const ANIMATION_STAGGER = 0.15;
const ANIMATION_DURATION = 0.4;

/** Map tailwind color names to border/background/text utility classes */
function colorClasses(color: string): {
  border: string;
  bg: string;
  text: string;
  ring: string;
} {
  const map: Record<string, { border: string; bg: string; text: string; ring: string }> = {
    blue: {
      border: "border-blue-300",
      bg: "bg-blue-50",
      text: "text-blue-700",
      ring: "ring-blue-400",
    },
    amber: {
      border: "border-amber-300",
      bg: "bg-amber-50",
      text: "text-amber-700",
      ring: "ring-amber-400",
    },
    green: {
      border: "border-green-300",
      bg: "bg-green-50",
      text: "text-green-700",
      ring: "ring-green-400",
    },
    purple: {
      border: "border-purple-300",
      bg: "bg-purple-50",
      text: "text-purple-700",
      ring: "ring-purple-400",
    },
    rose: {
      border: "border-rose-300",
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-400",
    },
  };
  return (
    map[color] ?? {
      border: "border-gray-300",
      bg: "bg-gray-50",
      text: "text-gray-700",
      ring: "ring-gray-400",
    }
  );
}

interface AgentBoxProps {
  agent: OrchestrationAgent;
  isActive?: boolean;
  delay?: number;
}

/** A single agent box with optional pulse animation when active */
function AgentBox({ agent, isActive = false, delay = 0 }: AgentBoxProps) {
  const colors = colorClasses(agent.color);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: ANIMATION_DURATION, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 text-center shadow-sm transition-shadow",
        colors.border,
        colors.bg,
        isActive && `ring-2 ${colors.ring} shadow-md`,
      )}
    >
      {isActive && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl border-2",
            colors.border,
          )}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ position: "absolute" }}
        />
      )}
      <span className={cn("text-sm font-bold", colors.text)}>
        {agent.name}
      </span>
      <span className="text-xs text-muted-foreground">{agent.role}</span>
    </motion.div>
  );
}

/** Animated arrow between agent boxes */
function Arrow({
  direction = "right",
  delay = 0,
}: {
  direction?: "right" | "down";
  delay?: number;
}) {
  const isVertical = direction === "down";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        isVertical ? "py-1" : "px-1",
      )}
    >
      {isVertical ? (
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
          <motion.path
            d="M12 2 L12 22 M6 16 L12 22 L18 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          />
        </svg>
      ) : (
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
          <motion.path
            d="M2 12 L26 12 M20 6 L26 12 L20 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          />
        </svg>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout renderers                                                    */
/* ------------------------------------------------------------------ */

function SequentialLayout({
  agents,
  activeAgentId,
}: {
  agents: OrchestrationAgent[];
  activeAgentId?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {agents.map((agent, i) => (
        <div key={agent.id} className="flex items-center gap-1">
          <AgentBox
            agent={agent}
            isActive={activeAgentId === agent.id}
            delay={i * ANIMATION_STAGGER}
          />
          {i < agents.length - 1 && (
            <Arrow direction="right" delay={i * ANIMATION_STAGGER + 0.2} />
          )}
        </div>
      ))}
    </div>
  );
}

function ParallelLayout({
  agents,
  activeAgentId,
}: {
  agents: OrchestrationAgent[];
  activeAgentId?: string;
}) {
  /* Expects: [orchestrator, ...workers, merger] */
  const orchestrator = agents[0];
  const workers = agents.slice(1, -1);
  const merger = agents[agents.length - 1];

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top: Orchestrator */}
      <AgentBox
        agent={orchestrator}
        isActive={activeAgentId === orchestrator.id}
        delay={0}
      />

      {/* Fan-out arrows */}
      <div className="flex items-start justify-center gap-8">
        {workers.map((_, i) => (
          <Arrow key={`arrow-down-${i}`} direction="down" delay={0.3 + i * 0.1} />
        ))}
      </div>

      {/* Workers row */}
      <div className="flex items-center justify-center gap-4">
        {workers.map((agent, i) => (
          <AgentBox
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
            delay={0.4 + i * ANIMATION_STAGGER}
          />
        ))}
      </div>

      {/* Fan-in arrows */}
      <div className="flex items-start justify-center gap-8">
        {workers.map((_, i) => (
          <Arrow key={`arrow-down-merge-${i}`} direction="down" delay={0.8 + i * 0.1} />
        ))}
      </div>

      {/* Bottom: Merger */}
      <AgentBox
        agent={merger}
        isActive={activeAgentId === merger.id}
        delay={1.0}
      />
    </div>
  );
}

function RouterLayout({
  agents,
  activeAgentId,
}: {
  agents: OrchestrationAgent[];
  activeAgentId?: string;
}) {
  /* Expects: [router, ...specialists] */
  const router = agents[0];
  const specialists = agents.slice(1);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top: Router */}
      <AgentBox
        agent={router}
        isActive={activeAgentId === router.id}
        delay={0}
      />

      {/* Arrows to specialists */}
      <div className="flex items-start justify-center gap-8">
        {specialists.map((_, i) => (
          <Arrow key={`arrow-${i}`} direction="down" delay={0.3 + i * 0.1} />
        ))}
      </div>

      {/* Specialists row */}
      <div className="flex items-center justify-center gap-4">
        {specialists.map((agent, i) => (
          <AgentBox
            key={agent.id}
            agent={agent}
            isActive={activeAgentId === agent.id}
            delay={0.5 + i * ANIMATION_STAGGER}
          />
        ))}
      </div>
    </div>
  );
}

function LoopLayout({
  agents,
  activeAgentId,
}: {
  agents: OrchestrationAgent[];
  activeAgentId?: string;
}) {
  /* Expects: [generator, evaluator] */
  const generator = agents[0];
  const evaluator = agents[1];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Generator */}
      <AgentBox
        agent={generator}
        isActive={activeAgentId === generator.id}
        delay={0}
      />

      {/* Forward arrow (generate -> evaluate) */}
      <Arrow direction="down" delay={0.2} />

      {/* Evaluator */}
      <AgentBox
        agent={evaluator}
        isActive={activeAgentId === evaluator.id}
        delay={0.3}
      />

      {/* Loop-back indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
          <motion.path
            d="M60 4 C20 4, 4 20, 20 36 L60 36 C100 36, 116 20, 100 4 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="4 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          />
          <motion.polygon
            points="56,0 64,4 56,8"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
        </svg>
        <span className="text-xs font-medium">Loop until quality met</span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

interface OrchestrationDiagramProps {
  agents: OrchestrationAgent[];
  layout: "sequential" | "parallel" | "router" | "loop";
  activeAgentId?: string;
  className?: string;
}

export function OrchestrationDiagram({
  agents,
  layout,
  activeAgentId,
  className,
}: OrchestrationDiagramProps) {
  return (
    <div className={cn("relative", className)}>
      {layout === "sequential" && (
        <SequentialLayout agents={agents} activeAgentId={activeAgentId} />
      )}
      {layout === "parallel" && (
        <ParallelLayout agents={agents} activeAgentId={activeAgentId} />
      )}
      {layout === "router" && (
        <RouterLayout agents={agents} activeAgentId={activeAgentId} />
      )}
      {layout === "loop" && (
        <LoopLayout agents={agents} activeAgentId={activeAgentId} />
      )}
    </div>
  );
}
