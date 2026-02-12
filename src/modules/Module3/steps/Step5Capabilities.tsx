import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Wrench, MessageSquare, ChevronDown } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { cn } from "@/lib/utils";
import { MCP_CAPABILITY_TYPES } from "@/config/mcp.config";

const ANIMATION_DURATION = 0.3;

/** Icon map for capability types */
const CAPABILITY_ICONS = {
  resources: BookOpen,
  tools: Wrench,
  prompts: MessageSquare,
} as const;

/** Color classes for capability types */
const CAPABILITY_COLORS = {
  resources: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    headerText: "text-blue-700",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  tools: {
    bg: "bg-green-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    headerText: "text-green-700",
    badgeBg: "bg-green-100",
    badgeText: "text-green-700",
  },
  prompts: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    headerText: "text-purple-700",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
  },
} as const;

type CapabilityType = keyof typeof MCP_CAPABILITY_TYPES;

/** Expandable capability card */
function CapabilityCard({
  type,
  isExpanded,
  onToggle,
}: {
  type: CapabilityType;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const data = MCP_CAPABILITY_TYPES[type];
  const colors = CAPABILITY_COLORS[type];
  const Icon = CAPABILITY_ICONS[type];

  return (
    <motion.div
      layout
      className={cn(
        "rounded-lg border overflow-hidden transition-colors",
        colors.border,
        isExpanded ? colors.bg : "bg-white",
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            colors.iconBg,
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", colors.iconText)} />
        </div>

        <div className="flex-1">
          <div className={cn("text-sm font-semibold", colors.headerText)}>
            {data.label}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {data.description}
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="overflow-hidden"
          >
            <div className="border-t px-3 pb-3 pt-2" style={{ borderColor: "inherit" }}>
              {/* Full description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {data.description}
              </p>

              {/* Examples */}
              <div className="mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Examples
                </span>
                <ul className="mt-1 space-y-0.5">
                  {data.examples.map((example, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-foreground"
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-1 w-1 shrink-0 rounded-full",
                          colors.iconBg,
                        )}
                      />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code example */}
              <CodeBlock
                code={data.codeExample}
                language="typescript"
                title={`${data.label} API Example`}
                className="text-[10px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Step5Capabilities() {
  const [expandedType, setExpandedType] = useState<CapabilityType | null>(null);

  const handleToggle = (type: CapabilityType) => {
    setExpandedType((prev) => (prev === type ? null : type));
  };

  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Three Capability Types"
          highlights={["Resources", "Tools", "Prompts"]}
        >
          <p>
            MCP servers expose three types of capabilities to clients. Each
            type serves a different purpose and gives the AI model different
            ways to interact with external systems.
          </p>

          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-foreground">Resources</span>{" "}
              provide read-only access to data. The AI can browse and read
              resources but cannot modify them through this interface.
            </li>
            <li>
              <span className="font-medium text-foreground">Tools</span> are
              executable actions. When the AI needs to perform an operation
              (query a database, call an API), it invokes a tool.
            </li>
            <li>
              <span className="font-medium text-foreground">Prompts</span> are
              reusable templates. They give the AI pre-built instructions for
              common tasks, ensuring consistent behavior.
            </li>
          </ul>

          <p>
            The server controls which capabilities to expose, providing a
            security boundary between the AI and the underlying systems.
          </p>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea>
          <p className="mb-3 text-center text-sm font-medium text-muted-foreground">
            Click a capability to expand
          </p>

          <div className="space-y-3">
            {(
              Object.keys(MCP_CAPABILITY_TYPES) as CapabilityType[]
            ).map((type) => (
              <CapabilityCard
                key={type}
                type={type}
                isExpanded={expandedType === type}
                onToggle={() => handleToggle(type)}
              />
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
