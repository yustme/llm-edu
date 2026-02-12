import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { formatJSON } from "@/lib/formatters";

type ToolCallStatus = "pending" | "running" | "complete" | "error";

interface ToolCallCardProps {
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: ToolCallStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  ToolCallStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-gray-100 text-gray-600" },
  running: { label: "Running", className: "bg-yellow-100 text-yellow-700" },
  complete: { label: "Complete", className: "bg-green-100 text-green-700" },
  error: { label: "Error", className: "bg-red-100 text-red-700" },
};

/**
 * Expandable card showing tool call details.
 * Collapsed: shows tool name + status badge.
 * Expanded: shows CodeBlock with input params and output result.
 */
export function ToolCallCard({
  toolName,
  input,
  output,
  status,
  className,
}: ToolCallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card",
        className,
      )}
    >
      {/* Collapsed header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="font-mono text-sm font-medium">{toolName}</span>
        <Badge
          variant="secondary"
          className={cn("ml-auto", statusInfo.className)}
        >
          {statusInfo.label}
        </Badge>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t px-4 py-3">
              <CodeBlock
                code={formatJSON(input)}
                language="json"
                title="Input"
              />
              <CodeBlock
                code={formatJSON(output)}
                language="json"
                title="Output"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
