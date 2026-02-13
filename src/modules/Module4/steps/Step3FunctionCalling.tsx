import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import {
  FUNCTION_CALLING_STEPS,
  FUNCTION_CALLING_TOOL_DEFINITION,
  FUNCTION_CALLING_RESPONSE,
  FUNCTION_CALLING_RESULT,
} from "@/data/mock-structured-output";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step3FunctionCalling() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="Function Calling"
          highlights={["Tool Definition", "Schema Parameters", "Structured Args"]}
        >
          <p>
            <strong>Function calling</strong> (also known as tool use) is the
            most reliable way to get structured output from an LLM. Instead of
            asking for JSON in a prompt, you <strong>define tools</strong> with
            parameter schemas.
          </p>
          <p>The process works in stages:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Define tools</strong> - provide name, description, and a
              JSON Schema for parameters
            </li>
            <li>
              <strong>User sends a prompt</strong> - a natural language request
              that may require tool use
            </li>
            <li>
              <strong>LLM selects a tool</strong> - decides which tool fits and
              generates structured arguments
            </li>
            <li>
              <strong>System executes</strong> - validates arguments against the
              schema and runs the tool
            </li>
            <li>
              <strong>Result returned</strong> - the tool result feeds back to
              the LLM for a final response
            </li>
          </ol>
          <p>
            Because the arguments must conform to a JSON Schema,{" "}
            <strong>function calling gives you schema-validated structured
            output by design</strong>. Major providers (OpenAI, Anthropic,
            Google) all support this pattern.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-5">
          {/* Flow diagram */}
          <p className="text-center text-sm font-medium text-muted-foreground">
            Function Calling Flow
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {FUNCTION_CALLING_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2 + index * STAGGER_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className={cn(
                    "rounded-lg border-2 px-3 py-2.5 text-center min-w-[100px]",
                    step.color,
                  )}
                >
                  <p className="text-xs font-bold">{step.label}</p>
                  <p className="text-[9px] opacity-80 max-w-[100px]">
                    {step.actor}
                  </p>
                </motion.div>
                {index < FUNCTION_CALLING_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.3 + index * STAGGER_DELAY,
                      duration: 0.3,
                    }}
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Code examples */}
          <div className="space-y-3">
            {/* Tool definition */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: ANIMATION_DURATION }}
            >
              <CodeBlock
                code={FUNCTION_CALLING_TOOL_DEFINITION}
                language="json"
                title="1. Tool Definition (developer provides this)"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.3 }}
              className="flex justify-center"
            >
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>

            {/* LLM response with tool call */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: ANIMATION_DURATION }}
            >
              <CodeBlock
                code={FUNCTION_CALLING_RESPONSE}
                language="json"
                title='2. LLM Response (user asked: "What is the weather in Prague?")'
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.3 }}
              className="flex justify-center"
            >
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>

            {/* Tool execution result */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: ANIMATION_DURATION }}
            >
              <CodeBlock
                code={FUNCTION_CALLING_RESULT}
                language="json"
                title="3. Tool Execution Result (returned to LLM)"
              />
            </motion.div>
          </div>

          {/* Key insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: ANIMATION_DURATION }}
            className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3 text-center"
          >
            <p className="text-xs text-muted-foreground">
              The LLM never outputs free text for tool arguments - it{" "}
              <strong>must</strong> conform to the parameter schema. This makes
              function calling the most <strong>reliable</strong> method for
              structured output.
            </p>
          </motion.div>
        </InteractiveArea>
      </div>
    </div>
  );
}
