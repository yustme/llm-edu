import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { APPROVAL_PATTERNS } from "@/data/mock-human-loop";
import type { ApprovalPattern, ApprovalPatternNode } from "@/data/mock-human-loop";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

const NODE_TYPE_STYLES: Record<ApprovalPatternNode["type"], string> = {
  agent: "bg-blue-100 border-blue-300 text-blue-800",
  action: "bg-purple-100 border-purple-300 text-purple-800",
  human: "bg-amber-100 border-amber-300 text-amber-800",
  result: "bg-green-100 border-green-300 text-green-800",
  decision: "bg-orange-100 border-orange-300 text-orange-800",
};

interface ApprovalFlowDiagramProps {
  pattern: ApprovalPattern["id"];
}

/**
 * Animated flow diagram for a specific approval pattern.
 * Renders nodes connected by arrows in a horizontal flow.
 */
export function ApprovalFlowDiagram({ pattern }: ApprovalFlowDiagramProps) {
  const data = APPROVAL_PATTERNS.find((p) => p.id === pattern);
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Flow diagram */}
      <div className="flex items-center justify-center gap-2">
        {data.nodes.map((node, index) => (
          <div key={node.id} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * STAGGER_DELAY,
                duration: ANIMATION_DURATION,
              }}
              className={cn(
                "flex min-w-[120px] items-center justify-center rounded-lg border-2 px-4 py-3 text-center text-sm font-medium shadow-sm",
                NODE_TYPE_STYLES[node.type],
              )}
            >
              {node.label}
            </motion.div>

            {/* Arrow between nodes */}
            {index < data.nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  delay: index * STAGGER_DELAY + 0.1,
                  duration: 0.3,
                }}
                className="flex flex-col items-center"
                style={{ transformOrigin: "left" }}
              >
                {data.edges[index]?.label && (
                  <span className="mb-1 text-[10px] font-medium text-muted-foreground">
                    {data.edges[index].label}
                  </span>
                )}
                <svg
                  width="40"
                  height="16"
                  viewBox="0 0 40 16"
                  className="text-muted-foreground"
                >
                  <line
                    x1="0"
                    y1="8"
                    x2="30"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polygon
                    points="30,3 40,8 30,13"
                    fill="currentColor"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Pattern details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: data.nodes.length * STAGGER_DELAY, duration: ANIMATION_DURATION }}
        className="rounded-lg border bg-muted/30 p-4"
      >
        <p className="mb-3 text-sm text-muted-foreground">{data.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-green-600">
              Advantages
            </p>
            <ul className="space-y-1">
              {data.pros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-red-600">
              Disadvantages
            </p>
            <ul className="space-y-1">
              {data.cons.map((con) => (
                <li
                  key={con}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
