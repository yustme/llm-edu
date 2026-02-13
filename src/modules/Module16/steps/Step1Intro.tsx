import { motion } from "framer-motion";
import { InfoPanel } from "@/components/presentation/InfoPanel";
import { InteractiveArea } from "@/components/presentation/InteractiveArea";
import { CodeBlock } from "@/components/presentation/CodeBlock";
import { SQL_EXAMPLES } from "../data";

const STAGGER_DELAY = 0.15;
const ANIMATION_DURATION = 0.4;

export function Step1Intro() {
  return (
    <div className="flex gap-8">
      <div className="w-2/5 shrink-0">
        <InfoPanel
          title="What is Text-to-SQL?"
          highlights={["Natural Language", "SQL Generation", "Schema Awareness"]}
        >
          <p>
            Text-to-SQL is the task of translating <strong>natural language
            questions</strong> into executable <strong>SQL queries</strong>.
            It allows non-technical users to query databases using plain English.
          </p>
          <p>Why is it hard?</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Ambiguity</strong> - "revenue" could mean gross, net, or
              after returns depending on context
            </li>
            <li>
              <strong>Schema knowledge</strong> - the model must know table
              names, column types, and relationships
            </li>
            <li>
              <strong>SQL correctness</strong> - generated queries must be
              syntactically and semantically valid
            </li>
            <li>
              <strong>Security</strong> - preventing SQL injection and
              unauthorized data access
            </li>
          </ul>
          <p>
            AI agents solve this by combining LLM reasoning with schema context
            and tool execution.
          </p>
        </InfoPanel>
      </div>

      <div className="flex-1">
        <InteractiveArea className="space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Example Translations
          </p>
          <div className="space-y-4">
            {SQL_EXAMPLES.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * STAGGER_DELAY,
                  duration: ANIMATION_DURATION,
                }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    &ldquo;{example.question}&rdquo;
                  </p>
                </div>
                <CodeBlock code={example.sql} language="sql" title={example.description} />
              </motion.div>
            ))}
          </div>
        </InteractiveArea>
      </div>
    </div>
  );
}
