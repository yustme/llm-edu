import { motion } from "framer-motion";
import { MessageSquare, Database, Code, Play, MessageCircle, ArrowDown } from "lucide-react";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { PIPELINE_STAGES } from "../data";

const STAGGER_DELAY = 0.2;
const ANIMATION_DURATION = 0.4;

const ICONS: Record<string, React.ElementType> = {
  MessageSquare,
  Database,
  Code,
  Play,
  MessageCircle,
};

const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-700",
  "bg-amber-100 border-amber-300 text-amber-700",
  "bg-purple-100 border-purple-300 text-purple-700",
  "bg-green-100 border-green-300 text-green-700",
  "bg-emerald-100 border-emerald-300 text-emerald-700",
];

export function Step2Pipeline() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="The Text-to-SQL Pipeline"
          highlights={["5 Stages", "Schema Context", "Execution"]}
        >
          <p>
            The Text-to-SQL pipeline has five stages that transform a natural
            language question into a structured answer:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Question</strong> - User asks in natural language
            </li>
            <li>
              <strong>Schema Context</strong> - Provide table and column
              definitions to the LLM
            </li>
            <li>
              <strong>SQL Generation</strong> - LLM generates a valid query
            </li>
            <li>
              <strong>Execution</strong> - Query runs against the database
            </li>
            <li>
              <strong>Answer</strong> - Results are formatted for the user
            </li>
          </ol>
          <p>
            The <strong>schema context</strong> step is critical - without it,
            the LLM will hallucinate table and column names.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Pipeline Flow
          </p>
          <div className="flex flex-col items-center gap-2">
            {PIPELINE_STAGES.map((stage, index) => {
              const Icon = ICONS[stage.iconName] ?? MessageSquare;
              return (
                <div key={stage.id} className="flex w-full flex-col items-center gap-2">
                  {index > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{
                        delay: 0.2 + (index - 0.5) * STAGGER_DELAY,
                        duration: 0.3,
                      }}
                      className="flex flex-col items-center origin-top"
                    >
                      <ArrowDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + index * STAGGER_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                    className={`flex w-full max-w-md items-center gap-4 rounded-lg border-2 px-5 py-3 ${COLORS[index]}`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{stage.label}</p>
                      <p className="text-xs opacity-80">{stage.description}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
