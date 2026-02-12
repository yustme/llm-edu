import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { formatJSON } from "@/lib/formatters";
import type { ToolDefinition } from "@/data/mock-tool-use";

interface ToolDefinitionCardProps {
  tool: ToolDefinition;
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Expandable card showing a tool's JSON schema definition.
 * Collapsed: tool name + short description.
 * Expanded: CodeBlock with full JSON schema.
 */
export function ToolDefinitionCard({
  tool,
  defaultExpanded = false,
  className,
}: ToolDefinitionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-mono text-sm font-medium">{tool.name}</span>
          <span className="text-xs text-muted-foreground truncate">
            {tool.description}
          </span>
        </div>
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
            <div className="border-t px-4 py-3">
              <CodeBlock
                code={formatJSON({
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.parameters,
                })}
                language="json"
                title="Tool Definition"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
