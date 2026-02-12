import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentDefinition } from "@/config/multi-agent.config";

interface AgentCardProps {
  agent: AgentDefinition;
  /** Delay for staggered entry animation (in seconds) */
  animationDelay?: number;
  className?: string;
}

const ANIMATION_DURATION = 0.5;

/**
 * Detailed agent info card showing name, role, description,
 * and available tools. Uses Framer Motion for entry animation.
 */
export function AgentCard({
  agent,
  animationDelay = 0,
  className,
}: AgentCardProps) {
  const Icon = agent.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        duration: ANIMATION_DURATION,
        ease: "easeOut",
      }}
      className={cn(
        "overflow-hidden rounded-xl border shadow-sm",
        agent.color.border,
        className,
      )}
    >
      {/* Colored header */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3",
          agent.color.bg,
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            agent.color.bg,
            agent.color.text,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className={cn("font-semibold", agent.color.text)}>
            {agent.name}
          </h3>
          <Badge
            variant="secondary"
            className={cn(
              "mt-0.5 text-xs",
              agent.color.bg,
              agent.color.text,
            )}
          >
            {agent.role}
          </Badge>
        </div>
      </div>

      {/* Description and tools */}
      <div className="space-y-3 bg-card px-4 py-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {agent.description}
        </p>

        {/* Tools list */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools.map((tool) => (
              <Badge
                key={tool.name}
                variant="outline"
                className="text-xs font-mono"
                title={tool.description}
              >
                {tool.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
