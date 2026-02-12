import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { ToolDefinitionCard } from "@/components/tools/ToolDefinitionCard";
import { TOOL_DEFINITIONS } from "@/data/mock-tool-use";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

export function Step2ToolDefinitions() {
  return (
    <div className="flex gap-8">
      {/* Left: Info panel (~40%) */}
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="How Tools Are Defined"
          highlights={["JSON Schema", "Parameters", "Description"]}
        >
          <p>
            Tools are defined as structured descriptions that the LLM can
            understand. Each definition includes a <strong>name</strong>, a
            human-readable <strong>description</strong>, and a{" "}
            <strong>JSON Schema</strong> for parameters.
          </p>
          <p>
            The LLM sees these definitions in its system prompt and uses them to
            decide which tool to call and how to format the arguments. The
            quality of tool descriptions directly impacts how reliably the LLM
            selects and uses them.
          </p>
          <p>
            Key elements of a good tool definition:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Clear, specific description of what the tool does</li>
            <li>Well-typed parameters with descriptions</li>
            <li>Required vs optional parameters marked explicitly</li>
            <li>Expected return format documented</li>
          </ul>
        </InfoPanel>
      </div>

      {/* Right: Interactive area (~60%) */}
      <div className="flex-1">
        <InteractiveArea className="flex h-full flex-col">
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Available Tool Definitions
          </p>
          <div className="space-y-3">
            {TOOL_DEFINITIONS.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                  ease: "easeOut",
                }}
              >
                <ToolDefinitionCard
                  tool={tool}
                  defaultExpanded={index === 0}
                />
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
